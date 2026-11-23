import React from 'react';
import { CheckCircle2, ShieldCheck, Wrench, FileCheck2, UserCheck2, TrendingUp } from 'lucide-react';

export default function SkillVerification() {
  const steps = [
    {
      step: '01',
      title: 'Practical Skill Assessment',
      description: 'Workers demonstrate their real craft—tool handling, safety adherence, and task execution—rather than memorizing theoretical papers.',
      icon: Wrench,
      highlight: 'Hands-on evaluation'
    },
    {
      step: '02',
      title: 'Digital Trade Credential',
      description: 'Successful demonstration issues a verifiable, tamper-evident digital skill record establishing trust and professional recognition.',
      icon: ShieldCheck,
      highlight: 'Portable digital identity'
    },
    {
      step: '03',
      title: 'Direct Contractor Linkage',
      description: 'Verified workers gain visibility with contractors looking for proven talent, removing informal intermediaries and ensuring fair wages.',
      icon: UserCheck2,
      highlight: 'Direct employment bridge'
    }
  ];

  return (
    <section id="verification" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Verification Methodology
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How Skill Verification Works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Standardizing trust for India's vocational workforce through standardized, localized, and practical skill verification.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="relative bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:border-brand-300 hover:shadow-lg transition-all group"
              >
                {/* Step Number Badge */}
                <div className="text-4xl font-black text-slate-200 group-hover:text-brand-200 transition-colors mb-4">
                  {item.step}
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-brand-600 mb-6 group-hover:bg-brand-600 group-hover:text-white transition-all">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {item.description}
                </p>

                <div className="pt-4 border-t border-slate-200/70 text-xs font-semibold text-brand-700 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                  {item.highlight}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
