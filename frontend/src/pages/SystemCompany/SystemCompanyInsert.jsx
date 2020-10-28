import React, { Component } from "react";
import { Col, ControlLabel, Grid, Row } from "react-bootstrap";
import InputMask from "react-input-mask";
import { Steps, Table, notification, Button } from "antd";
import 'antd/dist/antd.css';
import Card from "components/Card/Card";
import { EditFilled } from '@ant-design/icons';
import cep from 'cep-promise';
import api from '../../services/api';
import NotificationSystem from "react-notification-system";
import { style } from "variables/Variables.jsx";

import { FormInputs } from "components/FormInputs/FormInputs.jsx";

const { Step } = Steps;

const columns = [
  {
    title: 'Nome Sócio',
    width: 200,
    dataIndex: 'namePartner',
    key: 'name',
    fixed: 'left',
  },
  {
    title: 'CPF',
    width: 200,
    dataIndex: 'cpf',
    key: 'cpf',
    fixed: 'left',
  },
  {
    title: 'Ações',
    key: 'operation',
    fixed: 'right',
    width: 100,
    render: () => <div> <a href="/admin"><Button bsStyle="primary" fill bsSize="xsmall"><EditFilled /></Button> </a>
      <a href="/admin"><Button bsStyle="primary" fill bsSize="xsmall"><EditFilled /></Button> </a>
    </div>
  },
];

const columnsBank = [
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
    render: () => <a href="/admin"><Button bsStyle="primary" fill round><EditFilled /></Button> </a>,
  },
];

const data = [
  {
    key: '1',
    namePartner: 'José',
    cpf: '000.000.000-00',
  },
];

const dataBank = [
  {
    key: '1',
    bank: 'Caixa',
    agencia: '0175',
    conta: '1425',
    digito: '3',
    operacao: '013',
  },
];

class SystemCompanyInsert extends Component {

  state = {
    current: 0,
    loadingCep: false,
    loadingAvancar: false,
    desabilitarEndBairro: true,
    desabilitarCamposEndereco: true,
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
    dataCompany: {
      active: true,
      adresses: [
        {
          additional: "",
          adress: "",
          adress_number: "",
          city: "",
          neighborhood: "",
          state: "",
          zip_code: "",
        }
      ],
      banks_details: [
        {
          account: "",
          active: "",
          agency: "",
          bank: "",
          digit: "",
          operation: "",
        }
      ],
      company: {
        active: true,
        cnpj: "",
        fantasy_name: "",
        open_date: "",
        social_reason: "",
        state_regis: "",
      },
      contacts: [
        {
          cell_phone: "",
          email: "",
          phone: "",
        }
      ]
    }
  };

  dataCompany = {};

  dataPartner = {
    active: true,
    adresses: [
      {
        additional: this.state.complementoSocio,
        adress: this.state.enderecoSocio,
        adress_number: this.state.numeroSocio,
        city: this.state.cidadeSocio,
        neighborhood: this.state.bairroSocio,
        state: this.state.estadoSocio,
        zip_code: this.cepSocio,
      }
    ],
    banks_details: [
      {
        account: "123456",
        active: true,
        agency: "1679",
        bank: "Itau",
        digit: "5",
        operation: ""
      }
    ],
    contacts: [
      {
        cell_phone: this.state.celularSocio,
        email: this.state.emailSocio,
        phone: this.state.telefoneSocio
      }
    ],
    individual: {
      birth_date: this.state.dataNascSocio,
      cpf: this.state.cpf,
      last_name: this.state.sobreNome,
      name_individual: this.state.nome,
      rg: this.state.rg
    }
  };

  saveCompany = async (e) => {

    e.preventDefault();

    try {
      this.popularCamposEmpresaPost();

      const response = await api.post('api/persons/company', this.dataCompany);
      console.log(response);
      notification.success({
        message: `Empresa do sistema cadastrado com sucesso`,
      });

      this.nextStep();

    }
    catch (error) {
      console.log(error);
      notification.error({
        message: 'Não foi possível Salvar Empresa'
      });
    }
  };

  savePartner = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('api/persons/individual', this.dataPartner);

