# Dynamic Researcher Profile Feature

This feature allows you to dynamically load researcher profiles using Perplexity AI search.

## How It Works

The researcher profile page now fetches data dynamically using the Perplexity API to:
1. Find the researcher's top 5 most cited/impactful papers with links
2. Generate a detailed professional summary about their work and contributions

## Usage

### Accessing Researcher Profiles

Visit the researcher page with URL parameters:

```
http://localhost:3000/researcher?name=<researcher-name>&affiliation=<university>
```

**Example:**
```
http://localhost:3000/researcher?name=Yann LeCun&affiliation=New York University
```

### Parameters

- `name` (required): The researcher's full name
- `affiliation` (required): Their university or institution

### Default Behavior

If no parameters are provided, it defaults to:
- Name: "Dr. Sarah Chen"
- Affiliation: "University of São Paulo"

## API Endpoints

### GET /api/researcher/profile

Fetches researcher profile data using Perplexity AI.

**Query Parameters:**
- `name`: Researcher's full name
- `affiliation`: University/institution name

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "Researcher Name",
    "affiliation": "University Name",
    "summary": "Detailed 3-4 paragraph professional summary...",
    "topPapers": [
      {
        "title": "Paper Title",
        "authors": "Author names",
        "abstract": "Paper abstract...",
        "url": "https://arxiv.org/...",
        "year": "2024"
      }
    ]
  },
  "metadata": {
    "usedMockData": false,
    "timestamp": "2025-10-18T...",
    "model": "llama-3.1-sonar-large-128k-online"
  }
}
```

## Configuration

The Perplexity API key is configured in the `.env` file:

```env
PERPLEXITY_API_KEY=your-api-key-here
```

If the API key is not set or the API call fails, the system will fall back to mock data.

## Features

### What's Fetched

1. **Verified Publications (up to 5)**: Papers with STRICT authorship verification:
   - **ONLY papers where the researcher is actually listed as an author**
   - Full title exactly as published
   - Complete author list
   - Abstract/summary
   - Direct link (Google Scholar, arXiv, DOI, Semantic Scholar)
   - Publication year
   - **Backend validation ensures researcher name appears in author list**

2. **Professional Summary**: A comprehensive 3-4 paragraph summary covering:
   - Current position and role
   - Research focus areas
   - Major contributions to their field
   - Career highlights (previous positions, awards)
   - Key expertise areas
   - Impact on research community

### Paper Verification Process

The system uses a **two-layer verification** to ensure accuracy:

1. **AI Verification (Perplexity)**:
   - Explicit instructions to ONLY include verified papers
   - Cross-references Google Scholar, arXiv, and DBLP
   - Checks author lists before including papers
   - Prioritizes accuracy over quantity

2. **Backend Validation**:
   - Server-side filtering of returned papers
   - Validates researcher name appears in author list
   - Supports multiple name formats (full name, initials, etc.)
   - Filters out false matches
   - Logs filtered papers for transparency

### Caching

The Perplexity API responses are cached for 30 minutes to:
- Reduce API costs
- Improve performance
- Provide faster responses for repeated queries

## Files Modified/Created

1. **[lib/perplexity.ts](lib/perplexity.ts)** - Added `fetchResearcherProfile` method
2. **[app/api/researcher/profile/route.ts](app/api/researcher/profile/route.ts)** - New API endpoint
3. **[app/researcher/page.tsx](app/researcher/page.tsx)** - Updated to fetch dynamic data
4. **[.env](.env)** - Environment configuration (copied from .env.example)

## Testing

Try these examples:

1. **Yann LeCun** (NYU):
   ```
   http://localhost:3000/researcher?name=Yann LeCun&affiliation=New York University
   ```

2. **Geoffrey Hinton** (University of Toronto):
   ```
   http://localhost:3000/researcher?name=Geoffrey Hinton&affiliation=University of Toronto
   ```

3. **Andrew Ng** (Stanford):
   ```
   http://localhost:3000/researcher?name=Andrew Ng&affiliation=Stanford University
   ```

## Error Handling

The page gracefully handles errors:
- Shows loading spinner while fetching
- Displays error message if fetch fails
- Falls back to mock data if Perplexity API is unavailable
- Provides link back to home page

## Next Steps

You can enhance this feature by:
- Adding more researcher details (h-index, citation count, research interests)
- Implementing search/autocomplete for researcher names
- Adding filters for papers (by year, citations, etc.)
- Integrating with other academic databases (Google Scholar, DBLP)
- Adding the ability to claim and edit profiles
