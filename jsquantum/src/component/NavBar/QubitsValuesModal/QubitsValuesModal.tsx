import React from 'react';
import Modal from 'react-modal';
import { Subject } from 'rxjs';
import SimulatorUtils from '../../../processing/SimulatorUtils';
import QuantumSchematicsManager from '../../QuantumSchematics/QuantumSchematicsManager';
import './QubitsValuesModal.css';

export default class QubitsValuesModal extends React.Component<any> {

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
    QubitsValuesModal.openModalSubject.subscribe(() => {
      this.setState({ showModal: true });
    });
  }

  handleCloseModal (value: any) {
    this.setState({ showModal: false });
  }

  render() {
    return (
      <div>
        <Modal
           isOpen={this.state.showModal}
           contentLabel="Project"
           style={this.customStyles}
           onRequestClose={() => this.handleCloseModal(null)}
           overlayClassName="overlay"
        >
        <div className="modal-header">
          <div className="modal-title">
            Visualização de estados dos Qubits
          </div>
          <div className="modal-close-icon" onClick={() => this.handleCloseModal(null)}>
            X
          </div>
        </div>
        <div className="modal-content">
          {SimulatorUtils.combinations(QuantumSchematicsManager.getSize()).map((label, i) =>
              <div className="column--qubit" key={i}>
                <div className="column-content--qubit">
                  |{label}⟩
                </div>
                <div className="column-content--qubit column-content-close-box--qubit">
                  0.00 + 1.00i
                </div>
                <div className="column-content-end--qubit">
                  100%
                </div>
              </div>
          )}
        </div>
        </Modal>
      </div>
    )
  }
}