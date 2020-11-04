import React, { Component } from "react";
import { Grid, Row, Col, ControlLabel } from "react-bootstrap";
import { Button, Table, Collapse, notification } from "antd";
import InputMask from "react-input-mask";
import 'antd/dist/antd.css';
import { EditFilled } from '@ant-design/icons';
import api from "services/api";
import moment from 'moment';
import { cpf } from "cpf-cnpj-validator";

const { Panel } = Collapse;

class PassengerList extends Component {

    columns = [
        {
            title: 'CPF',
            width: 150,
            dataIndex: 'cpf',
            key: 'cpf',
            fixed: 'left',
        },
        {
            title: 'Nome',
            width: 200,
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
        },
        {
            title: 'Sobrenome',
            width: 200,
            dataIndex: 'sobrenome',
            key: 'sobrenome',
            fixed: 'left',
        },
        {
            title: 'RG',
            width: 150,
            dataIndex: 'rg',
            key: 'rg',
            fixed: 'left',
        },
        {
            title: 'Data Nascimento',
            width: 150,
            dataIndex: 'datanasc',
            key: 'datanasc',
            fixed: 'right',
            align: 'center'
        },
        {
            title: 'Ação',
            key: 'operation',
            fixed: 'right',
            width: 80,
            render: (x) =>
                <Button onClick={() => this.alterarPassageiro(x)} type="primary" size="small"><EditFilled /></Button>
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
    }

    handleClick = () => {
        this.props.history.push("/admin/Passenger/PassengerInsert.jsx")
    }

    alterarPassageiro(x) {
        let cpf = this.removeMascaraCpf(x.cpf);
        this.props.history.push(`/admin/Passenger/PassengerInsert/${cpf}`)
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

    onChange = (event) => {
        const state = Object.assign({}, this.state);
        const field = event.target.name;
        state[field] = event.target.value;
        this.setState(state);
    }

    async buscarIndividualApi(current = 1, size = 10) {
        this.setState({ loading: true });
        let x = [];
        try {
            const data = await api.get('api/persons/individual/filter', {
                params: {
                    pageNumber: current,
                    pageSize: size,
                    cpf: this.removeMascaraCpf(this.state.cpf),
                    name: this.state.nome,
                    lastname: this.state.sobreNome,
                    rg: this.state.rg,
                    sort: 'nameIndividual,asc'
                },  
            });
            data.data.content.forEach((item, index) => {
                x.push({
                    key: index,
                    cpf: this.mascaraCpf(item.cpf),
                    name: item.name_individual,
                    sobrenome: item.last_name,
                    rg: item.rg,
                    datanasc: moment(item.birth_date).format("DD/MM/YYYY")
                })
            })
            this.setState({ data: x });
            this.setState({
                pager: {
                    current: current,
                    pageSize: size,
                    total: data,
                }
            })
        } catch (error) {
            console.log(error);
            notification.error({
                message: "Algo de errado aconteceu",
                description: `Motivo: ${error.response.data.message}`
            });
            this.setState({ data: "" });
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
                    <Row>
                        <Col md={12}>
                            <Button onClick={this.handleClick} className="ant-btn-primary">Novo</Button>
                            <p></p>
                            <Collapse>
                                <Panel header="Filtros" key="1">
                                    <form name="formFilterPassenger">
                                        <Row>
                                            <div className="col-md-3">
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
                                            <div className="col-md-3">
                                                <ControlLabel>RG</ControlLabel>
                                                <input name="rg" value={this.state.rg}
                                                    type="text" className="form-control"
                                                    placeholder="9999999" onChange={this.onChange} />
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
                                onChange={(pagination) => { this.buscarIndividualApi(pagination.current, pagination.pageSize) }} />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default PassengerList;