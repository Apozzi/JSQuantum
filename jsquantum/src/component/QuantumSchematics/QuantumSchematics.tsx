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
    QuantumSchematicsManager.onClean().subscribe(() => this.onClean());
    QuantumSchematicsManager.onImport().subscribe(() => this.onImport());
    QuantumSchematicsManager.onExport().subscribe((projectName : String) => this.onExport(projectName));
  }

  componentDidUpdate() {
    if (this.props.isPlaying) {
      const oldOutputState = [...this.state.qbitsOutput];
      getLineOfGates().forEach((line, i) => {
        const kenet = this.defineKenetQbitFromNumber(this.state.qbitsInputNr[i]);
        let qubit : Qubit = SimulatorUtils.createQubitFromKenetNotation(kenet);
        line.forEach((gates) => {
          qubit =  SimulatorUtils.qGateTransformingByString(qubit, gates);
        });
        this.state.qbitsOutput[i] = qubit;
      });
      if (!_.isEqual(oldOutputState, this.state.qbitsOutput)) {
        console.log(this.state.qbitsOutput);
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
    console.log(file);
    if (file) {
      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (evt) => {
        if (evt.target !== null) {
          let parsedObj = null;
          try {
            parsedObj = JSON.parse(evt.target.result as string);
          } catch {
            // Tratamento exceção.
          }
        }
      }
    }
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
        gate: gateEl.id,
        x: gateEl.parentElement.id.split("_")[0],
        y: gateEl.parentElement.id.split("_")[1]
      });
    }
    this.downloadFile(JSON.stringify(fileArray), projectName + '.qjs', 'text');
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
                <td id={`table-box_${i}_${i2}`} key={i2} className="table-box"><hr className="quantum-box"></hr></td>
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
          {(this.state.quatumColumns > 1 ? 
           <button className="change-table-button" onClick={() => this.removeLine()}>-</button>
           :  null)}
        </div>
      </div>
    );
  }
}