import React, { Component } from "react";
import { Grid, Row, Col, ControlLabel } from "react-bootstrap";
import { Button, Table, Collapse, notification } from "antd";
import 'antd/dist/antd.css';
import { EditFilled } from '@ant-design/icons';
import { cnpj } from "cpf-cnpj-validator";
import InputMask from "react-input-mask";

//const [pager, setPager] = useState();

/*setPager({
current: 1,
pageSize: 10,
total: 100,
});*/

const { Panel } = Collapse;

class SystemCompanyList extends Component {

  state = {
    data: [{
    }
    ],
    pager: {
      current: 1,
      pageSize: 10,
      total: 100,
    },
    cnpj: "",
    razaoSocial: "",
    nomeFantasia: "",
    loading: false,
  }

  columns = [
    {
      title: 'Razão Social',
      width: 200,
      dataIndex: 'socialReason',
      key: 'socialReason',
      fixed: 'left',
    },
    {
      title: 'Nome Fantasia',
      width: 200,
      dataIndex: 'fantasyName',
      key: 'fantasyName',
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
      title: 'Ação',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (x) => <Button onClick={() => this.props.history.push(`/admin/systemCompany/SystemCompanyInsert/${x.cnpj}`)} type="primary" size="small"><EditFilled /></Button>
    },
  ];

  data = [
    {
      key: '1',
      socialReason: 'Paty e Eliza Tur',
      fantasyName: 'Paty Tur',
      cnpj: '00.000.000/0001-00',
    },
    {
      key: '2',
      socialReason: 'Paty e Eliza Transportes',
      fantasyName: 'Transportes Eliza',
      cnpj: '99.999.999/0001-99',
    },
  ];

  handleClick = () => {
    this.props.history.push("/admin/systemCompany/SystemCompanyInsert.jsx")
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

  validaCnpj(cnpjValidar) {
    const cnpjLimpo = this.removeCaractEspecial(cnpjValidar);
    if (cnpjLimpo.length === 14) {
      if (cnpj.isValid(cnpjLimpo)) {
      } else {
        notification.error({
          message: `CNPJ ${cnpjValidar} é inválido, favor informar um CNPJ válido`,
        });
        this.setState({ cnpj: "" });
      }
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
                  <form name="formFilterSystemCompany" onSubmit={this.filtrarDados}>
                    <Row>
                      <div className="col-md-3">
                        <ControlLabel>CNPJ</ControlLabel>
                        <InputMask mask="99.999.999/9999-99" name="cnpj" value={this.state.cnpj}
                          type="text" className="form-control" onBlur={this.validaCnpj(this.state.cnpj)}
                          placeholder="99.999.999/9999-99" onChange={this.onChange} />
                      </div>
                      <div className="col-md-3">
                        <ControlLabel>Razão Social</ControlLabel>
                        <input name="razaoSocial" value={this.state.razaoSocial}
                          type="text" className="form-control"
                          placeholder="Razão Social" onChange={this.onChange} />
                      </div>
                      <div className="col-md-3">
                        <ControlLabel>Nome Fantasia</ControlLabel>
                        <input name="nomeFantasia" value={this.state.nomeFantasia}
                          type="text" className="form-control"
                          placeholder="Nome Fantasia" onChange={this.onChange} />
                      </div>
                    </Row>
                    <div className="ant-row ant-row-end" style={{ marginTop: '30px' }}>
                      <div className="ant-col">
                        <Button size="middle" htmlType="submit"
                          type="primary" loading={this.state.loading}>Filtrar</Button>
                      </div>
                    </div>
                  </form>
                </Panel>
              </Collapse>
              <p></p>
              <Table columns={this.columns} dataSource={this.data} bordered scroll={{ x: 100 }} pagination={{
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

export default SystemCompanyList;