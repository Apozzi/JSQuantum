import React from 'react';
import Modal from 'react-modal';
import { Subject } from 'rxjs';
import BlockSphere from '../../components/BlochSphere/BlochSphere';
import SimulatorUtils from '../../utils/SimulatorUtils';
import './BlochSphereViewModal.css';

const math = require('mathjs');

export default class BlochSphereViewModal extends React.Component<any> {
  static openSubject = new Subject();

  customStyles = {
    content : {
      height: '80%',
      background: '#373b44',
      border: 'none',
      padding: "0px"
    }
  };

  state = {
    showModal: false,
    label: '',
    value: 0,
    index: 0
  };

  static openModal(obj: any) {
    this.openSubject.next(obj);
  }


  componentDidMount() {
    Modal.setAppElement('#app');
    BlochSphereViewModal.openSubject.subscribe((obj: any) => {
      this.setState({
        showModal: true,
        label: obj?.label,
        value: obj?.value,
        index: obj?.index
      });
    });
  }

  handleCloseModal (value: any) {
    this.setState({ showModal: false });
  }

  getRealQubitCoordenate() {
    return math.pow(math.re(this.state.value),2);
  }

  getImaginaryQubitCoordenate() {
    return math.pow(math.im(this.state.value),2);
  }

  getPercentageOfQubitSphere() {
    return SimulatorUtils.getPercentageLabel(this.state.index, math.pow(this.state.value, 2));
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
              Visualização esfera de Bloch do Qubit
            </div>
            <div className="modal-close-icon" onClick={() => this.handleCloseModal(null)}>
              X
            </div>
          </div>
          <div className="bloch-sphere-view-modal--tip">Arraste para rotacionar a esfera.</div>
          <div className="bloch-sphere-view-modal--qubit-title">Qubit |{this.state.label}⟩</div>
          <BlockSphere isActivated={this.state.showModal} realValue={this.getRealQubitCoordenate()} imaginaryValue={this.getImaginaryQubitCoordenate()} height="70%" width="70%" controls={true}></BlockSphere>
          <div className="bloch-sphere-view-modal--description">
            <div>Valor: {SimulatorUtils.getLabelRealAndImaginaryAValues(this.state.value)}</div>
            <div>Porcentagem: {this.getPercentageOfQubitSphere()}</div>
          </div>
        </Modal>
      </div>
    )
  }
}