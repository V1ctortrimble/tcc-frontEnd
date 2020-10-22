import React, { Component } from "react";
import { Col, Grid, Row } from "react-bootstrap";
import { Steps, Table } from "antd";
import 'antd/dist/antd.css';
import Card from "components/Card/Card";
import { EditFilled } from '@ant-design/icons';

import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import Button from "components/CustomButton/CustomButton.jsx";

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
    render: () => <a href="/admin"><Button bsStyle="primary" fill round><EditFilled /></Button> </a>,
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
    statusInitial: "process",
    statusOthers: "wait",
    cnpj: "",
    razaoSocial: "",
    nomeFantasia: "",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cpf: "",

  };



  consultaCEP = () => {
    this.props.history.push("/admin/systemCompany/SystemCompanyList.jsx")
  }

  toBackList = () => {
    this.props.history.push("/admin/systemCompany/SystemCompanyList.jsx")
  }

  onChangeStep = (current, statusInitial, statusOthers) => {
    this.setState({ current });
    this.setState({ statusInitial });
    this.setState({ statusOthers });
  };

  nextStep = () => {
    this.setState({current: this.state.current + 1});
  }

  previousStep = () => {
    this.setState({current: this.state.current - 1});
  }

  onChange = (event) => {
    const state = Object.assign({}, this.state);
    const field = event.target.name;
    state[field] = event.target.value;
    this.setState(state);
    console.log(state);
  }

  render() {
    const { current } = this.state;
    const { statusInitial } = this.state;
    const { statusOthers } = this.state;

    return (

      <div className="content">
        {JSON.stringify(this.state)}
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
                  <Step status={statusInitial} title="Dados Principais" >
                  </Step>
                  <Step status={statusOthers} title="Sócios" >
                  </Step>
                  <Step status={statusOthers} title="Informações Bancárias" />
                </Steps>
              </>
            </Row>
            <p></p>
            {(current === 0) ? (
              <Row>
                <Col md={12}>
                  <form>
                    <FormInputs
                      ncols={["col-md-2", "col-md-5", "col-md-5"]}
                      properties={[
                        {
                          name: "cnpj",
                          label: "CNPJ",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "00.000.000/0000-00",
                          required: true,
                          onChange: this.onChange,
                        },
                        {
                          name: "razaoSocial",
                          label: "Razão Social",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Razão Social",
                          required: true,
                          onChange: this.onChange,
                        },
                        {
                          name: "nomeFantasia",
                          label: "Nome Fantasia",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Nome Fantasia",
                          required: true,
                          onChange: this.onChange,
                        }
                      ]}
                    />
                    <FormInputs
                      ncols={["col-md-3"]}
                      properties={[
                        {
                          name: "cep",
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
                          name: "endereco",
                          label: "Endereço",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Rua xxxxxxxxxxx",
                          disabled: true,
                          onChange: this.onChange,
                        },
                        {
                          name: "numero",
                          label: "Número",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "123",
                          disabled: false,
                          onChange: this.onChange,
                        },
                        {
                          name: "complemento",
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
                          name: "bairro",
                          label: "Bairro",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Jardim Aurora",
                          disabled: true,
                          onChange: this.onChange,

                        },
                        {
                          name: "cidade",
                          label: "Cidade",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Londrina",
                          disabled: true,
                          onChange: this.onChange,
                        },
                        {
                          name: "estado",
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
                        <Button bsStyle="info" pullRight onClick={this.toBackList}>
                          Voltar
                    </Button>
                      </div>
                      <div className="ant-col">
                        <Button bsStyle="primary" pullRight fill type="submit" onClick={this.nextStep}>
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
                  <form>
                    <FormInputs ncols={["col-md-3", "col-md-3", "col-md-3", "col-md-3"]}
                      properties={[
                        {
                          name: "cpf",
                          label: "CPF",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "000.000.000-00",
                          required: true,
                          onChange: this.onChange,
                        },
                        {
                          name: "nome",
                          label: "Nome",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "José",
                          required: true,
                          onChange: this.onChange,
                        },
                        {
                          name: "sobreNome",
                          label: "Sobrenome",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "da Silva",
                          required: true,
                          onChange: this.onChange,
                        },
                        {
                          name: "rg",
                          label: "RG",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "00000000",
                          required: true,
                          onChange: this.onChange,
                        }
                      ]}>
                    </FormInputs>
                    <FormInputs
                      ncols={["col-md-3"]}
                      properties={[
                        {
                          name: "cep",
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
                          name: "endereco",
                          label: "Endereço",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Rua xxxxxxxxxxx",
                          disabled: true,
                          onChange: this.onChange,
                        },
                        {
                          name: "numero",
                          label: "Número",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "123",
                          disabled: false,
                          onChange: this.onChange,
                        },
                        {
                          name: "complemento",
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
                          name: "bairro",
                          label: "Bairro",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Jardim Aurora",
                          disabled: true,
                          onChange: this.onChange,

                        },
                        {
                          name: "cidade",
                          label: "Cidade",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Londrina",
                          disabled: true,
                          onChange: this.onChange,
                        },
                        {
                          name: "estado",
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
                          label: "Banco",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Itau",
                          required: true,
                          onChange: this.onChange,
                        },
                        {
                          name: "agencia",
                          label: "Agencia",
                          type: "number",
                          bsClass: "form-control",
                          placeholder: "123456",
                          required: true,
                          onChange: this.onChange,
                        },
                        {
                          name: "conta",
                          label: "Conta",
                          type: "number",
                          bsClass: "form-control",
                          placeholder: "654321",
                          required: true,
                          onChange: this.onChange,
                        },
                        {
                          name: "digito",
                          label: "Digito",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "0",
                          required: true,
                          onChange: this.onChange,
                        },
                        {
                          name: "operacao",
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
