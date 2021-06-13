import React from 'react';
import Modal from 'react-modal';
import { Subject } from 'rxjs';
import QuantumSchematicsManager from '../../QuantumSchematics/QuantumSchematicsManager';
import SimulatorUtils from '../../../utils/SimulatorUtils';
import './QubitsValuesModal.css';

const math = require('mathjs');

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

  getLabelRealAndImaginaryByIndex(index: number) {
    const numberInComplexObj = this.getComplexNumberAtIndex(index);
    return SimulatorUtils.getLabelRealAndImaginaryAValues(numberInComplexObj);
  }

  getQubitsPercentageLabel(index: number) {
    const numberInComplexObj = math.abs(math.pow(this.getComplexNumberAtIndex(index), 2));
    return SimulatorUtils.getPercentageLabel(index, numberInComplexObj);
  }

  private getComplexNumberAtIndex(index: number) {
    const output = QuantumSchematicsManager.getOutput();
    const numberAtPos = output[index];
    return math.complex(numberAtPos == undefined ? 0 : numberAtPos);
  }

  componentWillUnmount() {
    QubitsValuesModal.openModalSubject.unsubscribe();
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
          {SimulatorUtils.binaryCombinationsString(QuantumSchematicsManager.getSize()).map((label: string, i: number) =>
              <div className="column--qubit" key={i}>
                <div className="column-content--qubit">
                  |{label}⟩
                </div>
                <div className="column-content--qubit column-content-close-box--qubit">
                  {this.getLabelRealAndImaginaryByIndex(i)}
                </div>
                <div className="column-content-end--qubit">
                  {this.getQubitsPercentageLabel(i)}
                </div>
              </div>
          )}
        </div>
        </Modal>
      </div>
    )
  }
}