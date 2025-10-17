import { NextRequest, NextResponse } from 'next/server';
import { getPerplexityAPI, ResearchSearchResult } from '@/lib/perplexity';

/**
 * POST /api/search
 * Search for research papers using Perplexity API
 *
 * Request body:
 * {
 *   query: string;
 *   limit?: number;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, limit = 10 } = body;

    // Validate required fields
    if (!query) {
      return NextResponse.json(
        { error: 'query is required' },
        { status: 400 }
      );
    }

    // Try to call Perplexity API
    let result: ResearchSearchResult;
    let usedMockData = false;

    try {
      const perplexity = getPerplexityAPI();
      result = await perplexity.searchResearch(query);

      console.log('✅ Perplexity API search successful');

      // Limit results
      if (result.papers && result.papers.length > limit) {
        result.papers = result.papers.slice(0, limit);
      }

    } catch (error) {
      console.warn('⚠️ Perplexity API failed, using mock search results:', error);
      result = getMockSearchResults(query, limit);
      usedMockData = true;
    }

    return NextResponse.json({
      success: true,
      query,
      results: result,
      count: result.papers?.length || 0,
      metadata: {
        usedMockData,
        timestamp: new Date().toISOString(),
        model: usedMockData ? 'mock' : 'llama-3.1-sonar-large-128k-online',
      },
    });

  } catch (error) {
    console.error('❌ Error in search API:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/search?q=query
 * Search using query parameters
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const limit = parseInt(searchParams.get('limit') || '10');

  if (!query) {
    return NextResponse.json({
      service: 'Research Paper Search API',
      version: '1.0.0',
      description: 'Search for research papers using AI-powered search',
      endpoints: {
        GET: {
          description: 'Search with query parameters',
          parameters: ['q (query)', 'limit (optional)'],
          example: '/api/search?q=AI+alignment&limit=5',
        },
        POST: {
          description: 'Search with JSON body',
          requiredFields: ['query'],
          optionalFields: ['limit'],
        },
      },
      status: 'operational',
      timestamp: new Date().toISOString(),
    });
  }

  // Redirect to POST handler logic
  try {
    const perplexity = getPerplexityAPI();
    let result: ResearchSearchResult;
    let usedMockData = false;

    try {
      result = await perplexity.searchResearch(query);
      if (result.papers && result.papers.length > limit) {
        result.papers = result.papers.slice(0, limit);
      }
    } catch (error) {
      result = getMockSearchResults(query, limit);
      usedMockData = true;
    }

    return NextResponse.json({
      success: true,
      query,
      results: result,
      count: result.papers?.length || 0,
      metadata: {
        usedMockData,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Search failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * Generate mock search results when Perplexity API is unavailable
 */
function getMockSearchResults(
  query: string,
  limit: number
): ResearchSearchResult {
  const queryLower = query.toLowerCase();

  // Mock papers database
  const allPapers = [
    {
      title: 'Scalable Oversight of AI Systems via Debate',
      authors: 'S Chen, M Rodriguez, A Kumar, J Thompson',
      abstract: 'We present a novel framework for scalable oversight of advanced AI systems using structured debate protocols. Our approach enables human evaluators to judge the safety and alignment of AI systems performing tasks beyond human expertise.',
      url: 'https://arxiv.org/abs/2024.neurips.debate',
      relevance: 95,
      topics: ['ai safety', 'alignment', 'oversight', 'debate'],
    },
    {
      title: 'Constitutional AI: Harmlessness from AI Feedback',
      authors: 'Y Bai, A Jones, K Ndousse, A Askell',
      abstract: 'We propose a method for training AI systems to be harmless using AI-generated feedback, without relying solely on human labels. Our constitutional approach defines rules that AI systems should follow.',
      url: 'https://arxiv.org/abs/2212.08073',
      relevance: 92,
      topics: ['ai safety', 'alignment', 'constitutional ai', 'rlhf'],
    },
    {
      title: 'Language Models as Agent Models',
      authors: 'J Andreas, D Klein',
      abstract: 'We investigate the use of language models as models of rational agents, exploring how they can be used for decision-making tasks beyond simple text generation.',
      url: 'https://arxiv.org/abs/2024.agent.models',
      relevance: 88,
      topics: ['language models', 'agents', 'decision making'],
    },
    {
      title: 'Mechanistic Interpretability via Sparse Autoencoders',
      authors: 'T Henighan, N Elhage, C Olsson',
      abstract: 'We introduce sparse autoencoders as a tool for mechanistic interpretability, enabling better understanding of neural network internals through feature extraction.',
      url: 'https://arxiv.org/abs/2024.sparse.ae',
      relevance: 85,
      topics: ['interpretability', 'mechanistic', 'neural networks'],
    },
    {
      title: 'Adversarial Robustness in Large Language Models',
      authors: 'R Patel, K Lee, A Thompson',
      abstract: 'We analyze vulnerabilities in large language models and propose defense mechanisms that maintain model capabilities while improving robustness to adversarial inputs.',
      url: 'https://arxiv.org/abs/2024.llm.robust',
      relevance: 82,
      topics: ['adversarial', 'robustness', 'llm security'],
    },
    {
      title: 'Multi-Objective Optimization for AI Alignment',
      authors: 'Y Tanaka, H Sato, M Ito',
      abstract: 'We present a multi-objective optimization framework for AI alignment that balances competing human values and preferences, enabling more nuanced aligned systems.',
      url: 'https://arxiv.org/abs/2024.moo.alignment',
      relevance: 80,
      topics: ['alignment', 'optimization', 'value learning'],
    },
    {
      title: 'Recursive Reward Modeling for Training Aligned AI',
      authors: 'M Rodriguez, S Chen, A Kumar',
      abstract: 'We propose recursive reward modeling as a scalable approach to training aligned AI systems, building on RLHF techniques with hierarchical feedback.',
      url: 'https://arxiv.org/abs/2024.recursive.reward',
      relevance: 90,
      topics: ['rlhf', 'alignment', 'reward modeling'],
    },
    {
      title: 'Interpretability Through Causal Mechanisms',
      authors: 'E Williams, R Patel, S Johnson',
      abstract: 'We introduce a causal framework for understanding neural network decision-making, enabling more reliable interpretability of complex AI systems.',
      url: 'https://arxiv.org/abs/2024.causal.interp',
      relevance: 86,
      topics: ['interpretability', 'causality', 'explainability'],
    },
  ];

  // Filter and rank papers based on query
  const filteredPapers = allPapers
    .map(paper => {
      let relevance = paper.relevance;

      // Boost relevance based on keyword matches
      const keywords = queryLower.split(/\s+/);
      keywords.forEach(keyword => {
        if (paper.topics.some(t => t.includes(keyword))) {
          relevance += 5;
        }
        if (paper.title.toLowerCase().includes(keyword)) {
          relevance += 3;
        }
        if (paper.abstract.toLowerCase().includes(keyword)) {
          relevance += 2;
        }
      });

      return {
        ...paper,
        relevance: Math.min(relevance, 100),
      };
    })
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit)
    .filter(p => p.relevance >= 75); // Only return reasonably relevant papers

  return {
    papers: filteredPapers,
    citations: [
      { url: 'https://arxiv.org', title: 'arXiv.org' },
      { url: 'https://scholar.google.com', title: 'Google Scholar' },
    ],
  };
}
