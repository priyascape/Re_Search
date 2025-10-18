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
    const matches = [];

    for (const researcher of allResearchers) {
      try {
        console.log(`  📊 Analyzing ${researcher.name}...`);

        // Extract skills from researcher's papers and profile using Perplexity
        const skillExtractionResult = await perplexity.askAboutResearcher(
          `Based on this researcher's publications and profile, extract and list their key technical skills, research areas, methodologies, and domain expertise. Focus on skills that would be relevant to job requirements in AI/ML research.`,
          {
            name: researcher.name,
            papers: researcher.topPapers.map(p => ({
              title: p.title,
              abstract: p.abstract,
            })),
            bio: researcher.summary,
            institution: researcher.affiliation,
          }
        );

        const extractedSkills = skillExtractionResult.answer;

        // Match researcher against job description
        const matchResult = await perplexity.matchPaperToJob(
          {
            title: `Research Portfolio of ${researcher.name}`,
            abstract: `${researcher.summary}\n\nKey Skills: ${extractedSkills}\n\nTop Papers: ${researcher.topPapers.map(p => p.title).join('; ')}`,
            authors: researcher.name,
          },
          jobDescription
        );

        matches.push({
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
        });

        console.log(`    ✅ ${researcher.name}: ${matchResult.matchScore}/100`);
      } catch (error) {
        console.error(`    ❌ Error matching ${researcher.name}:`, error);
        // Continue with other researchers even if one fails
      }
    }

    // Sort by match score (highest first)
    matches.sort((a, b) => b.match.score - a.match.score);

    // Take top 5-10 matches
    const topMatches = matches.slice(0, 10);

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
