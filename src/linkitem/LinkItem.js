import React from 'react';
import './LinkItem.css'; 

const LinkItem = ({ title, url, image, thumbnail, description, dub, sub, appStoreUrl }) => {
  const hasImage = Boolean(image);
  const hasThumbnail = Boolean(thumbnail);

  // Detect iOS/macOS for App Store link
  const isAppleDevice = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /iPad|iPhone|iPod|Macintosh/.test(userAgent) && !window.MSStream;
  };

  // Use App Store URL for Apple devices if provided, otherwise use default URL
  const finalUrl = (appStoreUrl && isAppleDevice()) ? appStoreUrl : url;
  
  const getFlagUrl = (languageCode) => {
    return languageCode ? `/assets/Flag_${languageCode.toUpperCase()}.svg` : null;
  };

  // Instagram-style layout with large thumbnail
  if (hasThumbnail) {
    return (
      <a href={finalUrl} target="_blank" rel="noopener noreferrer">
        <div className="link-card link-item-instagram">
          <div className="instagram-thumbnail">
            <img src={thumbnail} alt={title} className="thumbnail-image" />
          </div>
          <div className="instagram-bottom">
            <div className="instagram-image-container">
              {hasImage && (
                <img src={image} alt={title} className="instagram-small-image" />
              )}
            </div>
            <div className="instagram-content">
              <div className="link-title">{title}</div>
              {description && <p className="link-description">{description}</p>}
              <div className="language-container">
                {dub && sub && 
                <div className="link-language">Dub&ensp;
                  <img src={getFlagUrl(dub)} alt={dub} className="language-image"/> | Sub&ensp; 
                  <img src={getFlagUrl(sub)} alt={sub} className="language-image"/>
                </div>}
                {dub && !sub && <div className="link-language">Dub&ensp;<img src={getFlagUrl(dub)} alt={dub} className="language-image"/></div>}
                {!dub && sub && <div className="link-language">Sub&ensp;<img src={getFlagUrl(sub)} alt={sub} className="language-image"/></div>}
              </div>
            </div>
          </div>
        </div>
      </a>
    );
  }

  // Render language info helper
  const renderLanguage = () => {
    if (!dub && !sub) return null;
    
    return (
      <div className="link-language">
        {dub && (
          <>
            Dub&ensp;<img src={getFlagUrl(dub)} alt={dub} className="language-image"/>
          </>
        )}
        {dub && sub && ' | '}
        {sub && (
          <>
            Sub&ensp;<img src={getFlagUrl(sub)} alt={sub} className="language-image"/>
          </>
        )}
      </div>
    );
  };

  // Standard horizontal layout
  return (
    <a href={finalUrl} target="_blank" rel="noopener noreferrer">
      <div className="link-card link-item">
        {hasImage && (
          <img src={image} alt={title} className="link-image" />
        )}
        <div className="link-content">
          <div className="link-title">{title}</div>
          {description && <p className="link-description">{description}</p>}
          {renderLanguage()}
        </div>
      </div>
    </a>
  );
};

export default LinkItem;
