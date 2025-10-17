/**
 * Perplexity API wrapper for matching research papers to job requirements
 */

export interface MatchRequest {
  jobDescription: string;
  researcherPapers: string[];
}

export interface MatchResult {
  score: number;
  reasoning: string;
  relevantPapers: string[];
}

export async function matchResearcherToJob(
  request: MatchRequest
): Promise<MatchResult> {
  const apiKey = process.env.PERPLEXITY_API_KEY;

  if (!apiKey) {
    throw new Error('PERPLEXITY_API_KEY is not set');
  }

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at matching research papers to job requirements. Analyze the research papers and job description, then provide a match score (0-100), reasoning, and list of most relevant papers.',
          },
          {
            role: 'user',
            content: `Job Description:\n${request.jobDescription}\n\nResearcher's Papers:\n${request.researcherPapers.join('\n')}\n\nProvide a JSON response with: score (0-100), reasoning, and relevantPapers (array of paper titles).`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    // Parse the JSON response from the model
    const result = JSON.parse(content);

    return {
      score: result.score,
      reasoning: result.reasoning,
      relevantPapers: result.relevantPapers,
    };
  } catch (error) {
    console.error('Error matching researcher to job:', error);
    throw error;
  }
}
