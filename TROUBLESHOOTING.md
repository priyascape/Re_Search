# Troubleshooting - Researcher Profile Not Working

## Problem: Seeing Mock Data Instead of Real Papers

If you're seeing papers like "Deep Learning Architectures for Large-Scale Applications" with your name inserted, you're seeing **mock data**, which means the Perplexity API is failing.

## Step 1: Test the Perplexity API

Run the test script:

```bash
node test-perplexity.js
```

### Expected Output (Success):
```
🔑 API Key: pplx-5LZZZ...
📡 Calling Perplexity API...
📊 Response status: 200 OK
✅ API Response received
Content: {papers: [...]}
Citations: [...]
```

### Common Errors:

#### Error 1: API Key Not Set
```
❌ PERPLEXITY_API_KEY is not set in .env file
```

**Fix**: Check that `.env` file exists and contains:
```
PERPLEXITY_API_KEY=pplx-your-actual-key-here
```

#### Error 2: Invalid API Key
```
❌ API Error: 401 Unauthorized
```

**Fix**:
1. Go to https://www.perplexity.ai/settings/api
2. Generate a new API key
3. Update `.env` file with the new key

#### Error 3: Rate Limit
```
❌ API Error: 429 Too Many Requests
```

**Fix**: Wait a few minutes and try again

#### Error 4: Network Error
```
❌ Error: fetch failed
```

**Fix**: Check your internet connection

## Step 2: Check Server Logs

When you search for a researcher, check the terminal/console logs:

### Success Logs:
```
🔍 Searching for researcher: Vishal Yadav at Queen Mary University of London
📡 Calling Perplexity API for: Vishal Yadav at Queen Mary University of London
📨 Perplexity response received (1234 chars)
📄 Response preview: {"name":"Vishal Yadav"...
🔍 Parsing JSON response...
✅ JSON parsed successfully
📊 Papers found in response: 2
📚 Papers returned from Perplexity:
  1. "Privacy-Preserving Behaviour of Chatbot Users..." - J Ive, V Yadav, M Ignashina...
  2. "A Data-Centric Approach to Detecting..." - J Ive, P Bondaronek, V Yadav...
📥 Received 2 papers from Perplexity
✅ Perplexity API call successful
📄 Found 2 verified papers after validation
```

### Failure Logs:
```
❌ Perplexity API failed: Error: PERPLEXITY_API_KEY is not set
Error details: PERPLEXITY_API_KEY is not set
```

OR

```
❌ Perplexity API failed: Error: Perplexity API error (401): Unauthorized
Error details: Perplexity API error (401): Unauthorized
```

## Step 3: Common Issues

### Issue: Database Error

If you see errors about `getDB()`:

**Fix**: The database integration is optional. If it's causing issues, you can comment it out in [app/api/researcher/profile/route.ts](app/api/researcher/profile/route.ts:186-194):

```typescript
// Comment out or remove these lines:
/*
const db = getDB();
const stored = db.upsert({
  name: result.name,
  affiliation: result.affiliation,
  summary: result.summary,
  topPapers: result.topPapers,
});
console.log(`💾 Saved researcher profile to database: ${stored.id}`);
*/
```

### Issue: JSON Parsing Error

If you see:
```
❌ Failed to parse researcher profile JSON
```

This means Perplexity returned data but not in the expected format.

**Fix**: Check the logs for "Raw content:" to see what was returned.

## Step 4: Clear Cache

The system caches responses for 30 minutes. To force a fresh search:

1. Restart your development server (`npm run dev`)
2. Try searching again

## Step 5: Verify .env File

Make sure your `.env` file is in the root directory and contains:

```env
# Perplexity API Configuration
PERPLEXITY_API_KEY=your_api_key_here

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important**: After updating `.env`, restart the dev server!

## Step 6: Check Browser Console

Open browser DevTools (F12) and check the Console tab when searching:

### Success:
```
✅ Profile loaded successfully
```

### Failure:
```
❌ Error: Failed to fetch researcher profile
```

## Step 7: Check Network Tab

In browser DevTools, go to Network tab:

1. Search for a researcher
2. Find the request to `/api/researcher/profile?name=...&affiliation=...`
3. Check the response

### Success Response:
```json
{
  "success": true,
  "data": {
    "name": "Vishal Yadav",
    "affiliation": "Queen Mary University of London",
    "topPapers": [
      {
        "title": "Privacy-Preserving Behaviour of Chatbot Users...",
        "authors": "J Ive, V Yadav, M Ignashina...",
        "url": "https://arxiv.org/abs/2411.17589",
        "year": "2024"
      }
    ]
  },
  "metadata": {
    "usedMockData": false,
    "model": "llama-3.1-sonar-large-128k-online"
  }
}
```

### Failure Response:
```json
{
  "error": "Failed to fetch researcher profile",
  "message": "PERPLEXITY_API_KEY is not set",
  "details": "Please check that the Perplexity API key is valid..."
}
```

## Quick Fix Checklist

- [ ] `.env` file exists in root directory
- [ ] `PERPLEXITY_API_KEY` is set in `.env`
- [ ] API key starts with `pplx-`
- [ ] Development server restarted after `.env` changes
- [ ] No rate limits (wait 5 minutes if you've been testing a lot)
- [ ] Internet connection working
- [ ] Can access https://www.perplexity.ai/

## Still Not Working?

If you've tried everything above and it's still showing mock data:

1. Run the test script and share the output:
   ```bash
   node test-perplexity.js
   ```

2. Check the server terminal logs when searching

3. Check if the API key is valid by visiting: https://www.perplexity.ai/settings/api

## Expected Behavior

When working correctly:

1. You search for "Vishal Yadav" at "Queen Mary University of London"
2. System calls Perplexity API
3. Perplexity searches Google Scholar
4. Finds his 2 actual papers
5. Returns real data (not mock)
6. You see his actual papers with arXiv links

**Metadata should show**: `"usedMockData": false`
