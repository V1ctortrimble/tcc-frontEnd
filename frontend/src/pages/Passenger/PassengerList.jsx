import React, { Component } from "react";
import { Grid, Row, Col, ControlLabel } from "react-bootstrap";
import { Button, Table, Collapse, notification } from "antd";
import InputMask from "react-input-mask";
import 'antd/dist/antd.css';
import { EditFilled } from '@ant-design/icons';
import api from "services/api";
import moment from 'moment';
import { cpf } from "cpf-cnpj-validator";

//const [pager, setPager] = useState();

/*setPager({
current: 1,
pageSize: 10,
total: 100,
});*/

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
                <Button onClick={() => this.props.history.push(`/admin/Passenger/PassengerInsert/${x.cpf}`)} type="primary" size="small"><EditFilled /></Button>
        },
    ];

    state = {
        data: [{

        }
        ],
        pager: {
            current: 1,
            pageSize: 10,
            total: 100,
        },
        cpf: "",
        nome: "",
        sobreNome: "",
        dataNasc: "",
        loading: false,
    }

    handleClick = () => {
        this.props.history.push("/admin/Passenger/PassengerInsert.jsx")
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

    removeCaractEspecial(texto) {
        return texto.replace(/[^a-zA-Z0-9]/g, '');
    }

    filtrarDados() {

    }

    onChange = (event) => {
        const state = Object.assign({}, this.state);
        const field = event.target.name;
        state[field] = event.target.value;
        this.setState(state);
    }

    async componentDidMount() {
        console.log(this.props);
        let x = [];
        try {
            const data = await api.get('api/persons/individual/all');
            data.data.content.forEach((item, index) => {
                x.push({
                    key: index,
                    cpf: item.cpf,
                    name: item.name_individual,
                    sobrenome: item.last_name,
                    datanasc: moment(item.birth_date).format("DD/MM/YYYY")
                })
            })
            this.setState({ data: x });
        } catch (error) {
            console.log(error);
        }
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
                                <form name="formFilterPassenger" onSubmit={this.filtrarDados}>
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
                                                <ControlLabel>Data Nascimento</ControlLabel>
                                                <input name="Data Nascimento" value={this.state.dataNasc}
                                                    type="text" className="form-control"
                                                    placeholder="xx/xx/xxxx" onChange={this.onChange} />
                                            </div>
                                            </Row>
                                            <div className="ant-row ant-row-end" style={{ marginTop: '30px'}}>
                                                <div className="ant-col">
                                                    <Button size="middle" htmlType="submit"
                                                        type="primary" loading={this.state.loading}>Filtrar</Button>
                                                </div>
                                            </div>
                                        </form>
                                    
                                </Panel>
                            </Collapse>
                            <p></p>
                            <Table columns={this.columns} dataSource={this.state.data} bordered scroll={{ x: 100 }} pagination={{
                                showTotal: total =>
                                    `Total de ${total} ${total > 1 ? 'itens' : 'item'}`,
                                showQuickJumper: true,
                                showSizeChanger: true,
                            }} />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default PassengerList;