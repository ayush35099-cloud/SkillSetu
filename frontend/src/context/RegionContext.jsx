import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INDIAN_REGIONS, DEFAULT_REGION } from '../data/regions';

const RegionContext = createContext();

const STORAGE_KEY_REGION = 'skillsetu_region';

export function RegionProvider({ children }) {
  const [region, setRegionState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REGION);
      if (saved && INDIAN_REGIONS.some(r => r.code === saved)) {
        return saved;
      }
    } catch (e) {
      console.warn('LocalStorage not available for region:', e);
    }
    return DEFAULT_REGION;
  });

  const [showRegionModal, setShowRegionModal] = useState(false);

  const setRegion = useCallback((code) => {
    if (INDIAN_REGIONS.some(r => r.code === code)) {
      setRegionState(code);
      try {
        localStorage.setItem(STORAGE_KEY_REGION, code);
        window.dispatchEvent(new CustomEvent('region-changed', { detail: { region: code } }));
      } catch (e) {
        console.warn('Could not save region preference:', e);
      }
    }
  }, []);

  const currentRegionMeta = INDIAN_REGIONS.find(r => r.code === region) || INDIAN_REGIONS[0];

  return (
    <RegionContext.Provider
      value={{
        region,
        setRegion,
        regions: INDIAN_REGIONS,
        currentRegionMeta,
        showRegionModal,
        setShowRegionModal
      }}
    >
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const ctx = useContext(RegionContext);
  if (!ctx) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return ctx;
}
