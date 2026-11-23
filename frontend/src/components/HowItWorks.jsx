import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { UserPlus, Wrench, ShieldCheck, Briefcase, ArrowRight } from 'lucide-react';

export default function HowItWorks({ onOpenGetStarted }) {
  const { t } = useLanguage();

  const steps = [
    {
      num: '01',
      icon: UserPlus,
      title: t('howItWorks.step1Title', 'Create your profile'),
      desc: t('howItWorks.step1Desc', 'Quick and simple setup in your mother tongue using your mobile number and preferred vocational trade.'),
    },
    {
      num: '02',
      icon: Wrench,
      title: t('howItWorks.step2Title', 'Demonstrate your skills'),
      desc: t('howItWorks.step2Desc', 'Complete localized, hands-on practical tasks using standard workshop tools and safety protocols.'),
    },
    {
      num: '03',
      icon: ShieldCheck,
      title: t('howItWorks.step3Title', 'Get your skills verified'),
      desc: t('howItWorks.step3Desc', 'Receive a tamper-evident digital skill credential recognizing your practical competence.'),
    },
    {
      num: '04',
      icon: Briefcase,
      title: t('howItWorks.step4Title', 'Discover employment opportunities'),
      desc: t('howItWorks.step4Desc', 'Connect directly with verified local contractors and builders for higher-paying, steady projects.'),
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-beige text-terracotta text-xs font-bold uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-terracotta"></span>
            <span>{t('howItWorks.badge', 'Step-by-Step Verification')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-teal tracking-tight font-heading">
            {t('howItWorks.title', 'How It Works')}
          </h2>

          <p className="mt-3 text-base sm:text-lg text-greygreen">
            {t('howItWorks.subtitle', 'Four simple, respectful steps to verify your craft and grow your livelihood.')}
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-white rounded-3xl p-6 sm:p-7 border border-beige shadow-xs hover:shadow-md hover:border-terracotta/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Step Number & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl font-black text-beige group-hover:text-terracotta-200 transition-colors font-heading">
                      {step.num}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-ivory border border-beige flex items-center justify-center text-teal group-hover:bg-teal group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-teal mb-2.5 font-heading">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-greygreen leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Bottom Step Indicator */}
                <div className="mt-6 pt-4 border-t border-beige/60 text-[11px] font-bold text-terracotta flex items-center justify-between">
                  <span>चरण {step.num} • Step {step.num}</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
