'use client';

import { useState } from 'react';
import { Briefcase, Search, Sparkles, TrendingUp, Clock, DollarSign, FileText, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const DEMO_JOB = `AI Inference Engineer - Perplexity AI

About Perplexity:
Perplexity AI is an AI-powered answer engine that delivers accurate, trusted, and real-time answers to any question. Founded in 2022, we've raised over $1B in venture investment from leaders including Elad Gil, Daniel Gross, Jeff Bezos, Accel, IVP, NEA, NVIDIA, Samsung, and many more. Our mission is to make authoritative knowledge accessible to everyone through conversational AI.

Role Overview:
We're looking for an AI Inference Engineer to join our growing team and help build the world's most advanced AI inference infrastructure. You'll work on optimizing model serving, reducing latency, and scaling our AI systems to handle millions of queries with lightning-fast response times.

Key Responsibilities:
• Design and implement high-performance inference systems for large language models
• Optimize model serving infrastructure for low latency and high throughput
• Develop and maintain inference pipelines using PyTorch, Triton, and CUDA
• Build scalable Kubernetes-based deployment systems for AI models
• Profile and optimize GPU utilization and memory efficiency
• Collaborate with research teams to deploy cutting-edge models into production
• Implement monitoring and observability for inference performance
• Research and integrate new inference optimization techniques

Required Qualifications:
• Strong engineering background in systems programming and ML infrastructure
• Proficiency in Python, Rust, and/or C++
• Deep understanding of PyTorch and neural network architectures
• Experience with GPU programming (CUDA) and optimization
• Knowledge of distributed systems and containerization (Kubernetes)
• Strong problem-solving skills and attention to performance optimization
• Bachelor's degree in Computer Science, Engineering, or related field

Preferred Qualifications:
• Experience with Triton Inference Server or similar model serving frameworks
• Background in compiler optimization or kernel development
• Prior work on LLM inference optimization (quantization, batching, etc.)
• Familiarity with model compression techniques (pruning, distillation)
• Experience with cloud infrastructure (AWS, GCP, Azure)
• Previous work at high-scale AI/ML companies
• Publications or contributions to ML systems research

Tech Stack:
• Languages: Python, Rust, C++
• ML Frameworks: PyTorch, Triton
• Infrastructure: CUDA, Kubernetes
• Cloud: Multi-cloud deployment experience preferred

What We Offer:
• Competitive compensation with significant equity
• Work on cutting-edge AI infrastructure powering millions of users
• Small, fast-moving team with minimal bureaucracy and high autonomy
• Generous compute budget and access to latest GPU hardware
• Comprehensive health benefits and flexible work arrangements
• Opportunity to shape the future of AI-powered knowledge access

Location: New York City; Palo Alto; San Francisco (Hybrid/Remote options available)`;


export default function RecruiterPortal() {
  const router = useRouter();
  const [jobDescription, setJobDescription] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleUseDemoJob = () => {
    setJobDescription(DEMO_JOB);
  };

  const handleSearch = async () => {
    setIsSearching(true);

    try {
      // Call the match API
      const response = await fetch('/api/recruiter/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to match researchers');
      }

      const data = await response.json();

      // Store results in sessionStorage to pass to matches page
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('matchResults', JSON.stringify(data.data));
      }

      // Navigate to matches page
      router.push('/recruiter/matches');
    } catch (error) {
      console.error('Error matching researchers:', error);
      alert('Failed to find matches. Please try again.');
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center">
            ← Back to Home
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl">
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
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-lg font-medium hover:from-blue-200 hover:to-indigo-200 transition-colors text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    Use Perplexity Demo JD
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm text-gray-900 bg-white placeholder:text-gray-400"
                  disabled={isSearching}
                />
              </div>

              <button
                onClick={handleSearch}
                disabled={!jobDescription.trim() || isSearching}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
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
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    <span className="font-semibold text-blue-900">Analyzing job requirements...</span>
                  </div>
                  <div className="text-sm text-blue-700 space-y-1 ml-8">
                    <p>• Extracting key research areas and requirements</p>
                    <p>• Searching through 847 NeurIPS papers</p>
                    <p>• Matching candidate expertise to role needs</p>
                    <p>• Ranking researchers by relevance</p>
                  </div>
                </div>
              )}

              {/* How it Works */}
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-blue-900 mb-2">How AI-Powered Matching Works:</h3>
                    <ul className="text-sm text-blue-800 space-y-1.5">
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
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 mb-4 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-600 rounded-lg p-2">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-blue-600 mb-1">96%</div>
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
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-4 border border-cyan-200">
                  <div className="flex items-start gap-3">
                    <div className="bg-cyan-600 rounded-lg p-2">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-cyan-600 mb-1">~5s</div>
                      <div className="text-sm font-medium text-gray-700">Average Search Time</div>
                      <div className="text-xs text-gray-600 mt-1">AI-powered analysis</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3">Why Use Perplexity Re-Searcher?</h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span><strong>Direct access</strong> to cutting-edge researchers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span><strong>AI-powered matching</strong> ensures relevance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span><strong>Save thousands</strong> on recruiting costs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span><strong>Connect at conference</strong> for face-to-face meetings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span><strong>Detailed match explanations</strong> with evidence</span>
                  </li>
                </ul>
              </div>

              {/* Testimonial */}
              <div className="pt-6 border-t border-gray-200">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 italic mb-2">
                    "We found our ideal ML researcher in under 5 minutes. The match quality was exceptional."
                  </p>
                  <p className="text-xs text-gray-600 font-medium">
                    — Denis Yarats, Co-Founder at Perplexity AI
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
