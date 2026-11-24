import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useRegion } from '../context/RegionContext';
import ThemeSwitcher from './ThemeSwitcher';
import { HardHat, Globe, ExternalLink, MapPin, Camera } from 'lucide-react';

export default function Footer() {
  const { currentLanguageMeta, setShowLanguageModal, t } = useLanguage();
  const { currentRegionMeta, setShowRegionModal } = useRegion();

  return (
    <footer className="bg-teal-900 dark:bg-charcoal-950 text-ivory/80 pt-16 pb-12 border-t border-teal-700 dark:border-charcoal-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-teal-800 dark:border-charcoal-800">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-700 dark:bg-charcoal-800 border border-teal-500 dark:border-charcoal-600 text-white flex items-center justify-center shadow-md">
                <HardHat className="w-6 h-6 text-terracotta-200" />
              </div>
              <span className="text-2xl font-black text-white font-heading">
                Skill<span className="text-terracotta-400">Setu</span>
              </span>
            </div>
            
            <p className="text-sm text-ivory/70 max-w-md leading-relaxed">
              {t('footer.tagline', 'Empowering India’s blue-collar craftspeople with verified practical skills, recognized trade identities, and direct contractor connections.')}
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {/* Language Selector */}
              <button
                type="button"
                onClick={() => setShowLanguageModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-800 dark:bg-charcoal-800 hover:bg-teal-700 dark:hover:bg-charcoal-700 text-xs text-white border border-teal-600 dark:border-charcoal-600 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-terracotta-300" />
                <span>भाषा: {currentLanguageMeta.nativeName}</span>
              </button>

              {/* Region Selector */}
              <button
                type="button"
                onClick={() => setShowRegionModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-800 dark:bg-charcoal-800 hover:bg-teal-700 dark:hover:bg-charcoal-700 text-xs text-white border border-teal-600 dark:border-charcoal-600 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-terracotta-300" />
                <span>क्षेत्र: {currentRegionMeta.name.split(' ')[0]}</span>
              </button>

              {/* Theme Switcher */}
              <ThemeSwitcher compact={true} />

              <a
                href="https://github.com/ayush35099-cloud/SkillSetu"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-terracotta-300 hover:underline px-2 py-1"
              >
                <span>GitHub Repo</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href="https://github.com/ayush35099-cloud/SkillSetu/blob/main/PHOTO_SOURCES.md"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-teal-300 hover:underline px-2 py-1"
              >
                <Camera className="w-3 h-3 text-amber-300" />
                <span>Photo Attribution</span>
              </a>
            </div>
          </div>

          {/* Architecture / Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-heading">
              {t('footer.arch', 'Architecture & Stack')}
            </h4>
            <ul className="space-y-2 text-xs text-ivory/60">
              <li>• Frontend: React 18, Vite, Tailwind CSS</li>
              <li>• Theme: Light / Dark / System Mode</li>
              <li>• Personalisation: 36 Indian Regions</li>
              <li>• Backend: Python 3.11, Flask REST API</li>
              <li>• Database: Render PostgreSQL & SQLAlchemy</li>
              <li>• Deployment: GitHub Pages & Render Free</li>
            </ul>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-heading">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-ivory/60">
              <li><Link to="/worker" className="text-terracotta-300 hover:text-white font-bold transition-colors">Worker Portal (Demo)</Link></li>
              <li><Link to="/worker/profile" className="hover:text-white transition-colors">Worker Profile</Link></li>
              <li><Link to="/worker/skills" className="hover:text-white transition-colors">Skills & Verification</Link></li>
              <li><Link to="/worker/passport" className="hover:text-white transition-colors">Digital Skill Passport</Link></li>
              <li><a href="#about" className="hover:text-white transition-colors">{t('nav.about', 'About')}</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">{t('nav.howItWorks', 'How It Works')}</a></li>
              <li><a href="#professions" className="hover:text-white transition-colors">{t('nav.professions', 'Professions')}</a></li>
              <li><a href="#system-status" className="hover:text-white transition-colors">{t('nav.status', 'System Status')}</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ivory/50">
          <div>
            {t('footer.copy', '© 2026 SkillSetu. Dedicated to the craft and dignity of India’s skilled workers.')}
          </div>
          <div className="flex items-center gap-1 text-ivory/60">
            <span>{t('footer.track', 'Track 4: UnlockED – Localized Vocational Skill Verification')}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
