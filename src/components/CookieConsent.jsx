import React, { useState, useEffect } from 'react';
import { getCookie, setCookie } from '../utils/analytics';
import './CookieConsent.css';

const CookieConsent = ({ language }) => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = getCookie('av_tracking_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    setCookie('av_tracking_consent', 'true', 365);
    setShowBanner(false);
    // Reload to start tracking
    window.location.reload();
  };

  const handleDecline = () => {
    setCookie('av_tracking_consent', 'false', 365);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  const text = language === 'de' ? {
    message: 'Wir verwenden Cookies, um zu verstehen, wie unsere Website genutzt wird. Ihre Daten werden anonymisiert und nicht an Dritte weitergegeben.',
    accept: 'Akzeptieren',
    decline: 'Ablehnen',
    privacy: 'Datenschutz'
  } : {
    message: 'We use cookies to understand how our website is used. Your data is anonymized and not shared with third parties.',
    accept: 'Accept',
    decline: 'Decline',
    privacy: 'Privacy Policy'
  };

  return (
    <div className="cookie-consent-banner">
      <div className="cookie-consent-content">
        <p>{text.message}</p>
        <a href="/datenschutz" className="cookie-privacy-link">{text.privacy}</a>
      </div>
      <div className="cookie-consent-buttons">
        <button onClick={handleDecline} className="cookie-btn cookie-decline">
          {text.decline}
        </button>
        <button onClick={handleAccept} className="cookie-btn cookie-accept">
          {text.accept}
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;

