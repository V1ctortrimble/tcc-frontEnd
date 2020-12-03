import { Col, ControlLabel, Grid, Row } from "react-bootstrap";
import React, { Component } from "react";
import Card from "components/Card/Card";
import { Input, Form, Space, Button, Select, Divider, notification } from "antd";
import InputMask from "react-input-mask";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import NumberFormat from 'react-number-format';
import api from "services/api";
import moment from "moment";

const { TextArea } = Input;
const { Option } = Select;

class TravelPackageInsert extends Component {
    state = {
        active: true,
        loading: false,
        idPacoteViavgem: null,
        nomeViagem: "",
        localOrigem: "",
        localDestino: "",
        percurso: "",
        descViagem: "",
        dataInicio: "",
        horaInicio: "",
        minutoInicio: "",
        dataFim: "",
        horaFim: "",
        minutoFim: "",
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
        empresas: [{}],
    };

    dataTravelPackage = {};

    horas = {};

    saveTravelPackage = async () => {
        //e.preventDefault();
        this.setState({
            loading: true,
        })
        if (this.state.idPacoteViavgem !== null) {
            try {
                this.popularCamposPacoteViagemPost();
                await api.put('/api/travelpackage', this.dataTravelPackage);
                notification.success({
                    message: `Pacote de viagem atualizado com sucesso`,
                });
                this.limpaCamposPacoteViagem();
                this.props.history.push(`/admin/TravelPackage/TravelPackageList.jsx`);
            } catch (error) {
                if (error.response) {
                    notification.error({
                        message: `Não foi possível atualizar pacote de viagem`,
                        description: `Motivo: ${error.response.data.message}`
                    });
                }
                try {
                    const empresasHospedagens = await api.get('api/hosting/all');
                    this.popularEmpresasHospedagens(empresasHospedagens);
                } catch (error) {
                    if (error.response) {
                        notification.error({
                            message: "Não foi possível carregar os dados de hospedagens",
                            description: `Motivo: ${error.response.data.message}`
                        })
                    }
                } finally {
                    this.setState({ loading: false })
                }
            }
        } else {
            try {
                this.popularCamposPacoteViagemPost();
                await api.post('/api/travelpackage', this.dataTravelPackage);
                notification.success({
                    message: 'Pacote de viagem cadastrado com sucesso',
                });
                this.limpaCamposPacoteViagem();
            } catch (error) {
                if (error.response) {
                    notification.error({
                        message: 'Não foi possível salvar pacote de viagem',
                        description: `Motivo: ${error.response.data.message}`
                    });
                }
            } finally {
                this.setState({ loading: false });
            }
        }
    };

    popularCamposPacoteViagemPost() {
        const horasInicio = this.state.horaInicio.split(':');
        const horasFim = this.state.horaFim.split(':');
        const hostings = this.idsHospedagem();
        const vehicles = this.idsVeiculos();
        this.dataTravelPackage = {
            active: true,
            adult_price: this.state.precoAdulto,
            child_price: this.state.precoCrianca,
            desc_travel_package: this.state.descViagem,
            destination_name: this.state.localDestino,
            end_date: this.state.dataFim,
            estimated_end_time: {
                hour: horasFim[0],
                minute: horasFim[1],
                nano: 0,
                second: "0",
            },
            expected_start_time: {
                hour: horasInicio[0],
                minute: horasInicio[1],
                nano: 0,
                second: "0",
            },
            feature_travel_package: "",
            hostings: [
                hostings
            ],
            name_travel_package: this.state.nomeViagem,
            origin_name: this.state.localOrigem,
            payment_methods: this.state.formaPagamento,
            registration_date: moment().format("YYYY-MM-DD"),
            route: this.state.percurso,
            start_date: this.state.dataInicio,
            vehicles: [
                vehicles
            ]
        }
    }

