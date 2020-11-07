import React, { Component } from "react";
import { Col, ControlLabel, Grid, Row } from "react-bootstrap";
import InputMask from "react-input-mask";
import { Steps, Table, notification, Button } from "antd";
import 'antd/dist/antd.css';
import Card from "components/Card/Card";
import { EditFilled, DeleteFilled } from '@ant-design/icons';
import cep from 'cep-promise';
import api from '../../services/api';
import { cpf, cnpj } from "cpf-cnpj-validator";
import moment from 'moment';

const { Step } = Steps;

class SystemCompanyInsert extends Component {

  columns = [
    {
      title: 'CPF Sócio',
      width: 200,
      dataIndex: 'cpf',
      key: 'cpf',
      fixed: 'left',
    },
    {
      title: 'Nome Sócio',
      width: 200,
      dataIndex: 'namePartner',
      key: 'namePartner',
      fixed: 'left',
    },
    {
      title: 'Sobrenome Sócio',
      width: 200,
      dataIndex: 'sobreNomePartner',
      key: 'sobreNomePartner',
      fixed: 'left',
    },
    {
      title: 'Data Nasc',
      width: 200,
      dataIndex: 'dataNascPartner',
      key: 'dataNascPartner',
      fixed: 'left',
    },
    {
      title: 'Ações',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: () => <div> <a href="/admin"><Button type="primary" size="small"><EditFilled /></Button> </a>
        <a href="/admin"><Button type="primary" danger size="small"><DeleteFilled /></Button> </a>
      </div>
    },
  ];

  columnsBank = [
    {
      title: 'Banco',
      width: 50,
      dataIndex: 'bank',
      key: 'bank',
      fixed: 'left',
    },
    {
      title: 'Agência',
      width: 50,
      dataIndex: 'agencia',
      key: 'agencia',
      fixed: 'left',
    },
    {
      title: 'Conta',
      width: 50,
      dataIndex: 'conta',
      key: 'conta',
      fixed: 'left',
    },
    {
      title: 'Digito',
      width: 30,
      dataIndex: 'digito',
      key: 'digito',
      fixed: 'left',
    },
    {
      title: 'Operação',
      width: 30,
      dataIndex: 'operacao',
      key: 'operacao',
      fixed: 'left',
    },
    {
      title: 'Ações',
      key: 'operation',
      fixed: 'right',
      width: 50,
      render: () => <div> <a href="/admin"><Button type="primary" size="small"><EditFilled /></Button> </a>
        <a href="/admin"><Button type="primary" danger size="small"><DeleteFilled /></Button> </a>
      </div>
    },
  ];

  data = [
    {
      key: '1',
      cpf: '000.000.000-00',
      namePartner: 'José',
      sobreNomePartner: "Da Silva",
      dataNascPartner: "01/01/1900"
    },
  ];

  dataBank = [
    {
      key: '1',
      bank: 'Caixa',
      agencia: '0175',
      conta: '1425',
      digito: '3',
      operacao: '013',
    },
  ];

  state = {
    current: 0,
    loadingCep: false,
    loadingAvancar: false,
    desabilitarEndBairro: true,
    desabilitarCamposEndereco: true,
    desabilitarEndBairroSocio: true,
    desabilitarCamposEnderecoSocio: true,
    idEmpresaSistema: "",
    cnpj: "",
    razaoSocial: "",
    nomeFantasia: "",
    telefone: "",
    celular: "",
    email: "",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cpf: "",
    nome: "",
    sobreNome: "",
    rg: "",
    dataNascSocio: "",
    telefoneSocio: "",
    celularSocio: "",
    emailSocio: "",
    cepSocio: "",
    enderecoSocio: "",
    numeroSocio: "",
    complementoSocio: "",
    bairroSocio: "",
    cidadeSocio: "",
    estadoSocio: "",
    banco: "",
    agencia: "",
    conta: "",
    digito: "",
    operacao: "",
  };

  dataCompany = {};

  dataPartner = {};

  dataCompanySystem = {};

