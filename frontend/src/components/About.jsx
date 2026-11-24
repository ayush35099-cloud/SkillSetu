import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { HeartHandshake, ShieldCheck, Languages, Wrench, CheckCircle2, Camera } from 'lucide-react';

export default function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-16 sm:py-24 bg-white dark:bg-charcoal-900 border-y border-beige dark:border-charcoal-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Authentic Photography of Workmanship */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden border border-beige dark:border-charcoal-700 shadow-md bg-ivory dark:bg-charcoal-800">
              <div className="relative h-80 sm:h-96">
                <img
                  src="https://images.pexels.com/photos/31199578/pexels-photo-31199578.jpeg"
                  alt="Skilled Indian female artisan smiling while operating an industrial sewing machine in a textile workshop"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80";
                  }}
                />
                <span className="absolute bottom-2 left-3 inline-flex items-center gap-1 text-[9px] text-ivory bg-teal-950/70 backdrop-blur-xs px-2 py-0.5 rounded">
                  <Camera className="w-2.5 h-2.5" />
                  <span>EqualStock IN / Pexels</span>
                </span>
              </div>
              <div className="p-5 bg-ivory dark:bg-charcoal-800 border-t border-beige dark:border-charcoal-700">
                <div className="flex items-center gap-2 text-teal dark:text-ivory font-bold text-sm font-heading">
                  <HeartHandshake className="w-5 h-5 text-terracotta" />
                  <span>समुदाय आधारित मंच • Community First</span>
                </div>
                <p className="text-xs text-greygreen dark:text-ivory/70 mt-1">
                  Built to empower grassroots workers with verifiable dignity, fair daily compensation, and pride in their trades.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Mission and Values */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ivory dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 text-terracotta dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-terracotta" />
              <span>{t('about.badge', 'About SkillSetu')}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-teal dark:text-ivory tracking-tight font-heading">
              {t('about.title', 'Built with Dignity for India’s Craftspeople')}
            </h2>

            <div className="mt-5 space-y-4 text-greygreen dark:text-ivory/70 text-base leading-relaxed">
              <p>
                {t('about.p1', 'Every building, home, and wire in our nation is crafted by hardworking artisans. Yet without formal paper degrees, your decades of mastery are often undervalued by informal middlemen.')}
              </p>
              <p>
                {t('about.p2', 'SkillSetu shifts the verification standard from written exams to real-world practical performance. We provide accessible assessment in your own mother tongue, issue verifiable credentials, and bridge you directly with trusted contractors.')}
              </p>
            </div>

            {/* Three Pillar Cards */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-ivory dark:bg-charcoal-800 border border-beige/80 dark:border-charcoal-700">
                <div className="w-9 h-9 rounded-xl bg-white dark:bg-charcoal-700 border border-beige dark:border-charcoal-600 flex items-center justify-center text-teal dark:text-ivory mb-3 shadow-2xs">
                  <Wrench className="w-5 h-5 text-terracotta" />
                </div>
                <h4 className="font-bold text-teal dark:text-ivory text-sm font-heading">8 Vocational Trades</h4>
                <p className="text-xs text-greygreen dark:text-ivory/60 mt-0.5">{t('about.statTradesSub', 'Practical test benchmarks')}</p>
              </div>

              <div className="p-4 rounded-2xl bg-ivory dark:bg-charcoal-800 border border-beige/80 dark:border-charcoal-700">
                <div className="w-9 h-9 rounded-xl bg-white dark:bg-charcoal-700 border border-beige dark:border-charcoal-600 flex items-center justify-center text-teal dark:text-ivory mb-3 shadow-2xs">
                  <Languages className="w-5 h-5 text-terracotta" />
                </div>
                <h4 className="font-bold text-teal dark:text-ivory text-sm font-heading">{t('about.statLanguages', '7 Indian Languages')}</h4>
                <p className="text-xs text-greygreen dark:text-ivory/60 mt-0.5">{t('about.statLanguagesSub', 'Native script & voice ready')}</p>
              </div>

              <div className="p-4 rounded-2xl bg-ivory dark:bg-charcoal-800 border border-beige/80 dark:border-charcoal-700">
                <div className="w-9 h-9 rounded-xl bg-white dark:bg-charcoal-700 border border-beige dark:border-charcoal-600 flex items-center justify-center text-teal dark:text-ivory mb-3 shadow-2xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                </div>
                <h4 className="font-bold text-teal dark:text-ivory text-sm font-heading">{t('about.statPractical', '100% Practical')}</h4>
                <p className="text-xs text-greygreen dark:text-ivory/60 mt-0.5">{t('about.statPracticalSub', 'Real craftsmanship testing')}</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
