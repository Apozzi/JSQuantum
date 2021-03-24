import React from 'react';
import SimulatorUtils from "../../processing/SimulatorUtils";
import _ from 'underscore';
import './QuantumSchematics.css';
import QuantumSchematicsManager from './QuantumSchematicsManager';
import QuantumLogicGateTrasform from '../../processing/QuantumLogicGateTrasform';

const math = require('mathjs');
const documentobj: any = document ? document : {};

const getColumnsOfGates = () => {
  const length = document.querySelectorAll("[id^='table-box_0']").length;
  let gates = [];
  for (let index = 0; index < length; index++) {
    const column : Array<any> = [];
    document.querySelectorAll(`[id^='table-box_'][id$='_${index}']`).forEach(e => {
      const gateEl = e.getElementsByClassName("gateSet")[0];
      column.push(gateEl ? gateEl.id : null);
    });
    if (column.length !== 0) gates.push(column);
  }
  return gates;
}

export default class QuantumSchematics extends React.Component<{isPlaying : boolean}> {

  fileUploader : any;
  state = {
    quatumColumns: 4,
    qbitsInputNr: Array(4).fill(0),
    qbitsOutputVector: Array(16).fill(0),
  };

  componentDidMount() {
    QuantumSchematicsManager.setSize(this.state.quatumColumns);
    QuantumSchematicsManager.onClean().subscribe(() => this.onClean());
    QuantumSchematicsManager.onImport().subscribe(() => this.onImport());
    QuantumSchematicsManager.onExport().subscribe((projectName : String) => this.onExport(projectName));
    QuantumSchematicsManager.onUpdateSchematics().subscribe(() => this.forceUpdate());
  }

  componentDidUpdate() {
    QuantumSchematicsManager.setSize(this.state.quatumColumns);
    if (this.props.isPlaying) {
      const oldOutputState = [...this.state.qbitsOutputVector];
      let columnsOfGates = getColumnsOfGates();
      let inputVector = QuantumLogicGateTrasform.createInputVectorFromQubits(this.state.qbitsInputNr.map(n => 
        SimulatorUtils.createQubitFromKenetNotation(SimulatorUtils.defineKenetQbitFromNumber(n))
      ));
      for (let columnOfGates of columnsOfGates) {
        const arrayOfTransformationMatrix = columnOfGates.map(e => SimulatorUtils.qGateTransformingByString(e));
        inputVector = QuantumLogicGateTrasform.transform(inputVector, arrayOfTransformationMatrix);
      }
      this.state.qbitsOutputVector = inputVector.flat();
      if (!_.isEqual(oldOutputState, this.state.qbitsOutputVector)) {
        this.setState({
          qbitsOutputMatrix: this.state.qbitsOutputVector
        });
      }
    }
  }

  

  changeQubitRotation(index: number) {
    this.state.qbitsInputNr[index]++;
    this.state.qbitsInputNr[index] = this.state.qbitsInputNr[index] % 6;
    this.setState({qbits: this.state.qbitsInputNr});
  }

  addLine() {
    this.state.qbitsInputNr.push(0);
    this.setState({
      qbits: this.state.qbitsInputNr,
      quatumColumns: this.state.quatumColumns + 1
    });
  }

  removeLine() {
    this.state.qbitsInputNr.pop();
    this.setState({
      qbits: this.state.qbitsInputNr,
      quatumColumns: this.state.quatumColumns - 1
    });
  }

  getMensuramentPercentageLabel(index: number) {
    let doubleValue = SimulatorUtils.getSpecificQubitPercentage(this.state.qbitsOutputVector, this.state.quatumColumns, index);
    if (index) {
      return (math.abs(math.pow(doubleValue, 2))*100).toFixed(2) + "%";
    }
    return "0.00%";
  }

  onClean() {
    const gateSets = [...documentobj.getElementsByClassName("gateSet")];
    for ( let gateEl of gateSets) {
      gateEl.remove();
    }
  }

  onImport() {
    if (this.fileUploader !== null) {
      this.fileUploader.click();
    }
  }

