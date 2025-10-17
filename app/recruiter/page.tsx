'use client';

import { useState } from 'react';
import { Briefcase, Search, Sparkles, TrendingUp, Clock, DollarSign, FileText, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const DEMO_JOB = `AI Safety Research Scientist - Anthropic

About Anthropic:
Anthropic is an AI safety and research company working to build reliable, interpretable, and steerable AI systems. We're committed to ensuring that artificial intelligence has a positive impact on the world.

Role Overview:
We're seeking exceptional research scientists to join our AI Safety team. You'll work on cutting-edge problems in AI alignment, scalable oversight, and interpretability research. This role offers the opportunity to shape the future of safe AI systems while working alongside world-class researchers.

Key Responsibilities:
• Conduct novel research on AI safety, alignment, and oversight mechanisms
• Develop and implement scalable methods for evaluating AI system behavior
• Collaborate with cross-functional teams to integrate safety techniques into production systems
• Publish research findings in top-tier venues (NeurIPS, ICML, ICLR, etc.)
• Mentor junior researchers and contribute to our research culture

Required Qualifications:
• PhD in Computer Science, Machine Learning, or related field (or equivalent research experience)
• Strong publication record in AI safety, alignment, interpretability, or related areas
• Deep understanding of machine learning, particularly large language models
• Experience with debate-based oversight, constitutional AI, or scalable supervision techniques
• Excellent communication skills and ability to explain complex technical concepts

Preferred Qualifications:
• Prior work on AI safety or alignment research
• Experience with reinforcement learning from human feedback (RLHF)
• Background in mechanistic interpretability or neural network analysis
• Track record of high-impact publications at top ML conferences
• Previous industry or research lab experience (OpenAI, DeepMind, FAIR, etc.)

What We Offer:
• Competitive compensation and equity packages
• Opportunity to work on some of the most important problems in AI
• Collaborative research environment with minimal bureaucracy
• Generous conference travel and professional development budget
• Health benefits and flexible work arrangements

Location: San Francisco, CA (Hybrid) or Remote`;

export default function RecruiterPortal() {
  const router = useRouter();
  const [jobDescription, setJobDescription] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleUseDemoJob = () => {
    setJobDescription(DEMO_JOB);
  };

  const handleSearch = () => {
    setIsSearching(true);

    // Simulate search with loading state
    setTimeout(() => {
      router.push('/recruiter/matches');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      {/* Header Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-emerald-600 hover:text-emerald-800 font-medium inline-flex items-center">
            ← Back to Home
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Recruiter Portal</h1>
              <p className="text-gray-600 text-lg">Find top AI researchers in seconds with Perplexity-powered search</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - Job Input */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-gray-900 font-bold text-lg">
                    Job Description
                  </label>
                  <button
                    onClick={handleUseDemoJob}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-medium hover:bg-emerald-200 transition-colors text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    Use Demo Job
                  </button>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Paste your job description below or use our demo to see how it works
                </p>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste your complete job description here...&#10;&#10;Include:&#10;• Role title and company&#10;• Key responsibilities&#10;• Required qualifications&#10;• Preferred experience&#10;• Research areas of interest"
                  rows={20}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none font-mono text-sm"
                  disabled={isSearching}
                />
              </div>

              <button
                onClick={handleSearch}
                disabled={!jobDescription.trim() || isSearching}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-lg font-bold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Searching with Perplexity...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Find Top 5-10 Matches
                  </>
                )}
              </button>

              {isSearching && (
                <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                    <span className="font-semibold text-emerald-900">Analyzing job requirements...</span>
                  </div>
                  <div className="text-sm text-emerald-700 space-y-1 ml-8">
                    <p>• Extracting key research areas and requirements</p>
                    <p>• Searching through 847 NeurIPS papers</p>
                    <p>• Matching candidate expertise to role needs</p>
                    <p>• Ranking researchers by relevance</p>
                  </div>
                </div>
              )}

              {/* How it Works */}
              <div className="mt-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-5">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-emerald-900 mb-2">How AI-Powered Matching Works:</h3>
                    <ul className="text-sm text-emerald-800 space-y-1.5">
                      <li>• <strong>Perplexity analyzes</strong> your job description to extract key requirements</li>
                      <li>• <strong>Searches through</strong> all NeurIPS 2024 papers and researcher profiles</li>
                      <li>• <strong>Ranks candidates</strong> based on research alignment and expertise</li>
                      <li>• <strong>Provides detailed explanations</strong> for each match with citation support</li>
                      <li>• <strong>Connects you directly</strong> with top researchers at the conference</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Stats */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Platform Statistics</h2>

                {/* Cost Savings */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-4 mb-4 border border-emerald-200">
                  <div className="flex items-start gap-3">
                    <div className="bg-emerald-600 rounded-lg p-2">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-emerald-600 mb-1">96%</div>
                      <div className="text-sm font-medium text-gray-700">Cost Savings</div>
                      <div className="text-xs text-gray-600 mt-1">vs. traditional recruiting</div>
                    </div>
                  </div>
                </div>

                {/* Papers Searchable */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 mb-4 border border-indigo-200">
                  <div className="flex items-start gap-3">
                    <div className="bg-indigo-600 rounded-lg p-2">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-indigo-600 mb-1">847</div>
                      <div className="text-sm font-medium text-gray-700">Papers Searchable</div>
                      <div className="text-xs text-gray-600 mt-1">NeurIPS 2024 corpus</div>
                    </div>
                  </div>
                </div>

                {/* Search Time */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-600 rounded-lg p-2">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-orange-600 mb-1">~30s</div>
                      <div className="text-sm font-medium text-gray-700">Average Search Time</div>
                      <div className="text-xs text-gray-600 mt-1">AI-powered analysis</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3">Why Use NeurIPS Talent Bridge?</h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span><strong>Direct access</strong> to cutting-edge researchers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span><strong>AI-powered matching</strong> ensures relevance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span><strong>Save thousands</strong> on recruiting costs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span><strong>Connect at conference</strong> for face-to-face meetings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span><strong>Detailed match explanations</strong> with evidence</span>
                  </li>
                </ul>
              </div>

              {/* Testimonial */}
              <div className="pt-6 border-t border-gray-200">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 italic mb-2">
                    "We found our ideal AI Safety researcher in under 5 minutes. The match quality was exceptional."
                  </p>
                  <p className="text-xs text-gray-600 font-medium">
                    — Sarah Johnson, Head of Talent at OpenAI
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
