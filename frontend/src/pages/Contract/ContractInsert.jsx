import { Divider, Select, Form, notification, Button, Space } from "antd";
import React, { Component } from "react";
import { Grid, Row, Col, ControlLabel } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import InputMask from "react-input-mask";
import { MinusCircleOutlined, PlusOutlined, FileDoneOutlined } from '@ant-design/icons';
import api from "services/api";
import moment from "moment";

const { Option } = Select;

class ContractInsert extends Component {

    state = {
        loading: false,
        loadingPrint: false,
        idContrato: null,
        idEmpresaContratada: null,
        idPacoteViagem: null,
        empresaContratada: {
            idEmpresaContratada: null,
            cnpjContratada: "",
            nomeFantasiaContratada: "",
        },
        empresasContratadas: [{}],
        pacoteViagem: {
            idPacoteViagem: null,
            nomePacoteViagem: "",
            localOrigem: "",
            localDestino: "",
            dataInicio: "",
            dataFim: "",
        },
        pacotesViagens: [{}],
        passageiros: [{}],
        passageiroContratante: {
            idPessoa: null,
            nomePessoa: "",
            sobreNomePessoa: "",
            cpfPessoa: "",
            rgPessoa: "",
            celularPessoa: "",
            telefonePessoa: "",
        },
        passageiroAcompanhante: null,
        passageirosAcompanhantesPost: null,
        localEmbarque: "",
        localDesembarque: "",

    }

    dataContract = {};

    limpaCamposContrato() {
        this.setState({
            idContrato: null,
            empresaContratada: {
                idEmpresaContratada: null,
                cnpjContratada: "",
                nomeFantasiaContratada: "",
            },
            pacoteViagem: {
                idPacoteViagem: null,
                nomePacoteViagem: "",
                localOrigem: "",
                localDestino: "",
                dataInicio: "",
                dataFim: "",
            },
            passageiroContratante: {
                idPessoa: null,
                nomePessoa: "",
                sobreNomePessoa: "",
                cpfPessoa: "",
                rgPessoa: "",
                celularPessoa: "",
                telefonePessoa: "",
            },
            passageiroAcompanhante: [{
                idPassageiroAcompanhante: null,
                nomePessoa: "",
                sobreNomePessoa: "",
                cpfPessoa: "",
                rgPessoa: ""
            }],
            localEmbarque: "",
            localDesembarque: "",
        })
    }

    saveContract = async () => {
        this.setState({ loading: true });
        if (this.state.idContrato !== null) {
            try {
                this.popularCamposContratoPost();
                const response = await api.put('api/travelcontract', this.dataContract);
                console.log(response);
                notification.success({
                    message: "Contrato atualizado com sucesso",
                })

            } catch (error) {
                if (error.response) {
                    notification.error({
                        message: "Não foi possível atualizar o contrato",
                        description: `Motivo: ${error.response.data.message}`
                    })
                }
            } finally {
                this.setState({ loading: false });
            }
        } else {
            try {
                this.popularCamposContratoPost();
                const response = await api.post('api/travelcontract', this.dataContract);
                console.log(response);
                notification.success({
                    message: "Contrato cadastrado com sucesso",
                })
            } catch (error) {
                if (error.response) {
                    notification.error({
                        message: "Não foi possível salvar o contrato",
                        description: `Motivo: ${error.response.data.message}`
                    })
                }
            } finally {
                this.setState({ loading: false })
            }
        }
    }

    popularCamposContratoPost() {
        this.populaAcompanhantes();
        this.dataContract = {
            boarding_location: this.state.localEmbarque,
            id_company: this.state.empresaContratada.idEmpresaContratada,
            id_travel_contract: this.state.idContrato,
            id_travel_package: this.state.pacoteViagem.idPacoteViagem,
            issue_date: moment().format("YYYY-MM-DD"),
            landingLocation: this.state.localDesembarque,
            passenger: {
                contracted_passenger: true,
                id_individual: this.state.passageiroContratante.idPessoa,
                paying_passenger: true,
            },
            passengers: this.state.passageirosAcompanhantesPost,
            total_contract_amount: 0,
        }
    }

