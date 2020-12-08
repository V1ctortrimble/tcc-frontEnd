import React, { Component } from "react";
import { Grid, Row, Col, ControlLabel } from "react-bootstrap";
import { Button, Table, Collapse, notification, Modal, Tag, Select } from "antd";
import 'antd/dist/antd.css';
import { EditFilled, UserAddOutlined, UserDeleteOutlined, UnorderedListOutlined, CopyOutlined } from '@ant-design/icons';
import api from "services/api";
import moment from 'moment';
//import InputMask from "react-input-mask";

const { Panel } = Collapse;
const { Option } = Select;

class PassengerList extends Component {

    columns = [
        {
            title: 'Codigo',
            width: 50,
            dataIndex: 'codigo',
            key: 'codigo',
            fixed: 'left',
            align: 'center',
        },
        {
            title: 'Nome Viagem',
            width: 100,
            dataIndex: 'nomeViagem',
            key: 'nomeViagem',
            fixed: 'left',
        },
        {
            title: 'local Origem',
            width: 80,
            dataIndex: 'localOrigem',
            key: 'localOrigem',
            fixed: 'left',
        },
        {
            title: 'Local Destino',
            width: 80,
            dataIndex: 'localDestino',
            key: 'localDestino',
            fixed: 'left',
        },
        {
            title: 'Data Inicio',
            width: 50,
            dataIndex: 'dataInicio',
            key: 'dataInicio',
            fixed: 'left',
            align: 'center'
        },
        {
            title: 'Data Fim',
            width: 50,
            dataIndex: 'dataFim',
            key: 'dataFim',
            fixed: 'left',
            align: 'center'
        },
        {
            title: 'Status',
            width: 50,
            dataIndex: 'status',
            key: 'status',
            fixed: 'left',
            align: 'center',
            render: (text, record) => (
                <Tag color={record.status ? "green" : "red"}
                    key="status"
                >
                    {record.status ? "ATIVO" : "INATIVO"}
                </Tag>
            ),
        },
        {
            title: 'Ação',
            key: 'operation',
            fixed: 'right',
            width: 80,
            render: (x) => {
                return x.status ?
                    (<div className="center">
                        <div>
                            <Button onClick={() => this.imprimirListaPassageiros(x)} loading={this.state.loadingListaPassageiros} type="primary" size="small" style={{ marginRight: '5%' }}><UnorderedListOutlined />Passageiros</Button>
                        </div>
                        <div style={{ marginTop: '5px' }}>
                            <Button onClick={() => this.divulgarViagem(x)} type="primary" size="small" style={{ marginRight: '5%' }}><CopyOutlined /></Button>
                            <Button onClick={() => this.alterarViagem(x)} type="primary" size="small" style={{ marginRight: '5%' }}><EditFilled /></Button>
                            <Button onClick={() => this.showModal(x)} type="primary" danger size="small"><UserDeleteOutlined /></Button>
                        </div>
                    </div>) : <div>
                        <Button className="ant-btn-personalized" onClick={() => this.ativarViagem(x)} type="primary" size="small" style={{ marginRight: '5%' }}><UserAddOutlined /></Button>
                    </div>
            }
        },
    ];

    state = {
        loadingListaPassageiros: false,
        loadingDivulgar: false,
        data: [{}],
        pager: {
            current: 1,
            pageSize: 10,
            total: "",
        },
        codigo: "",
        nomeViagem: "",
        localDestino: "",
        localOrigem: "",
        dataInicio: "",
        dataFim: "",
        loading: false,
        visible: false,
        visibleDivulgar: false,
        codigoParaDesativar: null,
        codigoParaAtivar: null,
        status: true,
        divulgarPacoteViagem: null,
        statusOpcoes: [
            {
                valor: true,
                descricao: "Ativo",
            },
            {
                valor: false,
                descricao: "Inativo",
            }
        ]
    }

    dataPacoteViagem = {};

    handleClick = () => {
        this.props.history.push("/admin/TravelPackage/TravelPackageInsert.jsx")
    }

    showModal = (x) => {
        let codigo = x.codigo;
        this.setState({
            codigoParaDesativar: codigo,
            visible: true,
        });
    };

    confirmarModal = () => {
        this.desativaViagem();
        this.setState({
            visible: false,
        });
    };

    cancelarModal = () => {
        this.setState({
            visible: false,
            visibleDivulgar: false,
        });
    };

    divulgarViagem(x) {
        this.carregarDadosViagem(x.codigo)
        this.setState({
            visibleDivulgar: true,
        })
    }

    copyClipboard = (e) => {
        this.textArea.select();
        document.execCommand('copy');
        e.target.focus();
        notification.success({
            message: "Dados copiados com sucesso!",
            description: "Utilizar função colar (ctrl + V) aonde desejar",
        })
        this.cancelarModal();
      };
       
    alterarViagem(x) {
        let idViagem = x.codigo;
        this.props.history.push(`/admin/TravelPackage/TravelPackageInsert/${idViagem}`)
    }

