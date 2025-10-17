import { NextRequest, NextResponse } from 'next/server';
import { getPerplexityAPI, PaperMatchResult } from '@/lib/perplexity';

/**
 * POST /api/match
 * Match a research paper to job requirements using Perplexity API
 *
 * Request body:
 * {
 *   paperId?: string;
 *   companyId?: string;
 *   jobRequirements: string;
 *   paper?: {
 *     title: string;
 *     abstract: string;
 *     topics?: string[];
 *     authors?: string;
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paperId, companyId, jobRequirements, paper } = body;

    // Validate required fields
    if (!jobRequirements) {
      return NextResponse.json(
        { error: 'jobRequirements is required' },
        { status: 400 }
      );
    }

    if (!paper && !paperId) {
      return NextResponse.json(
        { error: 'Either paper or paperId is required' },
        { status: 400 }
      );
    }

    // Get paper details (from body or mock data)
    const paperDetails = paper || getMockPaper(paperId);

    if (!paperDetails) {
      return NextResponse.json(
        { error: 'Paper not found' },
        { status: 404 }
      );
    }

    // Try to call Perplexity API
    let result: PaperMatchResult;
    let usedMockData = false;

    try {
      const perplexity = getPerplexityAPI();
      result = await perplexity.matchPaperToJob(paperDetails, jobRequirements);

      console.log('✅ Perplexity API call successful');
    } catch (error) {
      console.warn('⚠️ Perplexity API failed, using mock data:', error);
      result = getMockMatchResult(paperDetails, jobRequirements);
      usedMockData = true;
    }

    // Return response with metadata
    return NextResponse.json({
      success: true,
      paperId: paperId || 'custom',
      companyId: companyId || 'unknown',
      match: result,
      metadata: {
        usedMockData,
        timestamp: new Date().toISOString(),
        model: usedMockData ? 'mock' : 'llama-3.1-sonar-large-128k-online',
      },
    });

  } catch (error) {
    console.error('❌ Error in match API:', error);

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
 * GET /api/match
 * Get information about the match API
 */
export async function GET() {
  const perplexity = getPerplexityAPI();
  const cacheStats = perplexity.getCacheStats();

  return NextResponse.json({
    service: 'Research Paper Matching API',
    version: '1.0.0',
    endpoints: {
      POST: {
        description: 'Match a research paper to job requirements',
        requiredFields: ['jobRequirements', 'paper or paperId'],
        optionalFields: ['companyId'],
      },
    },
    status: 'operational',
    cache: cacheStats,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Mock paper data for fallback
 */
function getMockPaper(paperId?: string): any {
  const mockPapers: Record<string, any> = {
    'sarah-chen-debate': {
      title: 'Scalable Oversight of AI Systems via Debate',
      authors: 'S Chen, M Rodriguez, A Kumar, J Thompson',
      abstract: 'We present a novel framework for scalable oversight of advanced AI systems using structured debate protocols. Our approach enables human evaluators to judge the safety and alignment of AI systems performing tasks beyond human expertise by observing debates between AI agents.',
      topics: ['AI Safety', 'Alignment', 'Scalable Oversight', 'Debate', 'Interpretability'],
    },
    'default': {
      title: 'Advanced Machine Learning Techniques',
      authors: 'Research Team',
      abstract: 'A comprehensive study of machine learning methodologies and their applications in modern AI systems.',
      topics: ['Machine Learning', 'AI', 'Deep Learning'],
    },
  };

  return mockPapers[paperId || ''] || mockPapers['default'];
}

/**
 * Generate mock match result when Perplexity API is unavailable
 */
function getMockMatchResult(
  paper: any,
  jobRequirements: string
): PaperMatchResult {
  // Analyze job requirements for keywords
  const jobLower = jobRequirements.toLowerCase();
  const paperTopics = (paper.topics || []).map((t: string) => t.toLowerCase());

  // Calculate mock score based on keyword overlap
  let score = 70; // Base score

  const keywords = [
    { terms: ['ai safety', 'safety', 'alignment'], points: 10 },
    { terms: ['machine learning', 'ml', 'deep learning'], points: 8 },
    { terms: ['research', 'phd', 'publication'], points: 5 },
    { terms: ['scalable', 'production', 'deployment'], points: 7 },
    { terms: ['interpretability', 'explainability'], points: 6 },
    { terms: ['oversight', 'supervision', 'monitoring'], points: 8 },
  ];

  keywords.forEach(({ terms, points }) => {
    if (terms.some(term =>
      jobLower.includes(term) &&
      (paperTopics.some((t: string) => t.includes(term)) ||
       paper.title.toLowerCase().includes(term) ||
       paper.abstract.toLowerCase().includes(term))
    )) {
      score += points;
    }
  });

  // Cap at 96
  score = Math.min(score, 96);

  // Generate alignment points
  const alignment: string[] = [];

  if (jobLower.includes('ai safety') || jobLower.includes('safety')) {
    alignment.push('Strong research focus on AI safety aligns perfectly with role requirements');
  }

  if (jobLower.includes('scalable') || jobLower.includes('oversight')) {
    alignment.push('Demonstrated expertise in scalable oversight mechanisms');
  }

  if (jobLower.includes('research') || jobLower.includes('publication')) {
    alignment.push('Proven track record with peer-reviewed publications in top venues');
  }

  if (jobLower.includes('team') || jobLower.includes('collaboration')) {
    alignment.push('Evidence of collaborative research with cross-functional teams');
  }

  if (jobLower.includes('production') || jobLower.includes('industry')) {
    alignment.push('Research has practical applications in production systems');
  }

  // Ensure we have at least 3 alignment points
  while (alignment.length < 3) {
    alignment.push('Technical expertise relevant to the role requirements');
  }

  // Generate gaps (if score is below 90)
  const gaps: string[] = [];
  if (score < 90) {
    if (!jobLower.includes('industry') && score < 85) {
      gaps.push('Limited explicit industry experience mentioned in publications');
    }
    if (jobLower.includes('specific technology') && !paper.abstract.toLowerCase().includes('specific')) {
      gaps.push('May benefit from additional exposure to specific technologies mentioned in job description');
    }
  }

  return {
    matchScore: score,
    alignment: alignment.slice(0, 5), // Max 5 points
    gaps,
    relevance: `This paper demonstrates ${score >= 85 ? 'strong' : 'good'} alignment with the job requirements, particularly in areas of ${paperTopics.slice(0, 3).join(', ')}. The research methodology and technical depth are well-suited for the role.`,
    citations: [
      {
        url: 'https://scholar.google.com/citations',
        title: 'Google Scholar - Research Citations',
      },
      {
        url: 'https://arxiv.org',
        title: 'arXiv - Research Papers',
      },
    ],
  };
}