    populaAcompanhantes() {
        let acompanhantes = this.state.passageiroAcompanhante;
        let x = null;
        if (acompanhantes) {
            console.log("Passei aqui")
            acompanhantes.forEach((item) => {
                x.push({
                    contracted_passenger: false,
                    id_individual: item.idPassageiroAcompanhante,
                    paying_passenger: false,
                })
            })
            this.setState({ passageirosAcompanhantesPost: x })
        }
    }
    popularCamposContratoEdit() {
    }

    popularEmpresas(empresas) {
        let emp = []
        empresas.data.forEach((item) => {
            if (item.active) {
                emp.push({
                    cnpjContratada: item.cnpj,
                    nomeFantasiaContratada: item.fantasy_name,
                    idEmpresaContratada: item.id_company_system,
                })
            }
        });
        this.setState({
            empresasContratadas: emp,
        })
    }

    popularPacotesViagens(pacotesViagens) {
        let pct = [];
        pacotesViagens.data.content.forEach((item) => {
            if (item.active) {
                pct.push({
                    idPacoteViagem: item.id_travel_package,
                    nomePacoteViagem: item.name_travel_package,
                    localOrigem: item.origin_name,
                    localDestino: item.destination_name,
                    dataInicio: item.start_date,
                    dataFim: item.end_date,
                })
            }
        })
        this.setState({ pacotesViagens: pct });
    }

    popularPassageiros(passageiros) {
        let pas = [];
        passageiros.data.content.forEach((item) => {
            if (item.active) {
                pas.push({
                    idPessoa: item.id_individual,
                    nomePessoa: item.name_individual,
                    sobreNomePessoa: item.last_name,
                    cpfPessoa: item.cpf,
                    rgPessoa: item.rg,
                    celularPessoa: item.contact.cell_phone,
                    telefonePessoa: item.contact.phone,
                })
            }
        })
        this.setState({ passageiros: pas });
    }

    adicionaEmpresaContratada(value, key) {
        this.state.empresasContratadas.forEach((item) => {
            if (item.idEmpresaContratada === value) {
                this.setState({
                    empresaContratada: {
                        idEmpresaContratada: item.idEmpresaContratada,
                        cnpjContratada: item.cnpjContratada,
                        nomeFantasiaContratada: item.nomeFantasiaContratada
                    }
                })
            }
        })
    }

    adicionaPacoteViagem(value, key) {
        this.state.pacotesViagens.forEach((item) => {
            if (item.idPacoteViagem === value) {
                this.setState({
                    pacoteViagem: {
                        idPacoteViagem: item.idPacoteViagem,
                        nomePacoteViagem: item.nomePacoteViagem,
                        localOrigem: item.localOrigem,
                        localDestino: item.localDestino,
                        dataInicio: item.dataInicio,
                        dataFim: item.dataFim,
                    }
                })
            }
        })
    }

    adicionaPassageiroContratante(value, key) {
        this.state.passageiros.forEach((item) => {
            if (item.idPessoa === value) {
                this.setState({
                    passageiroContratante: {
                        idPessoa: item.idPessoa,
                        nomePessoa: item.nomePessoa,
                        sobreNomePessoa: item.sobreNomePessoa,
                        cpfPessoa: item.cpfPessoa,
                        rgPessoa: item.rgPessoa,
                        celularPessoa: item.celularPessoa,
                        telefonePessoa: item.telefonePessoa
                    }
                })
            }
        })
    }

