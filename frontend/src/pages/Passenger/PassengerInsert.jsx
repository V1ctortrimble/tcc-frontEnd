import React, { Component } from "react";
import { Col, ControlLabel, Grid, Row } from "react-bootstrap";
import InputMask from "react-input-mask";
import { notification, Button } from "antd";
import 'antd/dist/antd.css';
import Card from "components/Card/Card";
import api from '../../services/api';
import NotificationSystem from "react-notification-system";
import { style } from "variables/Variables.jsx";
import {cpf} from "cpf-cnpj-validator";

class PassengerInsert extends Component {

  state = {
    loadingAvancar: false,
    idPassageiro: "",
    cpf: "",
    nome: "",
    sobreNome: "",
    rg: "",
    dataNasc: "",
    celular: "",
    cellWhats: "",
    telefone: "",
    email: "",
  };

  dataPassenger = {};

  removeCaractEspecial(texto) {
    return texto.replace(/[^a-zA-Z0-9]/g, '');
  }

  validaCpf(cpfValidar) {
    const cpfLimpo = this.removeCaractEspecial(cpfValidar);
    if (cpfLimpo.length === 11) {
      if (cpf.isValid(cpfLimpo)) {
      } else {
        notification.error({
          message: `CPF ${cpfValidar} é inválido, favor informar um CPF válido`,
        });
        this.setState({cpf: ""});
      }
    }
  }

  savePassenger = async (e) => {
    e.preventDefault();
    this.setState({ loadingAvancar: true })

    try {
      this.popularCamposPassageiroPost();
      console.log(this.dataPassenger);
      const response = await api.post('api/persons/individual', this.dataPassenger);
      console.log(response);
      notification.success({
        message: `Passageiro(a) cadastrado com sucesso`,
      });
      this.limpaCamposPassageiro();
    }
    catch (error) {
      notification.error({
        message: 'Não foi possível salvar passageiro'
      });
      console.log(error)
    } finally {
      this.setState({ loadingAvancar: false })
    }
  }

  popularCamposPassageiroPost() {

    this.dataPassenger = {
      active: true,
      contacts: [
        {
          cell_phone: this.removeCaractEspecial(this.state.celular),
          email: this.state.email,
          phone: this.removeCaractEspecial(this.state.telefone),
          cell_whats: this.state.cellWhats
        }
      ],
      individual: {
        birth_date: this.state.dataNasc,
        cpf: this.removeCaractEspecial(this.state.cpf),
        last_name: this.state.sobreNome,
        name_individual: this.state.nome,
        rg: this.state.rg
      }
    }
  };

  limpaCamposPassageiro() {
    this.setState({
      idPassageiro: "",
      cpf: "",
      nome: "",
      sobreNome: "",
      rg: "",
      dataNasc: "",
      telefone: "",
      celular: "",
      cellWhats: "",
      email: "",
    })
  }

  toBackList = () => {
    this.props.history.push("/admin/Passenger/PassengerList.jsx")
  }

  onChange = (event) => {
    const state = Object.assign({}, this.state);
    const field = event.target.name;
    state[field] = event.target.value;
    this.setState(state);
  }

  render() {

    return (

      <div className="content">
        <NotificationSystem ref="notificationSystem" style={style} />
        <Card content={
          <Grid fluid>
            <Row>
            </Row>
            <p></p>
              <Row>
                <Col md={12}>
                  <form name="formPassageiro" onSubmit={this.savePassenger}>
                    <Row>
                      <div className="col-md-3">
                        <ControlLabel>CPF</ControlLabel>
                        <InputMask mask="999.999.999-99" name="cpf" value={this.state.cpf}
                          type="text" className="form-control" onBlur={this.validaCpf(this.state.cpf)}
                          placeholder="999.999.999-99" required onChange={this.onChange} />
                      </div>
                      <div className="col-md-3">
                        <ControlLabel>Nome</ControlLabel>
                        <input name="nome" value={this.state.nome}
                          type="text" className="form-control"
                          placeholder="José" required onChange={this.onChange} />
                      </div>
                      <div className="col-md-3">
                        <ControlLabel>Sobrenome</ControlLabel>
                        <input name="sobreNome" value={this.state.sobreNome}
                          type="text" className="form-control"
                          placeholder="da Silva" required onChange={this.onChange} />
                      </div>
                      <div className="col-md-3">
                        <ControlLabel>RG</ControlLabel>
                        <input name="rg" value={this.state.rg}
                          type="text" className="form-control"
                          placeholder="00000000" required onChange={this.onChange} />
                      </div>
                    </Row>
                    <Row>
                      <div className="col-md-2">
                        <ControlLabel>Data Nascimento</ControlLabel>
                        <input name="dataNasc" value={this.state.dataNasc}
                          type="date" className="form-control"
                          placeholder="XX/XX/XXXX" required onChange={this.onChange} />
                      </div>
                      <div className="col-md-2">
                        <ControlLabel>Celular</ControlLabel>
                        <InputMask mask="(99) 99999-9999" name="celular" value={this.state.celular}
                          type="text" className="form-control"
                          placeholder="(XX) XXXXX-XXXX" required onChange={this.onChange} />
                      </div>
                      <div className="col-md-2">
                        <ControlLabel>Telefone</ControlLabel>
                        <InputMask mask="(99) 9999-9999" name="telefone" value={this.state.telefone}
                          type="text" className="form-control"
                          placeholder="(XX) XXXX-XXXX" onChange={this.onChange} />
                      </div>
                      <div className="col-md-3">
                        <ControlLabel>Email</ControlLabel>
                        <input name="email" value={this.state.email}
                          type="email" className="form-control"
                          placeholder="xxxxxx@xxxxx.com" onChange={this.onChange} />
                      </div>
                    </Row>
                
                  <div className="ant-row ant-row-end">
                    <div className="ant-col">
                      <Button type="info" size="middle" onClick={this.toBackList}>
                        Voltar
                    </Button>
                    </div>
                    <div className="ant-col">
                      <Button type="primary" size="middle" htmlType="submit" loading={this.state.loadingAvancar}>
                        Salvar
                    </Button>
                    </div>
                  </div>
                  </form>
                </Col>
              </Row>
          </Grid>
        } />

      </div>
    )
  }
}
export default PassengerInsert;
