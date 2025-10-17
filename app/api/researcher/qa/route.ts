import { NextRequest, NextResponse } from 'next/server';
import { getPerplexityAPI, ResearcherQAResult } from '@/lib/perplexity';

/**
 * POST /api/researcher/qa
 * Ask questions about a researcher using Perplexity API
 *
 * Request body:
 * {
 *   question: string;
 *   researcher: {
 *     name: string;
 *     institution?: string;
 *     bio?: string;
 *     experience?: string[];
 *     papers: Array<{ title: string; abstract?: string }>;
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, researcher } = body;

    // Validate required fields
    if (!question) {
      return NextResponse.json(
        { error: 'question is required' },
        { status: 400 }
      );
    }

    if (!researcher || !researcher.name) {
      return NextResponse.json(
        { error: 'researcher information is required' },
        { status: 400 }
      );
    }

    // Try to call Perplexity API
    let result: ResearcherQAResult;
    let usedMockData = false;

    try {
      const perplexity = getPerplexityAPI();
      result = await perplexity.askAboutResearcher(question, researcher);

      console.log('✅ Perplexity API call successful for Q&A');
    } catch (error) {
      console.warn('⚠️ Perplexity API failed, using mock answer:', error);
      result = getMockQAResult(question, researcher);
      usedMockData = true;
    }

    return NextResponse.json({
      success: true,
      question,
      researcherName: researcher.name,
      answer: result,
      metadata: {
        usedMockData,
        timestamp: new Date().toISOString(),
        model: usedMockData ? 'mock' : 'llama-3.1-sonar-large-128k-online',
      },
    });

  } catch (error) {
    console.error('❌ Error in researcher Q&A API:', error);

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
 * Generate mock Q&A result when Perplexity API is unavailable
 */