    addPassageiroAcompanhante(value, key, index) {
        let temp = this.state.passageiroAcompanhante;
        let pas = []
        this.state.passageiros.forEach((item) => {
            if (item.idPessoa === value) {
                pas.push({
                    idPassageiroAcompanhante: item.idPessoa,
                    nomePessoa: item.nomePessoa,
                    sobreNomePessoa: item.sobreNomePessoa,
                    cpfPessoa: item.cpfPessoa,
                    rgPessoa: item.rgPessoa,
                })
            }
        })
        temp[index] = pas;
        this.setState({
            passageiroAcompanhante: temp,
        })
    }

    toBackList = () => {
        this.props.history.push("/admin/Contract/ContractList.jsx")
    }


    imprimirContrato = async (e) => {
        e.preventDefault();
        if (!this.state.idContrato) {
            notification.warning({
                message: "Não é possível imprimir contrato",
                description: "Necessário salvar o contrato antes"
            })
            console.log(this.state);
        } else {
            try {
                this.setState({ loadingPrint: true });
                await api.get('api/contract/pdf', {
                    params: {
                        idTravelContract: this.state.idContrato
                    }
                })
            } catch (error) {
                if (error.response) {
                    notification.error({
                        message: "Não foi possível imprimir o contrato",
                        description: `Motivo: ${error.response.data.message}`
                    })
                }
            }
        }

    }

    onChange = (event) => {
        const state = Object.assign({}, this.state);
        const field = event.target.name;
        state[field] = event.target.value;
        this.setState(state);
    }

    async componentDidMount() {
        if (this.props.match.params.id != null) {
            const contrato = await api.get(`/api/travelcontract/id`, {
                params: {
                    id: this.props.match.params.id
                }
            });
            this.popularCamposContratoEdit(contrato);
        }
        try {
            const empresasContratadas = await api.get('/api/companySystem');
            this.popularEmpresas(empresasContratadas);
        } catch (error) {
            if (error.response) {
                notification.warning({
                    message: "Não foi possível carregar as contratadas",
                    description: `Motivo: ${error.response.data.message}`
                })
            }
        }

        try {
            const pacotesViagens = await api.get('/api/travelpackage/filter', {
                params: {
                    page: 0,
                    size: 200,
                    active: true,
                }
            });
            this.popularPacotesViagens(pacotesViagens);
        } catch (error) {
            if (error.response) {
                notification.warning({
                    message: "Não foi possível carregar os pacotes de viagens",
                    description: `Motivo: ${error.response.data.message}`
                })
            }

        }
        try {
            const passageiros = await api.get('/api/persons/individual/filter', {
                params: {
                    page: 0,
                    size: 500,
                    sort: 'nameIndividual,asc',
                    active: true
                }
            })
            this.popularPassageiros(passageiros);
        } catch (error) {

        }

    }



