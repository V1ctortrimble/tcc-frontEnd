import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import {Typography, Button, Table} from "antd";
import 'antd/dist/antd.css';

const { Title } = Typography;

const columns = [
    {
      title: 'Nome Completo',
      width: 200,
      dataIndex: 'name',
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
        title: 'E-mail',
        width: 200,
        dataIndex: 'email',
        key: 'email',
        fixed: 'left',
      },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: () => <a href="/admin"><Button type="primary" size="small"><iconsArray className="pe-7s-pen"/></Button> </a>,
    },
  ];

  const data = [
    {
      key: '1',
      name: 'Marcio Levandovisk',
      cpf: '999.999.999-99',
      email:'MarcioLevandovisk@gmail.com',
    },
    {
      key: '2',
      name: 'Tiago Marques',
      cpf: '999.999.999-99',
      email:'TiagoMarques@gmail.com',
    },
    {
        key: '3',
        name: 'Gustavo Henrique',
        cpf: '999.999.999-99',
        email:'Gustavo@gmail.com',
      },
  ];


class UserLister extends Component {
  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
            <Title level={2}>Cadastro</Title> 
            <a href="/admin/UserRegistration"><Button type="primary">Novo</Button></a>
            <p></p>
            <Table columns={columns} dataSource={data} bordered scroll={{ x: 100 }}/>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default UserLister;