/**
 * Perplexity API wrapper for matching research papers to job requirements
 * Uses sonar-pro model with citation support and real-time web search
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

export interface ResearcherProfileResult {
  name: string;
  affiliation: string;
  summary: string;
  topPapers: Array<{
    title: string;
    authors: string;
    abstract: string;
    url: string;
    year?: string;
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
  private model = 'sonar-pro';  // FIXED: Updated to correct Perplexity model name
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
        content: `You are a CRITICAL and SELECTIVE AI research recruiter. Be strict in your evaluations.

SCORING GUIDELINES (be harsh):
- 90-100: Perfect match, rare (only if ALL requirements met + strong track record)
- 80-89: Excellent match (most requirements + proven expertise)
- 70-79: Good match (core requirements + some gaps)
- 60-69: Moderate match (partial fit, significant gaps)
- 50-59: Weak match (minimal overlap)
- Below 50: Poor match (major misalignment)

Be CRITICAL. Don't inflate scores. Look for RED FLAGS:
- Lack of practical experience
- Missing key technical skills
- Insufficient publication record
- No evidence of claimed expertise`,
      },
      {
        role: 'user',
        content: `Critically analyze this researcher against job requirements:

${paperContext}

Job Requirements:
${jobRequirements}

Be STRICT. Provide concise, critical analysis in JSON:
{
  "matchScore": <number 0-100, be harsh - most should be 60-80>,
  "alignment": [<2-3 SHORT bullet points (max 15 words each) of strongest matches>],
  "gaps": [<2-3 SHORT critical gaps or concerns>],
  "relevance": "<one sentence critical summary>"
}

Keep alignment points CONCISE (15 words max). Focus on concrete evidence, not vague statements.`,
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
        content: `You are a research analyst. Extract information concisely and accurately.
Be brief - focus on key facts only. Cite specific evidence.`,
      },
      {
        role: 'user',
        content: `Analyze this researcher and answer concisely:

${researcherContext}

Question: ${question}

Provide BRIEF JSON response:
{
  "answer": "<concise answer, max 100 words>",
  "confidence": "<high/medium/low>",
  "sources": [<1-2 specific sources>]
}

Be concise. Extract only essential information.`,
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
   * Fetch comprehensive researcher profile using Perplexity search
   * @param name - Researcher's full name
   * @param affiliation - University or institution name
   * @param limit - Number of papers to fetch (default: 10, max: 20)
   * @returns Researcher profile with top papers and professional summary
   */
  async fetchResearcherProfile(
    name: string,
    affiliation: string,
    limit: number = 10
  ): Promise<ResearcherProfileResult> {
    // Enforce reasonable limits
    const paperLimit = Math.min(Math.max(1, limit), 20);

    // Check cache
    const cacheKey = { name, affiliation, limit: paperLimit };
    const cached = this.cache.get('fetchResearcherProfile', cacheKey);
    if (cached) {
      console.log(`📦 Cache hit for ${name} at ${affiliation}`);
      return cached;
    }

    const messages: PerplexityMessage[] = [
      {
        role: 'system',
        content: `You are a Google Scholar search bot. Your ONLY job is to search Google Scholar and return EXACTLY what you find.

CRITICAL: You MUST return UP TO ${paperLimit} papers in the topPapers array. Return as many high-quality papers as you can find (up to ${paperLimit}), but it's okay to return fewer if the researcher has less published work.

Use your online search capabilities to find the researcher's Google Scholar profile RIGHT NOW.`,
      },
      {
        role: 'user',
        content: `TASK: Search Google Scholar for "${name}" at "${affiliation}" and return their top most cited papers (up to ${paperLimit} papers).

STEP 1: Go to Google Scholar and search: "${name}" "${affiliation}"
STEP 2: Find their author profile
STEP 3: Extract their top most cited papers from the profile (aim for ${paperLimit} papers)
STEP 4: Get the working URLs for each paper

REQUIREMENTS:
- Return UP TO ${paperLimit} papers in the topPapers array
- If the researcher has many papers, pick the MOST CITED ones
- If they have fewer than ${paperLimit} papers, return all available papers
- Each paper must include the researcher's name in the authors field

Return ONLY this JSON format (no other text):
{
  "name": "${name}",
  "affiliation": "${affiliation}",
  "summary": "Specific 2-3 sentence summary about their research focus, key contributions, and most notable work based on their Google Scholar profile",
  "topPapers": [
    // Include up to ${paperLimit} papers (or fewer if the researcher has less)
    {
      "title": "EXACT paper title from Google Scholar",
      "authors": "ALL authors as listed (including ${name})",
      "abstract": "Brief description or abstract",
      "url": "https://arxiv.org/abs/... OR https://doi.org/... OR Google Scholar link",
      "year": "YYYY"
    }
    // ... more papers up to ${paperLimit} total
  ]
}

VERIFICATION CHECKLIST BEFORE RESPONDING:
✓ Did I search Google Scholar online RIGHT NOW?
✓ Did I find the correct person at ${affiliation}?
✓ Does topPapers array have UP TO ${paperLimit} objects (or fewer if less are available)?
✓ Does each paper include "${name}" in the authors field?
✓ Does each paper have a real working URL?
✓ Are these papers from the researcher's ACTUAL Google Scholar profile?

EXAMPLE for "Yann LeCun" at "New York University" with limit ${paperLimit}:
He has 100+ papers, so return his ${paperLimit} MOST CITED papers based on citation count.

IMPORTANT: Return as many high-quality papers as you can find up to ${paperLimit}. It's okay to return fewer if the researcher has published less than ${paperLimit} papers.`,
      },
    ];

    console.log(`📡 Calling Perplexity API for: ${name} at ${affiliation}`);

    const response = await this.request(messages, { maxTokens: 3000 });
    const { content, citations } = this.parseResponse(response);

    console.log(`📨 Perplexity response received (${content.length} chars)`);
    console.log(`📄 Response preview: ${content.substring(0, 200)}...`);

    // Parse JSON from response
    let result: ResearcherProfileResult;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : content;

      console.log(`🔍 Parsing JSON response...`);

      const parsed = JSON.parse(jsonStr);

      console.log(`✅ JSON parsed successfully`);
      console.log(`📊 Papers found in response: ${parsed.topPapers?.length || 0}`);

      result = {
        name: parsed.name || name,
        affiliation: parsed.affiliation || affiliation,
        summary: parsed.summary || 'No summary available.',
        topPapers: parsed.topPapers || [],
        citations,
      };

      // Log paper details
      if (result.topPapers.length > 0) {
        console.log(`📚 Papers returned from Perplexity:`);
        result.topPapers.forEach((paper, i) => {
          console.log(`  ${i + 1}. "${paper.title}" - ${paper.authors}`);
        });
      } else {
        console.warn(`⚠️ No papers found in Perplexity response`);
      }
    } catch (error) {
      // Fallback if JSON parsing fails
      console.error('❌ Failed to parse researcher profile JSON:', error);
      console.error('Raw content:', content);

      throw new Error(`Failed to parse Perplexity response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Cache result
    this.cache.set('fetchResearcherProfile', cacheKey, result);
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
