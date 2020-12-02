import { Col, ControlLabel, Grid, Row } from "react-bootstrap";
import React, { Component } from "react";
import Card from "components/Card/Card";
import { Input, Form, Space, Button, Select } from "antd";
import InputMask from "react-input-mask";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

class TravelPackageInsert extends Component {
    state = {
        idPacoteViavgem: null,
        nomeViagem: "",
        localOrigem: "",
        localDestino: "",
        percurso: "",
        descViagem: "",
        dataInicio: "",
        horaInicio: "",
        dataFim: "",
        horaFim: "",
        precoAdulto: "",
        precoCrianca: "",
        formaPagamento: "",
        idHospedagem: null,
        hospedagem: "",
        idLocalHospedagem: null,
        localHospedagem: "",
        hospedagens: [{}],
        locaisHospedagens: [{}],
        idTransporte: null,
        transporte: "",
        idVeiculoTransporte: null,
        veiculoTransporte: "",
        transportes: [{}],
        veiculosTransportes: [{}],

    };

    async saveTravelPackage() {

    };

    onChange = (event) => {
        const state = Object.assign({}, this.state);
        const field = event.target.name;
        state[field] = event.target.value;
        this.setState(state);
        console.log(this.state);
    }

    render() {
        return (
            <div className="content">
                <Card content={
                    <Grid fluid>
                        <Row>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <Form name="formPacoteViagem" onSubmit={this.saveTravelPackage}>
                                    <Row>
                                        <div className="col-md-2">
                                            <ControlLabel>Código Identificador</ControlLabel>
                                            <input name="idPacoteViagem" value={this.state.idPacoteViavgem}
                                                type="text" className="form-control" maxLength="20" disabled
                                                placeholder="Código Pacote" onChange={this.onChange} />
                                        </div>
                                        <div className="col-md-3">
                                            <ControlLabel>Nome da Viagem</ControlLabel>
                                            <input name="nomeViagem" value={this.state.nomeViagem}
                                                type="text" className="form-control" maxLength="50" required
                                                placeholder="Excursão para ..." onChange={this.onChange} />
                                        </div>
                                    </Row>
                                    <Row>
                                        <div className="col-md-3">
                                            <ControlLabel>Local Origem</ControlLabel>
                                            <input name="localOrigem" value={this.state.localOrigem}
                                                type="text" className="form-control" maxLength="50" required
                                                placeholder="Londrina" onChange={this.onChange} />
                                        </div>
                                        <div className="col-md-3">
                                            <ControlLabel>Local Destino</ControlLabel>
                                            <input name="localDestino" value={this.state.localDestino}
                                                type="text" className="form-control" maxLength="50" required
                                                placeholder="São Paulo" onChange={this.onChange} />
                                        </div>
                                        <div className="col-md-3">
                                            <ControlLabel>Percurso</ControlLabel>
                                            <TextArea rows={5} name="percurso" value={this.state.percurso}
                                                type="text" className="form-control" style={{ padding: "8px 12px", marginTop: "10px" }}
                                                placeholder="Saida do centro de Londrina, passando por ibiporã, parada no Mapy Ourinhos e última parada na barra funda em São Paulo."
                                                required onChange={this.onChange} />
                                        </div>
                                        <div className="col-md-3">
                                            <ControlLabel>Descrição da Viagem</ControlLabel>
                                            <TextArea rows={5} name="descViagem" value={this.state.descViagem}
                                                type="text" className="form-control" style={{ padding: "8px 12px", marginTop: "10px" }}
                                                placeholder="O pacote inclui ... e passará pelos pontos turísticos .... e ...."
                                                required onChange={this.onChange} />
                                        </div>
                                    </Row>
                                    <Row>
                                        <div className="col-md-2">
                                            <ControlLabel>Data de Início</ControlLabel>
                                            <input name="dataInicio" value={this.state.dataInicio}
                                                type="date" className="form-control"
                                                placeholder="XX/XX/XXXX" required onChange={this.onChange} />
                                        </div>
                                        <div className="col-md-2">
                                            <ControlLabel>Hora de Início</ControlLabel>
                                            <InputMask name="horaInicio" className="form-control"
                                                value={this.state.horaInicio} placeholder="hh:mm" type="text" mask="99:99"
                                                required onChange={this.onChange} />
                                        </div>
                                        <div className="col-md-2">
                                            <ControlLabel>Data de Fim</ControlLabel>
                                            <input name="dataFim" value={this.state.dataFim}
                                                type="date" className="form-control"
                                                placeholder="XX/XX/XXXX" required onChange={this.onChange} />
                                        </div>
                                        <div className="col-md-2">
                                            <ControlLabel>Hora Fim</ControlLabel>
                                            <InputMask name="horaFim" className="form-control"
                                                value={this.state.horaFim} placeholder="hh:mm" type="text" mask="99:99"
                                                required onChange={this.onChange} />
                                        </div>
                                    </Row>
                                    <Row>
                                        <div className="col-md-2">
                                            <ControlLabel>Financeiro</ControlLabel>
                                        </div>
                                    </Row>
                                    <Row>
                                        <div className="col-md-2">
                                            <ControlLabel>Preço Adulto</ControlLabel>
                                            <input
                                                type="number" step="0.01" min="0.01"
                                                name="precoAdulto" className="form-control"
                                                value={this.state.precoAdulto} placeholder="R$ 150,00"
                                                required onChange={this.onChange} />
                                        </div>
                                        <div className="col-md-2">
                                            <ControlLabel>Preço Criança / Idoso</ControlLabel>
                                            <InputMask
                                                mask="R$ 999,99" type="text"
                                                name="precoCrianca" className="form-control"
                                                value={this.state.precoCrianca} placeholder="R$ 100,00"
                                                required onChange={this.onChange} />
                                        </div>
                                        <div className="col-md-5">
                                            <ControlLabel>Formas de Pagamento</ControlLabel>
                                            <input name="formaPagamento" value={this.state.formaPagamento}
                                                className="form-control" placeholder="Cheque / Cartão / 3x"
                                                required onChange={this.onChange} ></input>
                                        </div>
                                    </Row>
                                    <Row>
                                        <div className="col-md-6">
                                            <ControlLabel style={{ marginTop: "15px" }}>Hospedagem(ns):</ControlLabel>
                                        </div>
                                        <div className="col-md-6">
                                            <ControlLabel style={{ marginTop: "15px" }}>Transporte(s):</ControlLabel>
                                        </div>
                                    </Row>
                                    <Row>
                                        <div className="col-md-6">
                                            <Form.List name="hospedagens">
                                                {(fields, { add, remove }) => (
                                                    <>
                                                        {fields.map(field => (
                                                            <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                                <Form.Item
                                                                    {...field}
                                                                    name={[field.name, 'hospedagem']}
                                                                    fieldKey={[field.fieldKey, 'idHospedagem']}
                                                                    rules={[{ required: true, message: 'Seleciona a Hospedagem' }]}
                                                                >
                                                                    <Select
                                                                        style={{ textAlign: 'left', marginTop: '15px', fontSize: '14px', width: '200px' }}
                                                                        showSearch
                                                                        required
                                                                        value={this.state.idHospedagem}
                                                                        name="empresaHospedagem"
                                                                        placeholder="Selecione a empresa"
                                                                        /*onChange={(value, key) =>
                                                                            this.setState({
                                                                                empresaSistema: {
                                                                                    cnpj: value,
                                                                                    empresa: key
                                                                                }
                                                                            })
                                                                        }*/
                                                                        optionFilterProp="children"
                                                                        filterOption={(input, option) =>
                                                                            option.children
                                                                                .toLowerCase()
                                                                                .indexOf(input.toLowerCase()) >= 0
                                                                        }
                                                                    >
                                                                        {this.state.hospedagens.map((item) => (
                                                                            <Option value={item.idHospedagem} key={item.idHospedagem}>
                                                                                {item.hospedagem}
                                                                            </Option>
                                                                        ))}
                                                                    </Select>
                                                                </Form.Item>
                                                                <Form.Item
                                                                    {...field}
                                                                    name={[field.name, 'localHospedagem']}
                                                                    fieldKey={[field.fieldKey, 'idLocalHospedagem']}
                                                                    rules={[{ required: true, message: 'Selecione o local de Hospedagem' }]}
                                                                >
                                                                    <Select
                                                                        style={{ textAlign: 'left', marginTop: '15px', fontSize: '14px', width: '200px' }}
                                                                        showSearch
                                                                        required
                                                                        value={this.state.idLocalHospedagem}
                                                                        name="localHospedagem"
                                                                        placeholder="Selecione o local"
                                                                        /*onChange={(value, key) =>
                                                                            this.setState({
                                                                                empresaSistema: {
                                                                                    cnpj: value,
                                                                                    empresa: key
                                                                                }
                                                                            })
                                                                        }*/
                                                                        optionFilterProp="children"
                                                                        filterOption={(input, option) =>
                                                                            option.children
                                                                                .toLowerCase()
                                                                                .indexOf(input.toLowerCase()) >= 0
                                                                        }
                                                                    >
                                                                        {this.state.locaisHospedagens.map((item) => (
                                                                            <Option value={item.idLocalHospedagem} key={item.idLocalHospedagem}>
                                                                                {item.localHospedagem}
                                                                            </Option>
                                                                        ))}
                                                                    </Select>
                                                                </Form.Item>
                                                                <MinusCircleOutlined onClick={() => remove(field.name)} />
                                                            </Space>
                                                        ))}
                                                        <Form.Item>
                                                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                                Adicionar Hospedagem
                                                        </Button>
                                                        </Form.Item>
                                                    </>
                                                )}
                                            </Form.List>
                                        </div>
                                        <div className="col-md-6">
                                            <Form.List name="transportes">
                                                {(fields, { add, remove }) => (
                                                    <>
                                                        {fields.map(field => (
                                                            <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                                <Form.Item
                                                                    {...field}
                                                                    name={[field.name, 'transporte']}
                                                                    fieldKey={[field.fieldKey, 'idTransporte']}
                                                                    rules={[{ required: true, message: 'Seleciona a Empresa de Transporte' }]}
                                                                >
                                                                    <Select
                                                                        style={{ textAlign: 'left', marginTop: '15px', fontSize: '14px', width: '200px' }}
                                                                        showSearch
                                                                        required
                                                                        value={this.state.idTransporte}
                                                                        name="empresaTransporte"
                                                                        placeholder="Selecione a empresa"
                                                                        /*onChange={(value, key) =>
                                                                            this.setState({
                                                                                empresaSistema: {
                                                                                    cnpj: value,
                                                                                    empresa: key
                                                                                }
                                                                            })
                                                                        }*/
                                                                        optionFilterProp="children"
                                                                        filterOption={(input, option) =>
                                                                            option.children
                                                                                .toLowerCase()
                                                                                .indexOf(input.toLowerCase()) >= 0
                                                                        }
                                                                    >
                                                                        {this.state.transportes.map((item) => (
                                                                            <Option value={item.idTransporte} key={item.idTransporte}>
                                                                                {item.transporte}
                                                                            </Option>
                                                                        ))}
                                                                    </Select>
                                                                </Form.Item>
                                                                <Form.Item
                                                                    {...field}
                                                                    name={[field.name, 'veiculoTransporte']}
                                                                    fieldKey={[field.fieldKey, 'idVeiculoTransporte']}
                                                                    rules={[{ required: true, message: 'Selecione o veículo de transporte' }]}
                                                                >
                                                                    <Select
                                                                        style={{ textAlign: 'left', marginTop: '15px', fontSize: '14px', width: '200px' }}
                                                                        showSearch
                                                                        required
                                                                        value={this.state.idVeiculoTransporte}
                                                                        name="veiculoTransporte"
                                                                        placeholder="Selecione o local"
                                                                        /*onChange={(value, key) =>
                                                                            this.setState({
                                                                                empresaSistema: {
                                                                                    cnpj: value,
                                                                                    empresa: key
                                                                                }
                                                                            })
                                                                        }*/
                                                                        optionFilterProp="children"
                                                                        filterOption={(input, option) =>
                                                                            option.children
                                                                                .toLowerCase()
                                                                                .indexOf(input.toLowerCase()) >= 0
                                                                        }
                                                                    >
                                                                        {this.state.veiculosTransportes.map((item) => (
                                                                            <Option value={item.idVeiculoTransporte} key={item.idVeiculoTransporte}>
                                                                                {item.veiculoTransporte}
                                                                            </Option>
                                                                        ))}
                                                                    </Select>
                                                                </Form.Item>
                                                                <MinusCircleOutlined onClick={() => remove(field.name)} />
                                                            </Space>
                                                        ))}
                                                        <Form.Item>
                                                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                                Adicionar Transporte
                                                        </Button>
                                                        </Form.Item>
                                                    </>
                                                )}
                                            </Form.List>
                                        </div>
                                    </Row>
                                </Form>
                            </Col>
                        </Row>
                    </Grid>

                } />

            </div>
        )
    }

} export default TravelPackageInsert;