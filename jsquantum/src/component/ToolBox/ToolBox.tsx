import React from 'react';
import './ToolBox.css';
import { runInThisContext } from 'vm';

const math = require('mathjs');

const documentobj: any = document ? document : {};


const overlaps = (a: any, b: any) => {
  if (a === null || b === null) return false;
  const rect1 = a.getBoundingClientRect();
  const rect2 = b.getBoundingClientRect();
  const isInHoriztonalBounds =
    rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x;
  const isInVerticalBounds =
    rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;
  const isOverlapping = isInHoriztonalBounds && isInVerticalBounds;
  return isOverlapping;
}

const cloneFunction = (gateId : String) => {
  let clone = documentobj.getElementById(gateId).cloneNode( true )
  let dragId = gateId + "Drag";
  clone.setAttribute( 'id', dragId );
  clone.classList.add("gateSet");
  clone.style.position = "absolute";
  clone.style.left = '-400px';
  clone.style.top = '-400px';
  clone.style.zIndex = "999";
  documentobj.onmousemove = (e: any) => {
    let d = documentobj.getElementById(dragId);
    d.style.left = e.pageX - 38 +'px';
    d.style.top = e.pageY - 38 +'px';
  };
  documentobj.querySelector('.toolbox').appendChild( clone );
  documentobj.onmouseup = (e: any) => {
    documentobj.onmousemove = () => {};
    let tableobjs = document.getElementsByClassName('table-box');
    let isOnTable = false
    Array.from(tableobjs).forEach(tableobj => {
      if (overlaps(clone, tableobj)) {
        isOnTable = true;
        const boundingTable = tableobj.getBoundingClientRect();
        clone.style.left = boundingTable.x + "px";
        clone.style.top = boundingTable.y - 10 + "px";
        clone.style.zIndex = "10";
        clone.setAttribute( 'id', gateId + "Set" );
        clone.onmousedown = (e : any) => {
          cloneFunction(gateId);
          tableobj.removeChild(clone);
        }
        if (tableobj.childNodes.length > 1) {
          tableobj.removeChild(tableobj.lastChild as Node);
        }

        tableobj.appendChild(clone);
      }
    });
    const toolbox = documentobj.querySelector('.toolbox');
    if (clone && !isOnTable && clone.parentNode === toolbox) {
      toolbox.removeChild(clone);
      clone = null;
    }
  };
}


export default class ToolBox extends React.Component<{callbackPlaying : any}> {

  state = {
    isPlaying: false
  };


  onClickGate(gateId: String) {
    cloneFunction(gateId);
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
      </div>
    )
  }

}
