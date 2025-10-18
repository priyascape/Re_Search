import { NextRequest, NextResponse } from 'next/server';
import { getPerplexityAPI } from '@/lib/perplexity';

/**
 * GET /api/researcher/search?name=<name>&affiliation=<affiliation>
 * Search for multiple researcher profiles that match the criteria
 * Returns top matches for user to select the correct profile
 *
 * Query parameters:
 * - name: Researcher's name (required)
 * - affiliation: University or institution name (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get('name');
    const affiliation = searchParams.get('affiliation') || '';

    if (!name) {
      return NextResponse.json(
        {
          error: 'Missing required parameter',
          message: 'The "name" query parameter is required',
        },
        { status: 400 }
      );
    }

    const perplexity = getPerplexityAPI();

    console.log(`🔍 Searching for researcher candidates: ${name}${affiliation ? ` at ${affiliation}` : ''}`);

    // Search for potential matches
    const searchQuery = affiliation
      ? `Find researchers named "${name}" at "${affiliation}" on Google Scholar. Return up to 5 possible matches with their institution and brief description.`
      : `Find researchers named "${name}" on Google Scholar. Return up to 5 possible matches with their institution and brief description.`;

    const messages = [
      {
        role: 'system' as const,
        content: `You are a researcher search assistant. Find potential researcher matches on Google Scholar and return a list of candidates for the user to choose from.`,
      },
      {
        role: 'user' as const,
        content: `${searchQuery}

Return ONLY this JSON format:
{
  "candidates": [
    {
      "name": "Full Name",
      "affiliation": "Institution Name",
      "description": "Brief research focus description",
      "confidence": "high|medium|low"
    }
  ]
}

Return 3-5 most likely matches. If there's an exact match with high confidence, put it first.`,
      },
    ];

    const response = await perplexity['request'](messages, { maxTokens: 1500 });
    const content = response.choices[0]?.message?.content || '';

    // Parse JSON response
    let candidates = [];
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : content;
      const parsed = JSON.parse(jsonStr);
      candidates = parsed.candidates || [];
    } catch (error) {
      console.error('Failed to parse candidates:', error);
      // Fallback: return single candidate with provided info
      candidates = [
        {
          name,
          affiliation: affiliation || 'Unknown',
          description: 'Please verify this is the correct researcher',
          confidence: affiliation ? 'medium' : 'low',
        },
      ];
    }

    console.log(`✅ Found ${candidates.length} potential matches`);

    return NextResponse.json({
      success: true,
      data: {
        candidates,
        query: { name, affiliation },
      },
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('❌ Error in researcher search API:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
