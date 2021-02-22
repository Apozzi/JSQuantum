import React from 'react';
import QuantumSchematicsManager from '../QuantumSchematics/QuantumSchematicsManager';
import NameChoiceModal from './NameChoiceModal/NameChoiceModal';
import './NavBar.css';


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

  render() {
    return (
      <div className="navbar">
        <NameChoiceModal></NameChoiceModal>
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
      </div>
    )
  }

}