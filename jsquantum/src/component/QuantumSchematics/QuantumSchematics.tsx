import React, { useRef } from 'react';
import SimulatorUtils from "../../processing/SimulatorUtils";
import Qubit from "../../processing/Qubit";
import _ from 'underscore';
import './QuantumSchematics.css';
import QuantumSchematicsManager from './QuantumSchematicsManager';

const math = require('mathjs');
const documentobj: any = document ? document : {};

const getLineOfGates = () => {
  let gates = [];
  for (const element of documentobj.querySelector("#quantumSchematics tbody").children) {
    let line = [];
    for ( const gateEl of element.getElementsByClassName("gateSet")) {
      line.push(gateEl.id);
    }
    gates.push(line);
  }
  return gates;
}

export default class QuantumSchematics extends React.Component<{isPlaying : boolean}> {

  fileUploader : any;
  state = {
    quatumColumns: 4,
    qbitsInputNr: Array(4).fill(0),
    qbitsOutput: Array(4).fill(0)
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
      const oldOutputState = [...this.state.qbitsOutput];
      let lineOfGates = getLineOfGates();
      let outputResult = this.state.qbitsInputNr.map(qinput => {
        const kenet = this.defineKenetQbitFromNumber(qinput);
        return SimulatorUtils.createQubitFromKenetNotation(kenet);
      });
      while (lineOfGates.some((a) => (a.length))) {
        const controlledGatesInColumn = lineOfGates
          .map((gates, i) => ({gate: gates[0], index: i}))
          .filter((obj) => obj.gate === "ControlledGateSet");
        if (controlledGatesInColumn.length) {
          lineOfGates.forEach((line, i) => {
            const gate = line.shift();
            const controlledQubits =  [];
            for (let contr of controlledGatesInColumn) {
              controlledQubits.push(outputResult[contr.index]);
            }
            if (gate) outputResult[i] = SimulatorUtils.controlledQGateTransformingByString(outputResult[i], gate, controlledQubits);
          });
        } else {
          lineOfGates.forEach((line, i) => {
            const gate = line.shift();
            if (gate) outputResult[i] = SimulatorUtils.qGateTransformingByString(outputResult[i], gate);
          });
        }
      }
      this.state.qbitsOutput = outputResult;
      if (!_.isEqual(oldOutputState, this.state.qbitsOutput)) {
        this.setState({
          qbitsOutput: this.state.qbitsOutput
        });
      }
    }
  }

  defineKenetQbitFromNumber(qbitRepresentation : number) {
    return ['|0⟩', '|1⟩', '|+⟩', '|-⟩', '|i⟩', '|-i⟩'][qbitRepresentation];
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

  getMensuramentPercentage(qubit: Qubit) {
    if (qubit) {
      return (math.abs(math.pow(qubit.getBeta(), 2))*100).toFixed(2) + "%";
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
                  {this.defineKenetQbitFromNumber(this.state.qbitsInputNr[i])}
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
                  {this.getMensuramentPercentage(this.state.qbitsOutput[i])}
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