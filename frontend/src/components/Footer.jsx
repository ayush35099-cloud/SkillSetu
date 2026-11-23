import React from 'react';
import { HardHat, Github, Server, ExternalLink, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-md">
                <HardHat className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-white">
                Skill<span className="text-brand-500">Setu</span>
              </span>
            </div>
            
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              SkillSetu bridges India's blue-collar workforce with verified practical credentials and direct contractor connections. Built for Track 4: UnlockED – Localized Vocational Skill Verification.
            </p>

            <div className="text-xs text-slate-500 font-mono">
              Repository: <a href="https://github.com/ayush35099-cloud/SkillSetu" target="_blank" rel="noreferrer" className="text-brand-400 hover:underline">ayush35099-cloud/SkillSetu</a>
            </div>
          </div>

          {/* Architecture / Tech Stack */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Architecture & Stack
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>• Frontend: React 18, Vite, Tailwind CSS</li>
              <li>• Backend: Python Flask, Flask-CORS</li>
              <li>• Database: PostgreSQL & SQLAlchemy</li>
              <li>• Deployment: Render & GitHub Pages</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Phase 1 Deliverables
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#hero" className="hover:text-white transition-colors">Project Overview</a></li>
              <li><a href="#verification" className="hover:text-white transition-colors">Skill Verification</a></li>
              <li><a href="#professions" className="hover:text-white transition-colors">Vocational Trades</a></li>
              <li><a href="#system-status" className="hover:text-white transition-colors">Backend Health Status</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 SkillSetu. Built for Track 4: UnlockED Hackathon.
          </div>
          <div className="flex items-center gap-1">
            Dedicated to India's skilled craftspeople & artisans
          </div>
        </div>

      </div>
    </footer>
  );
}
