import React from 'react';
import QuantumSchematicsManager from '../../components/QuantumSchematics/QuantumSchematicsManager';
import BlochSpheresViewModal from './BlochSpheresViewModal/BlochSpheresViewModal';
import CustomGatesCreationModal from './CustomGatesCreationModal/CustomGatesCreationModal';
import HSVViewModal from './HSVViewModal/HSVViewModal';
import NameChoiceModal from './NameChoiceModal/NameChoiceModal';
import QubitsValuesModal from './QubitsValuesModal/QubitsValuesModal';
import CustomGateManager from './CustomGateManager/CustomGateManager';
import ExamplesData from '../../assets/examples.json';
import QJSFileUtils from '../../utils/FileUtils/QJSFileUtils';
import './NavBar.css';


export default class NavBar extends React.Component<any> {
  fileUploader : any;

  componentDidMount() {
    CustomGateManager.onChangeCustomGates().subscribe(()=> {
      this.forceUpdate();
    });
  }

  clean = QuantumSchematicsManager.clean;

  saveQjsFile() {
    NameChoiceModal.openModal().subscribe(projectName => {
      if (projectName !== null) {
        QuantumSchematicsManager.saveNewSchematics(projectName);
      }
    })
  }

  exportLaTeXFormat() {
    NameChoiceModal.openModal().subscribe(projectName => {
      if (projectName !== null) {
        QuantumSchematicsManager.exportToLaTeX(projectName);
      }
    })
  }

  exportAsciiFormat() {
    NameChoiceModal.openModal().subscribe(projectName => {
      if (projectName !== null) {
        QuantumSchematicsManager.exportToAscii(projectName);
      }
    })
  }

  openQjsFile = () => {
    if (this.fileUploader) this.fileUploader.click();
  }

  openFileProccess = (event: any) => {
    QJSFileUtils.readImportedFile(event).subscribe((gatesObj : any) => {
      QuantumSchematicsManager.openSchematics(gatesObj);
    })
  }

  openExample(jsonObjString: string) {
    QuantumSchematicsManager.openSchematics(JSON.parse(jsonObjString));
  }

  getExamplesNav() {
    return ExamplesData.examples.map((example, index) => (
      <a key={index} onClick={() => {if (example.data) this.openExample(example.data)}}>
        {example.name} {example.subnavs && '▸'}
        {this.getExampleSubnav(example)}
      </a>
    ));
  }

  private getExampleSubnav(example: any) {
    return example.subnavs && (
      <div className="subnav--subitem">
        {example.subnavs.map((subnav: any, indexSub: number) => (
          <div className="subnav--subitem-link" key={indexSub} onClick={() => {if (subnav.data) this.openExample(subnav.data)}}>{subnav.name}</div>
        ))}
      </div>
    );
  }

  render() {
    return (
      <div className="navbar">
        <HSVViewModal></HSVViewModal>
        <NameChoiceModal></NameChoiceModal>
        <QubitsValuesModal></QubitsValuesModal>
        <BlochSpheresViewModal></BlochSpheresViewModal>
        <CustomGatesCreationModal></CustomGatesCreationModal>
        <div className="navbar--button" onClick={this.clean}>
          Limpar
        </div>
        <div className="navbar--button" onClick={this.openQjsFile}>
          Abrir
        </div>
        <div className="navbar--button" onClick={this.saveQjsFile}>
          Salvar
        </div>
        <div className="navbar--button-with-subnav">
          <div className="navbar--button">
            <div className="navbar--arrow-icon">▼</div> Exportar
          </div>
          <div className="subnav--content">
            <a onClick={this.exportLaTeXFormat}>LaTeX ...</a>
            <a onClick={this.exportAsciiFormat}>ASCII text ...</a>
          </div>
        </div>
        <div className="navbar--button-with-subnav">
          <div className="navbar--button">
            <div className="navbar--arrow-icon">▼</div> Visualização
          </div>
          <div className="subnav--content">
            <a onClick={() => BlochSpheresViewModal.openModal()}>Modelo de esferas de Bloch</a>
            <a onClick={() => QubitsValuesModal.openModal()}>Visualização de estados dos Qubits</a>
            <a onClick={() => HSVViewModal.openModal()}>HSV View 2D/3D</a>
          </div>
        </div>
        <div className="navbar--button-with-subnav">
          <div className="navbar--button">
            <div className="navbar--arrow-icon">▼</div> Customização
          </div>
          <div className="subnav--content">
            <a onClick={() => CustomGatesCreationModal.openModal()}>Criar porta customizada</a>
            {CustomGateManager.hasCustomGates() ? 
              CustomGateManager.isShownCustomGates() ?
                <a onClick={() => CustomGateManager.hideCustomGates()}>Esconder portas customizadas</a> :
                <a onClick={() => CustomGateManager.showCustomGates()}>Mostrar portas customizadas</a>
              : undefined}
          </div>
        </div>
        <div className="navbar--button-with-subnav">
          <div className="navbar--button">
            <div className="navbar--arrow-icon">▼</div> Exemplos
          </div>
          <div className="subnav--content">{this.getExamplesNav()}</div>
        </div>
        <input type='file' id='file' ref={(ref) => this.fileUploader = ref} onChange={this.openFileProccess} style={{display: 'none'}}/>
      </div>
    )
  }
}