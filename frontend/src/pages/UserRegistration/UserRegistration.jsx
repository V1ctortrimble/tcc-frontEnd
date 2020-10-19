import React, { Component } from "react";
import {
  Grid,
  Row,
  Col
} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import Button from "components/CustomButton/CustomButton.jsx";

class UserProfile extends Component {
  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={8}>
              <Card
                title="Dados Pessoais"
                content={
                  <form>
                   <FormInputs
                      ncols={["col-md-4", "col-md-4", "col-md-4"]}
                      properties={[
                        {
                          label: "E-Mail",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "User@gmail.com",
                          defaultValue: ""
                        },
                        {
                          label: "Senha",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "**********",
                          defaultValue: ""
                        },
                        {
                          label: "Confirmar Senha",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "**********"
                        },
                      ]}
                    />
                    <FormInputs
                      ncols={["col-md-4", "col-md-4", "col-md-4"]}
                      properties={[
                        {
                          label: "Primeiro Nome",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Primeiro Nome",
                          defaultValue: ""
                        },
                        {
                          label: "Sobrenome",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Sobrenome",
                          defaultValue: ""
                        },
                        {
                          label: "RG",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "99.999.999-0"
                        },
                      ]}
                    />
                    <FormInputs
                      ncols={["col-md-4", "col-md-4", "col-md-4"]}
                      properties={[
                        {
                          label: "CPF",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "99.999.999-99",
                          defaultValue: ""
                        },
                        {
                          label: "Telefone Fixo",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "(43)9999-9999",
                          defaultValue: ""
                        },
                        {
                          label: "Celular ( Whatsapp )",
                          type: "email",
                          bsClass: "form-control",
                          placeholder: "(43)9999-9999"
                        },
                      ]}
                    />
                    <FormInputs
                      ncols={["col-md-7","col-md-2", "col-md-3"]}
                      properties={[
                        {
                          label: "Endereço",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Av. Jão João",
                          defaultValue:""
                        },
                        {
                          label: "Numero",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "N° 502",
                          defaultValue:""
                        },
                        {
                          label: "Logradouro",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Bloco A - Ap 09",
                          defaultValue:""
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
                          placeholder: "Cidade",
                          defaultValue: ""
                        },
                        {
                          label: "País",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "País",
                    
                        },
                        {
                          label: "CEP",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "00000-000"
                        }
                      ]}
                    />

                    <Button bsStyle="info" pullRight fill type="submit">
                      Cadastrar
                    </Button>
                    <div className="clearfix" />
                  </form>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default UserProfile;
