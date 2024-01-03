import avLogo from './assets/AV_Logo_weiss.svg';
import Layout from './layout/Layout';
import LinkItem from './linkitem/LinkItem';
import EarthlingEd from './assets/earthling_ed.jpg'
import './App.css';

function App() {
  return (
    <Layout>
      <div className="App">
        <header className="App-header">
            <img src={avLogo} className="App-logo" alt="AV_Logo" />
            <p>
              Website Work in Progress
            </p>
        </header>
        <div className="link-items-container">
          <LinkItem
            title="Eine Rede, die dir die Augen öffnet!"
            url="https://www.youtube.com/watch?v=Z3u7hXpOm58&hl=de&cc_lang_pref=de&cc_load_policy=1"
            image={EarthlingEd}
            dub="English"
            sub="German"
          />
          <LinkItem
            title="Eine Rede, die dir die Augen öffnet!"
            url="https://www.youtube.com/watch?v=Z3u7hXpOm58&hl=de&cc_lang_pref=de&cc_load_policy=1"
            image={EarthlingEd}
            dub="English"
            sub="German"
          />
        </div>
      </div>
    </Layout>
  );
}

export default App;