    render() {
        return (
            <div className="content">
                <Card content={
                    <Grid fluid>
                        <Row />
                        <Row>
                            <Col md={12}>
                                <Form name="formContrato" onFinish={this.saveContract}>
                                    <Row>
                                        <div className="col-md-2">
                                            <ControlLabel>Código Identificador:</ControlLabel>
                                            <input name="idContrato" value={this.state.idContrato}
                                                type="number" className="form-control"
                                                placeholder="Código do contrato" disabled onChange={this.onChange} />
                                        </div>
                                        <div className="col-md-8"></div>
                                        <div className="col-md-2">
                                            <Button loading={this.state.loadingPrint}
                                                type="primary" shape="round"
                                                size="large"
                                                onClick={this.imprimirContrato}
                                            ><FileDoneOutlined /> Imprimir Contrato </Button>
                                        </div>
                                    </Row>
                                    <Divider orientation="left">Contratada</Divider>
                                    <Row>
                                        <div className="col-md-3">
                                            <ControlLabel>Selecione a Contratada:</ControlLabel>
                                            <Select style={{ textAlign: 'left', marginTop: '15px', fontSize: '14px', width: '200px' }}
                                                showSearch
                                                required
                                                value={this.state.empresaContratada.idEmpresaContratada}
                                                name="empresaContratada"
                                                placeholder="Selecione a contratada"
                                                onChange={(value, key) => this.adicionaEmpresaContratada(value, key)}
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    option.children
                                                        .toLowerCase()
                                                        .indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {this.state.empresasContratadas.map((item) => (
                                                    <Option value={item.idEmpresaContratada} key={item.idEmpresaContratada}>
                                                        {item.nomeFantasiaContratada}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </div>
                                    </Row>
                                    <Row>
                                        <div className="col-md-3">
                                            <ControlLabel>Nome Contratada: </ControlLabel>
                                            <input name="nomeFantasiaContratada" value={this.state.empresaContratada.nomeFantasiaContratada}
                                                type="text" className="form-control" placeholder="Nome Fantasia Contratada"
                                                disabled onChange={this.onChange} />
                                        </div>
                                        <div className="col-md-3">
                                            <ControlLabel>CNPJ: </ControlLabel>
                                            <InputMask mask="99.999.999/9999-99" name="cnpjContratada"
                                                value={this.state.empresaContratada.cnpjContratada}
                                                type="text" className="form-control"
                                                placeholder="XX.XXX.XXX/XXXX-XX" onChange={this.onChange} disabled />
                                        </div>
                                    </Row>
                                    <Divider orientation="left">Pacote de Viagem</Divider>
                                    <Row>
                                        <div className="col-md-3">
                                            <ControlLabel>Selecione a Viagem:</ControlLabel>
                                            <Select style={{ textAlign: 'left', marginTop: '15px', fontSize: '14px', width: '200px' }}
                                                showSearch
                                                required
                                                value={this.state.pacoteViagem.idPacoteViagem}
                                                name="pacoteViagem"
                                                placeholder="Selecione a Viagem"
                                                onChange={(value, key) => this.adicionaPacoteViagem(value, key)}
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    option.children
                                                        .toLowerCase()
                                                        .indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {this.state.pacotesViagens.map((item) => (
                                                    <Option value={item.idPacoteViagem} key={item.idPacoteViagem}>
                                                        {item.nomePacoteViagem}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </div>
                                    </Row>
                                    <Row>
                                        <div className="col-md-3">
                                            <ControlLabel>Nome Viagem: </ControlLabel>
                                            <input name="nomePacoteViagem" value={this.state.pacoteViagem.nomePacoteViagem}
                                                type="text" className="form-control" placeholder="Nome da Viagem"
                                                disabled onChange={this.onChange} />
                                        </div>
                                        <div className="col-md-2">
                                            <ControlLabel>Local Origem: </ControlLabel>
                                            <input name="localOrigem" value={this.state.pacoteViagem.localOrigem}
                                                type="text" className="form-control" placeholder="Local de Origem"
                                                disabled onChange={this.onChange} />
                                        </div>
                                        <div className="col-md-2">
                                            <ControlLabel>Local Destino: </ControlLabel>
                                            <input name="localDestino" value={this.state.pacoteViagem.localDestino}
                                                type="text" className="form-control" placeholder="Local de Destino"
                                                disabled onChange={this.onChange} />
                                        </div>
                                        <div className="col-md-2">
                                            <ControlLabel>Data Inicio: </ControlLabel>
                                            <input name="dataInicio" value={this.state.pacoteViagem.dataInicio}
                                                type="date" className="form-control" placeholder="Data de Inicio"
                                                disabled onChange={this.onChange} />
                                        </div>
                                        <div className="col-md-2">
                                            <ControlLabel>Data Inicio: </ControlLabel>
                                            <input name="dataFim" value={this.state.pacoteViagem.dataFim}
                                                type="date" className="form-control" placeholder="Data Final"
                                                disabled onChange={this.onChange} />
                                        </div>
                                    </Row>
                                    <Divider orientation="left">Contratante</Divider>
                                    <Row>
                                        <div className="col-md-3">
                                            <ControlLabel>Selecione o Contratante:</ControlLabel>
                                            <Select style={{ textAlign: 'left', marginTop: '15px', fontSize: '14px', width: '200px' }}
                                                showSearch
                                                required
                                                value={this.state.passageiroContratante.idPessoa}
                                                name="passageiroContratante"
                                                placeholder="Selecione o Contratante"
                                                onChange={(value, key) =>
                                                    this.adicionaPassageiroContratante(value, key)
                                                }
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    option.children
                                                        .toLowerCase()
                                                        .indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {this.state.passageiros.map((item) => (
                                                    <Option value={item.idPessoa} key={item.idPessoa}>
                                                        {`${item.nomePessoa} - ${item.cpfPessoa}`}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </div>
                                    </Row>
                                    <Row>
                                        <div className="col-md-2">
                                            <ControlLabel>Nome Contratante: </ControlLabel>
                                            <input name="nomePessoa" value={this.state.passageiroContratante.nomePessoa}
                                                type="text" className="form-control" placeholder="Nome do Contratante"
                                                disabled onChange={this.onChange} />
                                        </div>
                                        <div className="col-md-2">
                                            <ControlLabel>Sobrenome: </ControlLabel>
                                            <input name="sobreNomePessoa" value={this.state.passageiroContratante.sobreNomePessoa}
                                                type="text" className="form-control" placeholder="Sobrenome contratante"
                                                disabled onChange={this.onChange} />
                                        </div>
                                        <div className="col-md-2">
                                            <ControlLabel>CPF: </ControlLabel>
                                            <InputMask mask="999.999.999-99" name="cpfPessoa"
                                                value={this.state.passageiroContratante.cpfPessoa}
                                                type="text" className="form-control"
                                                placeholder="XXX.XXX.XXX-XX" required onChange={this.onChange} disabled />
                                        </div>
                                        <div className="col-md-2">
                                            <ControlLabel>RG: </ControlLabel>
                                            <input name="rgPessoa" value={this.state.passageiroContratante.rgPessoa}
                                                type="text" className="form-control" placeholder="XXXXXXX-X"
                                                disabled onChange={this.onChange} />
                                        </div>
                                        <div className="col-md-2">
                                            <ControlLabel>Telefone Celular: </ControlLabel>
                                            <InputMask mask="(99) 99999-9999" name="celularPessoa"
                                                value={this.state.passageiroContratante.celularPessoa}
                                                type="text" className="form-control"
                                                placeholder="(XX) XXXXX-XXXX" disabled onChange={this.onChange} />
                                        </div>
                                        <div className="col-md-2">
                                            <ControlLabel>Telefone Fixo: </ControlLabel>
                                            <InputMask mask="(99) 9999-9999" name="celularPessoa"
                                                value={this.state.passageiroContratante.telefonePessoa}
                                                type="text" className="form-control"
                                                placeholder="(XX) XXXX-XXXX" disabled onChange={this.onChange} />
                                        </div>
                                    </Row>
                                    <Divider orientation="left">Acompanhantes</Divider>
                                    <div className="col-md-12">
                                        <Form.List name="acompanhantes">
                                            {(fields, { add, remove }) => (
                                                <>
                                                    {fields.map((field, index) => (
                                                        <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                            <Form.Item
                                                                {...field}
                                                                name={[field.name, 'nomePassageiroAcompanhante']}
                                                                fieldKey={[field.fieldKey, 'idPassageiroAcompanhante']}
                                                                rules={[{ required: true, message: 'Seleciona o passageiro acompanhante' }]}
                                                            >
                                                                <Select
                                                                    style={{ textAlign: 'left', marginTop: '15px', fontSize: '14px', width: '200px' }}
                                                                    showSearch
                                                                    required
                                                                    value={this.state.passageiroAcompanhante.idPassageiroAcompanhante}
                                                                    name="passageiroAcompanhante"
                                                                    placeholder="Selecione o acompanhante"
                                                                    onChange={(value, key) => this.addPassageiroAcompanhante(value, key, index)}
                                                                    optionFilterProp="children"
                                                                    filterOption={(input, option) =>
                                                                        option.children
                                                                            .toLowerCase()
                                                                            .indexOf(input.toLowerCase()) >= 0
                                                                    }
                                                                >
                                                                    {this.state.passageiros.map((item) => (
                                                                        <Option value={item.idPessoa} key={item.idPessoa}>
                                                                            {`${item.nomePessoa} - ${item.cpfPessoa}`}
                                                                        </Option>
                                                                    ))}
                                                                </Select>
                                                            </Form.Item>
                                                            <Form.Item
                                                                {...field}
                                                                name={[field.name, 'nomePessoaAcompanhante']}
                                                                fieldKey={[field.fieldKey, 'idNomePessoaAcompanhante']}
                                                                rules={[{ required: true, message: 'Selecione o passageiro acompanhante' }]}
                                                            >
                                                                <input name="nomePessoa" value={this.state.passageiroAcompanhante.nomePessoa}
                                                                    type="text" className="form-control" placeholder="Nome do Acompanhante"
                                                                    disabled onChange={this.onChange} />
                                                            </Form.Item>

                                                            <Form.Item
                                                                {...field}
                                                                name={[field.name, 'sobreNomePessoaAcompanhante']}
                                                                fieldKey={[field.fieldKey, 'idSobreNomePessoaAcompanhante']}
                                                                rules={[{ required: true, message: 'Selecione o passageiro acompanhante' }]}
                                                            >
                                                                <input name="sobreNomePessoa" value={this.state.passageiroAcompanhante.sobreNomePessoa}
                                                                    type="text" className="form-control" placeholder="Sobrenome Acompanhante"
                                                                    disabled onChange={this.onChange} />
                                                            </Form.Item>
                                                            <Form.Item
                                                                {...field}
                                                                name={[field.name, 'cpfPessoaAcompanhante']}
                                                                fieldKey={[field.fieldKey, 'idCpfPessoaAcompanhante']}
                                                                rules={[{ required: true, message: 'Selecione o passageiro acompanhante' }]}
                                                            >
                                                                <InputMask mask="999.999.999-99" name="cpfPessoa"
                                                                    value={this.state.passageiroAcompanhante.cpfPessoa}
                                                                    type="text" className="form-control"
                                                                    placeholder="XXX.XXX.XXX-XX" required onChange={this.onChange} disabled />
                                                            </Form.Item>
                                                            <Form.Item
                                                                {...field}
                                                                name={[field.name, 'cpfPessoaAcompanhante']}
                                                                fieldKey={[field.fieldKey, 'idCpfPessoaAcompanhante']}
                                                                rules={[{ required: true, message: 'Selecione o passageiro acompanhante' }]}
                                                            >
                                                                <input name="rgPessoa" value={this.state.passageiroAcompanhante.rgPessoa}
                                                                    type="text" className="form-control" placeholder="XXXXXXX-X"
                                                                    disabled onChange={this.onChange} />
                                                            </Form.Item>
                                                            <MinusCircleOutlined onClick={() => remove(field.name)} />
                                                        </Space>
                                                    ))}
                                                    <Form.Item>
                                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                            Adicionar Passageiro
                                                        </Button>
                                                    </Form.Item>
                                                </>
                                            )}
                                        </Form.List>
                                    </div>
                                    <Divider orientation="left">Local de embarque/desembarque</Divider>
                                    <Row>
                                        <div className="col-md-4">
                                            <ControlLabel>Local de Embarque: </ControlLabel>
                                            <input name="localEmbarque" value={this.state.localEmbarque}
                                                type="text" className="form-control" placeholder="Local de embarque"
                                                onChange={this.onChange} />
                                        </div>
                                        <div className="col-md-4">
                                            <ControlLabel>Local de Desembarque: </ControlLabel>
                                            <input name="localDesembarque" value={this.state.localDesembarque}
                                                type="text" className="form-control" placeholder="Local de desembarque"
                                                onChange={this.onChange} />
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

} export default ContractInsert