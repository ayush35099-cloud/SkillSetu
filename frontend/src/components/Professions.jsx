import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTradePhoto } from '../services/photoService';
import { 
  Zap, 
  Droplets, 
  Hammer, 
  Building, 
  Flame, 
  Paintbrush, 
  Wrench, 
  Cog, 
  Layers, 
  Check, 
  Camera,
  MapPin
} from 'lucide-react';

export default function Professions() {
  const { t } = useLanguage();

  const trades = [
    {
      id: 'electrician',
      icon: Zap,
      name: t('professions.electrician.name', 'Electrician'),
      nativeName: t('professions.electrician.nativeName', 'Electrician / विद्युत कर्मी'),
      desc: t('professions.electrician.desc', 'Conduit laying, DB panel termination, circuit load calculations, and earthing diagnostics.'),
      task: t('professions.electrician.task', 'Conduit bending, MCB termination and complete circuit continuity testing.'),
      badge: 'Core Trade',
    },
    {
      id: 'plumber',
      icon: Droplets,
      name: t('professions.plumber.name', 'Plumber'),
      nativeName: t('professions.plumber.nativeName', 'Plumber / प्लंबर'),
      desc: t('professions.plumber.desc', 'CPVC/UPVC pipe network routing, hydrostatic leak checks, sanitary fittings, and pump setup.'),
      task: t('professions.plumber.task', 'Multi-joint line assembly and high-pressure leak testing without failure.'),
      badge: 'Essential Trade',
    },
    {
      id: 'carpenter',
      icon: Hammer,
      name: t('professions.carpenter.name', 'Carpenter'),
      nativeName: t('professions.carpenter.nativeName', 'Carpenter / बढ़ई'),
      desc: t('professions.carpenter.desc', 'Mortise & tenon joinery, modular carcass assembly, hardware fitting, and laminate finishing.'),
      task: t('professions.carpenter.task', 'Fabricating a square joint frame with flush hardware and level alignment.'),
      badge: 'Finish Craft',
    },
    {
      id: 'mason',
      icon: Building,
      name: t('professions.mason.name', 'Mason'),
      nativeName: t('professions.mason.nativeName', 'Mason / राजमिस्त्री'),
      desc: t('professions.mason.desc', 'Right-angle brick alignment, mortar mixing hydration, level plastering, and RCC shuttering.'),
      task: t('professions.mason.task', 'Constructing a 90-degree plumb corner wall within structural tolerance.'),
      badge: 'Structural Core',
    },
    {
      id: 'welder',
      icon: Flame,
      name: t('professions.welder.name', 'Welder'),
      nativeName: t('professions.welder.nativeName', 'Welder / वेल्डर'),
      desc: t('professions.welder.desc', 'SMAW/MIG weld penetration, bevel preparation, slag cleanup, and thermal PPE safety.'),
      task: t('professions.welder.task', 'Multi-pass fillet and butt weld with bend test crack resistance.'),
      badge: 'Fabrication Core',
    },
    {
      id: 'painter',
      icon: Paintbrush,
      name: t('professions.painter.name', 'Painter'),
      nativeName: t('professions.painter.nativeName', 'Painter / पेंटर'),
      desc: t('professions.painter.desc', 'Wall preparation, putty smoothening, primer leveling, uniform roller coating, and weatherproofing.'),
      task: t('professions.painter.task', 'Surface sanding, 2-coat putty smoothening and flawless topcoat finish.'),
      badge: 'Finishing Trade',
    },
    {
      id: 'mechanic',
      icon: Cog,
      name: t('professions.mechanic.name', 'Mechanic'),
      nativeName: t('professions.mechanic.nativeName', 'Mechanic / मैकेनिक'),
      desc: t('professions.mechanic.desc', 'Engine diagnostics, brake shoe replacement, transmission servicing, and electrical troubleshooting.'),
      task: t('professions.mechanic.task', 'Four-stroke engine compression test, brake caliper overhaul and diagnostic scan.'),
      badge: 'Diagnostics & Repair',
    },
    {
      id: 'other',
      icon: Layers,
      name: t('professions.other.name', 'Other Trades'),
      nativeName: t('professions.other.nativeName', 'Other Trades / अन्य हुनर'),
      desc: t('professions.other.desc', 'Tile fixing, scaffolding, bar bending, waterproofing, HVAC ducting, and specialized fabrication.'),
      task: t('professions.other.task', 'Standardized task demonstration tailored to your trade craftsmanship.'),
      badge: 'Specialized Trades',
    },
  ];

  return (
    <section id="professions" className="py-16 sm:py-24 bg-white dark:bg-charcoal-900 border-t border-beige dark:border-charcoal-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ivory dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 text-terracotta dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Wrench className="w-3.5 h-3.5" />
            <span>{t('professions.badge', 'Vocational Trades')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-teal dark:text-ivory font-heading">
            {t('professions.title', 'Trades Covered by SkillSetu')}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-greygreen dark:text-ivory/70">
            {t('professions.subtitle', 'Standardized practical benchmarks tailored to the core craftsmanship of Indian vocational trades.')}
          </p>
        </div>

        {/* 8 Trades Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trades.map((trade) => {
            const Icon = trade.icon;
            const photo = getTradePhoto(trade.id);
            return (
              <div 
                key={trade.id} 
                className="bg-ivory dark:bg-charcoal-800 rounded-3xl border border-beige dark:border-charcoal-700 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                {/* Authentic Documentary Photo with attribution */}
                <div className="relative h-48 overflow-hidden bg-sand-200 dark:bg-charcoal-700">
                  <img
                    src={photo.url}
                    alt={photo.alt}
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80";
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-950/80 via-transparent to-transparent" />

                  {/* Top Badge */}
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-teal-900/80 backdrop-blur-sm text-[10px] font-bold text-ivory border border-white/20">
                    {trade.badge}
                  </span>

                  {/* Photo Attribution Pill */}
                  <span className="absolute bottom-2 left-3 inline-flex items-center gap-1 text-[9px] text-ivory/80 bg-teal-950/60 backdrop-blur-xs px-2 py-0.5 rounded">
                    <Camera className="w-2.5 h-2.5" />
                    <span>{photo.credit.split('/')[0]}</span>
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded-lg bg-teal dark:bg-charcoal-700 text-white">
                        <Icon className="w-4 h-4 text-terracotta-200" />
                      </div>
                      <h3 className="text-lg font-bold text-teal dark:text-ivory font-heading">
                        {trade.name}
                      </h3>
                    </div>

                    <p className="text-xs font-semibold text-terracotta dark:text-amber-400 mb-2">
                      {trade.nativeName}
                    </p>

                    <p className="text-xs text-greygreen dark:text-ivory/70 leading-relaxed">
                      {trade.desc}
                    </p>
                  </div>

                  {/* Hands-on Task Box */}
                  <div className="p-3 rounded-2xl bg-white dark:bg-charcoal-900 border border-beige dark:border-charcoal-700">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal dark:text-ivory/80 block mb-1">
                      {t('professions.verifiedTasks', 'Hands-on Assessment Task')}:
                    </span>
                    <p className="text-xs text-teal-950 dark:text-ivory font-medium leading-relaxed">
                      {trade.task}
                    </p>
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
