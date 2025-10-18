# Perplexity Re-Searcher

An AI-powered platform connecting world-class researchers with career-defining opportunities through intelligent matching powered by Perplexity AI.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🌟 Overview

Perplexity Re-Searcher is a modern web application that revolutionizes academic recruitment by leveraging AI to match researchers with relevant opportunities. The platform uses Perplexity's advanced AI capabilities to analyze research papers, extract skills, and find the perfect alignment between researchers and job opportunities.

### Key Features

- 🔍 **AI-Powered Matching** - Intelligent researcher-opportunity matching using Perplexity API
- 📚 **Research Profile Management** - Automatic sync with Google Scholar publications
- 🎯 **Smart Recommendations** - Personalized NeurIPS 2024 paper suggestions
- ⚡ **Fast Search** - Parallel processing for 5-10x faster matching (~5 seconds)
- 🎨 **Modern UI** - Clean, professional interface with responsive design
- 📊 **Detailed Analytics** - Match scores, alignment analysis, and skill extraction

## 🏗️ Architecture

### Tech Stack

- **Frontend:** Next.js 14, React 18, Tailwind CSS  
- **Backend:** Node.js / Vercel Serverless  
- **Intelligence Layer:** Perplexity API (grounded search + citations)  
- **Data Sources:** NeurIPS 2024 / arXiv / Google Scholar metadata  
- **Payments (demo):** Stripe sandbox for sponsorship flows  

---

## 🚀 Vision

> “If LinkedIn is the career graph of the industrial era,  
> **ReSearcher** is the reasoning graph of the intelligence era.”

Every paper, experiment, and idea becomes a living node in an evolving network of curiosity.  
ReSearcher helps people and organisations **ask better questions — and reason their way to better answers.**

---

## 🧪 Quick Start

```bash
# Install dependencies
npm install

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your Perplexity API key:
   ```env
   PERPLEXITY_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## 🔌 Perplexity API Integration

### How It Works

The application integrates Perplexity AI in several key areas:

#### 1. **Researcher Profile Fetching** (`lib/perplexity.ts`)

```typescript
// Searches Google Scholar for researcher publications
async fetchResearcherProfile(name: string, affiliation: string, limit: number = 10)
```

- Uses Perplexity to search Google Scholar in real-time
- Extracts top N most-cited papers (configurable, default: 10)
- Validates paper authorship and removes duplicates
- Returns structured profile with papers and summary

#### 2. **Researcher-Job Matching** (`lib/perplexity.ts`)

```typescript
// Matches researcher portfolio against job requirements
async matchPaperToJob(paper: Paper, jobRequirements: string)
```

- Analyzes researcher's work against job description
- Returns match score (0-100), alignment points, and gaps
- Uses critical scoring (strict rubric, realistic scores)
- Provides detailed explanations with citations

#### 3. **Skill Extraction** (`lib/perplexity.ts`)

```typescript
// Extracts technical skills from researcher profile
async askAboutResearcher(question: string, researcher: ResearcherContext)
```

- Analyzes papers and profile for key skills
- Extracts research areas and methodologies
- Returns concise bullet-point summaries
- Used for matching and profile enhancement

#### 4. **Paper Recommendations** (`app/api/researcher/recommendations/route.ts`)

```typescript
// Recommends relevant NeurIPS 2024 papers
GET /api/researcher/recommendations?areas=<research_areas>
```

- Finds top 5 NeurIPS 2024 papers aligned with researcher interests
- Ranks by relevance score
- Provides explanations for each recommendation

### API Configuration

The Perplexity API client is configured in `lib/perplexity.ts`:

```typescript
{
  model: "sonar-pro",              // Most capable model
  temperature: 0.2,                 // Low randomness for consistency
  return_citations: true,           // Enable source attribution
  search_domain_filter: [           // Focus on academic sources
    "arxiv.org",
    "scholar.google.com",
    "github.com"
  ]
}
```

### Performance Optimizations

1. **Parallel Processing** - All researcher analyses run concurrently
2. **Caching** - 30-minute TTL cache for repeated queries
3. **Batching** - Multiple API calls combined per researcher
4. **Smart Prompts** - Concise prompts for faster responses

### Rate Limiting & Error Handling

- Graceful degradation on API failures
- Exponential backoff for retries
- Null filtering for failed matches
- User-friendly error messages

## 📖 Usage

### For Researchers

1. Navigate to the **Researcher Portal**
2. Enter your name and affiliation
3. Select your profile from multiple candidates (if applicable)
4. View your publications and get NeurIPS 2024 paper recommendations

### For Recruiters

1. Navigate to the **Recruiter Portal**
2. Paste a job description (or use the demo Perplexity AI job)
3. Click **"Find Top Matches"**
4. Review ranked researchers with:
   - Match scores and confidence levels
   - Alignment strengths and gaps
   - Extracted skills and expertise
   - Publication details

### Admin

- Access `/admin` to view and seed the researcher database
- Pre-populated with example researchers (Yann LeCun, Geoffrey Hinton, Fei-Fei Li)

## 🎯 Key Features

### Dynamic Paper Handling

- **Configurable limits**: Request 1-20 papers per researcher
- **Edge case handling**: Gracefully handles researchers with 0, <5, or 20+ papers
- **No hardcoding**: All limits are dynamic and user-configurable

### Profile Selection System

- **Candidate search**: Finds multiple matches for ambiguous names
- **Confidence levels**: High/Medium/Low rankings
- **Manual selection**: User chooses correct profile from list

### Critical Scoring

- **Realistic scores**: Most candidates score 60-80% (not inflated)
- **Strict rubric**: 90+ reserved for exceptional matches
- **Detailed feedback**: Specific strengths and gaps highlighted

### Clean Modern UI

- White backgrounds with subtle shadows
- Professional blue/indigo color scheme
- Generous whitespace and padding
- Responsive design for all devices

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PERPLEXITY_API_KEY` | Your Perplexity API key | Yes |
| `NEXT_PUBLIC_APP_URL` | Application URL (for production) | No |

### Adding New Features

1. **API Routes**: Add to `app/api/`
2. **Pages**: Add to `app/`
3. **Components**: Add to `components/` (if needed)
4. **Utilities**: Add to `lib/`

## 📊 Performance Metrics

| Metric | Value |
|--------|-------|
| **Researcher Matching** | ~5 seconds (for 5 researchers) |
| **Profile Loading** | ~3-6 seconds |
| **Cached Queries** | <100ms (instant) |
| **Cache TTL** | 30 minutes |
| **Speedup vs Sequential** | 5-10x faster |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Perplexity AI** for providing the powerful AI API
- **Next.js** team for the amazing framework
- **Vercel** for seamless deployment
- **Tailwind CSS** for beautiful styling utilities

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ using Perplexity AI**
