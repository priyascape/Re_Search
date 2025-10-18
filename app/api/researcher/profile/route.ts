import { NextRequest, NextResponse } from 'next/server';
import { getPerplexityAPI, ResearcherProfileResult } from '@/lib/perplexity';
import { getDB } from '@/lib/db';

/**
 * Validate that papers actually include the researcher as an author
 * Filters out any papers where the researcher's name doesn't appear in the author list
 */
function validatePaperAuthorship(
  papers: Array<{ title: string; authors: string; abstract: string; url: string; year?: string }>,
  researcherName: string
): Array<{ title: string; authors: string; abstract: string; url: string; year?: string }> {
  // Split researcher name into parts for flexible matching
  const nameParts = researcherName.toLowerCase().trim().split(/\s+/);
  const lastName = nameParts[nameParts.length - 1];
  const firstName = nameParts[0];

  return papers.filter(paper => {
    const authorsLower = paper.authors.toLowerCase();

    // Check if the full name appears
    if (authorsLower.includes(researcherName.toLowerCase())) {
      return true;
    }

    // Check if last name + first initial appears (e.g., "Smith, J" for "John Smith")
    const firstInitial = firstName.charAt(0);
    if (authorsLower.includes(`${lastName}, ${firstInitial}`) ||
        authorsLower.includes(`${firstInitial}. ${lastName}`) ||
        authorsLower.includes(`${firstInitial} ${lastName}`)) {
      return true;
    }

    // Check if the last name appears (less strict, but common in author lists)
    // Only if the last name is reasonably unique (more than 4 characters)
    if (lastName.length > 4 && authorsLower.includes(lastName)) {
      console.log(`⚠️ Partial match for "${researcherName}" in paper: ${paper.title}`);
      return true;
    }

    console.log(`❌ Filtered out paper (author not found): ${paper.title}`);
    console.log(`   Authors listed: ${paper.authors}`);
    console.log(`   Looking for: ${researcherName}`);
    return false;
  });
}

/**
 * Remove duplicate papers based on title similarity
 * Keeps the first occurrence of each unique paper
 */
function removeDuplicatePapers(
  papers: Array<{ title: string; authors: string; abstract: string; url: string; year?: string }>
): Array<{ title: string; authors: string; abstract: string; url: string; year?: string }> {
  const seen = new Set<string>();
  const uniquePapers: Array<{ title: string; authors: string; abstract: string; url: string; year?: string }> = [];

  for (const paper of papers) {
    // Normalize title for comparison (lowercase, remove punctuation)
    const normalizedTitle = paper.title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!seen.has(normalizedTitle)) {
      seen.add(normalizedTitle);
      uniquePapers.push(paper);
    } else {
      console.log(`🗑️ Removed duplicate paper: ${paper.title}`);
    }
  }

  return uniquePapers;
}

/**
 * Ensure all papers have working URLs
 * If URL is missing or appears to be a search URL, create a Google Scholar search link
 */
function ensureWorkingUrls(
  papers: Array<{ title: string; authors: string; abstract: string; url: string; year?: string }>,
  researcherName: string
): Array<{ title: string; authors: string; abstract: string; url: string; year?: string }> {
  return papers.map(paper => {
    let url = paper.url;

    // Check if URL is missing, empty, or is a generic search URL
    const isBadUrl = !url ||
                     url.trim() === '' ||
                     url.includes('search?q=') ||
                     url === 'https://arxiv.org/abs/example' ||
                     url.includes('example');

    if (isBadUrl) {
      // Create a Google Scholar search URL as fallback
      const searchQuery = encodeURIComponent(`"${paper.title}" ${researcherName}`);
      url = `https://scholar.google.com/scholar?q=${searchQuery}`;
      console.log(`🔗 Generated fallback URL for: ${paper.title}`);
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      // If URL is invalid, create Google Scholar search
      const searchQuery = encodeURIComponent(`"${paper.title}" ${researcherName}`);
      url = `https://scholar.google.com/scholar?q=${searchQuery}`;
      console.log(`🔗 Fixed invalid URL for: ${paper.title}`);
    }

    return {
      ...paper,
      url
    };
  });
}

