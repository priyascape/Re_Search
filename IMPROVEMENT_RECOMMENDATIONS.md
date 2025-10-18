# Recommended Improvements for Researcher Profile System

## Critical Issues to Fix First

### 1. **Verify Perplexity API is Actually Working**
**Priority**: 🔴 CRITICAL

**Current Problem**: System might be failing silently and using mock data

**Action Items**:
- [ ] Run `node test-perplexity.js` to confirm API connectivity
- [ ] Check server logs for actual API responses
- [ ] Verify API key has sufficient credits/quota
- [ ] Test with a known researcher (e.g., "Geoffrey Hinton" at "University of Toronto")

**Why This Matters**: Without working API, everything else is irrelevant

---

## High-Impact Improvements

### 2. **Add Direct Google Scholar API Integration**
**Priority**: 🟠 HIGH

**Current Limitation**: Relying on Perplexity to search Google Scholar (indirect)

**Better Solution**: Use Scholarly Python library or SerpAPI for Google Scholar

**Implementation**:
```python
# Create new API endpoint: /api/researcher/scholar
from scholarly import scholarly

def get_researcher_papers(name, affiliation):
    # Search for researcher
    search_query = scholarly.search_author(f'{name} {affiliation}')
    author = next(search_query)

    # Get their papers
    scholarly.fill(author, sections=['publications'])

    papers = []
    for pub in author['publications'][:5]:  # Top 5
        scholarly.fill(pub)
        papers.append({
            'title': pub['bib']['title'],
            'authors': ', '.join(pub['bib']['author']),
            'year': pub['bib']['pub_year'],
            'citations': pub.get('num_citations', 0),
            'url': pub.get('pub_url') or pub.get('eprint_url')
        })

    return papers
```

**Benefits**:
- ✅ Direct access to Google Scholar data
- ✅ No ambiguity - exact researcher match
- ✅ Verified citation counts
- ✅ More reliable than AI interpretation

**Alternative**: Use SerpAPI (paid but more reliable)
```javascript
// SerpAPI for Google Scholar
const response = await fetch(
  `https://serpapi.com/search.json?engine=google_scholar_author&author_id=${authorId}&api_key=${SERPAPI_KEY}`
);
```

---

### 3. **Improve Person Identification with Multiple Data Points**
**Priority**: 🟠 HIGH

**Current Issue**: Only using name + affiliation (can match wrong person)

**Better Approach**: Multi-factor verification

**Add These Data Points**:
```typescript
interface ResearcherSearch {
  name: string;
  affiliation: string;
  // NEW FIELDS:
  orcid?: string;          // ORCID ID (unique identifier)
  googleScholarId?: string; // Google Scholar profile ID
  email?: string;          // Email domain verification
  researchArea?: string;   // Field/discipline
  knownCoauthors?: string[]; // Known collaborators
}
```

**Implementation**:
```typescript
// Step 1: Try ORCID if provided (most reliable)
if (orcid) {
  return await fetchFromORCID(orcid);
}

// Step 2: Try Google Scholar ID
if (googleScholarId) {
  return await fetchFromScholarProfile(googleScholarId);
}

// Step 3: Search with multiple filters
const results = await searchWithFilters({
  name,
  affiliation,
  researchArea,
  email_domain: affiliation.toLowerCase().replace(/\s/g, '')
});

// Step 4: Verify with co-authors
if (knownCoauthors && knownCoauthors.length > 0) {
  results = results.filter(r =>
    hasCommonCoauthors(r.coauthors, knownCoauthors)
  );
}
```

**UI Changes**:
```tsx
// Add optional fields to search form
<input name="orcid" placeholder="ORCID (optional)" />
<input name="scholarId" placeholder="Google Scholar ID (optional)" />
<input name="researchArea" placeholder="e.g., Natural Language Processing" />
```

---

### 4. **Implement Confidence Scoring System**
**Priority**: 🟡 MEDIUM

**Problem**: No indication of how confident the system is about the match

**Solution**: Score each result

**Implementation**:
```typescript
interface ResearcherMatch {
  profile: ResearcherProfile;
  confidenceScore: number; // 0-100
  matchingFactors: string[];
  warnings: string[];
}

