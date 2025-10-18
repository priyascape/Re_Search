'use client';

import { useState, useEffect } from 'react';
import { Award, TrendingUp, FileText, Mail, DollarSign, ChevronDown, ChevronUp, Sparkles, ExternalLink, Send, Building2, MapPin, BookOpen, CheckCircle, Code, Quote, Loader2, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Researcher {
  rank: number;
  name: string;
  institution: string;
  location: string;
  matchScore: number;
  paper: {
    title: string;
    authors: string;
    conference: string;
    abstract: string;
    topics: string[];
    citations: number;
    githubUrl?: string;
  };
  stats: {
    publications: number;
    citations: number;
    hIndex: number;
  };
  funding: {
    needed: number;
    breakdown: { item: string; amount: number }[];
  };
  matchReasons: string[];
  deepDive: {
    keyFindings: string[];
    relevantExperience: string[];
    technicalDepth: string;
  };
}

const researchers: Researcher[] = [
  {
    rank: 1,
    name: 'Dr. Sarah Chen',
    institution: 'University of São Paulo',
    location: 'São Paulo, Brazil',
    matchScore: 96,
    paper: {
      title: 'Scalable Oversight of AI Systems via Debate',
      authors: 'S Chen, M Rodriguez, A Kumar, J Thompson',
      conference: 'NeurIPS 2024 (Oral Presentation)',
      abstract: 'We present a novel framework for scalable oversight of advanced AI systems using structured debate protocols. Our approach enables human evaluators to judge the safety and alignment of AI systems performing tasks beyond human expertise by observing debates between AI agents.',
      topics: ['AI Safety', 'Alignment', 'Scalable Oversight', 'Debate', 'Interpretability'],
      citations: 247,
      githubUrl: 'https://github.com/sarahchen/debate-oversight'
    },
    stats: {
      publications: 23,
      citations: 1847,
      hIndex: 31
    },
    funding: {
      needed: 4500,
      breakdown: [
        { item: 'Conference Registration', amount: 1200 },
        { item: 'Travel (São Paulo → Vancouver)', amount: 1800 },
        { item: 'Accommodation (5 nights)', amount: 1500 }
      ]
    },
    matchReasons: [
      'Published NeurIPS 2024 paper directly addressing scalable oversight and debate-based AI safety mechanisms',
      'Previous experience at OpenAI and DeepMind Research demonstrates industry knowledge and collaborative culture fit',
      'PhD from Stanford (2019) with strong theoretical foundation in machine learning and AI systems',
      'Constitutional AI and recursive reward modeling work aligns perfectly with RLHF and alignment requirements',
      'Track record of 23 publications with 1,847 citations shows consistent high-impact research output'
    ],
    deepDive: {
      keyFindings: [
        'Achieved 89% accuracy in detecting misaligned AI behavior through debate protocols',
        'Demonstrated 10x reduction in human evaluation time compared to traditional oversight methods',
        'Successfully scaled debate-based oversight to complex domains: mathematical reasoning, code generation, strategic planning',
        'Developed framework applicable to AI systems operating beyond human expert-level performance'
      ],
      relevantExperience: [
        'Research Scientist at OpenAI (2020-2022): Led safety research initiatives',
        'Research Intern at DeepMind (2018-2019): Worked on interpretability projects',
        'Published work on Constitutional AI, recursive reward modeling, and mechanistic interpretability',
        'Collaborated with cross-functional teams in production AI safety implementations'
      ],
      technicalDepth: 'Dr. Chen demonstrates exceptional depth in both theoretical foundations and practical implementations of AI safety systems. Her work bridges the gap between academic research and industrial applications, with hands-on experience deploying safety mechanisms in production environments. Strong coding skills evidenced by open-source contributions and reproducible research.'
    }
  },
  {
    rank: 2,
    name: 'Dr. Michael Zhang',
    institution: 'Tsinghua University',
    location: 'Beijing, China',
    matchScore: 89,
    paper: {
      title: 'Hierarchical Reinforcement Learning for Aligned AI Agents',
      authors: 'M Zhang, L Wang, K Chen',
      conference: 'NeurIPS 2024',
      abstract: 'We propose a hierarchical reinforcement learning framework that incorporates human preferences at multiple levels of abstraction, enabling more nuanced alignment of AI agents with complex human values.',
      topics: ['RLHF', 'Alignment', 'Hierarchical RL', 'Multi-Agent Systems'],
      citations: 189,
      githubUrl: 'https://github.com/mzhang/hierarchical-rlhf'
    },
    stats: {
      publications: 18,
      citations: 1342,
      hIndex: 27
    },
    funding: {
      needed: 4500,
      breakdown: [
        { item: 'Conference Registration', amount: 1200 },
        { item: 'Travel (Beijing → Vancouver)', amount: 2000 },
        { item: 'Accommodation (5 nights)', amount: 1300 }
      ]
    },
    matchReasons: [
      'Hierarchical RLHF approach directly applicable to complex AI alignment challenges',
      'Strong multi-agent systems background relevant to collaborative AI development',
      'Experience with preference learning and value alignment in practical settings',
      'Publications in top-tier venues demonstrate rigorous research methodology',
      'Background in both theoretical foundations and empirical implementations'
    ],
    deepDive: {
      keyFindings: [
        'Developed hierarchical preference learning that captures human values at multiple abstraction levels',
        'Demonstrated improved alignment in complex decision-making scenarios',
        'Reduced training time by 40% while maintaining alignment quality'
      ],
      relevantExperience: [
        'Assistant Professor at Tsinghua University (2021-present)',
        'Visiting Scholar at UC Berkeley (2020-2021)',
        'Industry consulting experience with major Chinese tech companies'
      ],
      technicalDepth: 'Strong theoretical background with practical implementation experience. Expertise in RL algorithms and multi-agent coordination.'
    }
  },
  {
    rank: 3,
    name: 'Prof. Emma Williams',
    institution: 'MIT',
    location: 'Cambridge, MA, USA',
    matchScore: 87,
    paper: {
      title: 'Interpretability Through Causal Mechanisms in Neural Networks',
      authors: 'E Williams, R Patel, S Johnson',
      conference: 'NeurIPS 2024',
      abstract: 'We introduce a causal framework for understanding neural network decision-making, enabling more reliable interpretability of complex AI systems through identification of causal mechanisms.',
      topics: ['Interpretability', 'Causality', 'Neural Networks', 'Explainability'],
      citations: 312,
    },
    stats: {
      publications: 31,
      citations: 2456,
      hIndex: 34
    },
    funding: {
      needed: 3800,
      breakdown: [
        { item: 'Conference Registration', amount: 1200 },
        { item: 'Travel (Boston → Vancouver)', amount: 800 },
        { item: 'Accommodation (5 nights)', amount: 1800 }
      ]
    },
    matchReasons: [
      'Leading expert in mechanistic interpretability with 31 publications and 2,456 citations',
      'Causal reasoning framework essential for understanding AI safety mechanisms',
      'MIT faculty position demonstrates teaching ability and mentorship experience',
      'Experience explaining complex technical concepts crucial for cross-functional collaboration',
      'Strong track record of reproducible research and open science practices'
    ],
    deepDive: {
      keyFindings: [
        'Developed causal framework for identifying decision-making mechanisms in neural networks',
        'Improved interpretability accuracy by 65% over baseline attribution methods',
        'Successfully applied to production ML systems at major tech companies'
      ],
      relevantExperience: [
        'Associate Professor at MIT (2019-present)',
        'Research Scientist at Google Brain (2016-2019)',
        'Collaborations with OpenAI and Anthropic on interpretability projects'
      ],
      technicalDepth: 'World-class expertise in interpretability and causality. Strong publication record and industry partnerships.'
    }
  },
  {
    rank: 4,
    name: 'Dr. Raj Patel',
    institution: 'Stanford University',
    location: 'Stanford, CA, USA',
    matchScore: 85,
    paper: {
      title: 'Adversarial Robustness in Large Language Models',
      authors: 'R Patel, K Lee, A Thompson',
      conference: 'NeurIPS 2024',
      abstract: 'We analyze adversarial vulnerabilities in large language models and propose defense mechanisms that maintain model capabilities while improving robustness to adversarial inputs.',
      topics: ['Adversarial ML', 'LLM Safety', 'Robustness', 'Security'],
      citations: 167,
    },
    stats: {
      publications: 19,
      citations: 1123,
      hIndex: 25
    },
    funding: {
      needed: 4000,
      breakdown: [
        { item: 'Conference Registration', amount: 1200 },
        { item: 'Travel (San Francisco → Vancouver)', amount: 600 },
        { item: 'Accommodation (5 nights)', amount: 2200 }
      ]
    },
    matchReasons: [
      'Adversarial robustness expertise critical for deployed AI safety systems',
      'LLM security focus aligns with constitutional AI safety requirements',
      'Stanford affiliation provides strong academic network and collaboration opportunities',
      'Practical defense mechanisms applicable to production systems',
      'Research addresses real-world safety vulnerabilities in AI systems'
    ],
    deepDive: {
      keyFindings: [
        'Identified critical vulnerabilities in LLM safety mechanisms',
        'Developed defense strategies with minimal performance degradation',
        'Demonstrated practical applicability in production environments'
      ],
      relevantExperience: [
        'Postdoctoral Researcher at Stanford (2022-present)',
        'PhD from Carnegie Mellon University (2022)',
        'Internships at Meta AI and Microsoft Research'
      ],
      technicalDepth: 'Strong security background with focus on practical LLM safety. Experience with adversarial ML and defense mechanisms.'
    }
  },
  {
    rank: 5,
    name: 'Dr. Yuki Tanaka',
    institution: 'University of Tokyo',
    location: 'Tokyo, Japan',
    matchScore: 83,
    paper: {
      title: 'Multi-Objective Optimization for AI Alignment',
      authors: 'Y Tanaka, H Sato, M Ito',
      conference: 'NeurIPS 2024',
      abstract: 'We present a multi-objective optimization framework for AI alignment that balances competing human values and preferences, enabling more nuanced and context-aware aligned systems.',
      topics: ['Alignment', 'Multi-Objective Optimization', 'Value Learning', 'Ethics'],
      citations: 143,
    },
    stats: {
      publications: 16,
      citations: 892,
      hIndex: 22
    },
    funding: {
      needed: 4800,
      breakdown: [
        { item: 'Conference Registration', amount: 1200 },
        { item: 'Travel (Tokyo → Vancouver)', amount: 2200 },
        { item: 'Accommodation (5 nights)', amount: 1400 }
      ]
    },
    matchReasons: [
      'Multi-objective optimization crucial for balancing competing alignment objectives',
      'Value learning framework addresses complex ethical considerations in AI',
      'International perspective valuable for diverse AI safety considerations',
      'Strong mathematical foundation in optimization theory',
      'Experience with real-world tradeoffs in AI system design'
    ],
    deepDive: {
      keyFindings: [
        'Developed Pareto-optimal solutions for competing alignment objectives',
        'Framework handles value conflicts and ethical tradeoffs systematically',
        'Applied to healthcare and autonomous systems with measurable improvements'
      ],
      relevantExperience: [
        'Associate Professor at University of Tokyo (2020-present)',
        'Visiting Researcher at Oxford Future of Humanity Institute (2019)',
        'Collaboration with Japanese AI ethics initiatives'
      ],
      technicalDepth: 'Strong optimization theory background with ethical AI focus. Experience in multi-stakeholder value alignment.'
    }
  }
];

export default function MatchesPage() {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [customQuestion, setCustomQuestion] = useState('');
  const [askedQuestions, setAskedQuestions] = useState<{ [key: number]: string[] }>({});
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load match results from sessionStorage
    const loadMatches = () => {
      try {
        if (typeof window !== 'undefined') {
          const storedData = sessionStorage.getItem('matchResults');
          if (storedData) {
            const data = JSON.parse(storedData);
            setMatches(data.matches || []);
            setLoading(false);
          } else {
            setError('No match results found. Please perform a search first.');
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Error loading matches:', err);
        setError('Failed to load match results.');
        setLoading(false);
      }
    };

    loadMatches();
  }, []);

  const toggleExpand = (rank: number) => {
    setExpandedId(expandedId === rank ? null : rank);
  };

  const handleAskQuestion = (rank: number, question: string) => {
    setAskedQuestions(prev => ({
      ...prev,
      [rank]: [...(prev[rank] || []), question]
    }));
    setCustomQuestion('');
  };

  const suggestedQuestions = [
    'Does this researcher have industry experience?',
    'What is their experience with production ML systems?',
    'Have they worked on team projects or led research groups?',
    'What programming languages and frameworks are they proficient in?',
    'Do they have experience presenting at conferences?'
  ];

  // Use dynamic matches or fallback to demo data
  const displayData = matches.length > 0 ? matches : researchers;
  const totalFunding = 4500; // Default per researcher
  const traditionalRecruitingCost = 85000; // Average cost per hire
  const savings = traditionalRecruitingCost - totalFunding;
  const savingsPercent = Math.round((savings / traditionalRecruitingCost) * 100);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading match results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <Link href="/recruiter" className="text-emerald-600 hover:text-emerald-800 font-medium inline-flex items-center">
              ← New Search
            </Link>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700 font-bold mb-2">{error}</p>
            <Link href="/recruiter" className="text-emerald-600 hover:text-emerald-800 font-medium">
              Go back and start a new search
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      {/* Header Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link href="/recruiter" className="text-emerald-600 hover:text-emerald-800 font-medium inline-flex items-center">
            ← New Search
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-8 h-8 text-emerald-600" />
                <h1 className="text-4xl font-bold text-gray-900">Top Matching Researchers</h1>
              </div>
              <p className="text-gray-600 text-lg">
                Found {displayData.length} exceptional candidates for your role
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">
                  Powered by Perplexity Analysis
                </span>
                <span className="text-xs text-gray-500">• Ranked by research alignment and expertise</span>
              </div>
            </div>
          </div>
        </div>

        {/* Researcher Cards */}
        <div className="space-y-6 mb-8">
          {displayData.map((item, index) => {
            // Handle both API format and demo format
            const researcher = item.researcher || item;
            const matchData = item.match || {};
            const rank = index + 1;
            const matchScore = matchData.score || item.matchScore || 0;
            const alignment = matchData.alignment || item.matchReasons || [];
            const gaps = matchData.gaps || [];
            const extractedSkills = matchData.extractedSkills || '';

            return (
              <div
                key={researcher.id || rank}
                className={`bg-white rounded-xl shadow-sm border-2 transition-all ${
                  rank === 1
                    ? 'border-emerald-300 shadow-emerald-100'
                    : 'border-gray-200 hover:border-emerald-200'
                }`}
              >
              {/* Main Card Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Rank Badge */}
                    <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl ${
                      rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                      rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                      rank === 3 ? 'bg-gradient-to-br from-orange-300 to-orange-400 text-white' :
                      'bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700'
                    }`}>
                      #{rank}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h2 className="text-2xl font-bold text-gray-900">{researcher.name}</h2>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          matchScore >= 85
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                            : matchScore >= 75
                            ? 'bg-teal-100 text-teal-700 border border-teal-300'
                            : matchScore >= 65
                            ? 'bg-blue-100 text-blue-700 border border-blue-300'
                            : matchScore >= 50
                            ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                            : 'bg-gray-100 text-gray-700 border border-gray-300'
                        }`}>
                          {matchScore}% Match
                        </span>
                        {/* Score Interpretation */}
                        <span className="text-xs text-gray-500">
                          {matchScore >= 85 ? '(Excellent)' :
                           matchScore >= 75 ? '(Good)' :
                           matchScore >= 65 ? '(Moderate)' :
                           matchScore >= 50 ? '(Weak)' : '(Poor)'}
                        </span>
                        {rank === 1 && (
                          <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            TOP MATCH
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          <span>{researcher.affiliation || researcher.institution}</span>
                        </div>
                        {researcher.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{researcher.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex gap-6 text-sm mb-4">
                        <div>
                          <span className="font-semibold text-gray-900">{researcher.topPapers?.length || researcher.stats?.publications || 0}</span>
                          <span className="text-gray-600 ml-1">{(researcher.topPapers?.length || researcher.stats?.publications || 0) === 1 ? 'Publication' : 'Publications'}</span>
                        </div>
                        {researcher.stats && (
                          <>
                            <div>
                              <span className="font-semibold text-gray-900">{researcher.stats.citations}</span>
                              <span className="text-gray-600 ml-1">Citations</span>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-900">{researcher.stats.hIndex}</span>
                              <span className="text-gray-600 ml-1">h-index</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Funding Badge */}
                  <div className="flex-shrink-0 ml-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        ${researcher.funding?.needed.toLocaleString() || '4,500'}
                      </div>
                      <div className="text-xs text-gray-600">Funding Needed</div>
                    </div>
                  </div>
                </div>

                {/* Papers - Show top paper or all papers */}
                {researcher.topPapers && researcher.topPapers.length > 0 ? (
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 mb-4 border border-indigo-200">
                    <div className="flex items-start gap-3">
                      <BookOpen className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">Top Publication</h4>
                          <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded-full">
                            {researcher.topPapers.length} {researcher.topPapers.length === 1 ? 'paper' : 'papers'} total
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">{researcher.topPapers[0].title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{researcher.topPapers[0].authors}</p>
                        <p className="text-sm text-gray-700 mb-3">{researcher.topPapers[0].abstract}</p>
                        {researcher.topPapers[0].year && (
                          <p className="text-sm text-gray-600 mb-2">Year: {researcher.topPapers[0].year}</p>
                        )}
                        <a href={researcher.topPapers[0].url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" />
                          View Paper
                        </a>
                        {researcher.topPapers.length > 1 && (
                          <p className="text-xs text-gray-500 mt-2">+{researcher.topPapers.length - 1} more {researcher.topPapers.length - 1 === 1 ? 'publication' : 'publications'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : researcher.paper ? (
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 mb-4 border border-indigo-200">
                    <div className="flex items-start gap-3">
                      <BookOpen className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{researcher.paper.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{researcher.paper.authors}</p>
                        <p className="text-sm text-gray-700 mb-3">{researcher.paper.abstract}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {researcher.paper.topics.map((topic: string, idx: number) => (
                            <span key={idx} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                              {topic}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="font-medium">{researcher.paper.conference}</span>
                          <span>•</span>
                          <span><strong>{researcher.paper.citations}</strong> citations</span>
                          {researcher.paper.githubUrl && (
                            <>
                              <span>•</span>
                              <a href={researcher.paper.githubUrl} className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800">
                                <Code className="w-3 h-3" />
                                GitHub
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Match Summary - Condensed */}
                <div className="bg-emerald-50 rounded-lg p-4 mb-4 border border-emerald-200">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      Match Summary
                    </h3>
                    {extractedSkills && (
                      <button
                        onClick={() => toggleExpand(rank)}
                        className="text-xs text-emerald-700 hover:text-emerald-900 font-medium flex items-center gap-1"
                      >
                        {expandedId === rank ? 'Hide' : 'View'} Full Analysis →
                      </button>
                    )}
                  </div>

                  {/* Top 2 alignment points only */}
                  <ul className="space-y-1.5 mb-3">
                    {alignment.slice(0, 2).map((reason: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{reason}</span>
                      </li>
                    ))}
                    {alignment.length > 2 && (
                      <li className="text-xs text-gray-500 ml-6">
                        +{alignment.length - 2} more {alignment.length - 2 === 1 ? 'point' : 'points'} in full analysis
                      </li>
                    )}
                  </ul>

                  {/* Show top gap if exists */}
                  {gaps.length > 0 && (
                    <div className="pt-3 border-t border-emerald-200">
                      <div className="flex items-start gap-2 text-sm text-amber-700">
                        <span className="text-amber-500 font-bold">⚠</span>
                        <span className="line-clamp-1">{gaps[0]}</span>
                      </div>
                      {gaps.length > 1 && (
                        <p className="text-xs text-gray-500 ml-6 mt-1">
                          +{gaps.length - 1} more {gaps.length - 1 === 1 ? 'concern' : 'concerns'} in full analysis
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => toggleExpand(rank)}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-3 rounded-lg font-bold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    {expandedId === rank ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        View Details
                      </>
                    )}
                  </button>
                  <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Sponsor ${researcher.funding?.needed.toLocaleString() || '4,500'}
                  </button>
                  <button className="px-6 py-3 border-2 border-emerald-600 text-emerald-600 rounded-lg font-bold hover:bg-emerald-50 transition-colors flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Contact
                  </button>
                </div>
              </div>

              {/* Deep Dive Section */}
              {expandedId === rank && (
                <div className="border-t border-gray-200 bg-gray-50 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Detailed Analysis</h3>

                  {/* Full Match Analysis */}
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      Complete Match Analysis
                    </h4>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      {/* All Alignment Points */}
                      <div className="mb-4">
                        <h5 className="font-semibold text-gray-900 text-sm mb-2">Strengths & Alignment:</h5>
                        <ul className="space-y-2">
                          {alignment.map((reason: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* All Gaps */}
                      {gaps.length > 0 && (
                        <div className="pt-4 border-t border-gray-200">
                          <h5 className="font-semibold text-gray-900 text-sm mb-2">Gaps & Concerns:</h5>
                          <ul className="space-y-2">
                            {gaps.map((gap: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-amber-700">
                                <span className="text-amber-500 font-bold mt-0.5">⚠</span>
                                <span>{gap}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Overall Relevance */}
                      {matchData.relevance && (
                        <div className="pt-4 border-t border-gray-200 mt-4">
                          <h5 className="font-semibold text-gray-900 text-sm mb-2">Overall Assessment:</h5>
                          <p className="text-sm text-gray-700 italic">{matchData.relevance}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Extracted Skills - Full Detail */}
                  {extractedSkills && (
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Code className="w-4 h-4 text-indigo-600" />
                        Technical Skills & Expertise
                      </h4>
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="text-sm text-gray-700 whitespace-pre-line">{extractedSkills}</div>
                      </div>
                    </div>
                  )}

                  {/* Professional Summary */}
                  {researcher.summary && (
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Quote className="w-4 h-4 text-emerald-600" />
                        Professional Summary
                      </h4>
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <p className="text-sm text-gray-700 whitespace-pre-line">{researcher.summary}</p>
                      </div>
                    </div>
                  )}

                  {/* All Publications */}
                  {researcher.topPapers && researcher.topPapers.length > 1 && (
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-indigo-600" />
                        All Publications ({researcher.topPapers.length})
                      </h4>
                      <div className="space-y-3">
                        {researcher.topPapers.map((paper: any, idx: number) => (
                          <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
                            <h5 className="font-semibold text-gray-900 text-sm mb-1">{paper.title}</h5>
                            <p className="text-xs text-gray-600 mb-2">{paper.authors}</p>
                            {paper.year && <p className="text-xs text-gray-500 mb-2">Year: {paper.year}</p>}
                            <p className="text-xs text-gray-700 mb-2">{paper.abstract}</p>
                            <a href={paper.url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                              <ExternalLink className="w-3 h-3" />
                              View Paper
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Demo data deep dive (if available) */}
                  {researcher.deepDive && (
                    <>
                      <div className="mb-6">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Award className="w-4 h-4 text-purple-600" />
                          Key Research Findings
                        </h4>
                        <ul className="space-y-2 bg-white rounded-lg p-4 border border-gray-200">
                          {researcher.deepDive.keyFindings.map((finding: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{finding}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-indigo-600" />
                          Relevant Experience
                        </h4>
                        <ul className="space-y-2 bg-white rounded-lg p-4 border border-gray-200">
                          {researcher.deepDive.relevantExperience.map((exp: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{exp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Quote className="w-4 h-4 text-emerald-600" />
                          Technical Assessment
                        </h4>
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <p className="text-sm text-gray-700">{researcher.deepDive.technicalDepth}</p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Q&A Section */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-4">Ask Questions About This Candidate</h4>

                    {/* Suggested Questions */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Suggested questions:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestedQuestions.map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAskQuestion(rank, q)}
                            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Question Input */}
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={customQuestion}
                        onChange={(e) => setCustomQuestion(e.target.value)}
                        placeholder="Ask a custom question about this researcher..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && customQuestion.trim()) {
                            handleAskQuestion(rank, customQuestion);
                          }
                        }}
                      />
                      <button
                        onClick={() => customQuestion.trim() && handleAskQuestion(rank, customQuestion)}
                        disabled={!customQuestion.trim()}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Ask
                      </button>
                    </div>

                    {/* Asked Questions */}
                    {askedQuestions[rank] && askedQuestions[rank].length > 0 && (
                      <div className="space-y-3">
                        {askedQuestions[rank].map((q, idx) => (
                          <div key={idx} className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                            <p className="text-sm font-medium text-gray-900 mb-2">Q: {q}</p>
                            <p className="text-sm text-gray-700">
                              <span className="font-semibold text-emerald-700">A:</span> Based on their profile and publications,
                              {q.includes('industry') && ' yes, they have significant industry experience at OpenAI and DeepMind Research, working on production ML systems and safety implementations.'}
                              {q.includes('production') && ' they have hands-on experience deploying safety mechanisms in production environments at both OpenAI and DeepMind.'}
                              {q.includes('team') && ' they have led research teams and collaborated extensively with cross-functional groups in both academic and industry settings.'}
                              {q.includes('programming') && ' they are proficient in Python, PyTorch, TensorFlow, with strong evidence from open-source contributions and reproducible research code.'}
                              {q.includes('presenting') && ' yes, they have an oral presentation at NeurIPS 2024 and have presented at multiple top-tier conferences throughout their career.'}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              </div>
            );
          })}
        </div>

        {/* Cost Savings Summary */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl shadow-xl p-8 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Total Investment vs. Traditional Recruiting</h3>
              <p className="text-emerald-100 mb-6">
                Sponsor all 5 researchers and save significantly on recruiting costs
              </p>

              <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                  <div className="text-emerald-200 text-sm mb-1">Traditional Recruiting Cost</div>
                  <div className="text-4xl font-bold">${traditionalRecruitingCost.toLocaleString()}</div>
                  <div className="text-emerald-200 text-xs mt-1">Per hire average</div>
                </div>
                <div>
                  <div className="text-emerald-200 text-sm mb-1">Sponsorship Investment</div>
                  <div className="text-4xl font-bold">${totalFunding.toLocaleString()}</div>
                  <div className="text-emerald-200 text-xs mt-1">For 5 researchers</div>
                </div>
              </div>

              <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Your Savings:</span>
                  <span className="text-3xl font-bold">${savings.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-100 text-sm">Cost Reduction:</span>
                  <span className="text-2xl font-bold">{savingsPercent}%</span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 ml-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border-2 border-white/30">
                <DollarSign className="w-12 h-12 mx-auto mb-3" />
                <div className="text-4xl font-bold mb-2">{savingsPercent}%</div>
                <div className="text-emerald-100 text-sm">Savings</div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-emerald-100 text-sm">
              <strong>Plus additional benefits:</strong> Direct conference access, faster hiring process,
              verified research credentials, and pre-screened AI safety expertise. Connect with researchers
              face-to-face at NeurIPS 2024 in Vancouver.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
