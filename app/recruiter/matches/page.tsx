'use client';

import { Award, TrendingUp, FileText, Mail } from 'lucide-react';
import Link from 'next/link';
import { demoResearchers } from '@/lib/demo-data';

export default function MatchesPage() {
  // Mock match data with scores
  const matches = demoResearchers.map((researcher, index) => ({
    ...researcher,
    matchScore: [95, 88, 82, 76][index] || 70,
    reasoning: [
      'Excellent match: Published extensively on transformer architectures and NLP, directly relevant to language model research.',
      'Strong match: Meta-learning and few-shot learning expertise aligns well with adaptive AI systems requirements.',
      'Good match: Computer vision and generative models experience relevant for multimodal AI development.',
      'Moderate match: Distributed learning and privacy expertise valuable for secure ML applications.',
    ][index],
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/recruiter" className="text-purple-600 hover:text-purple-800">
            ← New Search
          </Link>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <h1 className="text-3xl font-bold text-gray-800">
                Top Matching Researchers
              </h1>
            </div>
            <p className="text-gray-600">
              Found {matches.length} researchers matching your requirements
            </p>
          </div>

          <div className="space-y-6">
            {matches.map((match) => (
              <div
                key={match.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold text-gray-800">
                          {match.name}
                        </h2>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            match.matchScore >= 90
                              ? 'bg-green-100 text-green-700'
                              : match.matchScore >= 80
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {match.matchScore}% Match
                        </span>
                      </div>
                      <p className="text-gray-600">{match.institution}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Contact
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Award className="w-4 h-4 text-purple-600" />
                      Match Analysis
                    </h3>
                    <p className="text-gray-700 bg-purple-50 p-3 rounded-lg">
                      {match.reasoning}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Research Interests
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {match.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-600" />
                      Recent Publications
                    </h3>
                    <ul className="space-y-1">
                      {match.papers.map((paper, index) => (
                        <li
                          key={index}
                          className="text-gray-600 text-sm pl-4 border-l-2 border-purple-200"
                        >
                          {paper}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
