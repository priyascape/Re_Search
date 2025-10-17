'use client';

import { Users, Building2, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ConferenceHub() {
  const sponsors = [
    { name: 'Google Research', matches: 12, interest: 'high' },
    { name: 'Microsoft Research', matches: 8, interest: 'medium' },
    { name: 'Meta AI', matches: 15, interest: 'high' },
    { name: 'DeepMind', matches: 6, interest: 'medium' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/researcher" className="text-indigo-600 hover:text-indigo-800">
            ← Back to Portal
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-800">
                NeurIPS 2024 - Conference Hub
              </h1>
            </div>

            <div className="mb-8">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Welcome, Dr. Sarah Chen!</h2>
                <p className="opacity-90">
                  Based on your research profile, we've found {sponsors.length} potential
                  sponsors interested in your work.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Sponsors Interested in Your Research
              </h3>

              <div className="space-y-4">
                {sponsors.map((sponsor, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="bg-indigo-100 p-3 rounded-lg">
                          <Building2 className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 text-lg">
                            {sponsor.name}
                          </h4>
                          <p className="text-gray-600 mt-1">
                            {sponsor.matches} matching papers in your portfolio
                          </p>
                          <div className="mt-3">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                sponsor.interest === 'high'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {sponsor.interest === 'high'
                                ? 'High Interest'
                                : 'Medium Interest'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                        Connect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Tips for Networking
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-1">•</span>
                  <span>Visit sponsor booths with high match scores first</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-1">•</span>
                  <span>Prepare a 30-second pitch about your most impactful paper</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-1">•</span>
                  <span>
                    Follow up within 48 hours of making a connection
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
