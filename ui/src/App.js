import React from 'react';
import { Provider } from 'react-redux';

import Web3Container from './containers/web3container';
import Modal from './containers/modal';
import AppContainer from './containers/appContainer';

import store from './store';

import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <div className="header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="title">Othello</h1>
        </div>
        <Web3Container />
        <AppContainer />
        <Modal />
      </div>
    </Provider>
  );
}

export default App;
