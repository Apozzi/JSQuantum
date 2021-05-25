import React from 'react';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from './components/NavBar/NavBar';
import ToolBox from './components/ToolBox/ToolBox';
import QuantumSchematics from './components/QuantumSchematics/QuantumSchematics';
import QuantumSchematicsManager from './components/QuantumSchematics/QuantumSchematicsManager';

export default class App extends React.Component {
  state = {
    isPlaying: false
  };

  onChangePlayState = (state: boolean) => {
    this.setState({ isPlaying: state });
  }

  onKeyPressed(event: any) {
    const keycodeStatistics = "KeyS";
    if (event.code === keycodeStatistics) {
      QuantumSchematicsManager.togglePerformanceStatistics();
      this.forceUpdate();
    }
  }

  render() {
    return (
      <div id="app" className="App" tabIndex={0} onKeyDown={(event) => this.onKeyPressed(event)}>
        <NavBar></NavBar>
        <ToolBox callbackPlaying={this.onChangePlayState}></ToolBox>
        <QuantumSchematics isPlaying={this.state.isPlaying}></QuantumSchematics>
      </div>
    );
  }
}
