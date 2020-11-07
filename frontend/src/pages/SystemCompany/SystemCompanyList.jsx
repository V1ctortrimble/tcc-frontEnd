import React, { Component } from "react";
import { Grid, Row, Col, ControlLabel } from "react-bootstrap";
import { Button, Table, Collapse, notification, Tag, Modal, Select } from "antd";
import 'antd/dist/antd.css';
import { EditFilled, CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { cnpj } from "cpf-cnpj-validator";
import InputMask from "react-input-mask";
import api from '../../services/api';
import moment from 'moment';

const { Panel } = Collapse;
const { Option } = Select;

class SystemCompanyList extends Component {

  columns = [
    {
      title: 'CNPJ',
      width: 120,
      dataIndex: 'cnpj',
      key: 'cnpj',
      fixed: 'left',
    },
    {
      title: 'Nome Fantasia',
      width: 120,
      dataIndex: 'fantasyName',
      key: 'fantasyName',
      fixed: 'left',
    },
    {
      title: 'Razão Social',
      width: 120,
      dataIndex: 'socialReason',
      key: 'socialReason',
      fixed: 'left',
    },
    {
      title: 'Data de Abertura',
      width: 120,
      dataIndex: 'openDate',
      key: 'openDate',
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
            <Button onClick={() => this.alterarEmpresaSistema(x)} type="primary" size="small" style={{ marginRight: '5%' }}><EditFilled /></Button>
            <Button onClick={() => this.showModal(x)} type="primary" danger size="small"><CloseCircleOutlined /></Button>
          </div>) : <div>
            <Button className="ant-btn-personalized" onClick={() => this.ativarEmpresaSistema(x)} type="primary" size="small" style={{ marginRight: '5%' }}><CheckCircleOutlined /></Button>
          </div>
      }
    },
  ];

  state = {
    data: [{}],
    pager: {
      current: "",
      pageSize: "",
      total: "",
    },
    cnpj: "",
    razaoSocial: "",
    nomeFantasia: "",
    cnpjParaDesativar: "",
    cnpjParaAtivar: "",
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

  dataCompany = {};

  handleClick = () => {
    this.props.history.push("/admin/systemCompany/SystemCompanyInsert.jsx")
  }

  showModal = (x) => {
    let cnpj = x.cnpj;
    this.setState({
      cnpjParaDesativar: cnpj,
      visible: true,
    });
  };

  confirmarModal = () => {
    this.desativaEmpresaSistema();
    this.setState({
      visible: false,
    });
  };

  cancelarModal = () => {
    this.setState({
      visible: false,
    });
  };

  alterarEmpresaSistema(x) {
    let cnpj = this.removeCaractEspecial(x.cnpj);
    this.props.history.push(`/admin/systemCompany/SystemCompanyInsert/${cnpj}`)
  }

  removeCaractEspecial(texto) {
    return texto.replace(/[^a-zA-Z0-9]/g, '');
  }

  async ativarEmpresaSistema(x) {
    let cnpj = this.removeMascaraCpf(x.cnpj);
    try {
      this.populaCamposAtivar(cnpj);
      await api.put('api/persons/individual/', this.dataPassenger, {
        params: {
          cnpj: cnpj
        },
      });
      notification.success({
        message: `Empresa ativada com sucesso`,
      });
      this.buscarCompanyApi();
    } catch (error) {
      if (error.response) {
        notification.error({
          message: `Algo de errado aconteceu`,
          description: `Motivo: ${error.response.data.message}`
        });
      }
    }
  }

  async desativaEmpresaSistema() {
    try {
      this.populaCamposDesativar();
      await api.put('api/persons/individual/', this.dataPassenger, {
        params: {
          cnpj: this.removeCaractEspecial(this.state.cnpjParaDesativar)
        },
      });
      notification.warning({
        message: `Empresa desativada com sucesso`,
      });
      this.buscarIndividualApi();
    } catch (error) {
      if (error.response) {
        notification.error({
          message: `Algo de errado aconteceu`,
          description: `Motivo: ${error.response.data.message}`
        });
      }
    }
  }

  mascaraCnpj(cnpj) {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5");
  }

  populaCamposAtivar(cnpj) {
    this.dataCompany = {
      company: {
        active: true,
        cnpj: cnpj
      }
    }
  }

  populaCamposDesativar() {
    this.dataCompany = {
      company: {
        active: false,
        cnpj: this.removeCaractEspecial(this.state.cnpjParaDesativar)
      }
    }
  }

  onChange = (event) => {
    const state = Object.assign({}, this.state);
    const field = event.target.name;
    state[field] = event.target.value;
    this.setState(state);
  }

  validaCnpj(cnpjValidar) {
    const cnpjLimpo = this.removeCaractEspecial(cnpjValidar);
    if (cnpjLimpo.length === 14) {
      if (cnpj.isValid(cnpjLimpo)) {
      } else {
        notification.error({
          message: `CNPJ ${cnpjValidar} é inválido, favor informar um CNPJ válido`,
        });
        this.setState({ cnpj: "" });
      }
    }
  }

  async buscarCompanyApi(current = 0, size = 10) {
    this.setState({ loading: true });
    let x = [];
    try {
      const data = await api.get('api/persons/company/filter', {
        params: {
          page: current,
          size: size,
          cnpj: this.removeCaractEspecial(this.state.cnpj),
          socialreason: this.state.razaoSocial,
          fantasyname: this.state.nomeFantasia,
          sort: 'fantasyName,asc',
          active: this.state.status
        },
      });
      data.data.content.forEach((item, index) => {
        x.push({
          key: index,
          cnpj: this.mascaraCnpj(item.cnpj),
          fantasyName: item.fantasy_name,
          socialReason: item.social_reason,
          openDate: moment(item.open_date).format("DD/MM/YYYY"),
          status: item.active
        })
      })
      this.setState({ data: x });
      this.setState({
        pager: {
          current: data.data.pageNumber,
          pageSize: data.data.pageSize,
          total: data.data.totalElements,
        }
      })
    } catch (error) {
      if (error.response) {
        notification.warning({
          message: "Aviso",
          description: `Motivo: ${error.response.data.message}`
        });
        this.setState({ data: "" });
      }
    } finally {
      this.setState({ loading: false });
    }
  }

  async componentDidMount() {
    this.buscarCompanyApi();
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
              Tem certeza que deseja desativar a
                        </div>
            <div className="col-md-12" style={{ textAlign: 'center' }}>
              empresa CNPJ: {this.state.cnpjParaDesativar} ?
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
                  <form name="formFilterSystemCompany" onSubmit={this.filtrarDados}>
                    <Row>
                      <div className="col-md-3">
                        <ControlLabel>CNPJ</ControlLabel>
                        <InputMask mask="99.999.999/9999-99" name="cnpj" value={this.state.cnpj}
                          type="text" className="form-control" onBlur={this.validaCnpj(this.state.cnpj)}
                          placeholder="99.999.999/9999-99" onChange={this.onChange} />
                      </div>
                      <div className="col-md-3">
                        <ControlLabel>Razão Social</ControlLabel>
                        <input name="razaoSocial" value={this.state.razaoSocial}
                          type="text" className="form-control"
                          placeholder="Razão Social" onChange={this.onChange} />
                      </div>
                      <div className="col-md-3">
                        <ControlLabel>Nome Fantasia</ControlLabel>
                        <input name="nomeFantasia" value={this.state.nomeFantasia}
                          type="text" className="form-control"
                          placeholder="Nome Fantasia" onChange={this.onChange} />
                      </div>
                      <div className="col-md-2">
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
                        <Button size="middle" onClick={() => this.buscarCompanyApi()}
                          type="primary" loading={this.state.loading}>Filtrar</Button>
                      </div>
                    </div>
                  </form>
                </Panel>
              </Collapse>
              <p></p>
              <Table columns={this.columns} dataSource={this.state.data} bordered scroll={{ x: 100 }} pagination={{
                ...this.state.pager,
                showTotal: total =>
                  `Total de ${total} ${total > 1 ? 'itens' : 'item'}`,
                showQuickJumper: true,
                showSizeChanger: true,
              }}
                size="middle"
                onChange={(pagination) => { this.buscarCompanyApi((pagination.current - 1), pagination.pageSize) }} />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default SystemCompanyList;