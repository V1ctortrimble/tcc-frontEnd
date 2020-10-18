import React, { Component } from "react";
import { Col, Grid, Row } from "react-bootstrap";
import { Steps } from "antd";
import 'antd/dist/antd.css';
import Card from "components/Card/Card";

import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import Button from "components/CustomButton/CustomButton.jsx";

const { Step } = Steps;

class SystemCompanyInsert extends Component {
    state = {
        current: 0,
        statusInitial: "process",
        statusOthers: "wait",
    };
    consultaCEP = () => {
        this.props.history.push("/admin/systemCompany/SystemCompanyList.jsx")
      }

    toBackList = () => {
        this.props.history.push("/admin/systemCompany/SystemCompanyList.jsx")
    }

    onChange = (current, statusInitial, statusOthers) => {
        this.setState({ current });
        this.setState({ statusInitial });
        this.setState({ statusOthers });
    };

    render() {
        const { current } = this.state;
        const { statusInitial } = this.state;
        const { statusOthers } = this.state;
        return (
            <div className="content">
                <Card content={
                
                <Grid fluid>
                    <Row>
                        <>
                            <Steps
                                type="navigation"
                                current={current}
                                onChange={this.onChange}
                                className="site-navigation-steps"
                            >
                                <Step status={statusInitial} title="Dados Principais" >
                                </Step>
                                <Step status={statusOthers} title="Sócios" >
                                </Step>
                                <Step status={statusOthers} title="Informações Bancárias" />
                            </Steps>
                        </>
                    </Row>
                    <p></p>
                    <Row>
                    <Col md={12}>
                          <form>
                          <FormInputs
                            ncols={["col-md-2", "col-md-5", "col-md-5"]}
                            properties={[
                              {
                                label: "CNPJ",
                                type: "text",
                                bsClass: "form-control",
                                placeholder: "00.000.000/0000-00",
                              },
                              {
                                label: "Razão Social",
                                type: "text",
                                bsClass: "form-control",
                                placeholder: "Razão Social",
                              },
                              {
                                label: "Nome Fantasia",
                                type: "text",
                                bsClass: "form-control",
                                placeholder: "Nome Fantasia"
                              }
                            ]}
                          />
                          <FormInputs
                            ncols={["col-md-3"]}
                            properties={[
                              {
                                label: "CEP",
                                type: "number",
                                bsClass: "form-control",
                                placeholder: "00000-000",
                                datamask: "00000-000",
                                maxlength: "8",
                              }
                            ]}
                          />
                    <Button bsStyle="info" fill onClick={this.consultaCEP}>
                      Consulta CEP
                    </Button>
                    <FormInputs
                            ncols={["col-md-5","col-md-2","col-md-2","col-md-3"]}
                            properties={[
                              {
                                label: "Endereço",
                                type: "text",
                                bsClass: "form-control",
                                placeholder: "Rua xxxxxxxxxxx",
                                disabled: true
                              },
                              {
                                label: "Número",
                                type: "text",
                                bsClass: "form-control",
                                placeholder: "123",
                                disabled: false
                              },
                              {
                                label: "Complemento",
                                type: "text",
                                bsClass: "form-control",
                                placeholder: "Bloco A",
                                disabled: false
                              },
                              {
                                label: "Bairro",
                                type: "text",
                                bsClass: "form-control",
                                placeholder: "Jardim Aurora",
                                disabled: true

                              }
                            ]}
                          />
                          <FormInputs
                            ncols={["col-md-4", "col-md-4", "col-md-4"]}
                            properties={[
                              {
                                label: "Cidade",
                                type: "text",
                                bsClass: "form-control",
                                placeholder: "Londrina",
                                disabled: true
                              },
                              {
                                label: "Estado",
                                type: "text",
                                bsClass: "form-control",
                                placeholder: "Paraná",
                                disabled: true
                              },
                              {
                                label: "Pais",
                                type: "text",
                                bsClass: "form-control",
                                placeholder: "Brasil",
                                disabled: true,
                              }
                            ]}
                          />
                         <div className="ant-row ant-row-end">
                         <div className="ant-col">
                    <Button bsStyle="info" pullRight onClick={this.toBackList}>
                      Voltar
                    </Button>
                    </div>
                             <div className="ant-col">
                          <Button bsStyle="primary" pullRight fill type="submit">
                      Avançar
                    </Button>
                    </div>
                 
                    </div>
                    <div className="clearfix" />
                  </form>
                          

                    </Col>
                </Row>
                </Grid>
                } />
               
            </div>
        )


    }

}
export default SystemCompanyInsert;
