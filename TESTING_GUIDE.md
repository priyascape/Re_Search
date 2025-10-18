# Testing Guide - Dynamic Recruiter Matching

## Overview
This guide will help you test the complete dynamic flow from researcher profile creation to AI-powered job matching.

## Quick Start - Step by Step

### Step 1: Start the Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:3000`

### Step 2: Seed the Database with Sample Researchers

**Option A: Use the Admin Page (Recommended)**
1. Go to `http://localhost:3000/admin`
2. Click "Seed Sample Data" button
3. This will add 3 famous AI researchers:
   - Yann LeCun (NYU)
   - Geoffrey Hinton (University of Toronto)
   - Fei-Fei Li (Stanford)

**Option B: Use API Directly**
```bash
curl -X POST http://localhost:3000/api/researchers/seed
```

### Step 3: Verify Researchers Were Stored
1. Stay on the `/admin` page
2. Click "Refresh" to reload the list
3. You should see 3 researchers listed with their affiliations and paper counts

### Step 4: Test the Recruiter Matching Flow

1. **Go to Recruiter Portal**
   - Navigate to `http://localhost:3000/recruiter`

2. **Use the Demo Job or Enter Your Own**
   - Click "Use Demo Job" for a pre-filled AI Safety Researcher position
   - OR paste your own job description

3. **Click "Find Top 5-10 Matches"**
   - The system will:
     - Fetch all researchers from the database
     - For each researcher, use Perplexity AI to:
       - Extract skills from their papers and profile
       - Match against the job description
       - Calculate similarity scores
     - Return ranked matches

4. **View Match Results**
   - You'll be redirected to `/recruiter/matches`
   - See researchers ranked by AI match score
   - Each match shows:
     - **Match Score** (0-100)
     - **Alignment Points** - Why they're a good fit
     - **Potential Gaps** - Areas where they might not match perfectly
     - **Extracted Skills** - AI-extracted technical skills
     - **All Publications** - Full list with abstracts
     - **Professional Summary** - Comprehensive background

5. **Explore Details**
   - Click "View Details" on any researcher
   - See their full publication list
   - View detailed professional summary

## Testing with Real Researchers

### Add a Real Researcher Profile

1. Go to `http://localhost:3000/researcher`
2. Enter a real researcher's name and affiliation, for example:
   - Name: `Andrew Ng`
   - Affiliation: `Stanford University`
3. Click "Search Researcher"
4. Perplexity API will:
   - Search Google Scholar for their papers
   - Verify authorship
   - Extract their professional summary
   - Save to database

5. Verify storage:
   - Go to `/admin`
   - Click "Refresh"
   - You should now see 4 researchers (3 seeded + 1 new)

6. Test matching again:
   - Go to `/recruiter`
   - Enter a job description related to machine learning
   - See all 4 researchers ranked by relevance

## Debugging

### Check Console Logs

The server logs will show:
```
🔄 Initialized new ResearcherDatabase instance
📊 Database stats: 3 researchers in database
📋 Researchers found: [ 'Yann LeCun', 'Geoffrey Hinton', 'Fei-Fei Li' ]
🔍 Matching 3 researchers against job description...
  📊 Analyzing Yann LeCun...
    ✅ Yann LeCun: 92/100
  📊 Analyzing Geoffrey Hinton...
    ✅ Geoffrey Hinton: 88/100
  📊 Analyzing Fei-Fei Li...
    ✅ Fei-Fei Li: 85/100
✅ Found 3 matches
```

### Common Issues

**Issue: "No researchers found in database"**
- **Solution**: Seed the database first using `/admin` page or `/api/researchers/seed`
- The in-memory database resets when the server restarts

**Issue: "Failed to find matches"**
- **Check 1**: Make sure Perplexity API key is set in `.env`
- **Check 2**: Check server console for API errors
- **Check 3**: Go to `/admin` to verify researchers are stored

**Issue: Match scores are all 0**
- This indicates Perplexity API failed
- Check your API key and rate limits
- Check server logs for error messages

## API Endpoints Reference

### Researchers
- `GET /api/researchers` - Get all researchers
- `POST /api/researchers/seed` - Add sample researchers

### Researcher Profile
- `GET /api/researcher/profile?name=X&affiliation=Y` - Fetch and store researcher profile

### Matching
- `POST /api/recruiter/match` - Match researchers to job description
  ```json
  {
    "jobDescription": "Your job description here..."
  }
  ```

## Expected Flow Diagram

```
User Flow:
1. Researcher creates profile (/researcher)
   ↓
2. Perplexity fetches papers from Google Scholar
   ↓
3. Profile saved to database (in-memory)
   ↓
4. Recruiter enters job description (/recruiter)
   ↓
5. API fetches all researchers from database
   ↓
6. For each researcher:
   - Perplexity extracts skills from papers
   - Perplexity matches vs job description
   - Calculates similarity score
   ↓
7. Returns ranked matches
   ↓
8. Recruiter views results (/recruiter/matches)
```

## Success Criteria

✅ **Database Seeding Works**
- Can seed 3 sample researchers
- Researchers appear in `/admin` page

✅ **Researcher Profile Creation Works**
- Can add a new researcher by name + affiliation
- Perplexity fetches real papers
- Profile appears in `/admin`

✅ **Matching Works**
- Recruiter can enter job description
- System fetches all researchers
- Perplexity analyzes each researcher
- Returns ranked matches with scores

✅ **Results Display Works**
- Match scores are displayed (0-100)
- Alignment reasons are shown
- Skills are extracted and displayed
- Publications are listed
- Professional summaries are shown

## Next Steps

After confirming everything works:

1. **Add More Researchers**
   - Use `/researcher` to add more real profiles
   - Build up a larger database for better testing

2. **Test Different Job Descriptions**
   - Try various research areas
   - See how matching quality changes

3. **Upgrade to Persistent Database**
   - Replace in-memory DB with PostgreSQL + Prisma
   - Data will survive server restarts

4. **Enhance Matching Algorithm**
   - Add filters (research area, location, etc.)
   - Implement weighted scoring
   - Add recruiter feedback loop
