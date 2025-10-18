import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { getPerplexityAPI } from '@/lib/perplexity';

/**
 * POST /api/recruiter/match
 * Match researchers to a job description using Perplexity AI
 *
 * Request body:
 * {
 *   "jobDescription": "string"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobDescription } = body;

    if (!jobDescription || typeof jobDescription !== 'string') {
      return NextResponse.json(
        {
          error: 'Invalid request',
          message: 'jobDescription is required and must be a string',
        },
        { status: 400 }
      );
    }

    // Fetch all researchers from database
    const db = getDB();
    const allResearchers = db.getAll();

    console.log(`📊 Database stats: ${db.count()} researchers in database`);
    console.log(`📋 Researchers found:`, allResearchers.map(r => r.name));

    if (allResearchers.length === 0) {
      console.log('⚠️ No researchers found in database!');
      console.log('💡 Tip: Have researchers create their profiles at /researcher first, or seed the database by calling POST /api/researchers/seed');

      return NextResponse.json({
        success: true,
        data: {
          matches: [],
          message: 'No researchers found in database. Researchers need to create their profiles first. Visit /researcher to create a profile, or use POST /api/researchers/seed to add sample data.',
        },
        metadata: {
          totalResearchers: 0,
          timestamp: new Date().toISOString(),
        },
      });
    }

    console.log(`🔍 Matching ${allResearchers.length} researchers against job description...`);

    // Use Perplexity to extract skills and match each researcher
    const perplexity = getPerplexityAPI();

    // Process all researchers in parallel for much faster results
    const matchPromises = allResearchers.map(async (researcher) => {
      try {
        console.log(`  📊 Analyzing ${researcher.name}...`);

        // Run skill extraction and matching in parallel for each researcher
        const [skillExtractionResult, matchResult] = await Promise.all([
          perplexity.askAboutResearcher(
            `List ONLY the top 5-7 most relevant technical skills and research areas from this researcher's work. Be CONCISE - use bullet points with 3-5 words each (e.g., "Deep Learning", "Computer Vision", "PyTorch/TensorFlow"). No explanations, just skill names.`,
            {
              name: researcher.name,
              papers: researcher.topPapers.map(p => ({
                title: p.title,
                abstract: p.abstract,
              })),
              bio: researcher.summary,
              institution: researcher.affiliation,
            }
          ),
          perplexity.matchPaperToJob(
            {
              title: `Research Portfolio of ${researcher.name}`,
              abstract: `${researcher.summary}\n\nTop Papers: ${researcher.topPapers.map(p => p.title).join('; ')}`,
              authors: researcher.name,
            },
            jobDescription
          ),
        ]);

        const extractedSkills = skillExtractionResult.answer;

        console.log(`    ✅ ${researcher.name}: ${matchResult.matchScore}/100`);

        return {
          researcher: {
            id: researcher.id,
            name: researcher.name,
            affiliation: researcher.affiliation,
            summary: researcher.summary,
            topPapers: researcher.topPapers,
          },
          match: {
            score: matchResult.matchScore,
            alignment: matchResult.alignment,
            gaps: matchResult.gaps,
            relevance: matchResult.relevance,
            extractedSkills,
          },
          citations: matchResult.citations || [],
        };
      } catch (error) {
        console.error(`    ❌ Error matching ${researcher.name}:`, error);
        // Return null for failed matches so we can filter them out
        return null;
      }
    });

    // Wait for all matches to complete
    const allMatches = await Promise.all(matchPromises);

    // Filter out any null results from errors
    const matches = allMatches.filter((match): match is NonNullable<typeof match> => match !== null);

    // Sort by match score (highest first)
    matches.sort((a, b) => b.match.score - a.match.score);

    // Return all matches (no hardcoded limit - let the frontend decide)
    const topMatches = matches;

    console.log(`✅ Found ${topMatches.length} matches`);

    return NextResponse.json({
      success: true,
      data: {
        matches: topMatches,
        totalAnalyzed: allResearchers.length,
      },
      metadata: {
        totalResearchers: allResearchers.length,
        totalMatches: topMatches.length,
        timestamp: new Date().toISOString(),
        model: 'llama-3.1-sonar-large-128k-online',
      },
    });

  } catch (error) {
    console.error('❌ Error in recruiter match API:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
