// Simple cookie utilities
export const setCookie = (name, value, days = 365) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Generate a unique visitor ID
const generateVisitorId = () => {
  return 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Get or create visitor ID
export const getVisitorId = () => {
  let visitorId = getCookie('av_visitor_id');
  if (!visitorId) {
    visitorId = generateVisitorId();
    setCookie('av_visitor_id', visitorId, 365); // Store for 1 year
  }
  return visitorId;
};

// Get or create session ID (expires when browser closes)
export const getSessionId = () => {
  let sessionId = sessionStorage.getItem('av_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('av_session_id', sessionId);
  }
  return sessionId;
};

// Track event
export const trackEvent = (eventType, eventData = {}) => {
  // Check if user has consented to tracking
  const hasConsent = getCookie('av_tracking_consent');
  if (hasConsent !== 'true') {
    return;
  }

  const trackingData = {
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    timestamp: new Date().toISOString(),
    eventType,
    url: window.location.href,
    referrer: document.referrer,
    userAgent: navigator.userAgent,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language,
    ...eventData
  };

  // Send to your backend
  sendToBackend(trackingData);
};

// Send tracking data to backend
const sendToBackend = async (data) => {
  try {
    // API is on port 3001
    const apiUrl = `${window.location.protocol}//${window.location.hostname}:3001/api/track`;
    
    // Use beacon API for reliable tracking even when page is closing
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      navigator.sendBeacon(apiUrl, blob);
    } else {
      // Fallback to fetch
      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: true
      });
    }
  } catch (error) {
    console.error('Tracking error:', error);
  }
};

// Track page view
export const trackPageView = () => {
  trackEvent('page_view', {
    path: window.location.pathname,
    hash: window.location.hash
  });
};

// Track link click
export const trackLinkClick = (linkTitle, linkUrl, linkType = 'external') => {
  trackEvent('link_click', {
    linkTitle,
    linkUrl,
    linkType
  });
};

// Track language change
export const trackLanguageChange = (fromLanguage, toLanguage) => {
  trackEvent('language_change', {
    fromLanguage,
    toLanguage
  });
};

// Track navigation (section/tab change)
export const trackNavigation = (sectionName, sectionKey) => {
  trackEvent('navigation', {
    sectionName,
    sectionKey
  });
};

