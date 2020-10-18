import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { Button, Table} from "antd";
import 'antd/dist/antd.css';
import {EditFilled} from '@ant-design/icons';

//const [pager, setPager] = useState();

/*setPager({
current: 1,
pageSize: 10,
total: 100,
});*/

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
      render: () => <a href="/admin"><Button type="primary" size="small"><EditFilled/></Button> </a>,
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


class SystemCompanyList extends Component {
  handleClick = () => {
    this.props.history.push("/admin/systemCompany/SystemCompanyInsert.jsx")
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
          }}/>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default SystemCompanyList;