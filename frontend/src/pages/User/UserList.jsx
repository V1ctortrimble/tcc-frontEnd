import React, { Component } from "react";
import { Grid, Row, Col, ControlLabel } from "react-bootstrap";
import { Button, Table, Collapse, notification, Modal, Tag, Select } from "antd";
import InputMask from "react-input-mask";
import 'antd/dist/antd.css';
import { EditFilled, UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons';
import api from "services/api";
import { cpf } from "cpf-cnpj-validator";

const { Panel } = Collapse;
const { Option } = Select;

class UserList extends Component {

  columns = [
    {
      title: 'Username',
      width: 150,
      dataIndex: 'username',
      key: 'username',
      fixed: 'left',
    },
    {
      title: 'Nome',
      width: 80,
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
    },
    {
      title: 'Sobrenome',
      width: 120,
      dataIndex: 'sobrenome',
      key: 'sobrenome',
      fixed: 'left',
    },
    {
      title: 'CPF',
      width: 90,
      dataIndex: 'cpf',
      key: 'cpf',
      fixed: 'left',
    },
    {
      title: 'Admin',
      width: 50,
      dataIndex: 'admin',
      key: 'admin',
      fixed: 'left',
      align: 'center',
    },
    {
      title: 'Status',
      width: 70,
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
            <Button onClick={() => this.alterarUsuario(x)} type="primary" size="small" style={{ marginRight: '5%' }}><EditFilled /></Button>
            <Button onClick={() => this.showModal(x)} type="primary" danger size="small"><UserDeleteOutlined /></Button>
          </div>) : <div>
            <Button className="ant-btn-personalized" onClick={() => this.ativarUsuario(x)} type="primary" size="small" style={{ marginRight: '5%' }}><UserAddOutlined /></Button>
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
    username: "",
    cpf: "",
    nome: "",
    sobreNome: "",
    loading: false,
    visible: false,
    usernameParaDesativar: "",
    cpfParaAtivar: "",
    status: true,
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

  dataUser = {};

  handleClick = () => {
    this.props.history.push("/admin/User/UserInsert.jsx")
  }

  showModal = (x) => {
    let username = x.username;
    this.setState({
      usernameParaDesativar: username,
      visible: true,
    });
  };

  confirmarModal = () => {
    this.desativaUsuario();
    this.setState({
      visible: false,
    });
  };

  cancelarModal = () => {
    this.setState({
      visible: false,
    });
  };

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

  removeCaractEspecial(texto) {
    return texto.replace(/[^a-zA-Z0-9]/g, '');
  }

  mascaraCpf(cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
  }

  alterarUsuario(x) {
    let username = x.username;
    this.props.history.push(`/admin/User/UserInsert/${username}`)
  }

  async ativarUsuario(x) {
    let username = x.username;
    try {
      this.populaCamposAtivar(username);
      await api.put('api/user/', this.dataUser, {
        params: {
          username: username
        },
      });
      notification.success({
        message: `Usuario(a) ativado com sucesso`,
      });
      this.buscarUsersApi();
    } catch (error) {
      if (error.response) {
        notification.error({
          message: `Algo de errado aconteceu`,
          description: `Motivo: ${error.response.data.message}`
        });
      }
    }
  }

  async desativaUsuario() {
    try {
      this.populaCamposDesativar();
      await api.put('api/user', this.dataUser, {
        params: {
          username: this.state.usernameParaDesativar
        },
      });
      notification.warning({
        message: `Usuario(a) desativado com sucesso`,
      });
      this.buscarUsersApi();
    } catch (error) {
      if (error.response) {
        notification.error({
          message: `Algo de errado aconteceu`,
          description: `Motivo: ${error.response.data.message}`
        });
      }
    }
  }

  populaCamposAtivar(username) {
    this.dataUser = {
      active: true,
      username: username,
    }
  }

  populaCamposDesativar() {
    this.dataUser = {
      active: false,
      username: this.state.usernameParaDesativar,
    }
  }

  onChange = (event) => {
    const state = Object.assign({}, this.state);
    const field = event.target.name;
    state[field] = event.target.value;
    this.setState(state);
    console.log(this.state);
  }

  async buscarUsersApi(current = 0, size = 10) {
    this.setState({ loading: true });
    let x = [];
    try {
      const data = await api.get('api/users/filter', {
        params: {
          page: current,
          size: size,
          cpf: this.removeCaractEspecial(this.state.cpf),
          name: this.state.nome,
          lastname: this.state.sobreNome,
          username: this.state.username,
          //sort: 'nameIndividual,asc',
          active: this.state.status
        },
      });
      data.data.content.forEach((item, index) => {
        x.push({
          key: index,
          username: item.username,
          cpf: this.mascaraCpf(item.individual.cpf),
          name: item.individual.name_individual,
          sobrenome: item.individual.last_name,
          admin: item.admin ? "Sim" : "Não",
          status: item.active
        })
      });
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
        /*this.setState({
          pager: {
            current: current,
            pageSize: size,
            total: '0',
          }
        })*/
      }
    } finally {
      this.setState({ loading: false });
    }
  }

  async componentDidMount() {
    this.buscarUsersApi();
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
              Usuario: {this.state.usernameParaDesativar} ?
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
                  <form name="formFilterUser">
                    <Row>
                      <div className="col-md-3">
                        <ControlLabel>Username</ControlLabel>
                        <input name="username" value={this.state.username}
                          type="text" className="form-control"
                          placeholder="xxxxxxx@xxxxx.xxx" onChange={this.onChange} />
                      </div>
                      <div className="col-md-2">
                        <ControlLabel>Nome</ControlLabel>
                        <input name="nome" value={this.state.nome}
                          type="text" className="form-control"
                          placeholder="José" onChange={this.onChange} />
                      </div>
                      <div className="col-md-3">
                        <ControlLabel>Sobrenome</ControlLabel>
                        <input name="sobreNome" value={this.state.sobreNome}
                          type="text" className="form-control"
                          placeholder="da Silva" onChange={this.onChange} />
                      </div>
                      <div className="col-md-2">
                        <ControlLabel>CPF</ControlLabel>
                        <InputMask mask="999.999.999-99" name="cpf" value={this.state.cpf}
                          type="text" className="form-control" onBlur={this.validaCpf(this.state.cpf)}
                          placeholder="999.999.999-99" onChange={this.onChange} />
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
                        <Button size="middle" onClick={() => this.buscarUsersApi()}
                          type="primary" loading={this.state.loading}>Filtrar</Button>
                      </div>
                    </div>
                  </form>

                </Panel>
              </Collapse>
              <p></p>
              <Table
                columns={this.columns}
                dataSource={this.state.data}
                bordered
                loading={this.state.loading}
                scroll={{ x: 100 }}
                pagination={{
                  ...this.state.pager,
                  showTotal: total =>
                    `Total de ${total} ${total > 1 ? 'itens' : 'item'}`,
                  showQuickJumper: true,
                  showSizeChanger: true,
                }}
                size="middle"
                onChange={(pagination) => { this.buscarUsersApi((pagination.current - 1), pagination.pageSize) }} />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default UserList;