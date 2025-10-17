'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Building2, MapPin, ExternalLink, Quote, DollarSign, Plane, Hotel, Ticket, ArrowRight, Mail, Code } from 'lucide-react';
import Link from 'next/link';

export default function ResearcherProfile() {
   const [isLoaded, setIsLoaded] = useState(false);

   useEffect(() => {
     setIsLoaded(true);
  }, []);

  return (
    <div className={`min-h-screen bg-gray-50 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center">
            ← Back to Home
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-start gap-8">
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                SC
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Dr. Sarah Chen</h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>University of São Paulo</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>São Paulo, Brazil</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-indigo-600">s.chen@usp.br</span>
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-700 leading-relaxed mb-4">
                Assistant Professor of Computer Science specializing in AI Safety and Alignment.
                My research focuses on developing scalable oversight mechanisms for advanced AI systems,
                with particular emphasis on debate-based approaches and interpretability. Previously at
                OpenAI and DeepMind Research. PhD from Stanford University (2019).
              </p>

              {/* Research Interests */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">AI Safety</span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">Alignment</span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">Scalable Oversight</span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">Machine Learning</span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">Interpretability</span>
              </div>

              {/* Stats */}
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="font-semibold text-gray-900">23</span>
                  <span className="text-gray-600 ml-1">Publications</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">1,847</span>
                  <span className="text-gray-600 ml-1">Citations</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">31</span>
                  <span className="text-gray-600 ml-1">h-index</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Papers */}
          <div className="lg:col-span-2 space-y-6">
            {/* Featured Paper */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-bold text-gray-900">Featured Publication</h2>
              </div>

              {/* Paper Card */}
              <div className="border border-indigo-200 bg-indigo-50/30 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">
                    Scalable Oversight of AI Systems via Debate
                  </h3>
                  <p className="text-sm text-gray-600">
                    S Chen, M Rodriguez, A Kumar, J Thompson
                  </p>
                  <p className="text-sm text-gray-500">
                    NeurIPS 2024 (Oral Presentation)
                  </p>
                </div>

                {/* Abstract */}
                <div className="mb-4">
                  <div className="flex items-start gap-2 mb-2">
                    <Quote className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-700 leading-relaxed">
                      We present a novel framework for scalable oversight of advanced AI systems using
                      structured debate protocols. Our approach enables human evaluators to judge the
                      safety and alignment of AI systems performing tasks beyond human expertise by
                      observing debates between AI agents. We demonstrate that debate-based oversight
                      scales to complex domains including mathematical reasoning, code generation, and
                      strategic planning, achieving 89% accuracy in detecting misaligned behavior.
                      Our method significantly outperforms traditional oversight mechanisms while
                      requiring 10x less human evaluation time.
                    </p>
                  </div>
                </div>

                {/* Topics */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">AI Safety</span>
                  <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">Alignment</span>
                  <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">Scalable Oversight</span>
                  <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">Debate</span>
                  <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">Interpretability</span>
                </div>

                {/* Links & Citations */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex gap-4">
                    <a
                      href="https://github.com/sarahchen/debate-oversight"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      <Code className="w-4 h-4" />
                      GitHub
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Paper
                    </a>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">247</span> citations
                  </div>
                </div>
              </div>

              {/* Recent Papers */}
              <div className="mt-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Recent Publications</h3>

                <div className="border-l-4 border-gray-200 pl-4 hover:border-indigo-400 transition-colors">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">
                    Constitutional AI: Training Language Models to be Helpful, Harmless, and Honest
                  </h4>
                  <p className="text-xs text-gray-600 mb-1">S Chen, R Patel, L Williams</p>
                  <p className="text-xs text-gray-500">ICML 2024 • <span className="font-medium">189 citations</span></p>
                </div>

                <div className="border-l-4 border-gray-200 pl-4 hover:border-indigo-400 transition-colors">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">
                    Recursive Reward Modeling for Training Aligned AI Systems
                  </h4>
                  <p className="text-xs text-gray-600 mb-1">M Rodriguez, S Chen, A Kumar</p>
                  <p className="text-xs text-gray-500">NeurIPS 2023 • <span className="font-medium">312 citations</span></p>
                </div>

                <div className="border-l-4 border-gray-200 pl-4 hover:border-indigo-400 transition-colors">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">
                    Mechanistic Interpretability in Large Language Models
                  </h4>
                  <p className="text-xs text-gray-600 mb-1">S Chen, J Thompson, K Lee</p>
                  <p className="text-xs text-gray-500">ICLR 2023 • <span className="font-medium">421 citations</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Funding Needs */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg shadow-sm border-2 border-indigo-200 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-gray-900">Funding Needed</h2>
              </div>

              <div className="bg-white rounded-lg p-4 mb-4 border border-indigo-100">
                <div className="text-center mb-3">
                  <div className="text-3xl font-bold text-indigo-600 mb-1">$4,500</div>
                  <div className="text-sm text-gray-600">Total Required</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
                <div className="text-xs text-gray-500 text-center">$0 raised • 0% funded</div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 bg-white rounded-lg p-3 border border-gray-200">
                  <Ticket className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium text-gray-900">Conference Registration</span>
                      <span className="text-sm font-bold text-gray-900 whitespace-nowrap ml-2">$1,200</span>
                    </div>
                    <p className="text-xs text-gray-600">NeurIPS 2024 attendance</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white rounded-lg p-3 border border-gray-200">
                  <Plane className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium text-gray-900">Travel Expenses</span>
                      <span className="text-sm font-bold text-gray-900 whitespace-nowrap ml-2">$1,800</span>
                    </div>
                    <p className="text-xs text-gray-600">São Paulo → Vancouver flights</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white rounded-lg p-3 border border-gray-200">
                  <Hotel className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium text-gray-900">Accommodation</span>
                      <span className="text-sm font-bold text-gray-900 whitespace-nowrap ml-2">$1,500</span>
                    </div>
                    <p className="text-xs text-gray-600">5 nights near venue</p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Link
                href="/researcher/conference"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-lg font-bold text-center hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                Claim Profile & Find Sponsors
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <p className="text-xs text-gray-600 text-center mt-4">
                Connect with companies looking to sponsor talented researchers like you
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