  importedFileProccess = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    var file = event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (evt) => {
        if (evt.target !== null) {
          let parsedObj = null;
          try {
            parsedObj = JSON.parse(evt.target.result as string);
            for (let gateObj of parsedObj) {
              SimulatorUtils.addGateInTable(gateObj.gate, gateObj.x, gateObj.y);
            }
          } catch {
            // Tratamento exceção.
          }
        }
      }
    }
    event.target.value = null;
  }

  downloadFile(data: any, filename: any, type:any ) {
    let file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else {
        let a = documentobj.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        documentobj.body.appendChild(a);
        a.click();
        setTimeout(function() {
          documentobj.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
  }

  onExport(projectName: String) {
    const gateSets = [...documentobj.getElementsByClassName("gateSet")];
    const fileArray = [];
    for ( let gateEl of gateSets) {
      fileArray.push({
        gate: gateEl.id.slice(0, -3),
        x: gateEl.parentElement.id.split("_")[1],
        y: gateEl.parentElement.id.split("_")[2]
      });
    }
    this.downloadFile(JSON.stringify(fileArray), projectName + '.qjs', 'text');
  }

  isLastRow(index: number) {
    return this.state.quatumColumns === (index + 1);
  }

  hasControllerGateLine(rowIndex: number, columnIndex: number) : boolean {
    const rowFinalIndex = this.state.quatumColumns - 1;
    const checkGate = (index: number) => {
      const tableColumn = document.getElementById(`table-box_${index}_${columnIndex}`);
      return tableColumn && Array.from(tableColumn.children).filter(children => children.id.includes("Set")).length ? index : null;
    };
    const getBeginPos = () => {
      for (let index = 0; index <= rowFinalIndex; index++) {
        let gateChecked = checkGate(index);
        if (gateChecked !== null) return gateChecked;
      }
      return rowFinalIndex;
    };
    const getFinalPos = () => {
      for (let index = rowFinalIndex; index >= 0; index--) {
        let gateChecked = checkGate(index);
        if (gateChecked !== null) return gateChecked;
      }
      return 0;
    };
    const hasDiferentGates = () => {
      const gateArray = [];
      for (let index = 0; index <= rowFinalIndex; index++) {
        const tableColumn = document.getElementById(`table-box_${index}_${columnIndex}`);
        const arrayTableColumn = tableColumn ? Array.from(tableColumn.children) : [];
        const gate = arrayTableColumn.filter(children => children.id.includes("Set"))[0];
        if (gate) gateArray.push(gate);
      }
      const quantityOfGates = gateArray.filter(children => children.id.includes("Set")).length;
      const quantityOfControlledGates = gateArray.filter(children => children.id.includes("ControlledGateSet")).length;
      const quantityGatesDiferentFromControlled = gateArray.filter(children => !children.id.includes("ControlledGateSet")).length;
      return quantityOfGates !== quantityOfControlledGates && quantityOfGates !== quantityGatesDiferentFromControlled;
    };
    const beginPos = getBeginPos();
    const endPos = getFinalPos();
    return beginPos <= rowIndex && endPos > rowIndex && hasDiferentGates();
  }

  render() {
    return (
      <div id="quantumSchematics" className="quantumSchematics">
        <input type='file' id='file' ref={(ref) => this.fileUploader = ref} onChange={this.importedFileProccess} style={{display: 'none'}}/>
        <table>
            <thead></thead>
            <tbody>
            {[...Array(this.state.quatumColumns)].map((x, i) =>
              <tr key={i}>
              <td className="table-quantum-number">
                <div className="qubit-simbol" onClick={() => this.changeQubitRotation(i)}>
                  {SimulatorUtils.defineKenetQbitFromNumber(this.state.qbitsInputNr[i])}
                </div>
              </td>
              <td className="q-box table-quantum-number">Q{i + 1}</td>
              {[...Array(14)].map((x, i2) =>
                <td id={`table-box_${i}_${i2}`} key={i2} className="table-box"><hr className="quantum-box">
                  </hr>
                  {!this.isLastRow(i) && this.hasControllerGateLine(i, i2) && <div id="controlledline" className="controlled-gate--bottom-line"></div> }
                </td>
              )}
              <td className="table-quantum-number table-mensurement-number-box">
                <div className="mensurement-number-box">
                  {this.getMensuramentPercentageLabel(1)}
                </div>
              </td>
            </tr>
            )}
            </tbody>
        </table>
        <div className="change-button-box">
          <button className="change-table-button" onClick={() => this.addLine()}>+</button>
          {this.state.quatumColumns > 1 && 
           <button className="change-table-button" onClick={() => this.removeLine()}>-</button>}
        </div>
      </div>
    );
  }
}