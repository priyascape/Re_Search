'use client';

import { useState } from 'react';
import { Briefcase, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RecruiterPortal() {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [requirements, setRequirements] = useState('');

  const handleSearch = () => {
    // In a real app, this would call the API
    // For now, just navigate to matches page
    router.push('/recruiter/matches');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="text-purple-600 hover:text-purple-800">
            ← Back to Home
          </Link>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Briefcase className="w-8 h-8 text-purple-600" />
              <h1 className="text-3xl font-bold text-gray-800">
                Recruiter Portal
              </h1>
            </div>

            <p className="text-gray-600 mb-8">
              Enter your job description and requirements to find the best matching
              researchers from NeurIPS 2024.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Senior ML Research Scientist"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Describe the role, responsibilities, and the type of research work involved..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Key Requirements
                </label>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="List the key skills, expertise areas, and qualifications needed..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              <button
                onClick={handleSearch}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Find Matching Researchers
              </button>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
                <h3 className="font-medium text-purple-900 mb-2">
                  How it works:
                </h3>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• We use AI to match your job requirements with research papers</li>
                  <li>• Get ranked results based on research relevance</li>
                  <li>• See detailed match explanations for each candidate</li>
                  <li>• Connect with top researchers at NeurIPS 2024</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
