import { NextRequest, NextResponse } from 'next/server';
import { matchResearcherToJob } from '@/lib/perplexity';
import { demoResearchers } from '@/lib/demo-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobDescription, researcherId } = body;

    if (!jobDescription) {
      return NextResponse.json(
        { error: 'Job description is required' },
        { status: 400 }
      );
    }

    // If no specific researcher is provided, match against all researchers
    if (!researcherId) {
      // Match all researchers
      const matches = await Promise.all(
        demoResearchers.map(async (researcher) => {
          try {
            const result = await matchResearcherToJob({
              jobDescription,
              researcherPapers: researcher.papers,
            });

            return {
              researcherId: researcher.id,
              researcher: researcher,
              ...result,
            };
          } catch (error) {
            console.error(
              `Error matching researcher ${researcher.id}:`,
              error
            );
            // Return a default score if matching fails
            return {
              researcherId: researcher.id,
              researcher: researcher,
              score: 0,
              reasoning: 'Error occurred during matching',
              relevantPapers: [],
            };
          }
        })
      );

      // Sort by score descending
      matches.sort((a, b) => b.score - a.score);

      return NextResponse.json({ matches });
    }

    // Match a specific researcher
    const researcher = demoResearchers.find((r) => r.id === researcherId);

    if (!researcher) {
      return NextResponse.json(
        { error: 'Researcher not found' },
        { status: 404 }
      );
    }

    const result = await matchResearcherToJob({
      jobDescription,
      researcherPapers: researcher.papers,
    });

    return NextResponse.json({
      researcherId: researcher.id,
      researcher: researcher,
      ...result,
    });
  } catch (error) {
    console.error('Error in match API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