    async carregarDadosViagem(id){
        let idtravelpackage = Number(id);
        try {
            this.setState({ loadingDivulgar: true});
            const dadosViagem = await api.get('api/travelpackage/id', {
                params: {
                    idtravelpackge: idtravelpackage
                }
            })
            this.montaDadosDivulgarViagem(dadosViagem);
        } catch (error) {
            if (error.response){
                notification.error({
                    message: "Não foi possível carregar os dados para divulgar",
                    description: `Motivo: ${error.response.data.message}`
                })
            }
        }
    }

    async imprimirListaPassageiros(x) {
        let idtravelpackage = Number(x.codigo)
        try {
            this.setState({ loadingListaPassageiros: true });
            await api.get('api/list/pdf', {
                responseType: 'arraybuffer',
                headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/pdf'}
                ,
                params: {
                    idtravelpackage: idtravelpackage,
                
                }
            }).then(function(response) {
                var blob = new Blob([response.data], {
                      type: 'application/pdf'
                });
                var url = window.URL.createObjectURL(blob)
                window.open(url);})
        } catch (error) {
            if (error.response) {
                notification.error({
                    message: 'Não foi possível imprimir a lista de passageiros',
                    description: `Motivo: ${error.response.data.message}`
                })
            }

        } finally {
            this.setState({ loadingListaPassageiros: false })
        }

    }

    async ativarViagem(x) {

        try {
            this.populaCamposAtivar(x.codigo);
            await api.put('/api/travelpackage/', this.dataPacoteViagem, {
                active: true,
                id_travel_package: this.state.idViagem
            });
            notification.success({
                message: `Viagem ativada com sucesso`,
            });
            this.buscarPacoteViagemApi();
        } catch (error) {
            if (error.response) {
                notification.error({
                    message: `Algo de errado aconteceu`,
                    description: `Motivo: ${error.response.data.message}`
                });
            }
        }
    }

    async desativaViagem() {
        try {
            this.populaCamposDesativar();
            await api.put('/api/travelpackage/', this.dataPacoteViagem, {
            });
            notification.warning({
                message: `Viagem desativada com sucesso`,
            });
            this.buscarPacoteViagemApi();
        } catch (error) {
            if (error.response) {
                notification.error({
                    message: `Algo de errado aconteceu`,
                    description: `Motivo: ${error.response.data.message}`
                });
            }
        }
    }

    populaCamposAtivar(idPacoteViagem) {
        this.dataPacoteViagem = {
            active: true,
            id_travel_package: idPacoteViagem,
        }
    }

    populaCamposDesativar() {
        this.dataPacoteViagem = {
            active: false,
            id_travel_package: this.state.codigoParaDesativar
        }
    }

    montaDadosDivulgarViagem(dadosViagem){
        let texto = "";
        texto = `Nome da Viagem: ${dadosViagem.data.name_travel_package} \n
Destino para: ${dadosViagem.data.destination_name} \n
Local de partida: ${dadosViagem.data.origin_name} \n
Data de Saída: ${dadosViagem.data.start_date} \n
Data de Chegada: ${dadosViagem.data.end_date} \n
Valor por Adulto: ${dadosViagem.data.adult_price} \n
Valor por Criança: ${dadosViagem.data.child_price} \n
Forma de Pagamento: ${dadosViagem.data.payment_methods}`;

        this.setState({divulgarPacoteViagem: texto});
    }

    onChange = (event) => {
        const state = Object.assign({}, this.state);
        const field = event.target.name;
        state[field] = event.target.value;
        this.setState(state);
    }

    async buscarPacoteViagemApi(current = 0, size = 10) {
        this.setState({ loading: true });
        let x = [];
        try {
            const data = await api.get('api/travelpackage/filter', {
                params: {
                    page: current,
                    size: size,
                    idtravelpackage: this.state.codigo,
                    nametravelpackage: this.state.nomeViagem,
                    destinationName: this.state.localDestino,
                    originname: this.state.localOrigem,
                    sort: 'nameTravelPackage,asc',
                    active: this.state.status
                },
            });
            data.data.content.forEach((item, index) => {
                x.push({
                    key: index,
                    codigo: item.id_travel_package,
                    nomeViagem: item.name_travel_package,
                    localDestino: item.destination_name,
                    localOrigem: item.origin_name,
                    dataInicio: moment(item.start_date).format("DD/MM/YYYY"),
                    dataFim: moment(item.end_date).format("DD/MM/YYYY"),
                    status: item.active
                })
            })
            this.setState({ data: x });
            this.setState({
                pager: {
                    current: data.data.pageNumber,
                    pageSize: data.data.pageSize,
                    total: data.data.totalElements,
                }
            })
        } catch (error) {
            if (error.response) {
                if (error.response.status === 403) {
                    notification.warning({
                        message: "Aviso",
                        description: `Motivo: Usuário não autorizado`
                    });
                } else {
                    notification.warning({
                        message: "Aviso",
                        description: `Motivo: ${error.response.data.message}`
                    });
                }

                this.setState({ data: "" });
                this.setState({
                    pager: {
                        current: current,
                        pageSize: size,
                        total: '0',
                    }
                })
            }
        } finally {
            this.setState({ loading: false });
        }
    }

