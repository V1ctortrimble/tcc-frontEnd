import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import {Typography, Button, Table} from "antd";
import 'antd/dist/antd.css';
import { iconsArray } from "variables/Variables.jsx";

const { Title } = Typography;

const columns = [
    {
      title: 'Nome Empresa',
      width: 200,
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
    },
    {
      title: 'CNPJ',
      width: 200,
      dataIndex: 'cnpj',
      key: 'cnpj',
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
      name: 'Paty e Eliza Tur',
      cnpj: '00.000.000/0001-00',
    },
    {
      key: '2',
      name: 'Paty e Eliza Transportes',
      cnpj: '99.999.999/0001-99',
    },
  ];


class SystemCompany extends Component {
  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
            <Title level={2}>Empresa do Sistema</Title> 
            <Button type="primary">Novo</Button>
            <p></p>
            <Table columns={columns} dataSource={data} bordered scroll={{ x: 100 }} />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default SystemCompany;