    popularLocaisHospedagens(locaisHospedagens) {
        let locHosp = []
        locaisHospedagens.data.forEach((item) => {
            locHosp.push({
                active: item.active,
                endereco: {
                    complemento: item.adress.additional,
                    endereco: item.adress.adress,
                    numero: item.adress.adress_number,
                    cidade: item.adress.city,
                    idEndereco: item.adress.id_adress,
                    bairro: item.adress.neighborhood,
                    estado: item.adress.state,
                    cep: item.adress.zip_code,
                },
                cnpj: item.document,
                descricao: item.features_hosting,
                tipoHospedagem: {
                    idTipoHospedagem: item.hosting_type.id_hosting_type,
                    nomeTipoHospedagem: item.hosting_type.name_hosting_type,
                },
                idHospedagem: item.id_hosting,
                quantidadePessoas: item.quantity_person,
                registroTurismo: item.tourism_regis,
            });
        });
        this.setState({
            locaisHospedagens: locHosp,
        })
    }

    popularVeiculosTransportes(veiculosTransportes) {
        let veicTransp = [];
        veiculosTransportes.data.forEach((item) => {
            veicTransp.push({
                active: item.active,
                empresa: {
                    active: item.company.active,
                    cnpj: item.company.cnpj,
                    nomeFantasia: item.company.fantasy_name,
                    idEmpresa: item.company.id_company,
                    dataAbertura: item.company.open_date,
                    razaoSocial: item.company.social_reason,
                    inscricaoEstadual: item.company.state_regis,
                },
                idVeiculo: item.id_vehicle,
                rntrc: item.rntrc,
                tipoVeiculo: {
                    acessibilidade: item.vehicle_type.accessibility,
                    banheiro: item.vehicle_type.bathroom,
                    descricao: item.vehicle_type.description,
                    idTipoVeiculo: item.vehicle_type.id_vehicle_type,
                    fabricante: item.vehicle_type.manufacturer,
                    modelo: item.vehicle_type.model,
                    nomeTipoVeiculo: item.vehicle_type.name_vehicle_type,
                    numAssentos: item.vehicle_type.num_seats,
                    tipoAssentos: item.vehicle_type.seats_type,
                }
            });
        });
        this.setState({
            veiculosTransportes: veicTransp,
        })

    }

    popularCamposPacoteViagemEdit(pacoteViagem) {
        this.juntarHorasInicio(pacoteViagem.data.estimated_end_time);
        this.juntarHorasFim(pacoteViagem.data.expected_start_time);
        this.setState({
            active: pacoteViagem.data.active,
            precoAdulto: pacoteViagem.data.adult_price,
            precoCrianca: pacoteViagem.data.child_price,
            descViagem: pacoteViagem.data.desc_travel_package,
            localDestino: pacoteViagem.data.destination_name,
            dataFim: pacoteViagem.data.end_date,
            hospedagens: pacoteViagem.data.hostings,
            idPacoteViavgem: pacoteViagem.data.id_travel_package,
            nomeViagem: pacoteViagem.data.name_travel_package,
            localOrigem: pacoteViagem.data.origin_name,
            formaPagamento: pacoteViagem.data.payment_methods,
            percurso: pacoteViagem.data.route,
            dataInicio: pacoteViagem.data.start_date,
            transportes: pacoteViagem.data.vehicles,
        })
    }

    limpaCamposPacoteViagem() {
        this.setState({
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
            idTransporte: null,
            transporte: "",
            idVeiculoTransporte: null,
            veiculoTransporte: "",
        })
    }

    idsHospedagem() {

    }

    idsVeiculos() {

    }

    onChange = (event) => {
        const state = Object.assign({}, this.state);
        const field = event.target.name;
        state[field] = event.target.value;
        this.setState(state);
    }

    juntarHorasInicio = (horaPacote) => {
        const hora = `${horaPacote.hour}:${horaPacote.minute}`
        this.setState({
            horaInicio: hora,
        })
    }

    juntarHorasFim = (horaPacote) => {
        const hora = `${horaPacote.hour}:${horaPacote.minute}`
        this.setState({
            horaFim: hora,
        })
    }

    toBackList = () => {
        this.props.history.push("/admin/TravelPackage/TravelPackageList.jsx")
    }

