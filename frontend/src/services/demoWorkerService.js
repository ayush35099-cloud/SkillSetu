/**
 * Demo Worker Service
 * 
 * Manages honest prototype data for SkillSetu Phase 2.
 * Strictly adheres to MVP truth-in-advertising guidelines:
 * - Computes profile completion dynamically from populated fields.
 * - Provides honest status labels (Not submitted, Submitted, Under review).
 * - Clearly identifies all data as DEMO PROTOTYPE.
 */

export const INITIAL_DEMO_PROFILE = {
  fullName: 'Ramesh Kumar',
  phone: '9876543210',
  homeState: 'Bihar',
  homeStateCode: 'BR',
  currentCity: 'Bengaluru',
  currentState: 'Karnataka',
  currentStateCode: 'KA',
  location: 'Bengaluru, Karnataka',
  preferredWorkLocations: 'Bengaluru (Karnataka), Patna (Bihar), All India',
  primaryTrade: 'electrician',
  experience: 8,
  specializations: ['Conduit Wiring', 'MCB Termination', 'Earthing Pit Testing'],
  preferredLanguage: 'en',
  isDemoUser: true,
  // Honest demo assessments
  tradeAssessments: {
    electrician: {
      status: 'under_review', // 'not_submitted' | 'submitted' | 'under_review' | 'demo_verified'
      label: 'Sample: Under Review',
      submissionDate: '2026-11-20',
      benchmarksCompleted: 1,
      totalBenchmarks: 4
    },
    plumber: {
      status: 'not_submitted',
      label: 'Not Submitted',
      submissionDate: null,
      benchmarksCompleted: 0,
      totalBenchmarks: 4
    },
    mason: {
      status: 'not_submitted',
      label: 'Not Submitted',
      submissionDate: null,
      benchmarksCompleted: 0,
      totalBenchmarks: 4
    },
    carpenter: {
      status: 'not_submitted',
      label: 'Not Submitted',
      submissionDate: null,
      benchmarksCompleted: 0,
      totalBenchmarks: 4
    },
    welder: {
      status: 'not_submitted',
      label: 'Not Submitted',
      submissionDate: null,
      benchmarksCompleted: 0,
      totalBenchmarks: 4
    },
    painter: {
      status: 'not_submitted',
      label: 'Not Submitted',
      submissionDate: null,
      benchmarksCompleted: 0,
      totalBenchmarks: 4
    },
    mechanic: {
      status: 'not_submitted',
      label: 'Not Submitted',
      submissionDate: null,
      benchmarksCompleted: 0,
      totalBenchmarks: 4
    },
    other: {
      status: 'not_submitted',
      label: 'Not Submitted',
      submissionDate: null,
      benchmarksCompleted: 0,
      totalBenchmarks: 4
    }
  }
};

const STORAGE_KEY = 'skillsetu_worker_profile';

export function getWorkerProfile() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...INITIAL_DEMO_PROFILE,
        ...parsed,
        tradeAssessments: {
          ...INITIAL_DEMO_PROFILE.tradeAssessments,
          ...(parsed.tradeAssessments || {})
        }
      };
    }
  } catch (e) {
    console.warn('Could not read worker profile from storage:', e);
  }
  return INITIAL_DEMO_PROFILE;
}

export function saveWorkerProfile(profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent('profile-updated', { detail: profile }));
    return true;
  } catch (e) {
    console.error('Could not save worker profile:', e);
    return false;
  }
}

/**
 * Calculates profile completion percentage dynamically from populated fields.
 * Returns { percentage, completedItems, pendingItems }
 */
export function calculateProfileCompletion(profile) {
  const checklist = [
    { key: 'name', label: 'Full Name entered', weight: 15, isDone: Boolean(profile?.fullName?.trim()) },
    { key: 'phone', label: '10-Digit Mobile verified', weight: 15, isDone: Boolean(profile?.phone && profile.phone.replace(/\D/g, '').length >= 10) },
    { key: 'location', label: 'Work City & Location specified', weight: 15, isDone: Boolean(profile?.location?.trim()) },
    { key: 'trade', label: 'Primary vocational craft selected', weight: 15, isDone: Boolean(profile?.primaryTrade) },
    { key: 'experience', label: 'Practical experience recorded', weight: 15, isDone: Number(profile?.experience) > 0 },
    { key: 'specializations', label: 'Tool proficiencies tagged', weight: 15, isDone: Array.isArray(profile?.specializations) && profile.specializations.length > 0 },
    { key: 'assessment', label: 'Practical assessment submitted', weight: 10, isDone: Boolean(profile?.tradeAssessments?.[profile?.primaryTrade]?.status !== 'not_submitted') }
  ];

  const earned = checklist.reduce((sum, item) => (item.isDone ? sum + item.weight : sum), 0);
  const percentage = Math.min(100, Math.max(0, earned));

  return {
    percentage,
    checklist
  };
}

/**
 * Derives dynamic summary counts based on real demo assessments
 */
export function getAssessmentStats(profile) {
  const assessments = Object.values(profile.tradeAssessments || {});
  let underReviewCount = 0;
  let submittedCount = 0;
  let notSubmittedCount = 0;
  let demoVerifiedCount = 0;

  assessments.forEach((item) => {
    if (item.status === 'under_review') underReviewCount++;
    else if (item.status === 'submitted') submittedCount++;
    else if (item.status === 'demo_verified') demoVerifiedCount++;
    else notSubmittedCount++;
  });

  return {
    underReviewCount,
    submittedCount,
    notSubmittedCount,
    demoVerifiedCount,
    totalTrades: assessments.length
  };
}