function calculateConfidence(profile: ResearcherProfile, search: ResearcherSearch): number {
  let score = 0;
  const factors: string[] = [];

  // Exact affiliation match
  if (profile.affiliation.toLowerCase() === search.affiliation.toLowerCase()) {
    score += 30;
    factors.push('✅ Exact affiliation match');
  } else if (profile.affiliation.toLowerCase().includes(search.affiliation.toLowerCase())) {
    score += 15;
    factors.push('⚠️ Partial affiliation match');
  }

  // Name matching
  const fullNameMatch = profile.name.toLowerCase() === search.name.toLowerCase();
  if (fullNameMatch) {
    score += 40;
    factors.push('✅ Full name exact match');
  } else {
    score += 20;
    factors.push('⚠️ Name variation detected');
  }

  // Has publications
  if (profile.topPapers.length > 0) {
    score += 20;
    factors.push(`✅ Found ${profile.topPapers.length} publications`);
  }

  // Research area match (if provided)
  if (search.researchArea && profile.summary.toLowerCase().includes(search.researchArea.toLowerCase())) {
    score += 10;
    factors.push('✅ Research area matches');
  }

  return { score, factors };
}
```

**Display in UI**:
```tsx
{confidenceScore < 70 && (
  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
    <p className="text-yellow-800 font-medium">
      ⚠️ Medium confidence match ({confidenceScore}%)
    </p>
    <p className="text-sm text-yellow-700">
      This might not be the correct person. Consider adding more details.
    </p>
  </div>
)}
```

---

### 5. **Add Paper Verification with Citation Counts**
**Priority**: 🟡 MEDIUM

**Current Issue**: No way to verify if papers are significant/correct

**Solution**: Include citation metrics

```typescript
interface Paper {
  title: string;
  authors: string;
  abstract: string;
  url: string;
  year: string;
  // NEW FIELDS:
  citationCount?: number;
  venue?: string;        // Conference/journal name
  doi?: string;
  pdfUrl?: string;
  bibtex?: string;
}
```

**Display**:
```tsx
<div className="flex items-center gap-4 text-sm">
  <span className="flex items-center gap-1">
    <Quote className="w-4 h-4" />
    {paper.citationCount || 0} citations
  </span>
  <span className="text-gray-600">{paper.venue}</span>
  {paper.year && <span className="text-gray-600">{paper.year}</span>}
</div>
```

---

### 6. **Implement Caching Strategy**
**Priority**: 🟡 MEDIUM

**Current**: 30-minute in-memory cache (lost on restart)

**Better**: Persistent cache with smart invalidation

**Implementation**:
```typescript
// Use database for caching
interface CachedProfile {
  id: string;
  name: string;
  affiliation: string;
  data: ResearcherProfile;
  cachedAt: Date;
  expiresAt: Date;
  source: 'perplexity' | 'google_scholar' | 'manual';
}

// Cache strategy
async function getResearcherProfile(name: string, affiliation: string) {
  // Check cache first (valid for 24 hours)
  const cached = await db.findCached(name, affiliation);

  if (cached && !isExpired(cached)) {
    console.log('📦 Using cached data');
    return cached.data;
  }

  // Fetch fresh data
  const fresh = await fetchFromPerplexity(name, affiliation);

  // Cache for 24 hours
  await db.cache({
    name,
    affiliation,
    data: fresh,
    cachedAt: new Date(),
    expiresAt: addHours(new Date(), 24)
  });

  return fresh;
}

// Add manual refresh button
<button onClick={() => refetchProfile(true)}>
  🔄 Refresh Profile
</button>
```

---

### 7. **Add Manual Verification/Editing**
**Priority**: 🟡 MEDIUM

**Problem**: Users can't correct wrong information

**Solution**: Allow profile claiming and editing

```typescript
// Add "Is this you?" button
<button onClick={() => claimProfile(profile.id)}>
  👤 Claim This Profile
</button>

// Profile editing interface
interface EditableProfile extends ResearcherProfile {
  isVerified: boolean;
  verifiedBy?: string;
  manuallyEdited: boolean;
  editHistory: Array<{
    field: string;
    oldValue: any;
    newValue: any;
    editedAt: Date;
  }>;
}

