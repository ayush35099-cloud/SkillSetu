import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useRegion } from '../context/RegionContext';
import { getHeroPhoto } from '../services/photoService';
import { ArrowRight, Compass, ShieldCheck, Award, Users, Mic, CheckCircle, MapPin, Camera } from 'lucide-react';

export default function Hero({ onOpenGetStarted, onOpenHowItWorks }) {
  const { t } = useLanguage();
  const { region, currentRegionMeta, setShowRegionModal } = useRegion();

  const heroPhoto = getHeroPhoto(region);

  return (
    <section id="hero" className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-ivory via-ivory-100 to-ivory dark:from-charcoal-900 dark:via-charcoal-950 dark:to-charcoal-900 transition-colors">
      
      {/* Subtle Warm Background Glows */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 w-96 h-96 bg-terracotta-100/30 dark:bg-terracotta-900/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-1/4 w-96 h-96 bg-beige/40 dark:bg-charcoal-800/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 text-left">
            
            {/* Track Tagline Pill & Region Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 text-terracotta-700 dark:text-terracotta-300 text-xs font-bold uppercase tracking-wider shadow-xs">
                <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse"></span>
                <span>{t('hero.badge', 'Track 4 – UnlockED: Localized Vocational Skill Verification')}</span>
              </div>

              {/* Regional Priority Pill */}
              <button
                type="button"
                onClick={() => setShowRegionModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sand-100 dark:bg-charcoal-700 hover:bg-sand-200 dark:hover:bg-charcoal-600 border border-beige dark:border-charcoal-600 text-teal dark:text-ivory text-xs font-bold transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-terracotta" />
                <span>Region: {currentRegionMeta.name}</span>
              </button>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-teal dark:text-ivory tracking-tight leading-[1.12] font-heading">
              {t('hero.heading', 'Your skills deserve to be recognised.')}
            </h1>

            {/* Supporting Tagline */}
            <p className="mt-4 text-xl sm:text-2xl font-bold text-terracotta dark:text-terracotta-300 font-heading">
              {t('hero.subheading', 'Show your skills. Get recognised. Discover better opportunities.')}
            </p>

            {/* Description */}
            <p className="mt-5 text-base sm:text-lg text-greygreen dark:text-ivory/70 leading-relaxed max-w-2xl">
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
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-white dark:bg-charcoal-800 hover:bg-beige/30 dark:hover:bg-charcoal-700 text-teal dark:text-ivory font-bold text-base border border-beige dark:border-charcoal-700 shadow-xs transition-all"
              >
                <Compass className="w-5 h-5 text-terracotta" />
                <span>{t('hero.ctaSecondary', 'How It Works')}</span>
              </button>
            </div>

            {/* 4 Trust Feature Points */}
            <div className="mt-10 pt-8 border-t border-beige dark:border-charcoal-700 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div>
                <div className="flex items-center gap-1.5 text-teal dark:text-ivory font-bold text-xs sm:text-sm font-heading">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                  <span>{t('hero.trustPractical', 'Practical')}</span>
                </div>
                <p className="text-[11px] text-greygreen dark:text-ivory/60 mt-0.5 leading-snug">{t('hero.trustPracticalSub', 'Hands-on tasks')}</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-teal dark:text-ivory font-bold text-xs sm:text-sm font-heading">
                  <Award className="w-4 h-4 text-terracotta dark:text-amber-300 shrink-0" />
                  <span>{t('hero.trustId', 'Trade ID')}</span>
                </div>
                <p className="text-[11px] text-greygreen dark:text-ivory/60 mt-0.5 leading-snug">{t('hero.trustIdSub', 'Digital credential')}</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-teal dark:text-ivory font-bold text-xs sm:text-sm font-heading">
                  <Users className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>{t('hero.trustDirect', 'Direct Link')}</span>
                </div>
                <p className="text-[11px] text-greygreen dark:text-ivory/60 mt-0.5 leading-snug">{t('hero.trustDirectSub', 'Zero middlemen')}</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-teal dark:text-ivory font-bold text-xs sm:text-sm font-heading">
                  <Mic className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
                  <span>{t('hero.trustVoice', '7 Languages')}</span>
                </div>
                <p className="text-[11px] text-greygreen dark:text-ivory/60 mt-0.5 leading-snug">{t('hero.trustVoiceSub', 'Mother tongue')}</p>
              </div>
            </div>

          </div>

          {/* Right Column: Authentic Indian Documentary Photography Montage */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-4 border-white dark:border-charcoal-700 shadow-xl bg-beige/30 dark:bg-charcoal-800">
              
              {/* Primary Authentic Indian Artisan Photo with error fallback */}
              <img
                src={heroPhoto.url}
                alt={heroPhoto.alt}
                onError={(e) => {
                  // Fallback to national infrastructure photo
                  e.currentTarget.src = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80";
                }}
                className="w-full h-[420px] object-cover object-center transform hover:scale-102 transition-transform duration-500"
                loading="eager"
              />

              {/* Gradient Scrim for readable overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-teal-950/90 via-teal-950/30 to-transparent" />

              {/* Top Region / Attribution Tag */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-teal-950/70 backdrop-blur-md text-[10px] font-bold border border-white/20">
                  <MapPin className="w-3 h-3 text-terracotta-300" />
                  <span>{heroPhoto.location}</span>
                </span>
                
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-950/70 backdrop-blur-md text-[9px] text-ivory/80 border border-white/10">
                  <Camera className="w-2.5 h-2.5" />
                  <span>Photo: {heroPhoto.credit.split('/')[0]}</span>
                </span>
              </div>

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
                  {heroPhoto.caption}
                </p>
              </div>
            </div>

            {/* Small Floating Badge Card */}
            <div className="hidden sm:flex absolute -bottom-5 -left-6 bg-white dark:bg-charcoal-800 p-3.5 rounded-2xl border border-beige dark:border-charcoal-700 shadow-lg items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-terracotta-50 dark:bg-terracotta/20 text-terracotta dark:text-terracotta-300 flex items-center justify-center font-bold text-sm font-heading">
                8
              </div>
              <div className="text-xs">
                <p className="font-bold text-teal dark:text-ivory font-heading">Core Vocational Trades</p>
                <p className="text-[11px] text-greygreen dark:text-ivory/60">Electrician to Mechanic</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
