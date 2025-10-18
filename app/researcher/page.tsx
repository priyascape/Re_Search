'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Building2, ExternalLink, Quote, DollarSign, Plane, Hotel, Ticket, ArrowRight, Loader2, Search, User, University, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Paper {
  title: string;
  authors: string;
  abstract: string;
  url: string;
  year?: string;
}

interface ResearcherProfile {
  name: string;
  affiliation: string;
  summary: string;
  topPapers: Paper[];
}

interface Candidate {
  name: string;
  affiliation: string;
  description: string;
  confidence: 'high' | 'medium' | 'low';
}

interface RecommendedPaper {
  title: string;
  authors: string;
  abstract: string;
  url: string;
  relevance: string;
  match_score: number;
}

export default function ResearcherProfile() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<ResearcherProfile | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [showCandidates, setShowCandidates] = useState(false);
  const [recommendedPapers, setRecommendedPapers] = useState<RecommendedPaper[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    affiliation: ''
  });

  const searchParams = useSearchParams();
  const urlName = searchParams.get('name');
  const urlAffiliation = searchParams.get('affiliation');

  useEffect(() => {
    setIsLoaded(true);
    // If URL params exist, auto-fill and fetch
    if (urlName && urlAffiliation) {
      setFormData({ name: urlName, affiliation: urlAffiliation });
      setShowOverlay(false);
      fetchResearcherProfile(urlName, urlAffiliation);
    }
  }, [urlName, urlAffiliation]);

  const fetchResearcherProfile = async (researcherName: string, researcherAffiliation: string, paperLimit: number = 10) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/researcher/profile?name=${encodeURIComponent(researcherName)}&affiliation=${encodeURIComponent(researcherAffiliation)}&limit=${paperLimit}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch researcher profile');
      }

      const data = await response.json();

      if (data.success && data.data) {
        setProfile(data.data);

        // After loading profile, fetch NeurIPS 2024 recommendations
        fetchRecommendations(researcherName, researcherAffiliation, data.data.topPapers);
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async (name: string, affiliation: string, papers: Paper[]) => {
    try {
      setLoadingRecommendations(true);

      // Extract research areas from papers (use titles as proxy)
      const areas = papers.slice(0, 3).map(p => {
        // Extract key terms from title (simple approach)
        const words = p.title.split(' ').filter(w => w.length > 5);
        return words.slice(0, 2).join(' ');
      }).join(', ');

      const response = await fetch(
        `/api/researcher/recommendations?name=${encodeURIComponent(name)}&affiliation=${encodeURIComponent(affiliation)}&areas=${encodeURIComponent(areas)}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.papers) {
          setRecommendedPapers(data.data.papers);
        }
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      // Don't set error - recommendations are optional
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const searchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/researcher/search?name=${encodeURIComponent(formData.name)}&affiliation=${encodeURIComponent(formData.affiliation)}`
      );

      if (!response.ok) {
        throw new Error('Failed to search for researchers');
      }

      const data = await response.json();

      if (data.success && data.data.candidates && data.data.candidates.length > 0) {
        setCandidates(data.data.candidates);

        // If only one high-confidence match, fetch it directly
        if (data.data.candidates.length === 1 && data.data.candidates[0].confidence === 'high') {
          await fetchResearcherProfile(
            data.data.candidates[0].name,
            data.data.candidates[0].affiliation
          );
          setShowOverlay(false);
        } else {
          // Show candidate selection
          setShowCandidates(true);
        }
      } else {
        throw new Error('No researchers found');
      }
    } catch (err) {
      console.error('Error searching candidates:', err);
      setError(err instanceof Error ? err.message : 'Failed to search for researchers');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCandidate = async (candidate: Candidate) => {
    setShowCandidates(false);
    await fetchResearcherProfile(candidate.name, candidate.affiliation);
    setShowOverlay(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Please enter a researcher name');
      return;
    }

    setError(null);

    // If affiliation is provided, search for candidates first
    if (formData.affiliation.trim()) {
      await searchCandidates();
    } else {
      // Otherwise, fetch directly (will use affiliation from search)
      await fetchResearcherProfile(formData.name, formData.affiliation || 'Unknown');
      if (!error) {
        setShowOverlay(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Extract initials for avatar
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[parts.length - 1][0];
    }
    return name.substring(0, 2).toUpperCase();
  };

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

      {/* Candidate Selection Modal */}
      {showCandidates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 transform transition-all animate-slideUp">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Select Researcher Profile</h2>
              <p className="text-gray-600">Multiple profiles found. Please select the correct one:</p>
            </div>

            <div className="space-y-3 mb-6">
              {candidates.map((candidate, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectCandidate(candidate)}
                  className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-700">
                        {candidate.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        {candidate.affiliation}
                      </p>
                      <p className="text-sm text-gray-700 mt-2">{candidate.description}</p>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          candidate.confidence === 'high'
                            ? 'bg-green-100 text-green-700'
                            : candidate.confidence === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {candidate.confidence.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setShowCandidates(false);
                setCandidates([]);
              }}
              className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              ← Back to Search
            </button>
          </div>
        </div>
      )}

      {/* Overlay Modal for Entering Researcher Details */}
      {showOverlay && !showCandidates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all animate-slideUp">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Find Researcher</h2>
              <p className="text-gray-600">Enter researcher details to view their profile</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Researcher Name
                  </div>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Yann LeCun"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white text-black placeholder:text-gray-400"
                  style={{ color: '#000000' }}
                  disabled={loading}
                />
              </div>

              {/* Affiliation Input */}
              <div>
                <label htmlFor="affiliation" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <University className="w-4 h-4" />
                    University / Institution
                  </div>
                </label>
                <input
                  type="text"
                  id="affiliation"
                  name="affiliation"
                  value={formData.affiliation}
                  onChange={handleInputChange}
                  placeholder="e.g., New York University"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white text-black placeholder:text-gray-400"
                  style={{ color: '#000000' }}
                  disabled={loading}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-lg font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Search Researcher
                  </>
                )}
              </button>

              {/* Example Suggestions */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Try these examples:</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ name: 'Yann LeCun', affiliation: 'New York University' })}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                    disabled={loading}
                  >
                    Yann LeCun
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ name: 'Geoffrey Hinton', affiliation: 'University of Toronto' })}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                    disabled={loading}
                  >
                    Geoffrey Hinton
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ name: 'Andrew Ng', affiliation: 'Stanford University' })}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                    disabled={loading}
                  >
                    Andrew Ng
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Content - Only show when overlay is hidden and profile exists */}
      {!showOverlay && profile && (
        <div className="container mx-auto px-4 py-8 max-w-6xl animate-fadeIn">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
            <div className="flex items-start gap-8">
              {/* Profile Photo */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  {getInitials(profile.name)}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-4xl font-bold text-gray-900">{profile.name}</h1>
                  <button
                    onClick={() => setShowOverlay(true)}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                  >
                    <Search className="w-4 h-4" />
                    New Search
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>{profile.affiliation}</span>
                  </div>
                </div>

                {/* Bio - Using the dynamic summary */}
                <div className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
                  {profile.summary}
                </div>
              </div>
            </div>
          </div>

          {/* NeurIPS 2024 Recommendations */}
          {recommendedPapers.length > 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-sm border-2 border-purple-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                    Recommended NeurIPS 2024 Papers
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Top papers aligned with your research interests
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {recommendedPapers.slice(0, 5).map((paper, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-4 border border-purple-200 hover:border-purple-400 transition-all hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded">
                        #{index + 1}
                      </span>
                      <span className="text-xs font-semibold text-gray-600">
                        {paper.match_score}% match
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2">
                      {paper.title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-2">{paper.authors}</p>
                    <p className="text-xs text-gray-700 mb-3 line-clamp-2">
                      {paper.abstract}
                    </p>
                    <div className="mb-3 pb-3 border-b border-gray-200">
                      <p className="text-xs text-purple-700 italic">
                        <strong>Why relevant:</strong> {paper.relevance}
                      </p>
                    </div>
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Paper
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {loadingRecommendations && (
            <div className="bg-purple-50 rounded-lg shadow-sm border border-purple-200 p-6 mb-6">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                <p className="text-gray-700">Finding relevant NeurIPS 2024 papers for you...</p>
              </div>
            </div>
          )}

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Papers */}
            <div className="lg:col-span-2 space-y-6">
              {/* Papers Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-xl font-bold text-gray-900">Publications</h2>
                  </div>
                  {profile.topPapers.length > 0 && (
                    <span className="text-sm text-gray-500">
                      {profile.topPapers.length} {profile.topPapers.length === 1 ? 'paper' : 'papers'} found
                    </span>
                  )}
                </div>

                <div className="space-y-6">
                  {profile.topPapers.map((paper, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg p-6 hover:shadow-md transition-shadow ${
                        index === 0
                          ? 'border-indigo-200 bg-indigo-50/30'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
                          {paper.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {paper.authors}
                        </p>
                        {paper.year && (
                          <p className="text-sm text-gray-500">
                            {paper.year}
                          </p>
                        )}
                      </div>

                      {/* Abstract */}
                      {paper.abstract && (
                        <div className="mb-4">
                          <div className="flex items-start gap-2 mb-2">
                            <Quote className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {paper.abstract}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Links */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex gap-4">
                          <a
                            href={paper.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View Paper
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {profile.topPapers.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium mb-1">No publications found</p>
                    <p className="text-sm text-gray-500 max-w-md mx-auto">
                      This researcher may be early in their career, or their publications may not be indexed in Google Scholar yet.
                      Check the professional summary above for more information about their work and expertise.
                    </p>
                  </div>
                )}
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
                      <p className="text-xs text-gray-600">International flights</p>
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
      )}

      {/* Show error state when not in overlay */}
      {!showOverlay && !profile && !loading && (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center py-12">
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-4 inline-block">
              <p className="font-bold">Unable to load profile</p>
              <p className="text-sm">{error || 'Please try again'}</p>
            </div>
            <button
              onClick={() => setShowOverlay(true)}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              ← Try Another Search
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
