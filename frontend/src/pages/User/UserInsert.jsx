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



const { Option } = Select;

class UserProfile extends Component {

  state = {
    active: true,
    loading: false,
    idUsuario: null,
    email: "",
    senha: "",
    confirmarSenha: "",
    nome: "",
    sobrenome: "",
    dataNasc: "",
    rg: "",
    cpf: "",
    telefone: "",
    celular: "",
    admin: false,
    empresaSistema: {
      cnpj: "",
      idEmpresa: null,
    },
    empresas: [
      {
        cnpjEmpresa: "",
        nomeFantasia: "",
    }
  ],
  };

  dataUser = {};

  limpaCamposUsuario() {
    this.setState({
      idUsuario: null,
      email: "",
      senha: "",
      confirmarSenha: "",
      nome: "",
      sobrenome: "",
      dataNasc: "",
      rg: "",
      cpf: "",
      telefone: "",
      celular: "",
      admin: false,
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
    if (this.state.senha !== this.state.confirmarSenha) {
      notification.warning({
        message: 'Favor verificar',
        description: 'Senhas digitadas não conferem',
      })
    } else {
      this.setState({ loading: true })
      if (this.state.idUsuario !== null) {
        try {
          this.popularCamposUsuarioPost();
          await api.put('/api/user', this.dataUser, {
            params: {
              username: this.state.email
            },
          });
          notification.success({
            message: `Usuario(a) atualizado com sucesso`,
          });
          this.limpaCamposUsuario();
          this.props.history.push(`/admin/User/Userlist.jsx`)
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
  }
  popularCamposUsuarioPost() {
    this.dataUser = {
      admin: this.state.admin,
      company_system: {
        cnpj: this.state.empresaSistema.cnpj,
        id_company_system: this.state.empresaSistema.idEmpresa,
      },
      contacts: [
        {
          cell_phone: this.removeCaractEspecial(this.state.celular),
          email: this.state.email,
          phone: this.removeCaractEspecial(this.state.telefone),
          cell_whats: false
        }
      ],
      individual: {
        active: this.state.active,
        birth_date: this.state.dataNasc,
        cpf: this.removeCaractEspecial(this.state.cpf),
        id_individual: this.state.idUsuario,
        last_name: this.state.sobreNome,
        name_individual: this.state.nome,
        rg: this.state.rg
      },
      password: this.state.senha,
      repeat_password: this.state.confirmarSenha,
      username: this.state.email,
    }
  };


  popularCamposUsuarioEdit(usuario) {
    this.setState({
      active: usuario.data.individual.active,
      idUsuario: usuario.data.individual.id_individual,
      nome: usuario.data.individual.name_individual,
      cpf: usuario.data.individual.cpf,
      sobreNome: usuario.data.individual.last_name,
      rg: usuario.data.individual.rg,
      dataNasc: usuario.data.individual.birth_date,
      celular: usuario.data.contacts[0].cell_phone,
      telefone: usuario.data.contacts[0].phone,
      email: usuario.data.username,
      admin: usuario.data.admin,
      empresaSistema: {
        cnpj: usuario.data.company_system.cnpj,
        idEmpresa: usuario.data.company_system.id_company_system,
      },
    })
  }

  popularEmpresas(empresas){
    let emp =[]
    empresas.data.content.forEach((item, index) => {
      emp.push({
        cnpjEmpresa: item.cnpj,
        nomeFantasia: item.fantasy_name,
      })
    }); 
    this.setState({
      empresas: emp,
    })
  }

  async componentDidMount() {
    if (this.props.match.params.username != null) {
      const usuario = await api.get(`/api/user/`, {
        params: {
          username: this.props.match.params.username
        }
      });
      this.popularCamposUsuarioEdit(usuario);
    }
    const empresas = await api.get('/api/persons/company/filter');
    this.popularEmpresas(empresas);
  }

  onChangeCheckbox = (event) => {
    this.setState({ admin: event.target.checked });
  }

  onChange = (event) => {
    const state = Object.assign({}, this.state);
    const field = event.target.name;
    state[field] = event.target.value;
    this.setState(state);
    console.log(state);
  }

  toBackList = () => {
    this.props.history.push("/admin/User/UserList.jsx")
  }

  render() {

    return (
      <div className="content">
        <Card content={
          <Grid fluid>
            <Row>
            </Row>
            <p></p>
            <Row>
              <Col md={12}>
                <form name="formUsuario" onSubmit={this.saveUser}>
                  <Row>
                  <div className="col-md-2">
                      <ControlLabel>Selecionar Empresa</ControlLabel>
                      <Select
                        style={{ textAlign: 'left', marginTop: '15px', fontSize: '14px', width: '200px' }}
                        showSearch
                        name="empresa"
                        placeholder="Empresa"
                        onChange={(value) => this.setState({ empresaSistema: {
                          cnpj: value,
                        }})}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {this.state.empresas.map((item) => (
                          <Option value={item.cnpjEmpresa} key={item.cnpjEmpresa}>
                            {item.nomeFantasia}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </Row>
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
                        type="text" className="form-control" maxLength='12'
                        placeholder="00000000" required onChange={this.onChange} />
                    </div>
                  </Row>
                  <Row>
                    <div className="col-md-3">
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
                  </Row>
                  <Row>
                    <div className="col-md-3">
                      <ControlLabel>Username</ControlLabel>
                      <input name="email" value={this.state.email}
                        type="email" className="form-control" required
                        placeholder="Exemplo@gmail.com" onChange={this.onChange} />
                    </div>
                    <div className="col-md-3">
                      <ControlLabel>Senha</ControlLabel>
                      <input name="senha" value={this.state.senha}
                        type="password" className="form-control" required
                        placeholder="senha" onChange={this.onChange}
                        pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$"
                        title="Digite uma senha com letras (Maiuscula e Minuscula), números e caracteres especiais (#@$!), mínimo de 8 caracteres." />
                    </div>
                    <div className="col-md-3">
                      <ControlLabel>Confirmar</ControlLabel>
                      <input name="ConfirmarSenha" value={this.state.confirmarSenha}
                        type="password" className="form-control" required
                        placeholder="Confirme a senha" onChange={this.onChange}
                        pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$"
                        title="Digite uma senha com letras (Maiuscula e Minuscula), números e caracteres especiais (#@$!), mínimo de 8 caracteres." />
                    </div>
                    
                    <div className="col-md-1">
                      <ControlLabel align="center">Admin?</ControlLabel>
                      <div align="left" style={{ marginTop: '20px', marginBottom: '10px', marginLeft: '12px' }}>
                        <Checkbox name="admin" checked={this.state.admin}
                          onChange={this.onChangeCheckbox} />
                      </div>
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

export default UserProfile;


