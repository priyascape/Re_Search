# API Documentation

This document describes the API routes available in the NeurIPS Talent Bridge application.

## Base URL
```
http://localhost:3000/api
```

## Authentication
Currently, no authentication is required. API key for Perplexity is configured via environment variable `PERPLEXITY_API_KEY`.

---

## Endpoints

### 1. Match Paper to Job

Match a research paper against job requirements using Perplexity AI.

**Endpoint:** `POST /api/match`

**Request Body:**
```json
{
  "paperId": "sarah-chen-debate",  // Optional: ID of pre-loaded paper
  "companyId": "anthropic",        // Optional: Company identifier
  "jobRequirements": "string",     // Required: Full job description
  "paper": {                        // Optional: Custom paper details
    "title": "string",
    "abstract": "string",
    "topics": ["string"],           // Optional
    "authors": "string"             // Optional
  }
}
```

**Response:**
```json
{
  "success": true,
  "paperId": "sarah-chen-debate",
  "companyId": "anthropic",
  "match": {
    "matchScore": 96,
    "alignment": [
      "Strong research focus on AI safety aligns perfectly with role requirements",
      "Demonstrated expertise in scalable oversight mechanisms",
      "...more alignment points"
    ],
    "gaps": [
      "...potential gaps if any"
    ],
    "relevance": "Overall assessment of the match",
    "citations": [
      {
        "url": "https://scholar.google.com/...",
        "title": "Citation title"
      }
    ]
  },
  "metadata": {
    "usedMockData": false,
    "timestamp": "2025-01-15T10:30:00Z",
    "model": "llama-3.1-sonar-large-128k-online"
  }
}
```

**GET /api/match**
- Returns API information and cache statistics

---

### 2. Researcher Q&A

Ask questions about a researcher using AI analysis.

**Endpoint:** `POST /api/researcher/qa`

**Request Body:**
```json
{
  "question": "Does this researcher have industry experience?",
  "researcher": {
    "name": "Dr. Sarah Chen",
    "institution": "University of São Paulo",
    "bio": "Assistant Professor...",
    "experience": [
      "Research Scientist at OpenAI (2020-2022)",
      "Research Intern at DeepMind (2018-2019)"
    ],
    "papers": [
      {
        "title": "Scalable Oversight of AI Systems via Debate",
        "abstract": "We present a novel framework..."
      }
    ]
  }
}
```

**Response:**
```json
{
  "success": true,
  "question": "Does this researcher have industry experience?",
  "researcherName": "Dr. Sarah Chen",
  "answer": {
    "answer": "Yes, Dr. Sarah Chen has significant industry experience...",
    "confidence": "high",
    "sources": [
      "Work experience section",
      "Professional background"
    ],
    "citations": [
      {
        "url": "https://scholar.google.com",
        "title": "Google Scholar Profile"
      }
    ]
  },
  "metadata": {
    "usedMockData": false,
    "timestamp": "2025-01-15T10:30:00Z",
    "model": "llama-3.1-sonar-large-128k-online"
  }
}
```

**Common Questions:**
- "Does this researcher have industry experience?"
- "What is their experience with production ML systems?"
- "Have they worked on team projects or led research groups?"
- "What programming languages and frameworks are they proficient in?"
- "Do they have experience presenting at conferences?"

**GET /api/researcher/qa**
- Returns API information and example questions

---

### 3. Search Research Papers

Search for research papers on specific topics.

**Endpoint:** `POST /api/search`

**Request Body:**
```json
{
  "query": "AI alignment and safety",
  "limit": 10  // Optional, default: 10
}
```

**Response:**
```json
{
  "success": true,
  "query": "AI alignment and safety",
  "results": {
    "papers": [
      {
        "title": "Scalable Oversight of AI Systems via Debate",
        "authors": "S Chen, M Rodriguez, A Kumar, J Thompson",
        "abstract": "We present a novel framework...",
        "url": "https://arxiv.org/abs/2024.neurips.debate",
        "relevance": 95
      }
    ],
    "citations": [
      {
        "url": "https://arxiv.org",
        "title": "arXiv.org"
      }
    ]
  },
  "count": 8,
  "metadata": {
    "usedMockData": false,
    "timestamp": "2025-01-15T10:30:00Z",
    "model": "llama-3.1-sonar-large-128k-online"
  }
}
```

**Alternative GET endpoint:**
```
GET /api/search?q=AI+alignment&limit=5
```

**GET /api/search** (no query)
- Returns API information and usage examples

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

**Common Error Codes:**
- `400` - Bad Request (missing required fields)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## Fallback Behavior

All endpoints include intelligent fallback to mock data when:
- Perplexity API key is not configured
- Perplexity API is unavailable
- Network errors occur
- Rate limits are exceeded

When fallback is used, `metadata.usedMockData` will be `true`.

---

## Caching

The Perplexity API wrapper includes built-in caching:
- **Cache Duration:** 30 minutes
- **Cache Type:** In-memory (per instance)
- **Cache Key:** Method name + parameters hash

Check cache stats:
```bash
curl http://localhost:3000/api/match
```

---

## Configuration

### Environment Variables

Create a `.env.local` file:
```bash
PERPLEXITY_API_KEY=your_api_key_here
```

Get your API key from: https://www.perplexity.ai/settings/api

---

## Usage Examples

### Using cURL

**Match Paper to Job:**
```bash
curl -X POST http://localhost:3000/api/match \
  -H "Content-Type: application/json" \
  -d '{
    "jobRequirements": "We are seeking an AI Safety researcher...",
    "paper": {
      "title": "Scalable Oversight via Debate",
      "abstract": "Novel framework for AI oversight...",
      "topics": ["AI Safety", "Alignment"]
    }
  }'
```

**Ask About Researcher:**
```bash
curl -X POST http://localhost:3000/api/researcher/qa \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Does this researcher have industry experience?",
    "researcher": {
      "name": "Dr. Sarah Chen",
      "papers": [{"title": "Scalable Oversight of AI Systems via Debate"}],
      "experience": ["Research Scientist at OpenAI (2020-2022)"]
    }
  }'
```

**Search Papers:**
```bash
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "AI alignment debate",
    "limit": 5
  }'
```

### Using JavaScript/TypeScript

```typescript
// Match paper to job
const matchResponse = await fetch('/api/match', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jobRequirements: 'AI Safety Research Scientist...',
    paperId: 'sarah-chen-debate'
  })
});
const matchData = await matchResponse.json();

// Ask about researcher
const qaResponse = await fetch('/api/researcher/qa', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    question: 'Does this researcher have industry experience?',
    researcher: { name: 'Dr. Sarah Chen', papers: [...] }
  })
});
const qaData = await qaResponse.json();

// Search papers
const searchResponse = await fetch('/api/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'AI alignment',
    limit: 10
  })
});
const searchData = await searchResponse.json();
```

---

## Rate Limiting

**Perplexity API Limits:**
- Varies by plan
- Check your dashboard at https://www.perplexity.ai/settings/api

**Application Limits:**
- None currently enforced
- Caching reduces API calls significantly

---

## Best Practices

1. **Use caching:** The API automatically caches responses for 30 minutes
2. **Provide detailed context:** More information leads to better matches
3. **Handle fallbacks gracefully:** Check `metadata.usedMockData` flag
4. **Batch requests when possible:** For multiple papers, consider combining data
5. **Monitor API usage:** Check Perplexity dashboard for usage stats

---

## Support

For issues or questions:
- GitHub: https://github.com/priyascape/Re_Search
- Perplexity API Docs: https://docs.perplexity.ai
