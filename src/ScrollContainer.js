import React, { useEffect, useRef } from 'react';
import { useTab } from './menu/TabContext';
import GenericPage from './GenericPage';
import './ScrollContainer.css';

// Utility function to normalize hash names (replace spaces with underscores)
const normalizeHash = (hash) => {
  return hash.replace(/\s+/g, '_');
};

const ScrollContainer = ({ routes, fileName }) => {
  const [currentTab, setCurrentTab] = useTab();
  const sectionRefs = useRef({});
  const observerRef = useRef(null);

  useEffect(() => {
    // Create IntersectionObserver to detect which section is visible
    const options = {
      root: null,
      rootMargin: '-50% 0px -50% 0px', // Trigger when section is in middle of viewport
      threshold: 0
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const route = routes.find(r => normalizeHash(r.key) === sectionId);
          if (route) {
            setCurrentTab(route.name);
            // Update URL hash without triggering navigation (already normalized)
            window.history.replaceState(null, '', `#${sectionId}`);
          }
        }
      });
    }, options);

    // Observe all sections
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) {
        observerRef.current.observe(ref);
      }
    });

    // Handle direct URL access to specific sections
    const hash = window.location.hash.slice(1);
    const normalizedHash = normalizeHash(hash);
    
    if (normalizedHash && sectionRefs.current[normalizedHash]) {
      // Scroll to the specified section
      setTimeout(() => {
        sectionRefs.current[normalizedHash].scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (!normalizedHash && routes.length > 0) {
      // No hash present - scroll to first section and set its hash
      setTimeout(() => {
        const firstRoute = routes[0];
        const firstNormalizedKey = normalizeHash(firstRoute.key);
        if (sectionRefs.current[firstNormalizedKey]) {
          sectionRefs.current[firstNormalizedKey].scrollIntoView({ behavior: 'smooth' });
          setCurrentTab(firstRoute.name);
          window.history.replaceState(null, '', `#${firstNormalizedKey}`);
        }
      }, 100);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [routes, setCurrentTab]);

  return (
    <div className="scroll-container">
      {routes.map((route, index) => {
        const normalizedKey = normalizeHash(route.key);
        return (
          <React.Fragment key={route.key}>
            {(
              <div className="section-divider">
                <div className="divider-line"></div>
                <div className="divider-text">{route.name}</div>
                <div className="divider-line"></div>
              </div>
            )}
            <section
              id={normalizedKey}
              ref={(el) => (sectionRefs.current[normalizedKey] = el)}
              className="scroll-section"
            >
              <GenericPage category={route.key} fileName={fileName} />
            </section>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ScrollContainer;

