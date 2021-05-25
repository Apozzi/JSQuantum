import React from 'react';
import QuantumSchematicsManager from './QuantumSchematicsManager';
import QuantumLogicGateTrasform from '../../processing/QuantumLogicGateTrasform';
import LaTeXFileUtils from '../../utils/FileUtils/LaTeXFileUtils';
import QJSFileUtils from '../../utils/FileUtils/QJSFileUtils';
import AsciiFileUtils from '../../utils/FileUtils/AsciiFileUtils';
import SimulatorUtils from "../../utils/SimulatorUtils";
import _ from 'underscore';
import './QuantumSchematics.css';

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

  state = {
    quatumColumns: 4,
    qubitsInputNr: Array(4).fill(0),
    qubitsOutputVector: [1].concat(Array(15).fill(0)),
  };

  componentDidMount() {
    QuantumSchematicsManager.setData(this.state.quatumColumns, this.state.qubitsOutputVector);
    QuantumSchematicsManager.onClean().subscribe(() => this.onClean());
    QuantumSchematicsManager.onOpenNewSchematics().subscribe((gatesObj: any) => this.onOpenSchematics(gatesObj));
    QuantumSchematicsManager.onSaveSchematics().subscribe((projectName : String) => this.onSaveSchematics(projectName));
    QuantumSchematicsManager.onExportSchematicsToLaTeX().subscribe((projectName : String) => this.onExportSchematicsToLatex(projectName));
    QuantumSchematicsManager.onExportSchematicsToAscii().subscribe((projectName : String) => this.onExportSchematicsToAscii(projectName));
    QuantumSchematicsManager.onUpdateSchematics().subscribe(() => this.forceUpdate());
  }

  componentDidUpdate() {
    QuantumSchematicsManager.setData(this.state.quatumColumns, this.state.qubitsOutputVector);
    if (this.props.isPlaying) {
      const beginProcessingTime = Date.now();
      this.generateOutput();
      const endProcessingTime = Date.now();
      QuantumSchematicsManager.setSchematicsExecutionTime(endProcessingTime - beginProcessingTime);
    }
  }

  private generateOutput() {
    const oldOutputState = [...this.state.qubitsOutputVector];
    let columnsOfGates = getColumnsOfGates();
    let inputVector = QuantumLogicGateTrasform.createInputVectorFromQubits(this.state.qubitsInputNr.map(n => 
      SimulatorUtils.createQubitFromKenetNotation(SimulatorUtils.defineKenetQbitFromNumber(n))
    ));
    this.state.qubitsOutputVector = this.applyGatesTransformationToInput(inputVector, columnsOfGates).flat();
    if (!_.isEqual(oldOutputState, this.state.qubitsOutputVector)) {
      this.setState({
        qbitsOutputMatrix: this.state.qubitsOutputVector
      });
    }
  }

  private applyGatesTransformationToInput(inputVector: number[][],columnsOfGates: string[][]): number[][] {
    for (let columnOfGates of columnsOfGates) {
      const hasControlGates = !!columnOfGates.find(gate => SimulatorUtils.isControlGate(gate));
      const controlGatesPosition = hasControlGates ? columnOfGates.map(gate => SimulatorUtils.isControlGate(gate)) : [];
      const arrayOfTransformationMatrix = columnOfGates.map(e => SimulatorUtils.qGateTransformingByString(e));
      inputVector = hasControlGates ? 
        QuantumLogicGateTrasform.transform(inputVector, arrayOfTransformationMatrix, controlGatesPosition) :
        QuantumLogicGateTrasform.transform(inputVector, arrayOfTransformationMatrix) ;
    }
    return inputVector;
  }

  changeQubitRotation(index: number) {
    this.state.qubitsInputNr[index]++;
    this.state.qubitsInputNr[index] = this.state.qubitsInputNr[index] % 6;
    this.setState({qbits: this.state.qubitsInputNr});
    this.forceUpdate();
  }

  addLine() {
    this.state.qubitsInputNr.push(0);
    this.setState({
      qbits: this.state.qubitsInputNr,
      quatumColumns: this.state.quatumColumns + 1,
      qbitsOutputVector: []
    });
  }

  removeLine() {
    this.state.qubitsInputNr.pop();
    this.setState({
      qbits: this.state.qubitsInputNr,
      quatumColumns: this.state.quatumColumns - 1,
      qbitsOutputVector: []
    });
  }

  onClean() {
    const gateSets = [...documentobj.getElementsByClassName("gateSet")];
    for ( let gateEl of gateSets) {
      gateEl.remove();
    }
    this.forceUpdate();
  }

  onOpenSchematics = (gatesObj: any) => {
    this.onClean()
    SimulatorUtils.addAllGatesInTable(gatesObj)
  };
  
  onSaveSchematics = (projectName: String) => QJSFileUtils.exportFile(documentobj, projectName);
  onExportSchematicsToLatex = (projectName: String) => LaTeXFileUtils.exportFile(documentobj, projectName, this.state.quatumColumns);
  onExportSchematicsToAscii = (projectName: String) => AsciiFileUtils.exportFile(documentobj, projectName, this.state.quatumColumns);

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
      const quantityOfControlGates = gateArray.filter(children => children.id.includes("ControlGateSet")).length;
      const quantityGatesDiferentFromControl = gateArray.filter(children => !children.id.includes("ControlGateSet")).length;
      return quantityOfGates !== quantityOfControlGates && quantityOfGates !== quantityGatesDiferentFromControl;
    };
    const beginPos = getBeginPos();
    const endPos = getFinalPos();
    return beginPos <= rowIndex && endPos > rowIndex && hasDiferentGates();
  }

  componentWillUnmount() {
    QuantumSchematicsManager.unsubcribeSubjects();
  }

  render() {
    return (
      <div id="quantumSchematics" className="quantum-schematics">
        <table>
            <thead></thead>
            <tbody>
            {[...Array(this.state.quatumColumns)].map((x, i) =>
              <tr key={i}>
              <td className="table-quantum-number">
                <div className="qubit-simbol" onClick={() => this.changeQubitRotation(i)}>
                  {SimulatorUtils.defineKenetQbitFromNumber(this.state.qubitsInputNr[i])}
                </div>
              </td>
              <td className="q-box table-quantum-number">Q{i + 1}</td>
              {[...Array(14)].map((x, i2) =>
                <td id={`table-box_${i}_${i2}`} key={i2} className="table-box"><hr className="quantum-box">
                  </hr>
                  {!this.isLastRow(i) && this.hasControllerGateLine(i, i2) && <div id="controlline" className="control-gate--bottom-line"></div> }
                </td>
              )}
              <td className="table-quantum-number table-mensurement-number-box">
                <div className="mensurement-number-box">
                  {SimulatorUtils.getSpecificQubitMensuramentLabel(this.state.qubitsOutputVector, this.state.quatumColumns, i)}
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
        {QuantumSchematicsManager.isActivePerformanceStatistics() 
          && <div className="quantum-schematics--statistics"> Tempo de atualização: {QuantumSchematicsManager.getSchematicsExecutionTime()}ms</div>}
      </div>
    );
  }
}