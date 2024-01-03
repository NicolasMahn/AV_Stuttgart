import avLogo from './assets/AV_Logo_weiss.svg';
import Layout from './Layout';
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
      </div>
    </Layout>
  );
}

export default App;