    async componentDidMount() {
        this.buscarPacoteViagemApi();
    }

    render() {
        return (
            <div className="content">
                <Grid fluid>
                    <Modal
                        title="Dados da Viagem"
                        visible={this.state.visibleDivulgar}
                        onOk={this.copyClipboard}
                        onCancel={this.cancelarModal}
                        okText="Copiar Dados"
                        cancelText="Cancelar"
                        centered
                    >
                        <div className="col-md-12" style={{ textAlign: 'center' }}>
                            <textarea rows={15} name="divulgarPacoteViagem" value={this.state.divulgarPacoteViagem}
                                ref={(textarea) => this.textArea = textarea}
                                type="text" className="form-control"
                                style={{ padding: "8px 12px", marginTop: "10px", marginBottom: "10px" }}
                                placeholder="Os dados da viagem não foram carregados." />
                        </div>
                    </Modal>
                    <Modal
                        title="Confirmação"
                        visible={this.state.visible}
                        onOk={this.confirmarModal}
                        onCancel={this.cancelarModal}
                        okText="Confirmar"
                        cancelText="Cancelar"
                        centered
                    >
                        <div className="col-md-12" style={{ textAlign: 'center' }}>
                            Tem certeza que deseja desativar
                        </div>
                        <div className="col-md-12" style={{ textAlign: 'center' }}>
                            a viagem de código: {this.state.codigoParaDesativar} ?
                        </div>
                    </Modal>
                    <Row>
                        <Col md={12}>
                            <Button onClick={this.handleClick} className="ant-btn-primary">Novo</Button>
                            <p></p>
                            <Collapse>
                                <Panel header="Filtros" key="1">
                                    <form name="formFilterViagem">
                                        <Row>
                                            <div className="col-md-2">
                                                <ControlLabel>Codigo</ControlLabel>
                                                <input name="codigo" value={this.state.codigo}
                                                    type="int" className="form-control" mask=""
                                                    placeholder="" onChange={this.onChange} />
                                            </div>
                                            <div className="col-md-3">
                                                <ControlLabel>Nome Viagem</ControlLabel>
                                                <input name="nomeViagem" value={this.state.nomeViagem}
                                                    type="text" className="form-control"
                                                    placeholder="" onChange={this.onChange} />
                                            </div>
                                            <div className="col-md-3">
                                                <ControlLabel>Local Origem</ControlLabel>
                                                <input name="localOrigem" value={this.state.localOrigem}
                                                    type="text" className="form-control"
                                                    placeholder="" onChange={this.onChange} />
                                            </div>

                                            <div className="col-md-3">
                                                <ControlLabel>Local Destino</ControlLabel>
                                                <input name="localDestino" value={this.state.localDestino}
                                                    type="text" className="form-control"
                                                    placeholder="" onChange={this.onChange} />
                                            </div>
                                            <div className="col-md-1">
                                                <ControlLabel>Status</ControlLabel>
                                                <Row>
                                                    <Select
                                                        style={{ textAlign: 'left', marginTop: '15px', fontSize: '14px', width: '100px' }}
                                                        showSearch
                                                        name="status"
                                                        placeholder="Status"
                                                        onChange={(value) => this.setState({ status: value })}
                                                        optionFilterProp="children"
                                                        filterOption={(input, option) =>
                                                            option.children
                                                                .toLowerCase()
                                                                .indexOf(input.toLowerCase()) >= 0
                                                        }
                                                        defaultValue={true}
                                                    >
                                                        {this.state.statusOpcoes.map((item) => (
                                                            <Option value={item.valor} key={item.valor}>
                                                                {item.descricao}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Row>
                                            </div>
                                        </Row>
                                        <div className="ant-row ant-row-end" style={{ marginTop: '30px' }}>
                                            <div className="ant-col">
                                                <Button size="middle" onClick={() => this.buscarPacoteViagemApi()}
                                                    type="primary" loading={this.state.loading}>Filtrar</Button>
                                            </div>
                                        </div>
                                    </form>

                                </Panel>
                            </Collapse>
                            <p></p>
                            <Table
                                columns={this.columns}
                                dataSource={this.state.data}
                                bordered
                                loading={this.state.loading}
                                scroll={{ x: 100 }}
                                pagination={{
                                    ...this.state.pager,
                                    showTotal: total =>
                                        `Total de ${total} ${total > 1 ? 'itens' : 'item'}`,
                                    showQuickJumper: true,
                                    showSizeChanger: true,
                                }}
                                size="middle"
                                onChange={(pagination) => { this.buscarPacoteViagemApi((pagination.current - 1), pagination.pageSize) }} />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default PassengerList;