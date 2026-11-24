import React, { useState, useMemo } from 'react';
import { useRegion } from '../context/RegionContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  MapPin, 
  Search, 
  X, 
  CheckCircle2, 
  Building2, 
  Navigation,
  Globe2
} from 'lucide-react';

export default function RegionModal() {
  const { region, setRegion, regions, showRegionModal, setShowRegionModal, currentRegionMeta } = useRegion();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All'); // 'All' | 'State' | 'Union Territory'

  const filteredRegions = useMemo(() => {
    return regions.filter((r) => {
      const matchesCategory = filterCategory === 'All' || r.category === filterCategory;
      const term = searchTerm.toLowerCase().trim();
      if (!term) return matchesCategory;

      const matchesName = r.name.toLowerCase().includes(term);
      const matchesNative = r.nativeName && r.nativeName.toLowerCase().includes(term);
      const matchesCode = r.code.toLowerCase().includes(term);
      const matchesHub = r.primaryHubs && r.primaryHubs.some(h => h.toLowerCase().includes(term));
      const matchesCapital = r.capital && r.capital.toLowerCase().includes(term);

      return matchesCategory && (matchesName || matchesNative || matchesCode || matchesHub || matchesCapital);
    });
  }, [regions, filterCategory, searchTerm]);

  if (!showRegionModal) return null;

  const handleSelect = (code) => {
    setRegion(code);
    setShowRegionModal(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-950/70 dark:bg-black/80 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="region-modal-title"
    >
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] bg-ivory dark:bg-charcoal-900 rounded-3xl shadow-2xl border border-beige dark:border-charcoal-700 overflow-hidden flex flex-col animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration */}
        <div className="h-2 bg-gradient-to-r from-teal via-amber-500 to-terracotta" />

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-beige dark:border-charcoal-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-terracotta/10 dark:bg-terracotta/20 text-terracotta flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 id="region-modal-title" className="text-xl sm:text-2xl font-black text-teal dark:text-ivory font-heading">
                  {t('region.title', 'Select Indian Region / State')}
                </h2>
                <p className="text-xs text-greygreen dark:text-ivory/60">
                  {t('region.subtitle', 'Language and region are independent. Tailor local projects, photos, and contractor networks.')}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowRegionModal(false)}
              className="p-2 rounded-full text-greygreen hover:text-teal dark:hover:text-ivory hover:bg-beige/40 dark:hover:bg-charcoal-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Box */}
          <div className="relative mt-4">
            <Search className="w-4 h-4 text-greygreen dark:text-ivory/40 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('region.searchPlaceholder', 'Search state, city hub, or territory (e.g. Karnataka, Bengaluru, Mumbai)...')}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-beige dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-teal dark:text-ivory placeholder-greygreen/50 dark:placeholder-ivory/30 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-all font-medium"
              autoFocus
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 mt-3 text-xs font-bold">
            <button
              type="button"
              onClick={() => setFilterCategory('All')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                filterCategory === 'All'
                  ? 'bg-teal dark:bg-charcoal-700 text-white border-teal dark:border-charcoal-600'
                  : 'bg-white dark:bg-charcoal-800 text-greygreen dark:text-ivory/60 border-beige dark:border-charcoal-700 hover:border-teal/40'
              }`}
            >
              {t('region.filterAll', 'All Regions')} ({regions.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory('State')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                filterCategory === 'State'
                  ? 'bg-teal dark:bg-charcoal-700 text-white border-teal dark:border-charcoal-600'
                  : 'bg-white dark:bg-charcoal-800 text-greygreen dark:text-ivory/60 border-beige dark:border-charcoal-700 hover:border-teal/40'
              }`}
            >
              {t('region.filterStates', '28 States')}
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory('Union Territory')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                filterCategory === 'Union Territory'
                  ? 'bg-teal dark:bg-charcoal-700 text-white border-teal dark:border-charcoal-600'
                  : 'bg-white dark:bg-charcoal-800 text-greygreen dark:text-ivory/60 border-beige dark:border-charcoal-700 hover:border-teal/40'
              }`}
            >
              {t('region.filterUT', '8 Union Territories')}
            </button>
          </div>
        </div>

        {/* Region List Scrollable Container */}
        <div className="p-6 overflow-y-auto flex-1 space-y-2 max-h-[55vh]">
          {filteredRegions.length === 0 ? (
            <div className="text-center py-8 text-greygreen dark:text-ivory/60 text-sm">
              <p>No Indian state or territory matched "{searchTerm}".</p>
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="mt-2 text-xs font-bold text-terracotta hover:underline"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredRegions.map((r) => {
                const isSelected = region === r.code;
                return (
                  <button
                    key={r.code}
                    type="button"
                    onClick={() => handleSelect(r.code)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 group ${
                      isSelected
                        ? 'border-terracotta bg-terracotta-50/70 dark:bg-terracotta/20 text-teal dark:text-ivory ring-2 ring-terracotta/30'
                        : 'border-beige dark:border-charcoal-700 bg-white dark:bg-charcoal-800/80 text-teal dark:text-ivory hover:border-teal/40 dark:hover:border-charcoal-500 hover:bg-sand-50 dark:hover:bg-charcoal-800'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs sm:text-sm font-heading truncate">
                          {r.name}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sand-200/60 dark:bg-charcoal-700 text-greygreen dark:text-ivory/70">
                          {r.code}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-greygreen dark:text-ivory/60">
                        {r.nativeName && <span className="font-medium truncate">{r.nativeName}</span>}
                        {r.primaryHubs && r.primaryHubs[0] && (
                          <>
                            <span>•</span>
                            <span className="truncate">{r.primaryHubs[0]}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-sand-50 dark:bg-charcoal-800/60 border-t border-beige dark:border-charcoal-700 flex items-center justify-between text-xs text-greygreen dark:text-ivory/60">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-terracotta" />
            <span>Currently Selected: <strong className="text-teal dark:text-ivory">{currentRegionMeta.name}</strong></span>
          </div>

          <button
            type="button"
            onClick={() => handleSelect('IN-ALL')}
            className="text-xs font-bold text-terracotta hover:underline"
          >
            Reset to All-India
          </button>
        </div>

      </div>
    </div>
  );
}
