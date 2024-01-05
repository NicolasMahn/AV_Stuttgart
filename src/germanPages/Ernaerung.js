import React from 'react';

import LinkItem from '../linkitem/LinkItem';

import EarthlingEd from '../assets/earthling_ed.jpg'
import DE from '../assets/Flag_of_Germany.svg'
import EN from '../assets/Flag_of_the_United_Kingdom.svg'



const Ernaerung = () => {
    return (
        <div className="link-items-container">
            <LinkItem
                title="Veganer Multinährstoff"
                description="Watson Nutrion"
                url="https://watsonnutrition.de/produkt/proveg-essentials/"
                image={EarthlingEd}
            />
            <LinkItem
                title="Get Better - Ernährung"
                url="https://get-better.me/ernaehrung/"
                image={EarthlingEd}
            />
        </div>
    );
  };

  export default Ernaerung;

  