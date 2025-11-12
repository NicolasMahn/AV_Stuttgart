import React, { useEffect, useRef } from 'react';
import { useTab } from './menu/TabContext';
import GenericPage from './GenericPage';
import './ScrollContainer.css';

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
          const route = routes.find(r => r.key === sectionId);
          if (route) {
            setCurrentTab(route.name);
            // Update URL hash without triggering navigation
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
    if (hash && sectionRefs.current[hash]) {
      setTimeout(() => {
        sectionRefs.current[hash].scrollIntoView({ behavior: 'smooth' });
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
      {routes.map((route, index) => (
        <React.Fragment key={route.key}>
          {(
            <div className="section-divider">
              <div className="divider-line"></div>
              <div className="divider-text">{route.name}</div>
              <div className="divider-line"></div>
            </div>
          )}
          <section
            id={route.key}
            ref={(el) => (sectionRefs.current[route.key] = el)}
            className="scroll-section"
          >
            <GenericPage category={route.key} fileName={fileName} />
          </section>
        </React.Fragment>
      ))}
    </div>
  );
};

export default ScrollContainer;

