import React, { Component } from 'react';
import './App.css';
import MapView from './components/MapView.js'
class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Interactive Map</h1>
        </header>
        <MapView/>
      </div>
    );
  }
}
export default App;
