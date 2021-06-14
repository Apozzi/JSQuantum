import React from 'react';
import SimulatorUtils from '../../processing/SimulatorUtils';
import './ToolBox.css';

export default class ToolBox extends React.Component<{callbackPlaying : any}> {

  state = {
    isPlaying: false
  };

  onClickGate(gateId: String) {
    SimulatorUtils.cloneGate(gateId);
  }

  togglePlayButton() {
    this.setState({
      isPlaying: !this.state.isPlaying
    });
    this.props.callbackPlaying(!this.state.isPlaying);
  }

  render() {
    return (
      <div className="toolbox">
        {
          this.state.isPlaying ? 
          <div className="pause-button" onClick={() => this.togglePlayButton()}>❚❚</div> :
          <div className="play-button" onClick={() => this.togglePlayButton()}>►</div>
        }
        <div id="HGate" className="toolbox-button" onMouseDown={() => this.onClickGate('HGate')} >
          H
        </div>
        <div id="XGate" className="toolbox-button" onMouseDown={() => this.onClickGate('XGate')}>
          X
        </div>
        <div id="YGate" className="toolbox-button" onMouseDown={() => this.onClickGate('YGate')}>
          Y
        </div>
        <div id="ZGate" className="toolbox-button" onMouseDown={() => this.onClickGate('ZGate')}>
          Z
        </div>
        <div id="SGate" className="toolbox-button" onMouseDown={() => this.onClickGate('SGate')}>
          S
        </div>
        <div id="TGate" className="toolbox-button" onMouseDown={() => this.onClickGate('TGate')}>
          T
        </div>
        <div id="ControlledGate" className="toolbox-button" onMouseDown={() => this.onClickGate('ControlledGate')}>
          •
        </div>
      </div>
    )
  }

}
