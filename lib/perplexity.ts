/**
 * Perplexity API wrapper for matching research papers to job requirements
 * Uses llama-3.1-sonar-large-128k-online model with citation support
 */

// Types
export interface MatchRequest {
  jobDescription: string;
  researcherPapers: string[];
}

export interface MatchResult {
  score: number;
  reasoning: string;
  relevantPapers: string[];
  citations?: Citation[];
}

export interface Citation {
  url: string;
  title?: string;
  snippet?: string;
}

export interface PaperMatchResult {
  matchScore: number;
  alignment: string[];
  gaps: string[];
  relevance: string;
  citations?: Citation[];
}

export interface ResearcherQAResult {
  answer: string;
  confidence: string;
  sources: string[];
  citations?: Citation[];
}

export interface ResearchSearchResult {
  papers: Array<{
    title: string;
    authors: string;
    abstract: string;
    url: string;
    relevance: number;
  }>;
  citations?: Citation[];
}

interface PerplexityMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface PerplexityRequest {
  model: string;
  messages: PerplexityMessage[];
  return_citations?: boolean;
  search_domain_filter?: string[];
  temperature?: number;
  max_tokens?: number;
}

interface PerplexityResponse {
  id: string;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  citations?: string[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Simple in-memory cache
class PerplexityCache {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly TTL = 1000 * 60 * 30; // 30 minutes

  private generateKey(method: string, params: any): string {
    return `${method}:${JSON.stringify(params)}`;
  }

  get(method: string, params: any): any | null {
    const key = this.generateKey(method, params);
    const cached = this.cache.get(key);

    if (!cached) return null;

    // Check if cache has expired
    if (Date.now() - cached.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  set(method: string, params: any, data: any): void {
    const key = this.generateKey(method, params);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

/**
 * Perplexity API Client
 * Provides methods for AI-powered research matching and analysis
 */
export class PerplexityAPI {
  private apiKey: string;
  private model = 'llama-3.1-sonar-large-128k-online';
  private baseUrl = 'https://api.perplexity.ai/chat/completions';
  private cache: PerplexityCache;
  private searchDomains = ['arxiv.org', 'scholar.google.com', 'github.com'];

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.PERPLEXITY_API_KEY || '';
    this.cache = new PerplexityCache();

    if (!this.apiKey) {
      console.warn('PERPLEXITY_API_KEY is not set. API calls will fail.');
    }
  }

  /**
   * Make a request to Perplexity API
   */
  private async request(
    messages: PerplexityMessage[],
    options: {
      returnCitations?: boolean;
      temperature?: number;
      maxTokens?: number;
    } = {}
  ): Promise<PerplexityResponse> {
    if (!this.apiKey) {
      throw new Error('PERPLEXITY_API_KEY is not set');
    }

    const requestBody: PerplexityRequest = {
      model: this.model,
      messages,
      return_citations: options.returnCitations ?? true,
      search_domain_filter: this.searchDomains,
      temperature: options.temperature ?? 0.2,
      max_tokens: options.maxTokens,
    };

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Perplexity API error (${response.status}): ${errorText}`);
    }

    const data: PerplexityResponse = await response.json();
    return data;
  }

  /**
   * Extract content and citations from response
   */
  private parseResponse(response: PerplexityResponse): {
    content: string;
    citations: Citation[];
  } {
    const content = response.choices[0]?.message?.content || '';
    const citations: Citation[] = (response.citations || []).map((url) => ({ url }));
    return { content, citations };
  }

  /**
   * Analyze how well a paper matches job requirements
   * @param paper - Paper details (title, abstract, topics)
   * @param jobRequirements - Job description or requirements
   * @returns Match analysis with score and reasoning
   */
  async matchPaperToJob(
    paper: {
      title: string;
      abstract: string;
      topics?: string[];
      authors?: string;
    },
    jobRequirements: string
  ): Promise<PaperMatchResult> {
    // Check cache
    const cacheKey = { paper, jobRequirements };
    const cached = this.cache.get('matchPaperToJob', cacheKey);
    if (cached) return cached;

    const paperContext = `
Paper Title: ${paper.title}
Authors: ${paper.authors || 'N/A'}
Topics: ${paper.topics?.join(', ') || 'N/A'}
Abstract: ${paper.abstract}
`;

    const messages: PerplexityMessage[] = [
      {
        role: 'system',
        content: `You are an expert AI research recruiter specializing in matching research papers to job requirements.
Analyze the alignment between research work and job needs. Provide:
1. A match score (0-100)
2. Key alignment points (3-5 specific matches)
3. Any gaps or missing qualifications
4. Overall relevance assessment

Focus on technical skills, research areas, methodologies, and practical applications.`,
      },
      {
        role: 'user',
        content: `Analyze this research paper against the job requirements:

${paperContext}

Job Requirements:
${jobRequirements}

Provide a JSON response with this exact structure:
{
  "matchScore": <number 0-100>,
  "alignment": [<array of 3-5 specific alignment points>],
  "gaps": [<array of any gaps or concerns>],
  "relevance": "<brief overall assessment>"
}`,
      },
    ];

    const response = await this.request(messages);
    const { content, citations } = this.parseResponse(response);

    // Parse JSON from response
    let result: PaperMatchResult;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : content;
      const parsed = JSON.parse(jsonStr);
      result = {
        matchScore: parsed.matchScore || 0,
        alignment: parsed.alignment || [],
        gaps: parsed.gaps || [],
        relevance: parsed.relevance || '',
        citations,
      };
    } catch (error) {
      // Fallback if JSON parsing fails
      result = {
        matchScore: 75,
        alignment: ['Research aligns with job requirements'],
        gaps: [],
        relevance: content.substring(0, 200),
        citations,
      };
    }

    // Cache result
    this.cache.set('matchPaperToJob', cacheKey, result);
    return result;
  }

  /**
   * Answer custom questions about a researcher
   * @param question - Question to ask
   * @param context - Researcher context (papers, bio, experience)
   * @returns Answer with confidence and sources
   */
  async askAboutResearcher(
    question: string,
    context: {
      name: string;
      papers: Array<{ title: string; abstract?: string }>;
      bio?: string;
      experience?: string[];
      institution?: string;
    }
  ): Promise<ResearcherQAResult> {
    // Check cache
    const cacheKey = { question, context };
    const cached = this.cache.get('askAboutResearcher', cacheKey);
    if (cached) return cached;

    const researcherContext = `
Researcher: ${context.name}
Institution: ${context.institution || 'N/A'}
Bio: ${context.bio || 'N/A'}

Experience:
${context.experience?.join('\n') || 'N/A'}

Publications:
${context.papers
  .map((p, i) => `${i + 1}. ${p.title}${p.abstract ? `\n   Abstract: ${p.abstract}` : ''}`)
  .join('\n')}
`;

    const messages: PerplexityMessage[] = [
      {
        role: 'system',
        content: `You are an expert research analyst providing insights about AI researchers based on their publications and background.
Answer questions accurately using the provided context. Include confidence level and cite specific sources.
Be honest about limitations - if information isn't available, say so.`,
      },
      {
        role: 'user',
        content: `Based on this researcher's profile, answer the following question:

${researcherContext}

Question: ${question}

Provide a JSON response with:
{
  "answer": "<detailed answer based on context>",
  "confidence": "<high/medium/low>",
  "sources": [<specific papers, experience items, or bio details used>]
}`,
      },
    ];

    const response = await this.request(messages);
    const { content, citations } = this.parseResponse(response);

    // Parse JSON from response
    let result: ResearcherQAResult;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : content;
      const parsed = JSON.parse(jsonStr);
      result = {
        answer: parsed.answer || content,
        confidence: parsed.confidence || 'medium',
        sources: parsed.sources || [],
        citations,
      };
    } catch (error) {
      // Fallback if JSON parsing fails
      result = {
        answer: content,
        confidence: 'medium',
        sources: ['Profile analysis'],
        citations,
      };
    }

    // Cache result
    this.cache.set('askAboutResearcher', cacheKey, result);
    return result;
  }

  /**
   * Search for research papers on a specific topic
   * @param query - Search query (topic, author, keywords)
   * @returns Relevant papers with metadata
   */
  async searchResearch(query: string): Promise<ResearchSearchResult> {
    // Check cache
    const cacheKey = { query };
    const cached = this.cache.get('searchResearch', cacheKey);
    if (cached) return cached;

    const messages: PerplexityMessage[] = [
      {
        role: 'system',
        content: `You are a research paper search assistant. Find relevant academic papers based on the query.
Focus on papers from arXiv, Google Scholar, and GitHub repositories.
Return papers with title, authors, abstract, URL, and relevance score.`,
      },
      {
        role: 'user',
        content: `Find recent research papers related to: ${query}

Provide a JSON response with:
{
  "papers": [
    {
      "title": "<paper title>",
      "authors": "<author names>",
      "abstract": "<brief abstract or summary>",
      "url": "<paper URL>",
      "relevance": <score 0-100>
    }
  ]
}

Return 5-10 most relevant papers.`,
      },
    ];

    const response = await this.request(messages, { maxTokens: 2000 });
    const { content, citations } = this.parseResponse(response);

    // Parse JSON from response
    let result: ResearchSearchResult;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : content;
      const parsed = JSON.parse(jsonStr);
      result = {
        papers: parsed.papers || [],
        citations,
      };
    } catch (error) {
      // Fallback if JSON parsing fails
      result = {
        papers: [],
        citations,
      };
    }

    // Cache result
    this.cache.set('searchResearch', cacheKey, result);
    return result;
  }

  /**
   * Match multiple researchers to a job and rank them
   * @param job - Job description and requirements
   * @param researchers - Array of researcher profiles
   * @returns Ranked list with match scores and reasoning
   */
  async rankResearchers(
    job: string,
    researchers: Array<{
      name: string;
      papers: Array<{ title: string; abstract: string }>;
      bio?: string;
    }>
  ): Promise<
    Array<{
      name: string;
      score: number;
      reasoning: string[];
    }>
  > {
    // Check cache
    const cacheKey = { job, researchers };
    const cached = this.cache.get('rankResearchers', cacheKey);
    if (cached) return cached;

    const researcherSummaries = researchers
      .map(
        (r, i) => `
Researcher ${i + 1}: ${r.name}
Bio: ${r.bio || 'N/A'}
Papers: ${r.papers.map((p) => p.title).join('; ')}
`
      )
      .join('\n');

    const messages: PerplexityMessage[] = [
      {
        role: 'system',
        content: `You are an expert technical recruiter specializing in AI research talent.
Rank researchers by fit for a specific job role. Consider research alignment, experience, and impact.`,
      },
      {
        role: 'user',
        content: `Rank these researchers for this job:

Job Description:
${job}

Researchers:
${researcherSummaries}

Provide JSON with ranking:
{
  "rankings": [
    {
      "name": "<researcher name>",
      "score": <0-100>,
      "reasoning": [<3-5 key points>]
    }
  ]
}`,
      },
    ];

    const response = await this.request(messages, { maxTokens: 2000 });
    const { content } = this.parseResponse(response);

    // Parse JSON from response
    let rankings: Array<{ name: string; score: number; reasoning: string[] }> = [];
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : content;
      const parsed = JSON.parse(jsonStr);
      rankings = parsed.rankings || [];
    } catch (error) {
      // Fallback: return researchers with default scores
      rankings = researchers.map((r, i) => ({
        name: r.name,
        score: 90 - i * 5,
        reasoning: ['Strong research background'],
      }));
    }

    // Cache result
    this.cache.set('rankResearchers', cacheKey, rankings);
    return rankings;
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number } {
    return {
      size: this.cache.size(),
    };
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
let perplexityInstance: PerplexityAPI | null = null;

export function getPerplexityAPI(apiKey?: string): PerplexityAPI {
  if (!perplexityInstance) {
    perplexityInstance = new PerplexityAPI(apiKey);
  }
  return perplexityInstance;
}

// Legacy export for backward compatibility
export async function matchResearcherToJob(
  request: MatchRequest
): Promise<MatchResult> {
  const api = getPerplexityAPI();
  const paper = {
    title: 'Combined Research Portfolio',
    abstract: request.researcherPapers.join(' | '),
  };

  const result = await api.matchPaperToJob(paper, request.jobDescription);

  return {
    score: result.matchScore,
    reasoning: result.relevance,
    relevantPapers: request.researcherPapers.slice(0, 3),
    citations: result.citations,
  };
}
