import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Compass, ShieldCheck, Award, Users, Mic, CheckCircle } from 'lucide-react';

export default function Hero({ onOpenGetStarted, onOpenHowItWorks }) {
  const { t } = useLanguage();

  return (
    <section id="hero" className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-ivory via-ivory-100 to-ivory">
      
      {/* Subtle Warm Background Glows */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 w-96 h-96 bg-terracotta-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-1/4 w-96 h-96 bg-beige/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 text-left">
            
            {/* Track Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-beige text-terracotta-700 text-xs font-bold uppercase tracking-wider mb-6 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse"></span>
              <span>{t('hero.badge', 'Track 4 – UnlockED: Localized Vocational Skill Verification')}</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-teal tracking-tight leading-[1.12] font-heading">
              {t('hero.heading', 'Your skills deserve to be recognised.')}
            </h1>

            {/* Supporting Tagline */}
            <p className="mt-4 text-xl sm:text-2xl font-bold text-terracotta font-heading">
              {t('hero.subheading', 'Show your skills. Get recognised. Discover better opportunities.')}
            </p>

            {/* Description */}
            <p className="mt-5 text-base sm:text-lg text-greygreen leading-relaxed max-w-2xl">
              {t('hero.description', 'SkillSetu is a dedicated community platform designed for India’s skilled blue-collar workers. Verify your practical trade craft, establish a trusted digital identity, and connect directly with verified contractors.')}
            </p>

            {/* Call to Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={onOpenGetStarted}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-base shadow-md shadow-terracotta/20 transition-all transform active:scale-95"
              >
                <span>{t('hero.ctaPrimary', 'Get Started')}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={onOpenHowItWorks}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-white hover:bg-beige/30 text-teal font-bold text-base border border-beige shadow-xs transition-all"
              >
                <Compass className="w-5 h-5 text-terracotta" />
                <span>{t('hero.ctaSecondary', 'How It Works')}</span>
              </button>
            </div>

            {/* 4 Trust Feature Points */}
            <div className="mt-10 pt-8 border-t border-beige grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div>
                <div className="flex items-center gap-1.5 text-teal font-bold text-xs sm:text-sm font-heading">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{t('hero.trustPractical', 'Practical')}</span>
                </div>
                <p className="text-[11px] text-greygreen mt-0.5 leading-snug">{t('hero.trustPracticalSub', 'Hands-on tasks')}</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-teal font-bold text-xs sm:text-sm font-heading">
                  <Award className="w-4 h-4 text-terracotta shrink-0" />
                  <span>{t('hero.trustId', 'Trade ID')}</span>
                </div>
                <p className="text-[11px] text-greygreen mt-0.5 leading-snug">{t('hero.trustIdSub', 'Digital credential')}</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-teal font-bold text-xs sm:text-sm font-heading">
                  <Users className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{t('hero.trustDirect', 'Direct Link')}</span>
                </div>
                <p className="text-[11px] text-greygreen mt-0.5 leading-snug">{t('hero.trustDirectSub', 'Zero middlemen')}</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-teal font-bold text-xs sm:text-sm font-heading">
                  <Mic className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>{t('hero.trustVoice', '7 Languages')}</span>
                </div>
                <p className="text-[11px] text-greygreen mt-0.5 leading-snug">{t('hero.trustVoiceSub', 'Mother tongue')}</p>
              </div>
            </div>

          </div>

          {/* Right Column: Authentic Documentary Photography Montage */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-beige/30">
              {/* Primary Authentic Artisan Photo */}
              <img
                src="https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=80"
                alt="Authentic skilled Indian craftsman shaping metal and wood with precision tools"
                className="w-full h-[420px] object-cover object-center transform hover:scale-102 transition-transform duration-500"
                loading="eager"
              />

              {/* Gradient Scrim for readable overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-teal-900/85 via-teal-900/20 to-transparent" />

              {/* Bottom Card Overlay with Cultural Dignity */}
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-md text-[11px] font-bold tracking-wide uppercase mb-1.5 border border-white/20">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>श्रम की पहचान • Dignity of Craft</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold font-heading text-white leading-snug">
                  "हमारा काम ही हमारी पहचान है।"
                </h3>
                <p className="text-xs text-ivory/80 mt-0.5">
                  Over 100,000 skilled hands building India's future every day.
                </p>
              </div>
            </div>

            {/* Small Floating Badge Card */}
            <div className="hidden sm:flex absolute -bottom-5 -left-6 bg-white p-3.5 rounded-2xl border border-beige shadow-lg items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-terracotta-50 text-terracotta flex items-center justify-center font-bold text-sm font-heading">
                6+
              </div>
              <div className="text-xs">
                <p className="font-bold text-teal font-heading">Certified Trades</p>
                <p className="text-[11px] text-greygreen">Electrician to Painter</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
