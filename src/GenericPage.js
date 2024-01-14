import React, { useState, useEffect } from 'react';
import yaml from 'js-yaml';
import LinkItem from './linkitem/LinkItem';

const LinksPage = ({ category }) => {
    const [links, setLinks] = useState([]);

    useEffect(() => {
        fetch('/content.yaml')
            .then(response => response.text())
            .then(text => yaml.load(text))
            .then(data => {
                if (data[category]) {
                    setLinks(data[category]);
                }
            })
            .catch(error => console.error('Error loading YAML data:', error));
    }, [category]);

    return (
        <div className="link-items-container">
            {links.map(link => (
                <LinkItem
                    key={link.url}
                    title={link.title}
                    url={link.url}
                    image={link.image_url}
                    description={link.description}
                    dub={link.dub}
                    sub={link.sub}
                />
            ))}
        </div>
    );
};

export default LinksPage;