  dataCompanyPartner = {};

  dataBankDetails = {};

  async componentDidMount() {
    if (this.props.match.params.cnpj != null) {
      try {
        const empresaSistema = await api.get(`api/persons/individual/`, {
          params: {
            cnpj: this.props.match.params.cnpj
          }
        })
        this.popularCamposEmpresaSistemaEdit(empresaSistema);

      } catch (error) {
        if (error.response) {
          notification.error({
            message: `Não foi possível carregar os dados para edição`,
            description: `Motivo: ${error.response.data.message}`
          })
        }
      }
      try {
        const sociosEmpresa = await api.get(`api/companyPartner`, {
          params: {
            cnpj: this.props.match.params.cnpj
          }
        })
        this.popularTabelaSocios(sociosEmpresa);

      } catch (error) {
        if (error.response) {
          notification.error({
            message: `Não foi possível carregar os sócios`,
            //description: `Motivo: ${error.response.data.message}`
          })
        }
      }
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

  validaCnpj(cnpjValidar) {
    const cnpjLimpo = this.removeCaractEspecial(cnpjValidar);
    console.log(cnpjLimpo)
    if (cnpjLimpo.length === 14) {
      if (cnpj.isValid(cnpjLimpo)) {
      } else {
        notification.error({
          message: `CNPJ ${cnpjValidar} é inválido, favor informar um CNPJ válido`,
        });
        this.setState({ cnpj: "" });
        console.log(this.props)
      }
    }
  }

  saveCompany = async (e) => {

    e.preventDefault();
    this.setState({ loadingAvancar: true })

    try {
      this.popularCamposEmpresaPost();
      this.popularCamposEmpresaSistema();
      await api.post('api/persons/company', this.dataCompany);
      await api.post('api/companySystem', this.dataCompanySystem);
      notification.success({
        message: `Empresa do sistema cadastrado com sucesso`,
      });
      this.nextStep();
    }
    catch (error) {
      if (error.response) {
        notification.error({
          message: `Não foi possível Salvar Empresa`,
          description: `Motivo: ${error.response.data.message}`
        });
      }
    } finally {
      this.setState({ loadingAvancar: false })
    }
  };

  savePartner = async (e) => {
    e.preventDefault();
    this.setState({ loadingAvancar: true })

    try {
      this.popularCamposSocioPost();
      this.popularCamposSocioEmpresa();
      await api.post('api/persons/individual', this.dataPartner);
      await api.post('api/companyPartner', this.dataCompanyPartner);
      notification.success({
        message: `Sócio(a) adicionado com sucesso`,
      });
      this.limpaCamposSocio();
    }
    catch (error) {
      if (error.response) {
        notification.error({
          message: 'Não foi possível Salvar Sócio',
          description: `Motivo: ${error.response.data.message}`
        });
      }
    } finally {
      this.setState({ loadingAvancar: false })
    }
  }

  saveBankDetails = async (e) => {
    e.preventDefault();
    this.setState({ loadingAvancar: true });

    try {
      this.popularCamposBancoPost();
      await api.post('api/persons/bankDetails', this.dataBankDetails);
      notification.success({
        message: `Dados Bancários adicionado com sucesso`,
      });
      this.limpaCamposDadosBancarios();
    }
    catch (error) {
      if (error.response) {
        notification.error({
          message: `Não foi possível Salvar dados Bancários`,
          description: `Motivo: ${error.response.data.message}`
        });
      }
    } finally {
      this.setState({ loadingAvancar: false })
    }
  }

  enderecoEmpresaCep = async () => {
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
        this.popularCamposEmpresaConsultaCep(enderecoCompleto);
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

  enderecoSocioCep = async () => {
    const cepIn = this.removeCaractEspecial(this.state.cepSocio);
    this.setState({
      desabilitarCamposEnderecoSocio: true,
      desabilitarEndBairroSocio: true
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
        this.popularCamposSocioConsultaCep(enderecoCompleto);
      }
      if (!enderecoCompleto.street) {
        notification.warning({
          message: 'Cep consultado com avisos',
          description: 'Cep geral, favor inserir Endereço e Bairro'
        });
        this.setState({ desabilitarEndBairroSocio: false })
      }
    } catch (error) {
      if (error.response) {
        notification.error({
          message: 'Falha ao consultar CEP',
          description: 'Insira o endereço manualmente'
        });
        this.setState({
          desabilitarCamposEnderecoSocio: false,
          desabilitarEndBairroSocio: false
        });
      }
    } finally {
      this.setState({ loadingCep: false })
    }
  };

  popularCamposEmpresaPost() {
    this.dataCompany = {
      active: true,
      adresses: [
        {
          additional: this.state.complemento,
          adress: this.state.endereco,
          adress_number: this.state.numero,
          city: this.state.cidade,
          neighborhood: this.state.bairro,
          state: this.state.estado,
          zip_code: this.state.cep,
        }
      ],
      company: {
        active: true,
        cnpj: this.removeCaractEspecial(this.state.cnpj),
        fantasy_name: this.state.nomeFantasia,
        open_date: "",
        social_reason: this.state.razaoSocial,
        state_regis: "",
      },
      contacts: [
        {
          cell_phone: this.removeCaractEspecial(this.state.celular),
          email: this.state.email,
          phone: this.removeCaractEspecial(this.state.telefone),
        }
      ]
    };
  }

  popularCamposSocioPost() {

    this.dataPartner = {
      active: true,
      adresses: [
        {
          additional: this.state.complementoSocio,
          adress: this.state.enderecoSocio,
          adress_number: this.state.numeroSocio,
          city: this.state.cidadeSocio,
          neighborhood: this.state.bairroSocio,
          state: this.state.estadoSocio,
          zip_code: this.removeCaractEspecial(this.state.cepSocio),
        }
      ],
      contacts: [
        {
          cell_phone: this.removeCaractEspecial(this.state.celularSocio),
          email: this.state.emailSocio,
          phone: this.removeCaractEspecial(this.state.telefoneSocio)
        }
      ],
      individual: {
        birth_date: this.state.dataNascSocio,
        cpf: this.removeCaractEspecial(this.state.cpf),
        last_name: this.state.sobreNome,
        name_individual: this.state.nome,
        rg: this.state.rg
      }
    }
  };

  popularCamposBancoPost() {
    this.dataBankDetails = {
      bank_details:
      {
        active: true,
        bank: this.state.banco,
        agency: this.state.agencia,
        account: this.state.conta,
        digit: this.state.digito,
        operation: this.state.operacao,
      },
      document: this.removeCaractEspecial(this.state.cnpj),
    }
  }

  popularCamposEmpresaSistema() {
    this.dataCompanySystem = {
      cnpj: this.removeCaractEspecial(this.state.cnpj)
    }
  }


  popularCamposSocioEmpresa() {
    this.dataCompanyPartner = {
      cnpj: this.removeCaractEspecial(this.state.cnpj),
      cpf: this.removeCaractEspecial(this.state.cpf)
    }
  }

  popularCamposEmpresaSistemaEdit(empresaSistema) {
    this.setState({
      idEmpresaSistema: empresaSistema.data.id_com_system,
      cnpj: empresaSistema.data.cnpj,
    })
  }

  popularTabelaSocios(sociosEmpresa) {
    let x = [];
    sociosEmpresa.data.content.forEach((item, index) => {
      x.push({
        key: index,
        cpf: item.cpf,
        namePartner: item.name_individual,
        sobreNomePartner: item.last_name,
        dataNascPartner: moment(item.birth_date).format("DD/MM/YYYY")
      })
    });
    this.setState({ data: x })
  }

  popularTabelaDadosBancarios(dadosBancarios) {
    let y = [];
    dadosBancarios.data.content.forEach((item, index) => {
      y.push({
        key: index,
        bank: item.bank_details.bank,
        agencia: item.bank_details.agency,
        conta: item.bank_details.account,
        digito: item.bank_details.digit,
        operacao: item.bank_details.operation
      })
    });
    this.setState({ dataBank: y })
  }

  popularCamposEmpresaConsultaCep = (data) => {
    this.setState({
      endereco: data.street,
      bairro: data.neighborhood,
      cidade: data.city,
      estado: data.state
    })
  };

  popularCamposSocioConsultaCep = (data) => {
    this.setState({
      enderecoSocio: data.street,
      bairroSocio: data.neighborhood,
      cidadeSocio: data.city,
      estadoSocio: data.state
    })
  }

  limpaCamposSocio() {
    this.setState({
      cpf: "",
      nome: "",
      sobreNome: "",
      rg: "",
      dataNascSocio: "",
      telefoneSocio: "",
      celularSocio: "",
      emailSocio: "",
      cepSocio: "",
      enderecoSocio: "",
      numeroSocio: "",
      complementoSocio: "",
      bairroSocio: "",
      cidadeSocio: "",
      estadoSocio: ""
    })
  }

  limpaCamposDadosBancarios() {
    this.setState({
      banco: "",
      agencia: "",
      conta: "",
      digito: "",
      operacao: "",
    })
  }

  toBackList = () => {
    this.props.history.push("/admin/systemCompany/SystemCompanyList.jsx")
  }

  onChangeStep = current => {
    this.setState({ current });
  };

  nextStep = () => {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  previousStep = () => {
    this.setState({ current: this.state.current - 1 });
  }

  onChange = (event) => {
    const state = Object.assign({}, this.state);
    const field = event.target.name;
    state[field] = event.target.value;
    this.setState(state);
  }

  render() {
    const { current } = this.state;

    return (

      <div className="content">
        <Card content={
          <Grid fluid>
            <Row>
              <>
                <Steps
                  type="navigation"
                  current={current}
                  onChange={this.onChangeStep}
                  className="site-navigation-steps"
                >
                  <Step title="Dados Principais" >
                  </Step>
                  <Step title="Sócios" >
                  </Step>
                  <Step title="Informações Bancárias" />
                </Steps>
              </>
            </Row>
            <p></p>
            {(current === 0) ? (
              <Row>
                <Col md={12}>
                  <form name="formEmpresa" onSubmit={this.saveCompany}>
                    <Row>
                      <div className="col-md-2">
                        <ControlLabel>CNPJ</ControlLabel>
                        <InputMask mask="99.999.999/9999-99" name="cnpj" value={this.state.cnpj}
                          type="text" className="form-control" onBlur={this.validaCnpj(this.state.cnpj)}
                          placeholder="00.000.000/0000-00" required onChange={this.onChange} />
                      </div>
                      <div className="col-md-5">
                        <ControlLabel>Razão Social</ControlLabel>
                        <input name="razaoSocial" value={this.state.razaoSocial}
                          type="text" className="form-control"
                          placeholder="Razão Social" required onChange={this.onChange} />
                      </div>
                      <div className="col-md-5">
                        <ControlLabel>Nome Fantasia</ControlLabel>
                        <input name="nomeFantasia" value={this.state.nomeFantasia}
                          type="text" className="form-control"
                          placeholder="Nome Fantasia" required onChange={this.onChange} />
                      </div>
                    </Row>
                    <Row>
                      <div className="col-md-2">
                        <ControlLabel>Telefone</ControlLabel>
                        <InputMask mask="(99) 9999-9999" name="telefone" value={this.state.telefone}
                          type="text" className="form-control"
                          placeholder="(XX) XXXX-XXXX" required onChange={this.onChange} />
                      </div>
                      <div className="col-md-2">
                        <ControlLabel>Celular</ControlLabel>
                        <InputMask mask="(99) 99999-9999" name="celular" value={this.state.celular}
                          type="text" className="form-control"
                          placeholder="(XX) XXXXX-XXXX" onChange={this.onChange} />
                      </div>
                      <div className="col-md-3">
                        <ControlLabel>Email</ControlLabel>
                        <input name="email" value={this.state.email}
                          type="email" className="form-control" required
                          placeholder="xxxxxx@xxxxx.xxx.xx" onChange={this.onChange} />
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
                        <Button style={{ height: '35%' }} onClick={this.enderecoEmpresaCep} size="middle"
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
                        <Button size="middle" onClick={this.toBackList}>
                          Voltar
                    </Button>
                      </div>
                      <div className="ant-col">
                        <Button type="primary" htmlType="submit" size="middle" loading={this.state.loadingAvancar}>
                          Avançar
                    </Button>
                      </div>
                    </div>
                    <div className="clearfix" />
                  </form>
                </Col>
              </Row>
            ) : null}
            {(current === 1) ?
              <Row>
                <Col md={12}>
                  <form name="formSocio" onSubmit={this.savePartner}>
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
                        <input name="dataNascSocio" value={this.state.dataNascSocio}
                          type="date" className="form-control"
                          placeholder="XX/XX/XXXX" required onChange={this.onChange} />
                      </div>
                      <div className="col-md-2">
                        <ControlLabel>Telefone</ControlLabel>
                        <InputMask mask="(99) 9999-9999" name="telefoneSocio" value={this.state.telefoneSocio}
                          type="text" className="form-control"
                          placeholder="(XX) XXXX-XXXX" onChange={this.onChange} />
                      </div>
                      <div className="col-md-2">
                        <ControlLabel>Celular</ControlLabel>
                        <InputMask mask="(99) 99999-9999" name="celularSocio" value={this.state.celularSocio}
                          type="text" className="form-control"
                          placeholder="(XX) XXXXX-XXXX" required onChange={this.onChange} />
                      </div>
                      <div className="col-md-3">
                        <ControlLabel>Email</ControlLabel>
                        <input name="emailSocio" value={this.state.emailSocio}
                          type="email" className="form-control"
                          placeholder="xxxxxx@xxxxx.com" onChange={this.onChange} />
                      </div>
                    </Row>
                    <Row>
                      <div className="col-md-3">
                        <ControlLabel>CEP</ControlLabel>
                        <InputMask name="cepSocio" className="form-control" value={this.state.cepSocio}
                          placeholder="00000-000" type="text" mask="99999-999"
                          required onChange={this.onChange} />
                      </div>
                      <div className="col-md-2" style={{ marginTop: '38px', marginBottom: '38px' }}>
                        <Button style={{ height: '35%' }} onClick={this.enderecoSocioCep} size="middle"
                          type="primary" loading={this.state.loadingCep}>Consultar Cep</Button>
                      </div>
                    </Row>
                    <Row>
                      <div className="col-md-6">
                        <ControlLabel>Endereço</ControlLabel>
                        <input name="enderecoSocio" value={this.state.enderecoSocio}
                          type="text" className="form-control"
                          placeholder="Rua xxxxxxxxxxx" onChange={this.onChange}
                          disabled={this.state.desabilitarEndBairroSocio} />
                      </div>
                      <div className="col-md-3">
                        <ControlLabel>Número</ControlLabel>
                        <input name="numeroSocio" value={this.state.numeroSocio}
                          type="text" className="form-control"
                          placeholder="123" onChange={this.onChange} />
                      </div>
                      <div className="col-md-3">
                        <ControlLabel>Complemento</ControlLabel>
                        <input name="complementoSocio" value={this.state.complementoSocio}
                          type="text" className="form-control"
                          placeholder="Bloco A" onChange={this.onChange} />
                      </div>
                    </Row>
                    <Row>
                      <div className="col-md-4">
                        <ControlLabel>Bairro</ControlLabel>
                        <input name="bairroSocio" value={this.state.bairroSocio}
                          type="text" className="form-control"
                          placeholder="Jardim Aurora" onChange={this.onChange}
                          disabled={this.state.desabilitarEndBairroSocio} />
                      </div>
                      <div className="col-md-4">
                        <ControlLabel>Cidade</ControlLabel>
                        <input name="cidadeSocio" value={this.state.cidadeSocio}
                          type="text" className="form-control"
                          placeholder="Londrina" onChange={this.onChange}
                          disabled={this.state.desabilitarCamposEnderecoSocio} />
                      </div>
                      <div className="col-md-4">
                        <ControlLabel>Estado</ControlLabel>
                        <input name="estadoSocio" value={this.state.estadoSocio}
                          type="text" className="form-control"
                          placeholder="Paraná" onChange={this.onChange}
                          disabled={this.state.desabilitarCamposEnderecoSocio} />
                      </div>
                    </Row>
                    <div className="ant-row ant-row-end">
                      <div className="ant-col">

                        <Button size="middle" htmlType="submit"
                          type="primary" loading={this.state.loadingAvancar}>Adicionar</Button>
                      </div>
                    </div>
                  </form>
                  <div className="content">
                    <Table columns={this.columns} dataSource={this.data} bordered scroll={{ x: 100 }} pagination={{
                      showTotal: total =>
                        `Total de ${total} ${total > 1 ? 'itens' : 'item'}`,
                      showQuickJumper: true,
                      showSizeChanger: true,
                    }} />
                  </div>
                  <div className="ant-row ant-row-end">
                    <div className="ant-col">
                      <Button type="info" size="middle" onClick={this.previousStep}>
                        Voltar
                    </Button>
                    </div>
                    <div className="ant-col">
                      <Button type="primary" size="middle" onClick={this.nextStep}>
                        Avançar
                    </Button>
                    </div>
                  </div>
                </Col>
              </Row>
              : null}
            {(current === 2) ?
              <Row>
                <Col md={12}>
                  <form name="formDadosBanco" onSubmit={this.saveBankDetails}>
                    <Row>
                      <div className="col-md-3">
                        <ControlLabel>Banco</ControlLabel>
                        <input name="banco" value={this.state.banco}
                          type="text" className="form-control"
                          placeholder="Itau" required onChange={this.onChange} />
                      </div>
                      <div className="col-md-2">
                        <ControlLabel>Agência</ControlLabel>
                        <input name="agencia" value={this.state.agencia}
                          type="text" className="form-control"
                          placeholder="123456" required onChange={this.onChange} />
                      </div>
                      <div className="col-md-2">
                        <ControlLabel>Conta</ControlLabel>
                        <input name="conta" value={this.state.conta}
                          type="text" className="form-control"
                          placeholder="654321" required onChange={this.onChange} />
                      </div>
                      <div className="col-md-1">
                        <ControlLabel>Dígito</ControlLabel>
                        <input name="digito" value={this.state.digito}
                          type="text" className="form-control"
                          placeholder="0" required onChange={this.onChange} />
                      </div>
                      <div className="col-md-1">
                        <ControlLabel>Operação</ControlLabel>
                        <input name="operacao" value={this.state.operacao}
                          type="text" className="form-control"
                          placeholder="001" onChange={this.onChange} />
                      </div>
                    </Row>
                    <div className="ant-row ant-row-end">
                      <div className="ant-col">

                        <Button size="middle" htmlType="submit"
                          type="primary" loading={this.state.loadingAvancar}>Adicionar</Button>
                      </div>
                    </div>
                  </form>
                  <div className="content">
                    <Table columns={this.columnsBank} dataSource={this.dataBank} bordered scroll={{ x: 100 }} pagination={{
                      showTotal: total =>
                        `Total de ${total} ${total > 1 ? 'itens' : 'item'}`,
                      showQuickJumper: true,
                      showSizeChanger: true,
                    }} />
                  </div>
                  <div className="ant-row ant-row-end">
                    <div className="ant-col">
                      <Button type="info" size="middle" onClick={this.previousStep}>
                        Voltar
                    </Button>
                    </div>
                    <div className="ant-col">
                      <Button type="primary" size="middle" onClick={this.toBackList}>
                        Finalizar
                    </Button>
                    </div>
                  </div>
                </Col>
              </Row>
              : null}
          </Grid>
        } />

      </div>
    )
  }
}
export default SystemCompanyInsert;
