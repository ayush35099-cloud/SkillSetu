import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { HeartHandshake, ShieldCheck, Languages, Wrench, CheckCircle2 } from 'lucide-react';

export default function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-16 sm:py-24 bg-white border-y border-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Authentic Photography of Workmanship */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden border border-beige shadow-md bg-ivory">
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
                alt="Indian technician performing precision electrical and hardware diagnostics"
                className="w-full h-80 sm:h-96 object-cover object-center"
                loading="lazy"
              />
              <div className="p-5 bg-ivory border-t border-beige">
                <div className="flex items-center gap-2 text-teal font-bold text-sm font-heading">
                  <HeartHandshake className="w-5 h-5 text-terracotta" />
                  <span>समुदाय आधारित मंच • Community First</span>
                </div>
                <p className="text-xs text-greygreen mt-1">
                  Built to empower grassroots workers with verifiable dignity, fair daily compensation, and pride in their trades.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Mission and Values */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ivory border border-beige text-terracotta text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-terracotta" />
              <span>{t('about.badge', 'About SkillSetu')}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-teal tracking-tight font-heading">
              {t('about.title', 'Built with Dignity for India’s Craftspeople')}
            </h2>

            <div className="mt-5 space-y-4 text-greygreen text-base leading-relaxed">
              <p>
                {t('about.p1', 'Every building, home, and wire in our nation is crafted by hardworking artisans. Yet without formal paper degrees, your decades of mastery are often undervalued by informal middlemen.')}
              </p>
              <p>
                {t('about.p2', 'SkillSetu shifts the verification standard from written exams to real-world practical performance. We provide accessible assessment in your own mother tongue, issue verifiable credentials, and bridge you directly with trusted contractors.')}
              </p>
            </div>

            {/* Three Pillar Cards */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-ivory border border-beige/80">
                <div className="w-9 h-9 rounded-xl bg-white border border-beige flex items-center justify-center text-teal mb-3 shadow-2xs">
                  <Wrench className="w-5 h-5 text-terracotta" />
                </div>
                <h4 className="font-bold text-teal text-sm font-heading">{t('about.statTrades', '6+ Vocational Trades')}</h4>
                <p className="text-xs text-greygreen mt-0.5">{t('about.statTradesSub', 'Practical test benchmarks')}</p>
              </div>

              <div className="p-4 rounded-2xl bg-ivory border border-beige/80">
                <div className="w-9 h-9 rounded-xl bg-white border border-beige flex items-center justify-center text-teal mb-3 shadow-2xs">
                  <Languages className="w-5 h-5 text-terracotta" />
                </div>
                <h4 className="font-bold text-teal text-sm font-heading">{t('about.statLanguages', '7 Indian Languages')}</h4>
                <p className="text-xs text-greygreen mt-0.5">{t('about.statLanguagesSub', 'Native script & voice ready')}</p>
              </div>

              <div className="p-4 rounded-2xl bg-ivory border border-beige/80">
                <div className="w-9 h-9 rounded-xl bg-white border border-beige flex items-center justify-center text-teal mb-3 shadow-2xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                </div>
                <h4 className="font-bold text-teal text-sm font-heading">{t('about.statPractical', '100% Practical')}</h4>
                <p className="text-xs text-greygreen mt-0.5">{t('about.statPracticalSub', 'Real craftsmanship testing')}</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
