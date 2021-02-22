import React from 'react';
import Modal from 'react-modal';
import { Subject } from 'rxjs';
import './NameChoiceModal.css';

export default class NameChoiceModal extends React.Component<any> {

  static modalResultSubject = new Subject();
  static openModalSubject = new Subject();

  customStyles = {
    content : {
      height: '111px',
      background: '#373b44',
      border: 'none'
    }
  };

  state = {
    showModal: false,
    projectName: ''
  };

  static openModal() : Subject<any> {
    this.openModalSubject.next();
    return this.modalResultSubject;
  }

  componentDidMount() {
    Modal.setAppElement('#app');
    NameChoiceModal.openModalSubject.subscribe(() => {
      this.setState({ showModal: true });
    });
  }

  handleCloseModal (value: any) {
    this.setState({ showModal: false });
    NameChoiceModal.modalResultSubject.next(value);
  }

  updateInput = (event: any) => {
    this.setState({projectName : event.target.value})
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
          <p className="title">Escolha o nome para o arquivo do projeto:</p>
          <input id="projectName" className="input-project" onChange={this.updateInput}></input>
          <button className="confirm-button button-margin" onClick={() => this.handleCloseModal(this.state.projectName)}>Exportar</button>
          <button className="default-button button-margin" onClick={() => this.handleCloseModal(null)}>Cancelar</button>
        </Modal>
      </div>
    )
  }
}