/**
 * GET /api/researcher/profile?name=<name>&affiliation=<affiliation>&limit=<limit>
 * Fetch researcher profile using Perplexity API
 *
 * Query parameters:
 * - name: Researcher's full name (required)
 * - affiliation: University or institution name (required)
 * - limit: Maximum number of papers to return (optional, default: 10)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get('name');
    const affiliation = searchParams.get('affiliation');
    const limitParam = searchParams.get('limit');

    // Parse limit with default value of 10, max of 20 for performance
    const limit = limitParam ? Math.min(Math.max(1, parseInt(limitParam, 10)), 20) : 10;

    // Validate required parameters
    if (!name || !affiliation) {
      return NextResponse.json(
        {
          error: 'Missing required parameters',
          message: 'Both "name" and "affiliation" query parameters are required'
        },
        { status: 400 }
      );
    }

    // Try to call Perplexity API
    let result: ResearcherProfileResult;
    let usedMockData = false;

    try {
      const perplexity = getPerplexityAPI();

      console.log(`🔍 Searching for researcher: ${name} at ${affiliation} (limit: ${limit} papers)`);

      result = await perplexity.fetchResearcherProfile(name, affiliation, limit);

      console.log(`📥 Received ${result.topPapers.length} papers from Perplexity`);

      // Validate that papers actually include the researcher as an author
      result.topPapers = validatePaperAuthorship(result.topPapers, name);

      // Remove duplicate papers
      result.topPapers = removeDuplicatePapers(result.topPapers);

      // Apply the dynamic limit (no longer hardcoded to 5)
      result.topPapers = result.topPapers.slice(0, limit);

      // Ensure all papers have working URLs
      result.topPapers = ensureWorkingUrls(result.topPapers, name);

      console.log(`✅ Perplexity API call successful for researcher: ${name}`);
      console.log(`📄 Found ${result.topPapers.length} verified papers after validation (requested limit: ${limit})`);
    } catch (error) {
      console.error('❌ Perplexity API failed:', error);
      console.error('Error details:', error instanceof Error ? error.message : String(error));

      // Return error instead of mock data
      return NextResponse.json(
        {
          error: 'Failed to fetch researcher profile',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: 'Please check that the Perplexity API key is valid and the API is accessible.',
        },
        { status: 500 }
      );
    }

    // Save the profile to the database
    const db = getDB();
    const stored = db.upsert({
      name: result.name,
      affiliation: result.affiliation,
      summary: result.summary,
      topPapers: result.topPapers,
    });
    console.log(`💾 Saved researcher profile to database: ${stored.id}`);

    return NextResponse.json({
      success: true,
      data: result,
      metadata: {
        usedMockData,
        timestamp: new Date().toISOString(),
        model: usedMockData ? 'mock' : 'sonar-pro',
        savedToDatabase: true,
      },
    });

  } catch (error) {
    console.error('❌ Error in researcher profile API:', error);

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
 * Generate mock profile data when Perplexity API is unavailable
 */
function getMockProfileResult(
  name: string,
  affiliation: string
): ResearcherProfileResult {
  // Generate 2-5 papers to simulate real-world variability
  const paperCount = Math.floor(Math.random() * 4) + 2; // 2 to 5 papers
  const currentYear = new Date().getFullYear();

  const allPapers = [
    {
      title: 'Deep Learning Architectures for Large-Scale Applications',
      authors: `${name}, J. Smith, A. Kumar`,
      abstract: 'This paper presents a comprehensive study of deep learning architectures optimized for large-scale applications. We introduce novel techniques for improving training efficiency and model performance across diverse domains including computer vision, natural language processing, and reinforcement learning.',
      url: 'https://scholar.google.com/scholar?q=' + encodeURIComponent(`${name} deep learning`),
      year: String(currentYear - 1),
    },
    {
      title: 'Scalable Methods for Neural Network Training',
      authors: `${name}, M. Rodriguez, L. Chen`,
      abstract: 'We propose new scalable methods for training large neural networks that significantly reduce computational overhead while maintaining or improving model accuracy. Our approach demonstrates superior performance on standard benchmarks and real-world datasets.',
      url: 'https://scholar.google.com/scholar?q=' + encodeURIComponent(`${name} neural network training`),
      year: String(currentYear - 2),
    },
    {
      title: 'Advances in Transfer Learning and Domain Adaptation',
      authors: `R. Williams, ${name}, K. Patel`,
      abstract: 'This work explores the frontier of transfer learning and domain adaptation, presenting novel algorithms that enable models to generalize better across different tasks and datasets. We achieve state-of-the-art results on multiple challenging benchmarks.',
      url: 'https://scholar.google.com/scholar?q=' + encodeURIComponent(`${name} transfer learning`),
      year: String(currentYear - 2),
    },
    {
      title: 'Interpretability in Modern Machine Learning Systems',
      authors: `${name}, T. Johnson`,
      abstract: 'We investigate methods for improving interpretability in complex machine learning systems. Our approach combines visualization techniques with formal analysis to provide insights into model behavior and decision-making processes.',
      url: 'https://scholar.google.com/scholar?q=' + encodeURIComponent(`${name} interpretability`),
      year: String(currentYear - 3),
    },
    {
      title: 'Efficient Optimization Techniques for Deep Networks',
      authors: `${name}, S. Lee, D. Martinez`,
      abstract: 'This paper introduces efficient optimization techniques specifically designed for deep neural networks. We demonstrate significant improvements in convergence speed and final model performance across a variety of tasks and architectures.',
      url: 'https://scholar.google.com/scholar?q=' + encodeURIComponent(`${name} optimization`),
      year: String(currentYear - 3),
    },
  ];

  return {
    name,
    affiliation,
    summary: `${name} is a researcher at ${affiliation}, specializing in areas of computer science and artificial intelligence. Their work focuses on developing novel approaches to machine learning, with particular emphasis on deep learning architectures and their applications to real-world problems.

Throughout their career, ${name} has made contributions to the field, working on both theoretical foundations and practical applications. Their research has been published in academic conferences and journals, and they actively collaborate with other researchers in the academic community.

${name} brings a combination of theoretical knowledge and practical insight to their work. They are involved in research projects at ${affiliation} and contribute to advancing the state of knowledge in their areas of expertise. Their research interests reflect a commitment to solving complex computational challenges.

Currently at ${affiliation}, ${name} continues their research in AI and machine learning, contributing to the academic community through publications, teaching, and collaborative research projects.`,
    topPapers: allPapers.slice(0, paperCount),
    citations: [],
  };
}
