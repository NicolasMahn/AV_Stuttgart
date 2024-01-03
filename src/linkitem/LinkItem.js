import React from 'react';
import './LinkItem.css'; // Assuming you will create a separate CSS file for styling

const LinkItem = ({ title, url, image, description, dub, sub }) => {
  return (
    <div className="link-item">
      {image && <img src={image} alt={title} className="link-image" />}
      <div className="link-content">
        <a href={url} target="_blank" rel="noopener noreferrer" className="link-title">{title}</a>
        {description && <p className="link-description">{description}</p>}
        {dub && <p className="link-dub">{dub}</p>}
        {sub && <p className="link-dub">{sub}</p>}
      </div>
    </div>
  );
};

export default LinkItem;