    async componentDidMount() {
        if (this.props.match.params.id != null) {
            try {
                const pacoteViagem = await api.get(`/api/travelpackage/id`, {
                    params: {
                        idtravelpackge: this.props.match.params.id,
                    }
                });
                this.popularCamposPacoteViagemEdit(pacoteViagem);
            } catch (error) {
                if (error.response) {
                    notification.error({
                        message: "Não foi possível carregar os dados para edição",
                        description: `Motivo: ${error.response.data.message}`
                    })
                }
            }
        }
        try {
            let x = [];
            const data = await api.get('/api/persons/company/filter', {
                params: {
                    page: 0,
                    size: 100,
                    cnpj: "",
                    socialreason: "",
                    fantasyname: "",
                    sort: 'fantasyName,asc',
                    active: true,
                },
            });
            data.data.content.forEach((item, index) => {
                x.push({
                    key: index,
                    cnpj: item.cnpj,
                    fantasyName: item.fantasy_name,
                    socialReason: item.social_reason,
                    openDate: moment(item.open_date).format("DD/MM/YYYY"),
                    status: item.active
                })
            })
            this.setState({ empresas: x });
        } catch (error) {
            if (error.response) {
                notification.error({
                    message: "Não foi possível carregar os dados de empresas",
                    description: `Motivo: ${error.response.data.message}`
                })
            }
        }
        try {
            const locaisHospedagens = await api.get('api/hosting/all');
            this.popularLocaisHospedagens(locaisHospedagens);
        } catch (error) {
            if (error.response) {
                notification.error({
                    message: "Não foi possível carregar os dados de hospedagens",
                    description: `Motivo: ${error.response.data.message}`
                })
            }
        }
        try {
            const veiculosTransportes = await api.get('api/vehicles/all');
            this.popularVeiculosTransportes(veiculosTransportes);
        } catch (error) {
            if (error.response) {
                notification.error({
                    message: "Não foi possível carregar os dados de transportes",
                    description: `Motivo: ${error.response.data.message}`
                })
            }
        }
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
                                <Form name="formPacoteViagem" onFinish={this.saveTravelPackage}>
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
                                    <Divider orientation="left">Financeiro</Divider>
                                    <Row>
                                        <div className="col-md-2">
                                            <ControlLabel>Preço Adulto</ControlLabel>
                                            <NumberFormat name="precoAdulto"
                                                value={this.state.precoAdulto} prefix={'R$ '} required
                                                thousandSeparator="," decimalSeparator="." fixedDecimalScale={true}
                                                decimalScale={2} style={{ height: "40px" }}
                                                placeholder="R$ 150,00" onValueChange={(values) => {
                                                    const { value } = values;
                                                    this.setState({
                                                        precoAdulto: value,
                                                    })
                                                }} />
                                        </div>
                                        <div className="col-md-2">
                                            <ControlLabel>Preço Criança / Idoso</ControlLabel>
                                            <NumberFormat name="precoCrianca"
                                                value={this.state.precoCrianca} prefix={'R$ '} required
                                                thousandSeparator="," decimalSeparator="." fixedDecimalScale={true}
                                                decimalScale={2} style={{ height: "40px" }}
                                                placeholder="R$ 100,00" onValueChange={(values) => {
                                                    const { value } = values;
                                                    this.setState({
                                                        precoCrianca: value,
                                                    })
                                                }} />
                                        </div>
                                        <div className="col-md-5">
                                            <ControlLabel>Formas de Pagamento</ControlLabel>
                                            <input name="formaPagamento" value={this.state.formaPagamento}
                                                className="form-control" placeholder="Cheque / Cartão / 3x"
                                                required onChange={this.onChange} ></input>
                                        </div>
                                    </Row>
                                    <Divider orientation="left">Hospedagem e Transporte</Divider>
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
                                    <div className="ant-row ant-row-end">
                                        <div className="ant-col">
                                            <Button type="info" size="middle" onClick={this.toBackList}>
                                                Voltar
                                            </Button>
                                        </div>
                                        <div className="ant-col">
                                            <Button type="primary" size="middle" htmlType="submit" loading={this.state.loading}>
                                                Salvar
                                            </Button>
                                        </div>
                                    </div>
                                </Form>
                            </Col>
                        </Row>
                    </Grid>

                } />

            </div>
        )
    }

} export default TravelPackageInsert;