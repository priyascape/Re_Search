import Link from 'next/link';
import { Users, Briefcase, Sparkles, Database } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        {/* Admin Link */}
        <div className="absolute top-4 right-4">
          <Link href="/admin" className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all border border-white/20">
            <Database className="w-4 h-4" />
            <span className="text-sm font-medium">Admin</span>
          </Link>
        </div>
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="flex justify-center mb-6">
            <Sparkles className="w-16 h-16 text-yellow-400 animate-pulse" />
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
            NeurIPS Talent Bridge
          </h1>
          <p className="text-xl md:text-2xl text-purple-200 max-w-3xl mx-auto">
            Connecting world-class researchers with career-defining opportunities through AI-powered matching
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-20">
          {/* Researcher Portal - Purple/Indigo Theme */}
          <Link href="/researcher">
            <div className="group relative bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl shadow-2xl p-12 hover:shadow-purple-500/50 hover:shadow-3xl transition-all duration-300 cursor-pointer transform hover:scale-105 overflow-hidden">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10">
                <div className="flex justify-center mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-full p-6 group-hover:bg-white/20 transition-all duration-300">
                    <Users className="w-20 h-20 text-white" />
                  </div>
                </div>
                <h2 className="text-4xl font-bold text-white mb-6 text-center">
                  I'm a Researcher
                </h2>
                <p className="text-purple-100 text-center mb-8 text-lg leading-relaxed">
                  Showcase your groundbreaking research and connect with sponsors actively seeking your expertise. Get funded, build connections, and advance your career.
                </p>
                <div className="flex justify-center">
                  <span className="inline-flex items-center bg-white text-purple-700 px-8 py-4 rounded-xl font-bold text-lg group-hover:bg-purple-50 transition-colors shadow-lg">
                    Claim Your Profile
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Recruiter Portal - Green Theme */}
          <Link href="/recruiter">
            <div className="group relative bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl shadow-2xl p-12 hover:shadow-emerald-500/50 hover:shadow-3xl transition-all duration-300 cursor-pointer transform hover:scale-105 overflow-hidden">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10">
                <div className="flex justify-center mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-full p-6 group-hover:bg-white/20 transition-all duration-300">
                    <Briefcase className="w-20 h-20 text-white" />
                  </div>
                </div>
                <h2 className="text-4xl font-bold text-white mb-6 text-center">
                  I'm a Recruiter
                </h2>
                <p className="text-emerald-100 text-center mb-8 text-lg leading-relaxed">
                  Discover exceptional researchers that perfectly match your requirements. AI-powered matching makes finding top talent effortless and precise.
                </p>
                <div className="flex justify-center">
                  <span className="inline-flex items-center bg-white text-emerald-700 px-8 py-4 rounded-xl font-bold text-lg group-hover:bg-emerald-50 transition-colors shadow-lg">
                    Find Talent Now
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Stats Banner */}
        <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">127</div>
              <div className="text-purple-200 text-sm md:text-base font-medium">Researchers Funded</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">$340K</div>
              <div className="text-purple-200 text-sm md:text-base font-medium">Total Sponsored</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">412</div>
              <div className="text-purple-200 text-sm md:text-base font-medium">Meetings Scheduled</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">34</div>
              <div className="text-purple-200 text-sm md:text-base font-medium">Job Offers Made</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
