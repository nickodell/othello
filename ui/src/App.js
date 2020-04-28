import React from 'react';
import { Provider } from 'react-redux';

import GameBoard from './containers/gameboard';
import Web3Container from './containers/web3container';
import Modal from './containers/modal';

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
        <GameBoard />
        <Modal />
      </div>
    </Provider>
  );
}

export default App;
