import React from 'react';
import SimulatorUtils from '../../utils/SimulatorUtils';
import CustomGateManager from '../NavBar/CustomGateManager/CustomGateManager';
import './ToolBox.css';

export default class ToolBox extends React.Component<{callbackPlaying : any}> {

  state = {
    isPlaying: false
  };

  componentDidMount() {
    CustomGateManager.onChangeCustomGates().subscribe(()=> {
      this.forceUpdate();
    });
  }

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
        <div id="ControlGate" className="toolbox-button" onMouseDown={() => this.onClickGate('ControlGate')}>
          •
        </div>
        {CustomGateManager.isShownCustomGates() ? 
          [<div className="toolbox--separation"></div>]
            .concat(CustomGateManager.getCustomGates().map((gate, index) => 
              <div id={`${gate.getUuId()}-CustomGate`} className="toolbox-button" key={index} onMouseDown={() => this.onClickGate(`${gate.getUuId()}-CustomGate`)}>
                {gate.getPrefix()}  
              </div>
            )) : 
          CustomGateManager.hasCustomGates() ? 
            <div className="toolbox--more-button" onMouseDown={() => CustomGateManager.showCustomGates()} > ••• </div> : undefined}
      </div>
    )
  }

}