// Allow users to add missing papers
<button onClick={() => addPaperManually()}>
  ➕ Add Missing Paper
</button>

// Paper verification by owner
{profile.isVerified && (
  <Badge className="bg-green-100 text-green-800">
    ✓ Verified by Researcher
  </Badge>
)}
```

---

### 8. **Improve Prompt Engineering**
**Priority**: 🟡 MEDIUM

**Current**: Single-shot prompt

**Better**: Multi-step reasoning

**Implementation**:
```typescript
// Step 1: Identify the researcher
const identificationPrompt = `
Search Google Scholar for researchers named "${name}".
List all matches with their affiliations.
Identify which one works at "${affiliation}".
Return ONLY the Google Scholar profile URL.
`;

// Step 2: Extract papers from confirmed profile
const extractionPrompt = `
Visit this Google Scholar profile: ${profileUrl}
Extract the top 5 papers with:
- Exact title
- All authors
- Publication year
- Citation count
- Direct link to paper

Return as JSON.
`;

// Step 3: Generate summary
const summaryPrompt = `
Based on these ${papers.length} papers, write a specific summary:
${papers.map(p => p.title).join('\n')}

Focus on:
- Specific research topics (not generic "AI" but "graph neural networks for drug discovery")
- Actual contributions
- Concrete achievements
`;
```

---

### 9. **Add Fallback Data Sources**
**Priority**: 🟢 LOW

**Current**: Only Perplexity → Mock data

**Better**: Multiple sources with priority

```typescript
async function fetchResearcherProfile(name: string, affiliation: string) {
  const sources = [
    { name: 'google_scholar', fn: fetchFromGoogleScholar },
    { name: 'orcid', fn: fetchFromORCID },
    { name: 'semantic_scholar', fn: fetchFromSemanticScholar },
    { name: 'perplexity', fn: fetchFromPerplexity },
    { name: 'dblp', fn: fetchFromDBLP },
  ];

  for (const source of sources) {
    try {
      console.log(`🔍 Trying ${source.name}...`);
      const result = await source.fn(name, affiliation);

      if (result && result.topPapers.length > 0) {
        console.log(`✅ Success with ${source.name}`);
        return { ...result, source: source.name };
      }
    } catch (error) {
      console.warn(`⚠️ ${source.name} failed:`, error.message);
    }
  }

  throw new Error('All data sources failed');
}
```

---

### 10. **Add Real-Time Validation Feedback**
**Priority**: 🟢 LOW

**Current**: Search → Wait → Results (or error)

**Better**: Progressive feedback

```tsx
// Show search progress
{searching && (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      {step >= 1 ? '✅' : '⏳'} Searching Google Scholar...
    </div>
    <div className="flex items-center gap-2">
      {step >= 2 ? '✅' : '⏳'} Verifying researcher identity...
    </div>
    <div className="flex items-center gap-2">
      {step >= 3 ? '✅' : '⏳'} Extracting publications...
    </div>
    <div className="flex items-center gap-2">
      {step >= 4 ? '✅' : '⏳'} Validating papers...
    </div>
  </div>
)}
```

---

## Implementation Priority

### Phase 1: Critical Fixes (Week 1)
1. ✅ Verify Perplexity API is working
2. 🔴 Add Google Scholar direct integration
3. 🔴 Improve person identification

### Phase 2: Reliability (Week 2)
4. 🟠 Implement confidence scoring
5. 🟠 Add paper verification with citations
6. 🟠 Implement persistent caching

### Phase 3: User Experience (Week 3)
7. 🟡 Add manual verification/editing
8. 🟡 Improve prompt engineering
9. 🟡 Add real-time feedback

### Phase 4: Robustness (Week 4)
10. 🟢 Add fallback data sources
11. 🟢 Add ORCID integration
12. 🟢 Add analytics and monitoring

---

## Quick Wins (Can Do Now)

### A. Add ORCID Field to Search Form
**Effort**: 15 minutes

```tsx
<div>
  <label>ORCID (Optional)</label>
  <input
    name="orcid"
    placeholder="0000-0002-1234-5678"
    pattern="[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{3}[0-9X]"
  />
  <p className="text-xs text-gray-500">
    Find yours at <a href="https://orcid.org">orcid.org</a>
  </p>
