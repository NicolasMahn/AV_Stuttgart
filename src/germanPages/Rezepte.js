import React from 'react';

import LinkItem from '../linkitem/LinkItem';

import EarthlingEd from '../assets/earthling_ed.jpg'
import DE from '../assets/Flag_of_Germany.svg'
import EN from '../assets/Flag_of_the_United_Kingdom.svg'



const Rezepte = () => {
    return (
        <div className="link-items-container">
            <LinkItem
                title="Veganer Foodblog aus Berlin"
                url="https://www.zuckerjagdwurst.com/de"
                image={EarthlingEd}
            />
            <LinkItem
                title="Vegane Rezepte von Rewe"
                url="https://www.rewe.de/rezeptsammlung/vegan-hauptspeise"
                image={EarthlingEd}
            />
        </div>
    );
  };

  export default Rezepte;

  