import React from 'react';
import Modal from 'react-modal';
import { Subject } from 'rxjs';
import BlockSphere from '../BlochSphere/BlochSphere';
import './BlochSphereViewModal.css';

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
    label: ''
  };

  static openModal(obj: any) {
    this.openSubject.next(obj);
  }


  componentDidMount() {
    Modal.setAppElement('#app');
    BlochSphereViewModal.openSubject.subscribe((obj: any) => {
      this.setState({
        showModal: true,
        label: obj?.label
      });
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
            Visualização esfera de Bloch do Qubit
          </div>
          <div className="modal-close-icon" onClick={() => this.handleCloseModal(null)}>
            X
          </div>
        </div>
        <div className="bloch-sphere-view-modal--tip">Arraste para rotacionar a esfera.</div>
        <div className="bloch-sphere-view-modal--qubit-title">Qubit |{this.state.label}⟩</div>
        <BlockSphere isActivated={this.state.showModal} height="70%" width="70%" controls={true}></BlockSphere>
        </Modal>
      </div>
    )
  }
}