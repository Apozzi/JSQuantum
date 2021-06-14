import React from 'react';
import Modal from 'react-modal';
import { Subject } from 'rxjs';
import CustomGate from '../CustomGateManager/CustomGate';
import CustomGateManager from '../CustomGateManager/CustomGateManager';
import './CustomGatesCreationModal.css';
import { ToastContainer, toast } from 'react-toastify';

const math = require('mathjs');

export default class CustomGatesCreationModal extends React.Component<any> {

  static openModalSubject = new Subject();

  customStyles = {
    content : {
      height: '550px',
      background: '#373b44',
      border: 'none',
      padding: "0px",
      width: '600px',
      marginLeft: 'calc(50vw - 332px)'
    }
  };

  state = {
    showModal: false,
    matrixAValue: "",
    matrixBValue: "",
    matrixCValue: "",
    matrixDValue: "",
    nameCustomGate: ""
  };

  static openModal() {
    this.openModalSubject.next();
  }

  componentDidMount() {
    Modal.setAppElement('#app');
    CustomGatesCreationModal.openModalSubject.subscribe(() => {
      this.setState({ showModal: true });
    });
  }

  handleCloseModal (value: any) {
    this.setState({ showModal: false });
  }

  addCustomGate() {
    if (this.hasSomeInputEmpty()) {
      const error = "Necessário preencher todos os campos para criar a porta customizada.";
      toast.error(error);
      return;
    };
    CustomGateManager.addCustomGate(
      new CustomGate(this.state.nameCustomGate, [
        [
          math.complex(this.state.matrixAValue),
          math.complex(this.state.matrixBValue)
        ],
        [
          math.complex(this.state.matrixCValue),
          math.complex(this.state.matrixDValue)
        ]
      ])
    );
    this.handleCloseModal(null);
  }

  handleInputChange = (event: any) => {
    const target = event.target;
    this.setState({
      [target.name]: target.value
    });
  }

  private hasSomeInputEmpty() {
    return this.state.nameCustomGate === "" &&
      this.state.matrixAValue === "" &&
      this.state.matrixBValue === "" &&
      this.state.matrixCValue === "" &&
      this.state.matrixDValue === "";
  }
  
  componentWillUnmount() {
    CustomGatesCreationModal.openModalSubject.unsubscribe();
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
            Criação de portas lógicas customizadas
          </div>
          <div className="modal-close-icon" onClick={() => this.handleCloseModal(null)}>
            X
          </div>
        </div>
        <div className="modal-content">
          <div className="custom-gates-creation-modal--padding-content">
            <div className="custom-gates-creation-modal--text-center">Adicione os valores da matrix de transformação da porta lógica.</div>
            <div className="custom-gates-creation-modal--table-values">
              <div className="custom-gates-creation-modal--table-values-column">
                <input name="matrixAValue" className="input-project" value={this.state.matrixAValue} placeholder="U11" onChange={this.handleInputChange}></input>
                <input name="matrixBValue" className="input-project" value={this.state.matrixBValue} placeholder="U12" onChange={this.handleInputChange}></input>
              </div>
              <div className="custom-gates-creation-modal--table-values-column">
                <input name="matrixCValue" className="input-project" value={this.state.matrixCValue} placeholder="U21" onChange={this.handleInputChange}></input>
                <input name="matrixDValue" className="input-project" value={this.state.matrixDValue} placeholder="U22" onChange={this.handleInputChange}></input>
              </div>
            </div>
            <div className="custom-gates-creation-modal--observation">Você pode adicionar numeros complexos nas entradas.</div>
            <div className="custom-gates-creation-modal--add">
              <div className="custom-gates-creation-modal--text-center">
                <input name="nameCustomGate" className="input-project" value={this.state.nameCustomGate} placeholder="Adicione um nome" onChange={this.handleInputChange}></input>
              </div>

              <div className="custom-gates-creation-modal--text-center">
                <button className=" default-button" onClick={() => this.addCustomGate()}>Adicionar porta customizada</button>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer></ToastContainer>
        </Modal>
      </div>
    )
  }
}