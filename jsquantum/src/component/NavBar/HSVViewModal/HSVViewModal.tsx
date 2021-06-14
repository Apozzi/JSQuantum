import React from 'react';
import Modal from 'react-modal';
import { Subject } from 'rxjs';
import './HSVViewModal.css';

export default class HSVViewModal extends React.Component<any> {

  static openModalSubject = new Subject();

  customStyles = {
    content : {
      height: '600px',
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
    HSVViewModal.openModalSubject.subscribe(() => {
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
            Visualização HSV View
          </div>
          <div className="modal-close-icon" onClick={() => this.handleCloseModal(null)}>
            X
          </div>
        </div>
        </Modal>
      </div>
    )
  }
}