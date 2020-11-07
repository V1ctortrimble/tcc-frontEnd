import React, { Component } from "react";
import { Grid, Row, Col, ControlLabel } from "react-bootstrap";
import { Button, Table, Collapse, notification, Modal, Tag, Select } from "antd";
import InputMask from "react-input-mask";
import 'antd/dist/antd.css';
import { EditFilled, UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons';
import api from "services/api";
import moment from 'moment';
import { cpf } from "cpf-cnpj-validator";

const { Panel } = Collapse;
const { Option } = Select;

class PassengerList extends Component {

    columns = [
        {
            title: 'CPF',
            width: 120,
            dataIndex: 'cpf',
            key: 'cpf',
            fixed: 'left',
        },
        {
            title: 'Nome',
            width: 120,
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
            title: 'RG',
            width: 120,
            dataIndex: 'rg',
            key: 'rg',
            fixed: 'left',
        },
        {
            title: 'Data Nascimento',
            width: 90,
            dataIndex: 'datanasc',
            key: 'datanasc',
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
                        <Button onClick={() => this.alterarPassageiro(x)} type="primary" size="small" style={{ marginRight: '5%' }}><EditFilled /></Button>
                        <Button onClick={() => this.showModal(x)} type="primary" danger size="small"><UserDeleteOutlined /></Button>
                    </div>) : <div>
                        <Button className="ant-btn-personalized" onClick={() => this.ativarPassageiro(x)} type="primary" size="small" style={{ marginRight: '5%' }}><UserAddOutlined /></Button>
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
        cpf: "",
        nome: "",
        sobreNome: "",
        rg: "",
        loading: false,
        visible: false,
        cpfParaDesativar: "",
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

    dataPassenger = {};

    handleClick = () => {
        this.props.history.push("/admin/Passenger/PassengerInsert.jsx")
    }

    showModal = (x) => {
        let cpf = x.cpf;
        this.setState({
            cpfParaDesativar: cpf,
            visible: true,
        });
    };

    confirmarModal = () => {
        this.desativaPassageiro();
        this.setState({
            visible: false,
        });
    };

    cancelarModal = () => {
        this.setState({
            visible: false,
        });
    };

    alterarPassageiro(x) {
        let cpf = this.removeMascaraCpf(x.cpf);
        this.props.history.push(`/admin/Passenger/PassengerInsert/${cpf}`)
    }

    async ativarPassageiro(x) {
        let cpf = this.removeMascaraCpf(x.cpf);
        try {
            this.populaCamposAtivar(cpf);
            await api.put('api/persons/individual/', this.dataPassenger, {
                params: {
                    cpf: cpf
                },
            });
            notification.success({
                message: `Passageiro(a) ativado com sucesso`,
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

    async desativaPassageiro() {
        try {
            this.populaCamposDesativar();
            await api.put('api/persons/individual/', this.dataPassenger, {
                params: {
                    cpf: this.removeMascaraCpf(this.state.cpfParaDesativar)
                },
            });
            notification.warning({
                message: `Passageiro(a) desativado com sucesso`,
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

    mascaraCpf(cpf) {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
    }

    removeMascaraCpf(cpf) {
        return this.removeCaractEspecial(cpf);
    }

    mascaraCnpj(cnpj) {
        return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5");
    }

    removeCaractEspecial(texto) {
        return texto.replace(/[^a-zA-Z0-9]/g, '');
    }

    populaCamposAtivar(cpf) {
        this.dataPassenger = {
            individual: {
                active: true,
                cpf: cpf
            }
        }
    }

    populaCamposDesativar() {
        this.dataPassenger = {
            individual: {
                active: false,
                cpf: this.removeMascaraCpf(this.state.cpfParaDesativar)
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
                    cpf: this.removeMascaraCpf(this.state.cpf),
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
                    cpf: this.mascaraCpf(item.cpf),
                    name: item.name_individual,
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
                console.log(error);
                notification.warning({
                    message: "Aviso",
                    description: `Motivo: ${error.response.data.message}`
                });
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
                            passageiro CPF: {this.state.cpfParaDesativar} ?
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
                                    <form name="formFilterPassenger">
                                        <Row>
                                            <div className="col-md-2">
                                                <ControlLabel>CPF</ControlLabel>
                                                <InputMask mask="999.999.999-99" name="cpf" value={this.state.cpf}
                                                    type="text" className="form-control" onBlur={this.validaCpf(this.state.cpf)}
                                                    placeholder="999.999.999-99" onChange={this.onChange} />
                                            </div>
                                            <div className="col-md-3">
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
                                                <ControlLabel>RG</ControlLabel>
                                                <input name="rg" value={this.state.rg}
                                                    type="text" className="form-control"
                                                    placeholder="9999999" onChange={this.onChange} />
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