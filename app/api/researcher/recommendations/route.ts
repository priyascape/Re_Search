import { NextRequest, NextResponse } from 'next/server';
import { getPerplexityAPI } from '@/lib/perplexity';

/**
 * GET /api/researcher/recommendations?name=<name>&affiliation=<affiliation>&areas=<areas>
 * Get top 5 NeurIPS 2024 papers aligned with researcher's work
 *
 * Query parameters:
 * - name: Researcher's name (optional, for personalization)
 * - affiliation: Researcher's affiliation (optional)
 * - areas: Comma-separated research areas (required)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get('name') || '';
    const affiliation = searchParams.get('affiliation') || '';
    const areas = searchParams.get('areas') || '';

    if (!areas) {
      return NextResponse.json(
        {
          error: 'Missing required parameter',
          message: 'The "areas" query parameter is required',
        },
        { status: 400 }
      );
    }

    const perplexity = getPerplexityAPI();

    console.log(`🔍 Finding NeurIPS 2024 papers for research areas: ${areas}`);

    const messages = [
      {
        role: 'system' as const,
        content: `You are a research paper recommendation assistant specializing in NeurIPS 2024 papers.
Find the most relevant and impactful papers from NeurIPS 2024 that align with the given research areas.`,
      },
      {
        role: 'user' as const,
        content: `Find the TOP 5 most relevant papers from NeurIPS 2024 that align with these research areas:

Research Areas: ${areas}
${name ? `Researcher: ${name}` : ''}
${affiliation ? `Affiliation: ${affiliation}` : ''}

Search for ACTUAL NeurIPS 2024 papers. Return ONLY papers from NeurIPS 2024 conference.

Provide response in JSON format:
{
  "papers": [
    {
      "title": "Exact paper title from NeurIPS 2024",
      "authors": "Author names",
      "abstract": "Brief abstract or summary (2-3 sentences)",
      "url": "Paper URL (arXiv or NeurIPS proceedings)",
      "relevance": "Why this paper is relevant to the researcher (1 sentence)",
      "match_score": <number 0-100 indicating relevance>
    }
  ]
}

Return EXACTLY 5 papers, ranked by relevance (highest first).
Focus on papers that:
- Are from NeurIPS 2024
- Directly relate to the research areas
- Are highly cited or impactful
- Offer novel insights or techniques`,
      },
    ];

    const response = await perplexity['request'](messages, { maxTokens: 2500 });
    const content = response.choices[0]?.message?.content || '';

    // Parse JSON response
    let papers = [];
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : content;
      const parsed = JSON.parse(jsonStr);
      papers = parsed.papers || [];

      // Ensure we have exactly 5 papers
      if (papers.length > 5) {
        papers = papers.slice(0, 5);
      }
    } catch (error) {
      console.error('Failed to parse recommendations:', error);

      // Fallback: return empty with helpful message
      return NextResponse.json({
        success: true,
        data: {
          papers: [],
          message: 'Unable to find NeurIPS 2024 papers at this time. Please try again later.',
        },
        metadata: {
          timestamp: new Date().toISOString(),
          areasSearched: areas.split(',').map(a => a.trim()),
        },
      });
    }

    console.log(`✅ Found ${papers.length} recommended NeurIPS 2024 papers`);

    return NextResponse.json({
      success: true,
      data: {
        papers,
        areasSearched: areas.split(',').map(a => a.trim()),
      },
      metadata: {
        timestamp: new Date().toISOString(),
        totalRecommendations: papers.length,
      },
    });
  } catch (error) {
    console.error('❌ Error in recommendations API:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
