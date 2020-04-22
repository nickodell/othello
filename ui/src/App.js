import React from 'react';
import { Provider } from 'react-redux';

import GameBoard from './containers/gameboard';

import store from './store';

import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <GameBoard />
      </div>
    </Provider>
  );
}

export default App;
