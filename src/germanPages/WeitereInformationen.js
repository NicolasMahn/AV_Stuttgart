import React from 'react';

import LinkItem from '../linkitem/LinkItem';

import EarthlingEd from '../assets/earthling_ed.jpg'
import DE from '../assets/Flag_of_Germany.svg'
import EN from '../assets/Flag_of_the_United_Kingdom.svg'



const WeitereInformationen = () => {
    return (
        <div className="link-items-container">
            <LinkItem
                title="darumpflanzlich"
                url="https://www.instagram.com/darumpflanzlich/?hl=de"
                image={EarthlingEd}
            />
            <LinkItem
                title="yammibean"
                url="https://www.instagram.com/yammibean/"
                image={EarthlingEd}
            />
            <LinkItem
                title="vegansparen"
                url="https://www.instagram.com/vegansparen/?hl=de"
                image={EarthlingEd}
            />
            <LinkItem
                title="vegan_check"
                url="https://www.instagram.com/vegan_check/?hl=de"
                image={EarthlingEd}
            />
        </div>
    );
  };

  export default WeitereInformationen;

  