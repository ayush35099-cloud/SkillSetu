import React from 'react';
import { ArrowRight, CheckCircle, ShieldCheck, Award, Users, HardHat, Compass } from 'lucide-react';

export default function Hero({ onOpenGetStarted, onOpenExplore }) {
  return (
    <section id="hero" className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-white via-orange-50/20 to-slate-50">
      
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 w-96 h-96 bg-brand-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-1/4 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Track Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse"></span>
            <span>Track 4 – UnlockED: Localized Vocational Skill Verification</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Your Skills. <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-amber-600 to-orange-500">Your Identity.</span> Your Future.
          </h1>

          {/* Short Description */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            SkillSetu is a dedicated platform designed for India's skilled blue-collar workforce. We bridge electricians, plumbers, masons, carpenters, and welders with verified credentials and direct contractor opportunities.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#verification"
              onClick={onOpenGetStarted}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-700 hover:to-amber-700 text-white font-bold text-base shadow-lg shadow-brand-500/25 transition-all transform active:scale-[0.98]"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </a>

            <a
              href="#professions"
              onClick={onOpenExplore}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-300 shadow-sm transition-all"
            >
              <Compass className="w-5 h-5 text-brand-600" />
              Explore SkillSetu
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="mt-12 pt-8 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                Practical Testing
              </div>
              <p className="text-xs text-slate-500 mt-1">Hands-on assessment over theory tests</p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Award className="w-4 h-4 text-brand-600 shrink-0" />
                Digital Trade ID
              </div>
              <p className="text-xs text-slate-500 mt-1">Verifiable identity for skilled workers</p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Users className="w-4 h-4 text-amber-600 shrink-0" />
                Direct Linkage
              </div>
              <p className="text-xs text-slate-500 mt-1">Connect with verified contractors</p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <HardHat className="w-4 h-4 text-blue-600 shrink-0" />
                Localized Focus
              </div>
              <p className="text-xs text-slate-500 mt-1">Built specifically for Indian trades</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
