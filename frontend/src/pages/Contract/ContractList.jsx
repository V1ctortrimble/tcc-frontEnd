import React, { Component } from "react";
import { Grid, Row, Col, ControlLabel } from "react-bootstrap";
import { Button, Table, Collapse, notification, Tag, Modal, Select } from "antd";
import 'antd/dist/antd.css';
import { EditFilled, CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { cpf } from "cpf-cnpj-validator";
import InputMask from "react-input-mask";
import api from '../../services/api';
import moment from 'moment';

const { Panel } = Collapse;
const { Option } = Select;

class ContractList extends Component {

  columns = [
    {
      title: 'Código',
      width: 70,
      dataIndex: 'codigo',
      key: 'codigo',
      fixed: 'left',
    },
    {
      title: 'CPF Contratante',
      width: 100,
      dataIndex: 'cpf',
      key: 'cpf',
      fixed: 'left',
    },
    {
      title: 'Nome Contratante',
      width: 80,
      dataIndex: 'nome',
      key: 'nome',
      fixed: 'left',
    },
    {
      title: 'Nome Viagem',
      width: 100,
      dataIndex: 'nomeViagem',
      key: 'nome',
      fixed: 'left',
    },
    {
      title: 'Data de Emissão',
      width: 80,
      dataIndex: 'dataEmissao',
      key: 'dataEmissao',
      fixed: 'left',
    },
    {
      title: 'Status',
      width: 100,
      dataIndex: 'status',
      key: 'status',
      fixed: 'left',
      align: 'center',
      render: (text, record) => (
        <Tag color={record.status ? "green" : "red"}
          key="status"
        >
          {record.status ? "ATIVO" : "INATIVO"}
        </Tag>
      ),
    },
    {
      title: 'Ação',
      key: 'operation',
      fixed: 'right',
      width: 80,
      render: (x) => {
        return x.status ?
          (<div>
            <Button onClick={() => this.alterarContrato(x)} type="primary" size="small" style={{ marginRight: '5%' }}><EditFilled /></Button>
            <Button onClick={() => this.showModal(x)} type="primary" danger size="small"><CloseCircleOutlined /></Button>
          </div>) : <div>
            <Button className="ant-btn-personalized" onClick={() => this.ativarContrato(x)} type="primary" size="small" style={{ marginRight: '5%' }}><CheckCircleOutlined /></Button>
          </div>
      }
    },
  ];

  state = {
    data: [{}],
    pager: {
      current: 1,
      pageSize: 10,
      total: "",
    },
    idContract: null,
    idContractDesativar: null,
    cpf: "",
    nome: "",
    nomeViagem: "",
    cpfParaDesativar: "",
    cpfParaAtivar: "",
    status: true,
    loading: false,
    visible: false,
    statusOpcoes: [
      {
        valor: true,
        descricao: "Ativo",
      },
      {
        valor: false,
        descricao: "Inativo",
      }
    ]
  }

  dataContract = {};

  handleClick = () => {
    this.props.history.push("/admin/Contract/ContractInsert.jsx")
  }

  showModal = (x) => {
    let cpf = x.cpf;
    this.setState({
      cpfParaDesativar: cpf,
      idContractDesativar: x.codigo,
      visible: true,
    });
  };

  confirmarModal = () => {
    this.desativaContrato();
    this.setState({
      visible: false,
    });
  };

  cancelarModal = () => {
    this.setState({
      visible: false,
    });
  };

  alterarContrato(x) {
    let id = x.codigo;
    this.props.history.push(`/admin/Contract/ContractInsert/${id}`)
  }

  removeCaractEspecial(texto) {
    return texto.replace(/[^a-zA-Z0-9]/g, '');
  }

  async ativarContrato(x) {
    let cpf = this.removeCaractEspecial(x.cpf);
    try {
      this.populaCamposAtivar(cpf);
      await api.put('/api/travelcontract/', this.dataContract)
      notification.success({
        message: `Contrato ativado com sucesso`,
      });
      this.buscarContratoApi();
    } catch (error) {
      if (error.response) {
        notification.error({
          message: `Algo de errado aconteceu`,
          description: `Motivo: ${error.response.data.message}`
        });
      }
    }
  }

  async desativaContrato() {
    try {
      this.populaCamposDesativar();
      await api.put('/api/travelcontract/', this.dataContract, {
        params: {
          id: this.state.idContractDesativar,
        }
      })
      notification.warning({
        message: `Contrato desativado com sucesso`,
      });
      this.buscarContratoApi();
    } catch (error) {
      if (error.response) {
        notification.error({
          message: `Algo de errado aconteceu`,
          description: `Motivo: ${error.response.data.message}`
        });
      }
    }
  }

  mascaraCpf(cpf) {
    return cpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5");
  }

  populaCamposAtivar(idContract) {
    this.dataContract = {
     active: true,
     id_travel_contract: idContract,
    }
  }

  populaCamposDesativar() {
    this.dataContract = {
     active: false,
     id_travel_contract: this.state.idContractDesativar,
    }
  }

  onChange = (event) => {
    const state = Object.assign({}, this.state);
    const field = event.target.name;
    state[field] = event.target.value;
    this.setState(state);
  }

  validaCpf(cpfValidar) {
    const cpfLimpo = this.removeCaractEspecial(cpfValidar);
    if (cpfLimpo.length === 14) {
      if (cpf.isValid(cpfLimpo)) {
      } else {
        notification.error({
          message: `CPF ${cpfValidar} é inválido, favor informar um CPF válido`,
        });
        this.setState({ cpf: "" });
      }
    }
  }

  async buscarContratoApi() {
    this.setState({ loading: true });
    let x = [];
    try {
      const data = await api.get('/api/travelcontract/all')
      data.data.forEach((item) => {
        console.log(item);
        x.push({
          codigo: item.id_travel_contract,
          cpf: this.mascaraCpf(item.passengers[0].individual.cpf),
          nome: item.passengers[0].individual.name_individual,
          nomeViagem: item.travel_package.name_travel_package,
          dataEmissao: moment(item.issue_date).format("DD/MM/YYYY"),
          status: item.active
        })
      })
      this.setState({ data: x });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          notification.warning({
              message: "Aviso",
              description: `Motivo: Usuário não autorizado`
          });
      } else {
          notification.warning({
              message: "Aviso",
              description: `Motivo: ${error.response.data.message}`
          });
      }
        this.setState({ data: "" });
      }
    } finally {
      this.setState({ loading: false });
    }
  }

  async componentDidMount() {
    this.buscarContratoApi();
  }

  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Modal
            title="Confirmação"
            visible={this.state.visible}
            onOk={this.confirmarModal}
            onCancel={this.cancelarModal}
            okText="Confirmar"
            cancelText="Cancelar"
            centered
          >
            <div className="col-md-12" style={{ textAlign: 'center' }}>
              Tem certeza que deseja desativar o
                        </div>
            <div className="col-md-12" style={{ textAlign: 'center' }}>
              contrato CPF: {this.state.cpfParaDesativar} ?
                        </div>
            <p></p>
            <p></p>
          </Modal>
          <Row>
            <Col md={12}>
              <Button onClick={this.handleClick} className="ant-btn-primary">Novo</Button>
              <p></p>
              <Collapse>
                <Panel header="Filtros" key="1">
                  <form name="formFilterCompany" onSubmit={this.filtrarDados}>
                    <Row>
                    <div className="col-md-2">
                        <ControlLabel>Código</ControlLabel>
                        <input name="codigo" value={this.state.codigo}
                          type="int" className="form-control"
                          placeholder="" onChange={this.onChange} />
                      </div>
                      <div className="col-md-2">
                        <ControlLabel>CPF Contratante</ControlLabel>
                        <InputMask mask="99.999.999/9999-99" name="cpf" value={this.state.cpf}
                          type="text" className="form-control" onBlur={this.validaCpf(this.state.cpf)}
                          placeholder="99.999.999/9999-99" onChange={this.onChange} />
                      </div>
                      <div className="col-md-2">
                        <ControlLabel>Nome Contratante</ControlLabel>
                        <input name="nome" value={this.state.nome}
                          type="text" className="form-control"
                          placeholder="" onChange={this.onChange} />
                      </div>
                      <div className="col-md-2">
                        <ControlLabel>Nome Viagem</ControlLabel>
                        <input name="nomeViagem" value={this.state.nomeViagem}
                          type="text" className="form-control"
                          placeholder="" onChange={this.onChange} />
                      </div>
                      <div className="col-md-2">
                        <ControlLabel>Data Emissão</ControlLabel>
                        <input name="openData" value={this.state.openDate}
                          type="text" className="form-control"
                          placeholder="01/01/2020" onChange={this.onChange} />
                      </div>
                      <div className="col-md-1">
                        <ControlLabel>Status</ControlLabel>
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
                    </Row>
                    <div className="ant-row ant-row-end" style={{ marginTop: '30px' }}>
                      <div className="ant-col">
                        <Button size="middle" onClick={() => this.buscarContratoApi()}
                          type="primary" loading={this.state.loading}>Filtrar</Button>
                      </div>
                    </div>
                  </form>
                </Panel>
              </Collapse>
              <p></p>
              <Table columns={this.columns} dataSource={this.state.data}
              loading={this.state.loading} 
              bordered scroll={{ x: 100 }} pagination={{
                ...this.state.pager,
                showTotal: total =>
                  `Total de ${total} ${total > 1 ? 'itens' : 'item'}`,
                showQuickJumper: true,
                showSizeChanger: true,
              }}
                size="middle"
                onChange={(pagination) => { this.buscarContratoApi((pagination.current - 1), pagination.pageSize) }} />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default ContractList;