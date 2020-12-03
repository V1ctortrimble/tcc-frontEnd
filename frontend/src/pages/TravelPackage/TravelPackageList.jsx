import React, { Component } from "react";
import { Grid, Row, Col, ControlLabel } from "react-bootstrap";
import { Button, Table, Collapse, notification, Modal, Tag, Select } from "antd";
import 'antd/dist/antd.css';
import { EditFilled, UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons';
import api from "services/api";
import moment from 'moment';
//import InputMask from "react-input-mask";

const { Panel } = Collapse;
const { Option } = Select;

class PassengerList extends Component {

    columns = [
        {
            title: 'Codigo',
            width: 120,
            dataIndex: 'codigo',
            key: 'codigo',
            fixed: 'left',
        },
        {
            title: 'Nome Viagem',
            width: 120,
            dataIndex: 'nameViagem',
            key: 'nameViagem',
            fixed: 'left',
        },
        {
            title: 'Local Destino',
            width: 120,
            dataIndex: 'localDstino',
            key: 'localDstino',
            fixed: 'left',
        },
        {
            title: 'local Origem',
            width: 120,
            dataIndex: 'localorigem',
            key: 'localorigem',
            fixed: 'left',
        },
        {
            title: 'Data Inicio',
            width: 90,
            dataIndex: 'datainicio',
            key: 'datainicio',
            fixed: 'left',
            align: 'center'
        },
        {
            title: 'Data Fim',
            width: 90,
            dataIndex: 'datafim',
            key: 'datafim',
            fixed: 'left',
            align: 'center'
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
                        <Button onClick={() => this.alterarViagem(x)} type="primary" size="small" style={{ marginRight: '5%' }}><EditFilled /></Button>
                        <Button onClick={() => this.showModal(x)} type="primary" danger size="small"><UserDeleteOutlined /></Button>
                    </div>) : <div>
                        <Button className="ant-btn-personalized" onClick={() => this.ativarViagem(x)} type="primary" size="small" style={{ marginRight: '5%' }}><UserAddOutlined /></Button>
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
        codigo: "",
        nomeViagem: "",
        localDstino: "",
        localorigem: "",
        dataInicio:"",
        dataFim:"",
        loading: false,
        visible: false,
        codigoParaDesativar: "",
        codigoParaAtivar: "",
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

    dataPacoteViagem = {};

    handleClick = () => {
        this.props.history.push("/admin/TravelPackage/TravelPackageInsert.jsx")
    }

    showModal = (x) => {
        let codigo = x.codigo;
        this.setState({
            codigoParaDesativar: codigo,
            visible: true,
        });
    };

    confirmarModal = () => {
        this.desativaViagem();
        this.setState({
            visible: false,
        });
    };

    cancelarModal = () => {
        this.setState({
            visible: false,
        });
    };

    alterarViagem(x) {
        this.props.history.push(`/admin/TravelPackage/TravelPackageList/`)
    }

    async ativarViagem(x) {

        try {
            this.populaCamposAtivar(x.codigo);
            await api.put('api/persons/individual/', this.dataPacoteViagem, {
                params: {
                    codigo: x.codigo
                },
            });
            notification.success({
                message: `Viage ativada com sucesso`,
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

    async desativaViagem() {
        try {
            this.populaCamposDesativar();
            await api.put('api/persons/individual/', this.dataPacoteViagem, {
            });
            notification.warning({
                message: `Viagem desativada com sucesso`,
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

    populaCamposAtivar(codigo) {
        this.dataPacoteViagem = {
            individual: {
                active: true,
                codigo: codigo
            }
        }
    }

    populaCamposDesativar(x) {
        this.dataPacoteViagem = {
            individual: {
                active: false,
                codigo:x.codigo
            }
        }
    }

    onChange = (event) => {
        const state = Object.assign({}, this.state);
        const field = event.target.name;
        state[field] = event.target.value;
        this.setState(state);
        console.log(this.state);
    }

    async buscarIndividualApi(current = 0, size = 10) {
        this.setState({ loading: true });
        let x = [];
        try {
            const data = await api.get('api/persons/individual/filter', {
                params: {
                    page: current,
                    size: size,
                    name: this.state.nome,
                    lastname: this.state.sobreNome,
                    rg: this.state.rg,
                    sort: 'nameIndividual,asc',
                    active: this.state.status
                },
            });
            data.data.content.forEach((item, index) => {
                x.push({
                    key: index,
                    codigo: item.codigo,
                    name: item,
                    sobrenome: item.last_name,
                    rg: item.rg,
                    datanasc: moment(item.birth_date).format("DD/MM/YYYY"),
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
                this.setState({
                    pager: {
                        current: current,
                        pageSize: size,
                        total: '0',
                    }
                })
            }
        } finally {
            this.setState({ loading: false });
        }
    }

    async componentDidMount() {
        this.buscarIndividualApi();
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
                            codigo de viagem: {this.state.codigoParaDesativar} ?
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
                                    <form name="formFilterViagem">
                                        <Row>
                                            <div className="col-md-2">
                                                <ControlLabel>Codigo</ControlLabel>
                                                <input name="codigo" value={this.state.codigo}
                                                    type="int" className="form-control" mask=""
                                                    placeholder="" onChange={this.onChange} />
                                            </div>
                                            <div className="col-md-3">
                                                <ControlLabel>Nome Viagem</ControlLabel>
                                                <input name="nomeViagem" value={this.state.nomeViagem}
                                                    type="text" className="form-control"
                                                    placeholder="" onChange={this.onChange} />
                                            </div>
                                            <div className="col-md-3">
                                                <ControlLabel>Local Origem</ControlLabel>
                                                <input name="localOrigem" value={this.state.localorigem}
                                                    type="text" className="form-control"
                                                    placeholder="" onChange={this.onChange} />
                                            </div>

                                            <div className="col-md-3">
                                                <ControlLabel>Local Destino</ControlLabel>
                                                <input name="localDestino" value={this.state.nome}
                                                    type="text" className="form-control"
                                                    placeholder="" onChange={this.onChange} />
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
                                                <Button size="middle" onClick={() => this.buscarIndividualApi()}
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
                                onChange={(pagination) => { this.buscarIndividualApi((pagination.current - 1), pagination.pageSize) }} />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default PassengerList;