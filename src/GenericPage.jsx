import React, { useState, useEffect } from 'react';
import yaml from 'js-yaml';
import LinkItem from './linkitem/LinkItem';

const LinksPage = ({ category, fileName }) => {
    const [links, setLinks] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setError(null);
        
        fetch(fileName)
            .then(response => response.text())
            .then(text => yaml.load(text))
            .then(data => {
                if (data[category]) {
                    setLinks(data[category]);
                } else {
                    setError(`Category "${category}" not found in content file.`);
                    setLinks([]);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error loading YAML data:', error);
                setError('Failed to load content. Please try again later.');
                setLoading(false);
            });
    }, [category, fileName]);

    if (loading) {
        return (
            <div className="link-items-container">
                <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>
                    Loading content...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="link-items-container">
                <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="link-items-container">
            {links.map(link => (
                <LinkItem
                    key={link.url}
                    title={link.title}
                    url={link.url}
                    image={link.image_url}
                    thumbnail={link.thumbnail_url}
                    description={link.description}
                    dub={link.dub}
                    sub={link.sub}
                    appStoreUrl={link.app_store_url}
                />
            ))}
        </div>
    );
};

export default LinksPage;
