import avLogo from './assets/AV_Logo_weiss.svg';
import Layout from './layout/Layout';
import Menu from './menu/Menu';
import LinkItem from './linkitem/LinkItem';
import EarthlingEd from './assets/earthling_ed.jpg'
import DE from './assets/Flag_of_Germany.svg'
import EN from './assets/Flag_of_the_United_Kingdom.svg'
import './App.css';

function App() {
  return (
    <Layout>
      <div className="App">
        <Menu/>
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
            title="Eine Rede, die dir die Augen öffnet!"
            url="https://www.youtube.com/watch?v=Z3u7hXpOm58&hl=de&cc_lang_pref=de&cc_load_policy=1"
            image={EarthlingEd}
            dub={EN}
            sub={DE}
            dubAlt="EN"
            subAlt="DE"
          />
          <LinkItem
            title="Eine Rede, die dir die Augen öffnet!"
            url="https://www.youtube.com/watch?v=Z3u7hXpOm58&hl=de&cc_lang_pref=de&cc_load_policy=1"
            image={EarthlingEd}
            sub={DE}
            subAlt="DE"
          />
          <LinkItem
            title="Eine Rede, die dir die Augen öffnet!"
            url="https://www.youtube.com/watch?v=Z3u7hXpOm58&hl=de&cc_lang_pref=de&cc_load_policy=1"
            image={EarthlingEd}
            dub={EN}
            dubAlt="EN"
          />
          <LinkItem
            title="Eine Rede, die dir die Augen öffnet!"
            url="https://www.youtube.com/watch?v=Z3u7hXpOm58&hl=de&cc_lang_pref=de&cc_load_policy=1"
            image={EarthlingEd}
          />
          <LinkItem
            title="Eine Rede, die dir die Augen öffnet!"
            url="https://www.youtube.com/watch?v=Z3u7hXpOm58&hl=de&cc_lang_pref=de&cc_load_policy=1"
          />
        </div>
      </div>
    </Layout>
  );
}

export default App;
