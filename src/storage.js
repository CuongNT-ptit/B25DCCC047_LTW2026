const MATCHES_KEY = 'ltw_bongda_matches';

export const loadSaved = () => {
  try {
    const saved = localStorage.getItem(MATCHES_KEY);
    if (saved === null) {
      return null;
    }
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : null;
  } catch (err) {
    return null;
  }
};

export const saveMatches = (matches) => {
  try {
    localStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
  } catch (err) {
    console.error(err);
  }
};
