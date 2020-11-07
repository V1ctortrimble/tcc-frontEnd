import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  ControlLabel
} from "react-bootstrap";

import api from '../../services/api';
import InputMask from "react-input-mask";
import { notification, Button, Checkbox, Select } from "antd";
import { Card } from "components/Card/Card.jsx";
import { cpf } from "cpf-cnpj-validator";
import { style } from "variables/Variables.jsx";
import NotificationSystem from "react-notification-system";


const { Option } = Select;

class UserProfile extends Component {

  state = {
    current: 0,
    statusInitial: "process",
    statusOthers: "wait",
    idUsuario: null,
    email:"",
    senha:"",
    confirmarsenha:"",
    nome:"",
    sobrenome:"",
    dataNasc:"",
    rg:"",
    cpf:"",
    telefonefixo:"",
    celular:"",
  };

  dataUser = {};

  limpaCamposUsuario() {
    this.setState({
      email:"",
      senha:"",
      confirmarsenha:"",
      nome:"",
      sobrenome:"",
      rg:"",
      cpf:"",
      telefonefixo:"",
      celular:"",
      endereco:"",
      numero:"",
    })
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
          message: `CPF ${cpfValidar} é inválido,Por favor informar um CPF válido`,
        });
        this.setState({ cpf: "" });
      }
    }
  }

  saveUser = async (e) => {
    e.preventDefault();
    this.setState({ loadingAvancar: true })

    if (this.state.idUsuario !== null) {
      console.log("Passou Por aqui !")
      try {
        this.popularCamposUsuarioPost();
        await api.put('/api/user', this.dataUser, {
          params: {
            nome: this.state.email
          },
        });
        notification.success({
          message: `Usuario(a) atualizado com sucesso`,
        });
        this.limpaCamposUsuario();
        this.props.history.push(`/admin/Passenger/Passengerlist.jsx`)
      } catch (error) {
        if (error.response) {
          notification.error({
            message: 'Não foi possível atualizar Usuario',
            description: `Motivo: ${error.response.data.message}`
          });
        }
      } finally {
        this.setState({ loadingAvancar: false })
      }
    } else {
      try {
        this.popularCamposUsuarioPost();
        await api.post('/api/user', this.dataUser);
        notification.success({
          message: `Usuario(a) cadastrado com sucesso`,
        });
        this.limpaCamposUsuario();
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

  popularCamposUsuarioPost() {

    this.dataUser = {
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


  popularCamposUsuariosEdit(Usuario) {
    this.setState({
      idUsuario: Usuario.data.id_person,
      nome: Usuario.data.individual.name_individual,    
      cpf: Usuario.data.individual.cpf,
      sobreNome: Usuario.data.individual.last_name,
      rg: Usuario.data.individual.rg,
      dataNasc: Usuario.data.individual.birth_date,
      celular: Usuario.data.contacts[0].cell_phone,
      cellWhats: Usuario.data.contacts[0].cell_whats,
      telefone: Usuario.data.contacts[0].phone,
      email: Usuario.data.contacts[0].email,
      
    })
  }

  async componentDidMount() {
    if (this.props.match.params.email != null) {
      const Usuario = await api.get(`/api/user/`, {
        params: {
          email: this.props.match.params.email
        }
      })
      this.popularCamposUsuarioEdit(Usuario);
    }
  }

  onChangeCheckbox = (event) => {
    this.setState({ cellWhats: event.target.checked });
  }

  onChange = (event) => {
    const state = Object.assign({}, this.state);
    const field = event.target.name;
    state[field] = event.target.value;
    this.setState(state);
    console.log(state);
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
              <Col md={10}>
                <form name="formUsuario" onSubmit={this.saveUser}>
                  <Row>
                  <div className="col-md-4">
                      <ControlLabel>Email</ControlLabel>
                      <input name="email" value={this.state.email}
                        type="email" className="form-control"
                        placeholder="Exemplo@gmail.com" onChange={this.onChange} />
                    </div>
                    <div className="col-md-4">
                      <ControlLabel>Senha</ControlLabel>
                      <input name="senha" value={this.state.senha}
                        type="int" className="form-control"
                        placeholder="********" onChange={this.onChange} />
                    </div>
                    <div className="col-md-4">
                      <ControlLabel>Confirmar</ControlLabel>
                      <input name="ConfirmarSenha" value={this.state.confirmarsenha}
                        type="int" className="form-control"
                        placeholder="********" onChange={this.onChange} />
                    </div>
                    </Row>

                  <Row>
                  <div className="col-md-4">
                      <ControlLabel>Nome</ControlLabel>
                      <input name="nome" value={this.state.nome}
                        type="text" className="form-control"
                        placeholder="José" required onChange={this.onChange} />
                    </div>

                    <div className="col-md-4">
                      <ControlLabel>Sobrenome</ControlLabel>
                      <input name="sobreNome" value={this.state.sobreNome}
                        type="text" className="form-control"
                        placeholder="da Silva" required onChange={this.onChange} />
                    </div>
                    
                    
                    <div className="col-md-3">
                      <ControlLabel>Data Nascimento</ControlLabel>
                      <input name="dataNasc" value={this.state.dataNasc}
                        type="date" className="form-control"
                        placeholder="XX/XX/XXXX" required onChange={this.onChange} />
                    </div>
                    </Row>
                    <Row>
                    <div className="col-md-3">
                      <ControlLabel>RG</ControlLabel>
                      <input name="rg" value={this.state.rg}
                        type="text" className="form-control" maxLength='12'
                        placeholder="00000000" required onChange={this.onChange} />
                    </div>

                    <div className="col-md-3">
                      <ControlLabel>CPF</ControlLabel>
                      <InputMask mask="999.999.999-99" name="cpf" value={this.state.cpf}
                        type="text" className="form-control" onBlur={this.validaCpf(this.state.cpf)}
                        placeholder="999.999.999-99" required onChange={this.onChange} />
                    </div>

                  <div className="col-md-2">
                      <ControlLabel>Telefone</ControlLabel>
                      <InputMask mask="(99) 9999-9999" name="telefone" value={this.state.telefone}
                        type="text" className="form-control"
                        placeholder="(XX) XXXX-XXXX" onChange={this.onChange} />
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
                  </Row>
                  {/* <Row>
                  <div className="col-md-2">
                    <ControlLabel>Selecinar Empresa</ControlLabel>
                      <Row>
                        <Select
                          style={{ textAlign: 'left', marginTop: '15px', fontSize: '14px', width: '100px' }}
                            showSearch
                              name="status"
                                placeholder="Status"
                                  onChange={(value) => this.setState({ status: value })}
                                    optionFilterProp="children"
                                      filterOption={(input, option) =>
                                        option.children
                                          .toLowerCase()
                                          .indexOf(input.toLowerCase()) >= 0
                                            }
                                              defaultValue={true}
                                                >
                                                  {this.state.statusOpcoes.map((item) => (
                                                    <Option value={item.valor} key={item.valor}>
                                                      {item.descricao}
                                                          </Option>
                                                        ))}
                                                    </Select>
                                                </Row>
                                            </div>
                                            </Row>                                     */}
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

export default UserProfile;


