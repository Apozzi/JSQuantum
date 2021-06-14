import React from 'react';
import Modal from 'react-modal';
import { Subject } from 'rxjs';
import BlockSphere from '../../BlochSphere/BlochSphere';
import SimulatorUtils from '../../../processing/SimulatorUtils';
import QuantumSchematicsManager from '../../QuantumSchematics/QuantumSchematicsManager';
import './BlochSpheresViewModal.css';
import BlochSphereViewModal from '../../BlochSphereViewModal/BlochSphereViewModal';

export default class BlochSpheresViewModal extends React.Component<any> {
  static openModalSubject = new Subject();

  customStyles = {
    content : {
      height: '80%',
      background: '#373b44',
      border: 'none',
      padding: "0px"
    }
  };

  state = {
    showModal: false
  };

  static openModal() {
    this.openModalSubject.next();
  }


  componentDidMount() {
    Modal.setAppElement('#app');
    BlochSpheresViewModal.openModalSubject.subscribe(() => {
      this.setState({ showModal: true });
    });
  }

  handleCloseModal (value: any) {
    this.setState({ showModal: false });
  }

  openDetailedVisualization(label: string) {
    this.handleCloseModal(null);
    BlochSphereViewModal.openModal({
      label
    });
  }


  render() {
    return (
      <div>
        <BlochSphereViewModal></BlochSphereViewModal>
        <Modal
           isOpen={this.state.showModal}
           contentLabel="Project"
           style={this.customStyles}
           onRequestClose={() => this.handleCloseModal(null)}
           overlayClassName="overlay"
        >
        <div className="modal-header">
          <div className="modal-title">
            Visualização através da esfera de Bloch
          </div>
          <div className="modal-close-icon" onClick={() => this.handleCloseModal(null)}>
            X
          </div>
        </div>
        {SimulatorUtils.combinations(QuantumSchematicsManager.getSize()).map((label, i) =>
              <div className="bloch-spheres-view-modal-content--qubit" key={i}>
                <div className="bloch-spheres-view-modal--qubit">
                  {i}
                </div>
                <div className="bloch-spheres-view-modal--qubit">
                  |{label}⟩
                </div>
                <button className="bloch-sphere-view-modal--button" onClick={() => this.openDetailedVisualization(label)}>Ver detalhes</button>
                <div className="bloch-spheres-view-modal--qubit bloch-spheres-view-modal-close-box--qubit">
                  <BlockSphere isActivated={this.state.showModal} height="150px" width="250px" controls={false}></BlockSphere>
                </div>
              </div>
          )}
        </Modal>
      </div>
    )
  }
}