import React from 'react';
import { Zap, Droplets, BrickWall, Hammer, Flame, Check, Shield } from 'lucide-react';

export default function Professions() {
  const professions = [
    {
      id: 'electrician',
      name: 'Electrician',
      hindiName: 'विद्युत कर्मी / इलेक्ट्रीशियन',
      icon: Zap,
      color: 'amber',
      accent: 'text-amber-600 bg-amber-50 border-amber-200',
      badge: 'High Demand',
      skills: [
        'Single & 3-phase wiring systems',
        'Circuit breaker & MCB installation',
        'Load calculation & fault isolation',
        'Earthing & industrial safety standards'
      ],
      practicalTask: 'Conduit laying, DB termination & continuity testing'
    },
    {
      id: 'plumber',
      name: 'Plumber',
      hindiName: 'प्लंबर / जल संयोजन विशेषज्ञ',
      icon: Droplets,
      color: 'sky',
      accent: 'text-sky-600 bg-sky-50 border-sky-200',
      badge: 'Essential Trade',
      skills: [
        'CPVC/UPVC pipe network routing',
        'Hydrostatic pressure leak testing',
        'Sanitary fixtures & drainage slope',
        'Overhead & underground pump setup'
      ],
      practicalTask: 'Multi-joint line assembly & pressure test without leak'
    },
    {
      id: 'mason',
      name: 'Mason',
      hindiName: 'राजमिस्त्री / भवन निर्माण शिल्पी',
      icon: BrickWall,
      color: 'orange',
      accent: 'text-orange-600 bg-orange-50 border-orange-200',
      badge: 'Infrastructure Core',
      skills: [
        'Brick/block masonry alignment & plumb',
        'Mortar mixing ratios & hydration',
        'Smooth & rough plastering finishes',
        'RCC column shuttering alignment'
      ],
      practicalTask: 'Constructing a 90-degree plumb corner wall within tolerance'
    },
    {
      id: 'carpenter',
      name: 'Carpenter',
      hindiName: 'बढ़ई / काष्ठ शिल्पी',
      icon: Hammer,
      color: 'amber',
      accent: 'text-yellow-700 bg-yellow-50 border-yellow-200',
      badge: 'Finish Craft',
      skills: [
        'Mortise, tenon & precision lap joinery',
        'Modular cabinet & carcass framing',
        'Hardware, hinge & sliding fitting',
        'Laminate pressing & edge banding'
      ],
      practicalTask: 'Fabricating a square joint frame with flush hardware'
    },
    {
      id: 'welder',
      name: 'Welder',
      hindiName: 'वेल्डर / धातु संयोजन शिल्पी',
      icon: Flame,
      color: 'rose',
      accent: 'text-rose-600 bg-rose-50 border-rose-200',
      badge: 'Fabrication Core',
      skills: [
        'SMAW (Shielded Metal Arc Welding)',
        'MIG/MAG & Gas cutting techniques',
        'Weld penetration & slag cleanup',
        'Safety PPE & spark hazard control'
      ],
      practicalTask: 'Butt and fillet weld pass with bend test compliance'
    }
  ];

  return (
    <section id="professions" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-800 text-xs font-bold uppercase tracking-wider mb-3 border border-brand-200">
            <Shield className="w-3.5 h-3.5 text-brand-600" />
            Vocational Trades
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Trades Covered by SkillSetu
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Standardized practical verification tailored to the specific tools, standards, and job requirements of India's vocational trades.
          </p>
        </div>

        {/* Professions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professions.map((trade) => {
            const Icon = trade.icon;
            return (
              <div 
                key={trade.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar with Icon and Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className={`p-3 rounded-xl border ${trade.accent}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wide bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200">
                      {trade.badge}
                    </span>
                  </div>

                  {/* Title & Hindi Subtitle */}
                  <h3 className="text-xl font-bold text-slate-900">
                    {trade.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 mb-4">
                    {trade.hindiName}
                  </p>

                  {/* Skills Checklist */}
                  <div className="space-y-2 mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Verified Capabilities:
                    </span>
                    {trade.skills.map((skill, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Practical Verification Task Preview */}
                <div className="pt-4 border-t border-slate-100 bg-slate-50/70 -mx-6 -mb-6 p-4 rounded-b-2xl">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Hands-on Assessment Task:
                  </div>
                  <div className="text-xs text-slate-800 font-medium italic">
                    "{trade.practicalTask}"
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
