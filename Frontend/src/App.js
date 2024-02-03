import "./App.css";

function App() {
  const handleAuthorize = () => {
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_REDIRECT_URI; 
    const scope = "repo";

    const githubOAuthURL = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = githubOAuthURL;
};

  return (
    <div className="App">
      <header className="App-header">
        <button className="App-button" onClick={handleAuthorize}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/GitHub_Invertocat_Logo.svg/1200px-GitHub_Invertocat_Logo.svg.png"
            className="App-logo"
            alt="logo"
          />
          <span>Authorize With GitHub</span>
        </button>
      </header>
    </div>
  );
}

export default App;
