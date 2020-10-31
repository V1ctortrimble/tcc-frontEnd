import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { Button, Table } from "antd";
import 'antd/dist/antd.css';
import { EditFilled } from '@ant-design/icons';

//const [pager, setPager] = useState();

/*setPager({
current: 1,
pageSize: 10,
total: 100,
});*/

const columns = [
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
        render: () => <a href="/admin"><Button type="primary" size="small"><EditFilled /></Button> </a>,
    },
];

const data = [
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
];

class PassengerList extends Component {

    handleClick = () => {
        this.props.history.push("/admin/Passenger/PassengerInsert.jsx")
    }

    render() {
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Button onClick={this.handleClick} className="ant-btn-primary">Novo</Button>
                            <p></p>
                            <Table columns={columns} dataSource={data} bordered scroll={{ x: 100 }} pagination={{
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