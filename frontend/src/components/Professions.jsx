import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Zap, Droplets, Hammer, BrickWall, Flame, Paintbrush, Check, Wrench } from 'lucide-react';

export default function Professions() {
  const { t } = useLanguage();

  const tradeList = [
    {
      id: 'electrician',
      icon: Zap,
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
      name: t('professions.electrician.name', 'Electrician'),
      nativeName: t('professions.electrician.nativeName', 'Electrician / विद्युत कर्मी'),
      desc: t('professions.electrician.desc', 'Conduit laying, DB panel termination, circuit load calculations, and earthing diagnostics.'),
      task: t('professions.electrician.task', 'Conduit bending, MCB termination and complete circuit continuity testing.'),
      badge: 'High Demand',
    },
    {
      id: 'plumber',
      icon: Droplets,
      image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80',
      name: t('professions.plumber.name', 'Plumber'),
      nativeName: t('professions.plumber.nativeName', 'Plumber / प्लंबर'),
      desc: t('professions.plumber.desc', 'CPVC/UPVC pipe network routing, hydrostatic leak checks, sanitary fittings, and pump setup.'),
      task: t('professions.plumber.task', 'Multi-joint line assembly and high-pressure leak testing without failure.'),
      badge: 'Essential Trade',
    },
    {
      id: 'carpenter',
      icon: Hammer,
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
      name: t('professions.carpenter.name', 'Carpenter'),
      nativeName: t('professions.carpenter.nativeName', 'Carpenter / बढ़ई'),
      desc: t('professions.carpenter.desc', 'Mortise & tenon joinery, modular carcass assembly, hardware fitting, and laminate finishing.'),
      task: t('professions.carpenter.task', 'Fabricating a square joint frame with flush hardware and level alignment.'),
      badge: 'Finish Craft',
    },
    {
      id: 'mason',
      icon: BrickWall,
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=600&q=80',
      name: t('professions.mason.name', 'Mason'),
      nativeName: t('professions.mason.nativeName', 'Mason / राजमिस्त्री'),
      desc: t('professions.mason.desc', 'Right-angle brick alignment, mortar mixing hydration, level plastering, and RCC shuttering.'),
      task: t('professions.mason.task', 'Constructing a 90-degree plumb corner wall within structural tolerance.'),
      badge: 'Structural Core',
    },
    {
      id: 'welder',
      icon: Flame,
      image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80',
      name: t('professions.welder.name', 'Welder'),
      nativeName: t('professions.welder.nativeName', 'Welder / वेल्डर'),
      desc: t('professions.welder.desc', 'SMAW/MIG weld penetration, bevel preparation, slag cleanup, and thermal PPE safety.'),
      task: t('professions.welder.task', 'Multi-pass fillet and butt weld with bend test crack resistance.'),
      badge: 'Fabrication Core',
    },
    {
      id: 'painter',
      icon: Paintbrush,
      image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80',
      name: t('professions.painter.name', 'Painter'),
      nativeName: t('professions.painter.nativeName', 'Painter / पेंटर'),
      desc: t('professions.painter.desc', 'Wall preparation, putty smoothening, primer leveling, uniform roller coating, and weatherproofing.'),
      task: t('professions.painter.task', 'Surface sanding, 2-coat putty smoothening and flawless topcoat finish.'),
      badge: 'Finishing Trade',
    },
    {
      id: 'mechanic',
      icon: Wrench,
      image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
      name: t('professions.mechanic.name', 'Mechanic'),
      nativeName: t('professions.mechanic.nativeName', 'Mechanic / मैकेनिक'),
      desc: t('professions.mechanic.desc', 'Engine diagnostics, brake shoe replacement, transmission servicing, and electrical system troubleshooting.'),
      task: t('professions.mechanic.task', 'Four-stroke engine compression test, brake caliper overhaul and diagnostic scan.'),
      badge: 'Diagnostics & Repair',
    },
    {
      id: 'other',
      icon: BrickWall,
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
      name: t('professions.other.name', 'Other Trades'),
      nativeName: t('professions.other.nativeName', 'Other Trades / अन्य हुनर'),
      desc: t('professions.other.desc', 'Masonry tiling, scaffolding, bar bending, waterproofing, HVAC ducting, and specialized fabrication.'),
      task: t('professions.other.task', 'Standardized task demonstration tailored to your trade craftsmanship.'),
      badge: 'Specialized Trades',
    },
  ];

  return (
    <section id="professions" className="py-16 sm:py-24 bg-white border-t border-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ivory border border-beige text-terracotta text-xs font-bold uppercase tracking-wider mb-3">
            <Wrench className="w-3.5 h-3.5 text-terracotta" />
            <span>{t('professions.badge', 'Vocational Trades')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-teal tracking-tight font-heading">
            {t('professions.title', 'Trades Covered by SkillSetu')}
          </h2>

          <p className="mt-3 text-base sm:text-lg text-greygreen">
            {t('professions.subtitle', 'Standardized practical benchmarks tailored to the core craftsmanship of Indian vocational trades.')}
          </p>
        </div>

        {/* 6 Professions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {tradeList.map((trade) => {
            const Icon = trade.icon;
            return (
              <div
                key={trade.id}
                className="bg-ivory rounded-3xl overflow-hidden border border-beige shadow-xs hover:shadow-lg hover:border-terracotta/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Photo Header */}
                  <div className="relative h-44 overflow-hidden bg-beige/30">
                    <img
                      src={trade.image}
                      alt={`${trade.name} craftsmanship task`}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-teal-950/80 via-teal-950/20 to-transparent" />
                    
                    {/* Badge */}
                    <div className="absolute top-3.5 right-3.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-teal px-2.5 py-1 rounded-full border border-beige shadow-xs">
                        {trade.badge}
                      </span>
                    </div>

                    {/* Trade Icon & Title on Overlay */}
                    <div className="absolute bottom-3.5 left-4 right-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-terracotta text-white flex items-center justify-center shadow-md">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-white">
                        <h3 className="text-lg font-bold font-heading leading-tight drop-shadow-xs">
                          {trade.name}
                        </h3>
                        <p className="text-[11px] text-ivory/90 font-medium">
                          {trade.nativeName}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6">
                    <p className="text-xs sm:text-sm text-greygreen leading-relaxed mb-4">
                      {trade.desc}
                    </p>
                  </div>
                </div>

                {/* Practical Assessment Task Footer */}
                <div className="p-4 sm:p-5 bg-white border-t border-beige/70">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-terracotta mb-1">
                    {t('professions.verifiedTasks', 'Hands-on Assessment Task:')}
                  </div>
                  <p className="text-xs text-teal font-medium italic">
                    "{trade.task}"
                  </p>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
