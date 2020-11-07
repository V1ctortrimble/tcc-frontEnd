import React, { Component } from "react";
import { Col, ControlLabel, Grid, Row } from "react-bootstrap";
import InputMask from "react-input-mask";
import { notification, Button, Checkbox } from "antd";
import 'antd/dist/antd.css';
import Card from "components/Card/Card";
import api from '../../services/api';
import NotificationSystem from "react-notification-system";
import { style } from "variables/Variables.jsx";
import { cpf } from "cpf-cnpj-validator";

class PassengerInsert extends Component {

  state = {
    loadingAvancar: false,
    idPassageiro: null,
    cpf: "",
    nome: "",
    sobreNome: "",
    rg: "",
    dataNasc: "",
    celular: "",
    cellWhats: true,
    telefone: "",
    email: "",
    desativar: false,
  };

  dataPassenger = {};

  async componentDidMount() {
    if (this.props.match.params.cpf != null) {
      const passageiro = await api.get(`api/persons/individual/`, {
        params: {
          cpf: this.props.match.params.cpf
        }
      })
      this.popularCamposPassageiroEdit(passageiro);
    }
  }

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
        this.setState({ cpf: "" });
      }
    }
  }

  savePassenger = async (e) => {
    e.preventDefault();
    this.setState({ loadingAvancar: true })

    if (this.state.idPassageiro !== null) {
      try {
        this.popularCamposPassageiroPost();
        await api.put('api/persons/individual/', this.dataPassenger, {
          params: {
            cpf: this.state.cpf
          },
        });
        notification.success({
          message: `Passageiro(a) atualizado com sucesso`,
        });
        this.limpaCamposPassageiro();
        this.props.history.push(`/admin/Passenger/Passengerlist.jsx`)
      } catch (error) {
        if (error.response) {
          notification.error({
            message: 'Não foi possível atualizar passageiro',
            description: `Motivo: ${error.response.data.message}`
          });
        }
      } finally {
        this.setState({ loadingAvancar: false })
      }
    } else {
      try {
        this.popularCamposPassageiroPost();
        await api.post('api/persons/individual', this.dataPassenger);
        notification.success({
          message: `Passageiro(a) cadastrado com sucesso`,
        });
        this.limpaCamposPassageiro();
      }
      catch (error) {
        if (error.response) {
          notification.error({
            message: 'Não foi possível salvar passageiro',
            description: `Motivo: ${error.response.data.message}`
          });
        }
      } finally {
        this.setState({ loadingAvancar: false })
      }
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

  popularCamposPassageiroEdit(passageiro) {
    this.setState({
      idPassageiro: passageiro.data.id_person,
      cpf: passageiro.data.individual.cpf,
      nome: passageiro.data.individual.name_individual,
      sobreNome: passageiro.data.individual.last_name,
      rg: passageiro.data.individual.rg,
      dataNasc: passageiro.data.individual.birth_date,
      celular: passageiro.data.contacts[0].cell_phone,
      cellWhats: passageiro.data.contacts[0].cell_whats,
      telefone: passageiro.data.contacts[0].phone,
      email: passageiro.data.contacts[0].email,
      desativar: true,
    })
  }

  limpaCamposPassageiro() {
    this.setState({
      idPassageiro: null,
      cpf: "",
      nome: "",
      sobreNome: "",
      rg: "",
      dataNasc: "",
      telefone: "",
      celular: "",
      cellWhats: true,
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

  onChangeCheckbox = (event) => {
    this.setState({ cellWhats: event.target.checked });
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
                        placeholder="999.999.999-99" required onChange={this.onChange} disabled={this.state.desativar} />
                    </div>
                    <div className="col-md-3">
                      <ControlLabel>Nome</ControlLabel>
                      <input name="nome" value={this.state.nome}
                        type="text" className="form-control" maxLength='50'
                        placeholder="José" required onChange={this.onChange} />
                    </div>
                    <div className="col-md-3">
                      <ControlLabel>Sobrenome</ControlLabel>
                      <input name="sobreNome" value={this.state.sobreNome}
                        type="text" className="form-control" maxLength='100'
                        placeholder="da Silva" required onChange={this.onChange} />
                    </div>
                    <div className="col-md-3">
                      <ControlLabel>RG</ControlLabel>
                      <input name="rg" value={this.state.rg}
                        type="text" className="form-control" maxLength='12'
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
                    <div className="col-md-1">
                      <ControlLabel align="center">Mensagens por Whatsapp?</ControlLabel>
                      <div align="center" style={{ marginTop: '5px', marginBottom: '5px' }}>
                        <Checkbox name="cellWhats" checked={this.state.cellWhats}
                          onChange={this.onChangeCheckbox} />
                      </div>

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
                        type="email" className="form-control" maxLength='80'
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
