'use client';

//import { useState } from 'react';
import { Users, Building2, Sparkles, TrendingUp, BookOpen, ExternalLink, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

type TabType = 'sponsors' | 'similar' | 'trending';

export default function ConferenceHub() {
  const [activeTab, setActiveTab] = useState<TabType>('sponsors');

  const sponsors = [
    {
      name: 'Anthropic',
      match: 96,
      funding: 4500,
      logo: '🔮',
      reasons: [
        'Your debate-based oversight research directly aligns with their Constitutional AI approach',
        'Strong track record in scalable oversight mechanisms',
        'Previous collaboration experience with OpenAI and DeepMind',
        'Focus on AI safety and alignment matches their core mission'
      ],
      interests: ['AI Safety', 'Alignment', 'Scalable Oversight', 'Interpretability']
    },
    {
      name: 'OpenAI',
      match: 89,
      funding: 4500,
      logo: '⚡',
      reasons: [
        'Expertise in debate protocols complements their safety research initiatives',
        'Published work on recursive reward modeling aligns with RLHF research',
        'Strong publication record in top-tier ML conferences',
        'Interest in mechanistic interpretability research'
      ],
      interests: ['Alignment', 'RLHF', 'Debate', 'Safety Research']
    },
    {
      name: 'DeepMind',
      match: 87,
      funding: 3800,
      logo: '🧠',
      reasons: [
        'Research on scalable oversight fits with their AI safety agenda',
        'Constitutional AI work relevant to their ethics initiatives',
        'Strong academic background with Stanford PhD',
        'Track record of high-impact publications'
      ],
      interests: ['AI Safety', 'Ethics', 'Reinforcement Learning']
    },
    {
      name: 'Redwood Research',
      match: 85,
      funding: 4000,
      logo: '🌲',
      reasons: [
        'Specialized focus on AI safety and alignment research',
        'Debate-based oversight directly applicable to their work',
        'Strong emphasis on interpretability and mechanistic understanding',
        'Collaborative research culture matches your background'
      ],
      interests: ['AI Safety', 'Alignment', 'Interpretability']
    }
  ];

  const similarResearchers = [
    {
      name: 'Dr. Alex Kumar',
      institution: 'Stanford University',
      paper: 'Recursive Reward Modeling at Scale',
      overlap: ['AI Safety', 'Alignment', 'RLHF'],
      citations: 523,
      hIndex: 28
    },
    {
      name: 'Dr. Maria Rodriguez',
      institution: 'MIT',
      paper: 'Interpretable Neural Network Architectures',
      overlap: ['Interpretability', 'Safety', 'Transparency'],
      citations: 687,
      hIndex: 31
    },
    {
      name: 'Prof. James Thompson',
      institution: 'UC Berkeley',
      paper: 'Constitutional Approaches to AI Alignment',
      overlap: ['Alignment', 'Constitutional AI', 'Ethics'],
      citations: 892,
      hIndex: 35
    },
    {
      name: 'Dr. Lisa Wang',
      institution: 'Carnegie Mellon',
      paper: 'Debate Mechanisms for AI Oversight',
      overlap: ['Debate', 'Oversight', 'Multi-Agent Systems'],
      citations: 412,
      hIndex: 24
    }
  ];

  const trendingPapers = [
    {
      title: 'Language Models as Agent Models',
      authors: 'J. Andreas et al.',
      conference: 'NeurIPS 2024',
      citations: 156,
      trend: '+48% this week',
      topics: ['LLMs', 'Agent Systems', 'Decision Making']
    },
    {
      title: 'Mechanistic Interpretability via Sparse Autoencoders',
      authors: 'T. Henighan, N. Elhage et al.',
      conference: 'NeurIPS 2024',
      citations: 203,
      trend: '+62% this week',
      topics: ['Interpretability', 'Neural Networks', 'Analysis']
    },
    {
      title: 'Scaling Monosemanticity: Extracting Interpretable Features',
      authors: 'Anthropic Research',
      conference: 'NeurIPS 2024',
      citations: 287,
      trend: '+71% this week',
      topics: ['Interpretability', 'Feature Extraction', 'Scaling']
    },
    {
      title: 'Constitutional AI: Learning from Human Feedback',
      authors: 'Y. Bai, A. Jones et al.',
      conference: 'NeurIPS 2024',
      citations: 341,
      trend: '+55% this week',
      topics: ['Alignment', 'RLHF', 'Safety']
    },
    {
      title: 'Debate-Based Oversight of Frontier AI Systems',
      authors: 'M. Khan, S. Brown et al.',
      conference: 'NeurIPS 2024',
      citations: 198,
      trend: '+89% this week',
      topics: ['Oversight', 'Debate', 'AI Safety']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/researcher" className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center">
            ← Back to Profile
          </Link>
        </div>
      </div>

      {/* Notification Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Anthropic wants to sponsor your attendance!</h2>
                <p className="text-purple-100 text-sm">96% match • $4,500 funding available • Review offer below</p>
              </div>
            </div>
            <button className="bg-white text-purple-600 px-6 py-2.5 rounded-lg font-bold hover:bg-purple-50 transition-colors shadow-lg hidden md:block">
              View Details
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">NeurIPS 2024 Conference Hub</h1>
          <p className="text-gray-600 text-lg">Vancouver, BC • December 10-16, 2024</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('sponsors')}
                className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'sponsors'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Potential Sponsors
                <span className="ml-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-bold">
                  {sponsors.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('similar')}
                className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'similar'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="w-4 h-4" />
                Similar Researchers
              </button>
              <button
                onClick={() => setActiveTab('trending')}
                className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'trending'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Trending Papers
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Potential Sponsors Tab */}
            {activeTab === 'sponsors' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Companies Ready to Fund You</h2>
                    <p className="text-gray-600 flex items-center gap-2">
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-medium">
                        Powered by Perplexity Analysis
                      </span>
                      Match scores based on research alignment and company interests
                    </p>
                  </div>
                </div>

                {sponsors.map((sponsor, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-xl p-6 hover:shadow-lg transition-all ${
                      index === 0 ? 'border-purple-300 bg-purple-50/30' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="text-5xl">{sponsor.logo}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-bold text-gray-900">{sponsor.name}</h3>
                            {index === 0 && (
                              <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                TOP MATCH
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-2">
                              <div className="text-3xl font-bold text-purple-600">{sponsor.match}%</div>
                              <span className="text-gray-600">match</span>
                            </div>
                            <div className="h-6 w-px bg-gray-300"></div>
                            <div className="flex items-center gap-2">
                              <div className="text-2xl font-bold text-green-600">${sponsor.funding.toLocaleString()}</div>
                              <span className="text-gray-600">funding</span>
                            </div>
                          </div>

                          {/* Match Reasons */}
                          <div className="bg-white rounded-lg p-4 border border-gray-200 mb-3">
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-indigo-600" />
                              Why this is a strong match:
                            </h4>
                            <ul className="space-y-2">
                              {sponsor.reasons.map((reason, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                  <span>{reason}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Interest Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {sponsor.interests.map((interest, idx) => (
                              <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                        Express Interest
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                        Learn More
                      </button>
                    </div>
                  </div>
                ))}

                {/* Perplexity Attribution */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">AI-Powered Matching</h4>
                      <p className="text-sm text-gray-700">
                        Match scores and insights generated by Perplexity's advanced research analysis engine,
                        evaluating alignment between your publications, research interests, and company initiatives.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Similar Researchers Tab */}
            {activeTab === 'similar' && (
              <div className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Researchers Working on Related Topics</h2>
                  <p className="text-gray-600">Connect with colleagues doing similar work at NeurIPS 2024</p>
                </div>

                {similarResearchers.map((researcher, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                          {researcher.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">{researcher.name}</h3>
                          <p className="text-gray-600 text-sm mb-2">{researcher.institution}</p>
                          <p className="text-gray-700 font-medium mb-3">"{researcher.paper}"</p>

                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <span><strong>{researcher.citations}</strong> citations</span>
                            <span>•</span>
                            <span>h-index: <strong>{researcher.hIndex}</strong></span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {researcher.overlap.map((topic, idx) => (
                              <span key={idx} className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                        Connect
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Trending Papers Tab */}
            {activeTab === 'trending' && (
              <div className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Hot Papers at NeurIPS 2024</h2>
                  <p className="text-gray-600">Most discussed and cited papers this week</p>
                </div>

                {trendingPapers.map((paper, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-lg p-3 flex-shrink-0">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-bold text-gray-900 leading-tight flex-1">{paper.title}</h3>
                          <span className="ml-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                            {paper.trend}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{paper.authors}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                          <span className="font-medium">{paper.conference}</span>
                          <span>•</span>
                          <span><strong>{paper.citations}</strong> citations</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {paper.topics.map((topic, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button className="w-full mt-3 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Read Paper
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
