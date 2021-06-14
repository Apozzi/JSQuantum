import React from 'react';
import QuantumSchematicsManager from '../QuantumSchematics/QuantumSchematicsManager';
import BlochSpheresViewModal from './BlochSpheresViewModal/BlochSpheresViewModal';
import HSVViewModal from './HSVViewModal/HSVViewModal';
import NameChoiceModal from './NameChoiceModal/NameChoiceModal';
import './NavBar.css';
import QubitsValuesModal from './QubitsValuesModal/QubitsValuesModal';


export default class NavBar extends React.Component<any> {

  clean = QuantumSchematicsManager.clean;
  import = QuantumSchematicsManager.import;

  export() {
    NameChoiceModal.openModal().subscribe(projectName => {
      if (projectName !== null) {
        QuantumSchematicsManager.export(projectName);
      }
    })
  }

  showQubitsValuesModal() {
    QubitsValuesModal.openModal();
  }

  showHSVViewModal() {
    HSVViewModal.openModal();
  }

  showBlochSphereModal() {
    BlochSpheresViewModal.openModal();
  }

  render() {
    return (
      <div className="navbar">
        <HSVViewModal></HSVViewModal>
        <NameChoiceModal></NameChoiceModal>
        <QubitsValuesModal></QubitsValuesModal>
        <BlochSpheresViewModal></BlochSpheresViewModal>
        <div className="navbar--button" onClick={this.clean}>
          Limpar
        </div>
        <div className="navbar--button" onClick={this.import}>
          Importar
        </div>
        <div className="navbar--button" onClick={this.export}>
          Exportar
        </div>
        <div className="navbar--button">
          Exemplos
        </div>
        <div className="navbar--button-with-subnav">
          <div className="navbar--button">
            <div className="navbar--arrow-icon">▼</div> Visualização
          </div>
          <div className="subnav--content">
            <a onClick={() => this.showBlochSphereModal()}>Modelo de esferas de Bloch</a>
            <a onClick={() => this.showQubitsValuesModal()}>Visualização de estados dos Qubits</a>
            <a onClick={() => this.showHSVViewModal()}>HSV View 2D/3D</a>
          </div>
        </div>
      </div>
    )
  }

}