</div>
```

### B. Add "Did you mean?" Suggestions
**Effort**: 30 minutes

```typescript
// If no exact match, suggest alternatives
if (results.length === 0) {
  const suggestions = await searchSimilarNames(name);
  return {
    error: 'No exact match found',
    suggestions: suggestions.map(s => ({
      name: s.name,
      affiliation: s.affiliation,
      matchScore: s.similarity
    }))
  };
}
```

### C. Add Paper Source Badges
**Effort**: 10 minutes

```tsx
{paper.url.includes('arxiv.org') && (
  <Badge variant="secondary">arXiv</Badge>
)}
{paper.url.includes('doi.org') && (
  <Badge variant="success">DOI</Badge>
)}
```

### D. Add Export Functionality
**Effort**: 20 minutes

```tsx
<button onClick={() => exportToBibTeX(papers)}>
  📥 Export BibTeX
</button>

<button onClick={() => exportToCSV(profile)}>
  📊 Export CSV
</button>
```

---

## Testing Recommendations

### Test Cases to Add

1. **Common Names**: "John Smith", "Wei Wang", "Maria Garcia"
2. **Similar Researchers**: Multiple people with same name at different institutions
3. **Early Career**: Researchers with 0-2 papers
4. **Prolific Researchers**: People with 50+ papers
5. **Name Variations**: "Bob" vs "Robert", "J. Smith" vs "John Smith"
6. **Special Characters**: Names with accents, umlauts, etc.
7. **Edge Cases**: Retired professors, moved institutions, changed names

### Automated Testing

```typescript
describe('Researcher Profile Search', () => {
  test('finds researcher with exact match', async () => {
    const result = await searchResearcher(
      'Geoffrey Hinton',
      'University of Toronto'
    );

    expect(result.confidenceScore).toBeGreaterThan(90);
    expect(result.topPapers.length).toBeGreaterThan(0);
    expect(result.topPapers[0].authors).toContain('Hinton');
  });

  test('handles common names correctly', async () => {
    const result = await searchResearcher('John Smith', 'MIT');

    expect(result.warnings).toContain('Common name - verify affiliation');
    expect(result.confidenceScore).toBeLessThan(100);
  });

  test('returns zero papers for new researcher', async () => {
    const result = await searchResearcher('New Person', 'Unknown University');

    expect(result.topPapers.length).toBe(0);
    expect(result.summary).toBeTruthy();
  });
});
```

---

## Monitoring & Analytics

### Add Usage Tracking

```typescript
// Track searches
await analytics.track('researcher_search', {
  name_hash: hashName(name),
  affiliation: affiliation,
  papers_found: result.topPapers.length,
  confidence_score: result.confidenceScore,
  source: result.source,
  cache_hit: usedCache,
  response_time_ms: Date.now() - startTime
});

// Track errors
if (error) {
  await analytics.track('search_error', {
    error_type: error.name,
    error_message: error.message,
    source: 'perplexity'
  });
}
```

### Add Admin Dashboard

```tsx
// Show statistics
<Stats>
  <Stat label="Total Searches" value={totalSearches} />
  <Stat label="Success Rate" value={`${successRate}%`} />
  <Stat label="Avg Response Time" value={`${avgTime}ms`} />
  <Stat label="Cache Hit Rate" value={`${cacheHitRate}%`} />
</Stats>

// Show recent searches
<RecentSearches searches={recentSearches} />

// Show common errors
<ErrorLog errors={recentErrors} />
```

---

## Summary

**Top 3 Most Important Improvements**:

1. 🔴 **Direct Google Scholar Integration** - Most reliable source
2. 🔴 **Better Person Identification** - Add ORCID, email, research area
3. 🟠 **Confidence Scoring** - Show users how certain the match is

**Quick Wins to Implement Now**:
- ✅ Add ORCID field
- ✅ Add paper source badges
- ✅ Add confidence indicator
- ✅ Add manual refresh button

These improvements will dramatically increase accuracy and user trust in the system!