function getMockQAResult(
  question: string,
  researcher: any
): ResearcherQAResult {
  const questionLower = question.toLowerCase();
  let answer = '';
  let confidence: 'high' | 'medium' | 'low' = 'medium';
  const sources: string[] = [];

  // Industry experience
  if (questionLower.includes('industry')) {
    const hasIndustryExp = researcher.experience?.some(
      (exp: string) => exp.toLowerCase().includes('openai') ||
                      exp.toLowerCase().includes('deepmind') ||
                      exp.toLowerCase().includes('google') ||
                      exp.toLowerCase().includes('microsoft')
    );

    if (hasIndustryExp) {
      answer = `Yes, ${researcher.name} has significant industry experience. Based on their profile, they have worked at leading AI research organizations including positions at companies like OpenAI and DeepMind Research. This experience demonstrates their ability to work on production ML systems and collaborate with industry teams.`;
      confidence = 'high';
      sources.push('Work experience section', 'Professional background');
    } else {
      answer = `Based on the available profile information, ${researcher.name} appears to have primarily academic experience. While their publications show strong research capabilities, explicit industry experience is not prominently mentioned in their profile.`;
      confidence = 'medium';
      sources.push('Profile analysis');
    }
  }

  // Production/ML systems
  else if (questionLower.includes('production') || questionLower.includes('ml systems')) {
    answer = `${researcher.name} has experience with production ML systems, as evidenced by their research on practical implementations and real-world applications. Their papers discuss scalable approaches and deployment considerations, suggesting hands-on experience with production environments. Industry positions at research labs would have provided exposure to large-scale ML infrastructure.`;
    confidence = 'medium';
    sources.push('Research papers', 'Abstract analysis', 'Industry experience');
  }

  // Team/collaboration
  else if (questionLower.includes('team') || questionLower.includes('collaboration') || questionLower.includes('lead')) {
    const paperCount = researcher.papers?.length || 0;
    const hasCoauthors = researcher.papers?.some((p: any) =>
      p.title && (p.authors?.includes(',') || p.authors?.includes('et al'))
    );

    answer = `Yes, ${researcher.name} has demonstrated strong collaborative and team experience. They have ${paperCount} publications, many with multiple co-authors, indicating extensive collaboration with other researchers. `;

    if (questionLower.includes('lead')) {
      answer += `Based on being first author on key publications and their academic position, they have experience leading research projects and mentoring junior team members.`;
    } else {
      answer += `Their work shows they are effective in cross-functional research teams and can collaborate with colleagues from different backgrounds.`;
    }

    confidence = 'high';
    sources.push('Publication record', 'Co-authorship patterns', 'Academic position');
  }

  // Programming/technical skills
  else if (questionLower.includes('programming') || questionLower.includes('framework') || questionLower.includes('code')) {
    answer = `${researcher.name} is proficient in programming languages commonly used in AI research, particularly Python. Based on their research work and publications, they likely have strong experience with PyTorch and/or TensorFlow for implementing deep learning models. Their papers often include implementations, suggesting hands-on coding skills and familiarity with modern ML frameworks. Some of their work may be available on GitHub with reproducible code.`;
    confidence = 'medium';
    sources.push('Research methodology', 'Technical papers', 'Open source contributions');
  }

  // Conference presentations
  else if (questionLower.includes('present') || questionLower.includes('conference') || questionLower.includes('speaking')) {
    const hasOralPresentation = researcher.papers?.some(
      (p: any) => p.conference?.toLowerCase().includes('oral')
    );

    if (hasOralPresentation) {
      answer = `Yes, ${researcher.name} has significant experience presenting at conferences. They have given oral presentations at top-tier venues like NeurIPS, which requires excellent communication skills and the ability to explain complex technical concepts to diverse audiences. This demonstrates their capability to represent research effectively in professional settings.`;
      confidence = 'high';
      sources.push('NeurIPS oral presentation', 'Publication venues');
    } else {
      answer = `${researcher.name} has published at major conferences, which typically involves presenting posters or talks. While specific presentation formats aren't detailed in the profile, publication at top venues like NeurIPS, ICML, or ICLR indicates they have experience sharing their work with the research community.`;
      confidence = 'medium';
      sources.push('Conference publications');
    }
  }

  // Research areas/expertise
  else if (questionLower.includes('expertise') || questionLower.includes('specialize')) {
    const topics = researcher.papers?.[0]?.topics || [];
    answer = `${researcher.name} specializes in ${topics.slice(0, 3).join(', ')}. Their research focuses on cutting-edge problems in AI, with particular emphasis on ${topics[0] || 'machine learning'}. They have published extensively in these areas, demonstrating deep technical expertise and staying current with the latest developments in the field.`;
    confidence = 'high';
    sources.push('Research papers', 'Publication topics');
  }

  // Default response
  else {
    answer = `Based on ${researcher.name}'s profile, including their ${researcher.papers?.length || 0} publications and work at ${researcher.institution || 'their institution'}, they appear to be well-qualified for research-focused roles. Their background suggests strong technical skills, research capabilities, and experience in their domain. For specific details about "${question}", I'd recommend reviewing their publications directly or conducting a detailed interview.`;
    confidence = 'low';
    sources.push('General profile analysis');
  }

  return {
    answer,
    confidence,
    sources,
    citations: [
      { url: 'https://scholar.google.com', title: 'Google Scholar Profile' },
      { url: researcher.institution || 'https://university.edu', title: 'Institution Page' },
    ],
  };
}

/**
 * GET /api/researcher/qa
 * Get information about the Q&A API
 */
export async function GET() {
  return NextResponse.json({
    service: 'Researcher Q&A API',
    version: '1.0.0',
    description: 'Ask questions about researchers using AI-powered analysis',
    endpoints: {
      POST: {
        description: 'Ask a question about a researcher',
        requiredFields: ['question', 'researcher'],
      },
    },
    exampleQuestions: [
      'Does this researcher have industry experience?',
      'What is their experience with production ML systems?',
      'Have they worked on team projects or led research groups?',
      'What programming languages are they proficient in?',
      'Do they have experience presenting at conferences?',
    ],
    status: 'operational',
    timestamp: new Date().toISOString(),
  });
}
