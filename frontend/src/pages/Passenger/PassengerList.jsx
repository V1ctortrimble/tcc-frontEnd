import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { Button, Table } from "antd";
import 'antd/dist/antd.css';
import { EditFilled } from '@ant-design/icons';
import api from "services/api";

//const [pager, setPager] = useState();

/*setPager({
current: 1,
pageSize: 10,
total: 100,
});*/



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
        data: [
            {
                key: '1',
                cpf: '000.000.000-00',
                name: 'Jose',
                sobrenome: 'das Couves',
                datanasc: '14/01/1978'
            },
            {
                key: '2',
                cpf: '999.999.999-99',
                name: 'Sabrina',
                sobrenome: 'Sato',
                datanasc: '04/02/1981'
            },
        ]
    }

    handleClick = () => {
        this.props.history.push("/admin/Passenger/PassengerInsert.jsx")
    }

    async componentDidMount () {
        let x = [];
        try {
            const data = await api.get('api/persons/individual/all');
            data.data.content.forEach((item, index) => {
                x.push({
                    key: index,
                    cpf: item.cpf,
                    name: item.name_individual,
                    sobrenome: item.last_name,
                    datanasc: item.birth_date
                })
            })
            this.setState({data: x});
            console.log(data);
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