import React, { Component } from "react";
import "./App.css";
import { Web3Provider } from "react-web3";
import DownloadMetaMaskButton from "./DownloadMetaMaskButton";
import { BrowserRouter, Route, Switch, HashRouter } from "react-router-dom";

class App extends Component {
  render(props, context) {
    return (
      <div className="App">
        <a className="github-banner" href="https://github.com/skyge">
          <img src="https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png" alt="Fork me on GitHub" />
        </a>
        <Web3Provider web3UnavailableScreen={() => 
            <div>
                <p>You need a web3 browser like MetaMask to use this site and manage cryptocurrencies.</p>
                <DownloadMetaMaskButton/>
            </div>}
        >
            <BrowserRouter basename={process.env.PUBLIC_URL}>
                <HashRouter hashType="noslash">
                    <Switch>
                    </Switch>
                </HashRouter>
            </BrowserRouter>
        </Web3Provider>
      </div>
    );
  }
}

export default App;
