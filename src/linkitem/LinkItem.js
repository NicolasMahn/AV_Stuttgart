import React from 'react';
import './LinkItem.css'; 

const LinkItem = ({ title, url, image, description, dub, sub }) => {
  const hasImage = Boolean(image);

  
  const getFlagUrl = (languageCode) => {
    return languageCode ? `/assets/Flag_${languageCode.toUpperCase()}.svg` : null;
  };


  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
        <div className="link-item">
            <div className="link-image-container">
                {hasImage ? (
                    <img src={image} alt={title} className="link-image" />
                ) : (
                    <div className="link-image-spacer"></div>
                )}
            </div>
            <div className="link-content">
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
    </a>
  );
};

export default LinkItem;