      console.log(response);

    }
    catch (error) {
      notification.error({
        message: 'Não foi possível Salvar Sócio'
      });
    }
  }

  enderecoEmpresaCep = async () => {
    this.setState({cep: this.state.cep.replace('-','')});
    const cepIn = this.state.cep.replace('-','');
    console.log(cepIn);
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
      const enderecoCompleto = await cep(`${cepIn.replace(/[^a-zA-Z0-9]/g, '')}`);

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
      console.log(error);
      notification.error({
        message: 'Falha ao consultar CEP',
        description: 'Insira o endereço manualmente'
      });
      this.setState({
        desabilitarCamposEndereco: false,
        desabilitarEndBairro: false
      })
    } finally {
      this.setState({ loadingCep: false })
    }
  };

  popularCamposEmpresaPost() {
    const cnpjNorm = this.state.cnpj.replace(/[^a-zA-Z0-9]/g,'');
    const cellPhoneNorm = this.state.celular.replace(/[^a-zA-Z0-9]/g,'')
    const phoneNorm = this.state.telefone.replace(/[^a-zA-Z0-9]/g,'')
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
        cnpj: cnpjNorm,
        fantasy_name: this.state.nomeFantasia,
        open_date: "",
        social_reason: this.state.razaoSocial,
        state_regis: "",
      },
      contacts: [
        {
          cell_phone: cellPhoneNorm,
          email: this.state.email,
          phone: phoneNorm,
        }
      ]
    };
  }

  popularCamposEmpresaConsultaCep = (data) => {
    this.setState({
      endereco: data.street,
      bairro: data.neighborhood,
      cidade: data.city,
      estado: data.state
    })
  };

  popularCamposSocioEndereco = (data) => {
    this.setState({
      endereco: data.street,
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
        <NotificationSystem ref="notificationSystem" style={style} />
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
                    {JSON.stringify(this.state)}
                    <Row>
                      <div className="col-md-2">
                        <ControlLabel>CNPJ</ControlLabel>
                        <InputMask mask="99.999.999/9999-99" name="cnpj" value={this.state.cnpj.replace(/[^a-zA-Z0-9]/g,'')}
                          type="text" className="form-control"
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
                          type="email" className="form-control"
                          placeholder="xxxxxx@xxxxx.xxx.xx" onChange={this.onChange} />
                      </div>
                    </Row>

                    <Row>
                      <div className="col-md-3">
                        <ControlLabel>CEP</ControlLabel>
                        <InputMask name="cep" className="form-control" value={this.state.cep}
                          placeholder="00000-000" type="text" mask="99999-999"
                          required onChange={this.onChange}/>
                      </div>
                      <div className="col-md-2" style={{marginTop: '34px', marginBottom: '34px'}}>
                        <Button style={{height: '35%'}} onClick={this.enderecoEmpresaCep} size="large"
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
                        <Button size="large" pullRight onClick={this.toBackList}>
                          Voltar
                    </Button>
                      </div>
                      <div className="ant-col">
                        <Button type="primary" htmlType="submit" size="large" pullRight fill loading={this.state.loadingAvancar}>
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
                  <form name="formSocio">
                    <FormInputs ncols={["col-md-3", "col-md-3", "col-md-3", "col-md-3"]}
                      properties={[
                        {
                          name: "cpf",
                          value: this.state.cpf,
                          label: "CPF",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "000.000.000-00",
                          required: true,
                          onChange: this.onChange,
                        },
                        {
                          name: "nome",
                          value: this.state.nome,
                          label: "Nome",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "José",
                          required: true,
                          onChange: this.onChange,
                        },
                        {
                          name: "sobreNome",
                          value: this.state.sobreNome,
                          label: "Sobrenome",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "da Silva",
                          required: true,
                          onChange: this.onChange,
                        },
                        {
                          name: "rg",
                          value: this.state.rg,
                          label: "RG",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "00000000",
                          required: true,
                          onChange: this.onChange,
                        }
                      ]} />
                    <FormInputs
                      ncols={["col-md-2", "col-md-2", "col-md-2", "col-md-3"]}
                      properties={[
                        {
                          name: "dataNascSocio",
                          value: this.state.dataNascSocio,
                          label: "Data Nascimento",
                          type: "date",
                          bsClass: "form-control",
                          placeholder: "XX/XX/XXXX",
                          required: true,
                          onChange: this.onChange,
                        },
                        {
                          name: "telefoneSocio",
                          value: this.state.telefoneSocio,
                          label: "Telefone",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "(XX) XXXX-XXXX",
                          required: true,
                          onChange: this.onChange,
                        },
                        {
                          name: "celularSocio",
                          value: this.state.celularSocio,
                          label: "Celular",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "(XX) XXXX-XXXX",
                          required: false,
                          onChange: this.onChange,
                        },
                        {
                          name: "emailSocio",
                          value: this.state.emailSocio,
                          label: "Email",
                          type: "email",
                          bsClass: "form-control",
                          placeholder: "Nome xxxxxx@xxxxx.com",
                          required: false,
                          onChange: this.onChange,
                        }
                      ]}
                    />
                    <FormInputs
                      ncols={["col-md-3"]}
                      properties={[
                        {
                          name: "cepSocio",
                          value: this.state.cepSocio,
                          label: "CEP",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "00000-000",
                          maxLength: 8,
                          required: true,
                          onChange: this.onChange,
                        }
                      ]}
                    />
                    <Button bsStyle="info" fill onClick={this.consultaCEP}>
                      Consulta CEP
                    </Button>
                    <FormInputs
                      ncols={["col-md-6", "col-md-3", "col-md-3"]}
                      properties={[
                        {
                          name: "enderecoSocio",
                          value: this.state.enderecoSocio,
                          label: "Endereço",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Rua xxxxxxxxxxx",
                          disabled: true,
                          onChange: this.onChange,
                        },
                        {
                          name: "numeroSocio",
                          value: this.state.numeroSocio,
                          label: "Número",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "123",
                          disabled: false,
                          onChange: this.onChange,
                        },
                        {
                          name: "complementoSocio",
                          value: this.state.complementoSocio,
                          label: "Complemento",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Bloco A",
                          disabled: false,
                          onChange: this.onChange,
                        }
                      ]}
                    />
                    <FormInputs
                      ncols={["col-md-4", "col-md-4", "col-md-4"]}
                      properties={[
                        {
                          name: "bairroSocio",
                          value: this.state.bairroSocio,
                          label: "Bairro",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Jardim Aurora",
                          disabled: true,
                          onChange: this.onChange,

                        },
                        {
                          name: "cidadeSocio",
                          value: this.state.cidadeSocio,
                          label: "Cidade",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Londrina",
                          disabled: true,
                          onChange: this.onChange,
                        },
                        {
                          name: "estadoSocio",
                          value: this.state.estadoSocio,
                          label: "Estado",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Paraná",
                          disabled: true,
                          onChange: this.onChange,
                        }
                      ]}
                    />
                    <div className="ant-row ant-row-end">
                      <div className="ant-col">
                        <Button bsStyle="primary" pullRight fill type="submit">
                          Adicionar
                    </Button>
                      </div>
                    </div>
                  </form>
                  <div className="content">
                    <Table columns={columns} dataSource={data} bordered scroll={{ x: 100 }} pagination={{
                      showTotal: total =>
                        `Total de ${total} ${total > 1 ? 'itens' : 'item'}`,
                      showQuickJumper: true,
                      showSizeChanger: true,
                    }} />
                  </div>
                  <div className="ant-row ant-row-end">
                    <div className="ant-col">
                      <Button bsStyle="info" pullRight onClick={this.previousStep}>
                        Voltar
                    </Button>
                    </div>
                    <div className="ant-col">
                      <Button bsStyle="primary" pullRight fill type="submit" onClick={this.nextStep}>
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
                  <form>
                    <FormInputs ncols={["col-md-3", "col-md-2", "col-md-2", "col-md-1", "col-md-1"]}
                      properties={[
                        {
                          name: "banco",
                          value: this.state.banco,
                          label: "Banco",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Itau",
                          required: true,
                          onChange: this.onChange,
                        },
                        {
                          name: "agencia",
                          value: this.state.agencia,
                          label: "Agencia",
                          type: "number",
                          bsClass: "form-control",
                          placeholder: "123456",
                          required: true,
                          onChange: this.onChange,
                        },
                        {
                          name: "conta",
                          value: this.state.conta,
                          label: "Conta",
                          type: "number",
                          bsClass: "form-control",
                          placeholder: "654321",
                          required: true,
                          onChange: this.onChange,
                        },
                        {
                          name: "digito",
                          value: this.state.digito,
                          label: "Digito",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "0",
                          required: true,
                          onChange: this.onChange,
                        },
                        {
                          name: "operacao",
                          value: this.state.operacao,
                          label: "Operação",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "001",
                          onChange: this.onChange,
                        }
                      ]}>
                    </FormInputs>
                    <div className="ant-row ant-row-end">
                      <div className="ant-col">
                        <Button bsStyle="primary" pullRight fill type="submit">
                          Adicionar
                        </Button>
                      </div>
                    </div>
                  </form>
                  <div className="content">
                    <Table columns={columnsBank} dataSource={dataBank} bordered scroll={{ x: 100 }} pagination={{
                      showTotal: total =>
                        `Total de ${total} ${total > 1 ? 'itens' : 'item'}`,
                      showQuickJumper: true,
                      showSizeChanger: true,
                    }} />
                  </div>
                  <div className="ant-row ant-row-end">
                    <div className="ant-col">
                      <Button bsStyle="info" pullRight onClick={this.previousStep}>
                        Voltar
                    </Button>
                    </div>
                    <div className="ant-col">
                      <Button bsStyle="primary" pullRight fill type="submit" onClick={this.toBackList}>
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
