import React from 'react';

import LinkItem from '../linkitem/LinkItem';

import EarthlingEd from '../assets/earthling_ed.jpg'
import DE from '../assets/Flag_of_Germany.svg'
import EN from '../assets/Flag_of_the_United_Kingdom.svg'



const AufDerKarte = () => {
    return (
        <div className="link-items-container">
            <LinkItem
                title="Dominion (2018)"
                url="https://www.youtube.com/watch?v=V7DrljVAaYk"
                image={EarthlingEd}
                dub={DE}
                dubAlt="DE"
            />
            <LinkItem
                title="Was bedeutet Biofleisch (SOKO Tierschutz)"
                url="https://www.soko-tierschutz.org/bio"
                image={EarthlingEd}
            />
            <LinkItem
                title="Warum sind Veganer nicht einfach Vegetarier?"
                url="https://www.youtube.com/watch?v=pUsqS1k8Bu0"
                image={EarthlingEd}
                dub={EN}
                sub={DE}
                dub_alt="EN"
                sub_alt="DE"
            />
            <LinkItem
                title="Eat this! Veganes Foodblog seit 2011"
                url="http://eat-this.org"
                image={EarthlingEd}
            />
            <LinkItem
                title="Der vegane Einkaufsguide"
                url="https://play.google.com/store/apps/details?id=org.petazwei.petazwei&hl=de&gl=US&pli=1"
                image={EarthlingEd}
            />
            <LinkItem
                title="HappyCow"
                description="Eine App um vegane Restaurants zu finden"
                url="https://play.google.com/store/apps/details?id=com.hcceg.veg.compassionfree&hl=de&gl=US"
                image={EarthlingEd}
            />
        </div>
    );
  };

  export default AufDerKarte;

  