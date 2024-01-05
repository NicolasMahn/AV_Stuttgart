import React from 'react';

import LinkItem from '../linkitem/LinkItem';

import EarthlingEd from '../assets/earthling_ed.jpg'
import DE from '../assets/Flag_of_Germany.svg'
import EN from '../assets/Flag_of_the_United_Kingdom.svg'



const Ethik = () => {
    return (
        <div className="link-items-container">
            <LinkItem
                title="Eine Rede, die dir die Augen öffnet!"
                description="Schau dir die aufrüttelnde Rede an, die Tausende von Studenten in Universitäten überall in Großbritannien hörten."
                url="https://www.youtube.com/watch?v=Z3u7hXpOm58&hl=de&cc_lang_pref=de&cc_load_policy=1"
                image={EarthlingEd}
                dub={EN}
                sub={DE}
                dub_alt="EN"
                sub_alt="DE"
            />
            <LinkItem
                title="MILK - Kurzfilm"
                url="https://www.youtube.com/watch?v=zX8BLGDNyxc"
                image={EarthlingEd}
            />
            <LinkItem
                title="&quot;Norm&quot; - Kurzfilm"
                url="https://www.youtube.com/watch?v=poxl0K9UrP0&hl=de&cc_lang_pref=de&cc_load_policy=1"
                image={EarthlingEd}
                dub={EN}
                sub={DE}
                dub_alt="EN"
                sub_alt="DE"
            />
            <LinkItem
                title="Warum essen Veganer keine Eier aus dem Hinterhof?"
                url="https://www.youtube.com/watch?v=Z3u7hXpOm58&hl=de&cc_lang_pref=de&cc_load_policy=1"
                image={EarthlingEd}
                dub={EN}
                sub={DE}
                dub_alt="EN"
                sub_alt="DE"
            />
            <LinkItem
                title="Der geheime Grund warum wir Fleisch essen"
                url="https://www.youtube.com/watch?v=ao2GL3NAWQU&hl=de&cc_lang_pref=de&cc_load_policy=1"
                image={EarthlingEd}
                dub={EN}
                sub={DE}
                dub_alt="EN"
                sub_alt="DE"
            />
        </div>
    );
  };

  export default Ethik;

  