import React from 'react';
import './App.css';
import NavBar from './component/NavBar/NavBar';
import ToolBox from './component/ToolBox/ToolBox';
import QuantumSchematics from './component/QuantumSchematics/QuantumSchematics';

export default class App extends React.Component {
  state = {
    isPlaying: false
  };

  onChangePlayState = (state: boolean) => {
    this.setState({ isPlaying: state });
  }

  render() {
    return (
      <div id="app" className="App">
        <NavBar></NavBar>
        <ToolBox callbackPlaying={this.onChangePlayState}></ToolBox>
        <QuantumSchematics isPlaying={this.state.isPlaying}></QuantumSchematics>

      </div>
    );
  }
}
