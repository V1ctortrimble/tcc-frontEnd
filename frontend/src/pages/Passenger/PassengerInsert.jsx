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
import cep from 'cep-promise';

class PassengerInsert extends Component {

  state = {
    desabilitarEndBairro: true,
    desabilitarCamposEndereco: true,
    loadingCep: false,
    loadingAvancar: false,
    idPassageiro: null,
    idContato: null,
    idEndereco: null,
    cpf: "",
    nome: "",
    sobreNome: "",
    rg: "",
    dataNasc: "",
    celular: "",
    cellWhats: true,
    telefone: "",
    email: "",
    cep: null,
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
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

  popularCamposConsultaCep = (data) => {
    this.setState({
      endereco: data.street,
      bairro: data.neighborhood,
      cidade: data.city,
      estado: data.state
    })
  };

  enderecoCep = async () => {
    const cepIn = this.removeCaractEspecial(this.state.cep);
    this.setState({
      desabilitarCamposEndereco: true,
      desabilitarEndBairro: true
    })
    if (cepIn.length !== 8) {
      notification.error({
        message: 'CEP informado é inválido.',
        description: 'Favor inserir um Cep, com 8 números'
      });
      return;
    }
    this.setState({ loadingCep: true });
    try {
      const enderecoCompleto = await cep(cepIn);

      if (enderecoCompleto) {
        this.popularCamposConsultaCep(enderecoCompleto);
      }
      if (!enderecoCompleto.street) {
        notification.warning({
          message: 'Cep consultado com avisos',
          description: 'Cep geral, favor inserir Endereço e Bairro'
        });
        this.setState({ desabilitarEndBairro: false })
      }
    } catch (error) {
      if (error.response) {
        notification.error({
          message: 'Falha ao consultar CEP',
          description: 'Insira o endereço manualmente'
        });
        this.setState({
          desabilitarCamposEndereco: false,
          desabilitarEndBairro: false
        });
      }
    } finally {
      this.setState({ loadingCep: false })
    }
  };

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
      adresses: [{
        additional: this.state.complemento,
        adress: this.state.endereco,
        adress_number: this.state.numero,
        city: this.state.cidade,
        neighborhood: this.state.bairro,
        state: this.state.estado,
        zip_code: this.state.cep,
        id_adress: this.state.idEndereco
      }],
      contacts: [
        {
          cell_phone: this.removeCaractEspecial(this.state.celular),
          email: this.state.email,
          phone: this.removeCaractEspecial(this.state.telefone),
          cell_whats: this.state.cellWhats,
          id_contact: this.state.idContato
        }
      ],
      individual: {
        birth_date: this.state.dataNasc,
        cpf: this.removeCaractEspecial(this.state.cpf),
        last_name: this.state.sobreNome,
        name_individual: this.state.nome,
        rg: this.state.rg,
        id_individual: this.state.idPassageiro
      }
    }
  };

  popularCamposPassageiroEdit(passageiro) {
    if (passageiro.data.adresses[0]) {
      this.setState({
        cep: passageiro.data.adresses[0].zip_code,
        endereco: passageiro.data.adresses[0].adress,
        numero: passageiro.data.adresses[0].adress_number,
        complemento: passageiro.data.adresses[0].additional,
        bairro: passageiro.data.adresses[0].neighborhood,
        cidade: passageiro.data.adresses[0].city,
        estado: passageiro.data.adresses[0].state,
      })
    }
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
      idContato: null,
      idEndereco: null,
      cpf: "",
      nome: "",
      sobreNome: "",
      rg: "",
      dataNasc: "",
      telefone: "",
      celular: "",
      cellWhats: true,
      email: "",
      cep: "",
      endereco: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
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
                  <Row>
                    <div className="col-md-3">
                      <ControlLabel>CEP</ControlLabel>
                      <InputMask name="cep" className="form-control" value={this.state.cep}
                        placeholder="00000-000" type="text" mask="99999-999"
                        required onChange={this.onChange} />
                    </div>
                    <div className="col-md-2" style={{ marginTop: '38px', marginBottom: '38px' }}>
                      <Button style={{ height: '35%' }} onClick={this.enderecoCep} size="middle"
                        type="primary" loading={this.state.loadingCep}>Consultar Cep</Button>
                    </div>
                  </Row>
                  <Row>
                    <div className="col-md-6">
                      <ControlLabel>Endereço</ControlLabel>
                      <input name="endereco" value={this.state.endereco}
                        type="text" className="form-control"
                        placeholder="Rua xxxxxxxxxxx" onChange={this.onChange}
                        disabled={this.state.desabilitarEndBairro} />
                    </div>
                    <div className="col-md-3">
                      <ControlLabel>Número</ControlLabel>
                      <input name="numero" value={this.state.numero}
                        type="text" className="form-control"
                        placeholder="123" onChange={this.onChange} />
                    </div>
                    <div className="col-md-3">
                      <ControlLabel>Complemento</ControlLabel>
                      <input name="complemento" value={this.state.complemento}
                        type="text" className="form-control"
                        placeholder="Bloco A" onChange={this.onChange} />
                    </div>
                  </Row>
                  <Row>
                    <div className="col-md-4">
                      <ControlLabel>Bairro</ControlLabel>
                      <input name="bairro" value={this.state.bairro}
                        type="text" className="form-control"
                        placeholder="Jardim Aurora" onChange={this.onChange}
                        disabled={this.state.desabilitarEndBairro} />
                    </div>
                    <div className="col-md-4">
                      <ControlLabel>Cidade</ControlLabel>
                      <input name="cidade" value={this.state.cidade}
                        type="text" className="form-control"
                        placeholder="Londrina" onChange={this.onChange}
                        disabled={this.state.desabilitarCamposEndereco} />
                    </div>
                    <div className="col-md-4">
                      <ControlLabel>Estado</ControlLabel>
                      <input name="estado" value={this.state.estado}
                        type="text" className="form-control"
                        placeholder="Paraná" onChange={this.onChange}
                        disabled={this.state.desabilitarCamposEndereco} />
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
