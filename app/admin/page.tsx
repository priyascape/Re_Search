'use client';

import { useState, useEffect } from 'react';
import { Database, Users, RefreshCw, PlusCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [researchers, setResearchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const fetchResearchers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/researchers');
      const data = await response.json();
      setResearchers(data.data || []);
    } catch (error) {
      console.error('Error fetching researchers:', error);
    } finally {
      setLoading(false);
    }
  };

  const seedDatabase = async () => {
    setSeeding(true);
    try {
      const response = await fetch('/api/researchers/seed', {
        method: 'POST',
      });
      const data = await response.json();
      alert(`✅ Seeded ${data.data?.length || 0} researchers successfully!`);
      fetchResearchers();
    } catch (error) {
      console.error('Error seeding database:', error);
      alert('❌ Failed to seed database');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchResearchers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl">
              <Database className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Database Admin</h1>
              <p className="text-gray-600 text-lg">Manage researcher profiles and database</p>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Database Status</h2>
              <p className="text-gray-600">In-memory storage (resets on server restart)</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-indigo-600">{researchers.length}</div>
              <div className="text-sm text-gray-600">Researchers</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={fetchResearchers}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-100 text-indigo-700 rounded-lg font-semibold hover:bg-indigo-200 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  Refresh
                </>
              )}
            </button>
            <button
              onClick={seedDatabase}
              disabled={seeding}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {seeding ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Seeding...
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" />
                  Seed Sample Data
                </>
              )}
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            How to Add Researchers
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">1.</span>
              <span>
                <strong>Manual Entry:</strong> Go to{' '}
                <Link href="/researcher" className="text-indigo-600 hover:text-indigo-800 underline">
                  /researcher
                </Link>{' '}
                and enter a researcher's name and affiliation. Perplexity will fetch their real papers from Google Scholar.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">2.</span>
              <span>
                <strong>Sample Data:</strong> Click "Seed Sample Data" above to add 3 famous researchers (Yann LeCun, Geoffrey Hinton, Fei-Fei Li) to the database.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">3.</span>
              <span>
                <strong>Test Matching:</strong> Once you have researchers in the database, go to{' '}
                <Link href="/recruiter" className="text-emerald-600 hover:text-emerald-800 underline">
                  /recruiter
                </Link>{' '}
                to test the AI-powered matching.
              </span>
            </li>
          </ul>
        </div>

        {/* Researchers List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Current Researchers</h3>

          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-2" />
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : researchers.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <Database className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium mb-1">No researchers in database</p>
              <p className="text-sm text-gray-500">
                Click "Seed Sample Data" or add researchers manually at /researcher
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {researchers.map((researcher) => (
                <div
                  key={researcher.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900">{researcher.name}</h4>
                      <p className="text-sm text-gray-600">{researcher.affiliation}</p>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      <div>{researcher.topPapers?.length || 0} papers</div>
                      <div className="text-xs text-gray-400">
                        Added: {new Date(researcher.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {researcher.summary && (
                    <p className="text-sm text-gray-700 line-clamp-2">{researcher.summary}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Debug Info */}
        <div className="mt-6 bg-gray-900 rounded-lg p-4 text-gray-300 text-xs font-mono">
          <div className="text-gray-400 mb-2">Debug Info:</div>
          <div>Database Type: In-Memory (persists during dev server session)</div>
          <div>Total Researchers: {researchers.length}</div>
          <div>API Endpoint: GET /api/researchers</div>
          <div>Seed Endpoint: POST /api/researchers/seed</div>
        </div>
      </div>
    </div>
  );
}
