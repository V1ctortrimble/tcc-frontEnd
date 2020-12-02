import React, { Component } from "react";
import { Col, ControlLabel, Grid, Row } from "react-bootstrap";
import InputMask from "react-input-mask";
import { Steps, Table, notification, Button, Modal, Input, Select, Radio } from "antd";
import 'antd/dist/antd.css';
import Card from "components/Card/Card";
import { EditFilled, CloseCircleOutlined, CheckCircleOutlined, DeleteFilled } from '@ant-design/icons';
import cep from 'cep-promise';
import api from '../../services/api';
import { cnpj } from "cpf-cnpj-validator";

const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;

class SystemCompanyInsert extends Component {

  columnsHosp = [
    {
      title: 'Tipo Hospedagem',
      width: 200,
      dataIndex: 'tpHosp',
      key: 'tpHosp',
      fixed: 'left',
    },
    {
      title: 'Qnt Pessoas',
      width: 80,
      dataIndex: 'qntPessoas',
      key: 'qntPessoas',
      fixed: 'center',
    },
    {
      title: 'Endereço',
      width: 200,
      dataIndex: 'endereco',
      key: 'endereco',
      fixed: 'left',
    },
    {
      title: 'Cidade',
      width: 100,
      dataIndex: 'cidade',
      key: 'cidade',
      fixed: 'left',
    },
    {
      title: 'Ações',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (x) => {
        return x.active ?
          (<div>
            <Button onClick={() => this.alterarHospedagemEmpresa(x)} type="primary" size="small" style={{ marginRight: '5%' }}><EditFilled /></Button>
            <Button onClick={() => this.showModalHospedagem(x)} type="primary" danger size="small"><CloseCircleOutlined /></Button>
          </div>) : <div>
            <Button className="ant-btn-personalized" onClick={() => this.ativarHospedagemEmpresa(x)} type="primary" size="small" style={{ marginRight: '5%' }}><CheckCircleOutlined /></Button>
          </div>
      }
    },
  ];

  columnsVehicles = [
    {
      title: 'Nome Veículo',
      width: 200,
      dataIndex: 'nomeVeiculo',
      key: 'nomeVeiculo',
      fixed: 'left',
    },
    {
      title: 'Qnt Assentos',
      width: 50,
      dataIndex: 'qntAssentos',
      key: 'qntAssentos',
      fixed: 'left',
    },
    {
      title: 'Tipo Assento',
      width: 100,
      dataIndex: 'tpAssento',
      key: 'tpAssento',
      fixed: 'left',
    },
    {
      title: 'Tipo Veículo',
      width: 100,
      dataIndex: 'tpVeiculo',
      key: 'tpVeiculo',
      fixed: 'left',
    },
    {
      title: 'Ações',
      key: 'operation',
      fixed: 'right',
      width: 50,
      render: (y) => {
        return y.active ?
          (<div>
            <Button onClick={() => this.alterarVeiculoEmpresa(y)} type="primary" size="small" style={{ marginRight: '5%' }}><EditFilled /></Button>
            <Button onClick={() => this.showModalVeiculo(y)} type="primary" danger size="small"><DeleteFilled /></Button>
          </div>) : <div>
            <Button className="ant-btn-personalized" onClick={() => this.ativarVeiculoEmpresa(y)} type="primary" size="small" style={{ marginRight: '5%' }}><CheckCircleOutlined /></Button>
          </div>
      }
    },
  ];

  state = {
    current: 0,
    permiteAvancarPassos: false,
    loadingCep: false,
    loadingAvancar: false,
    loadingModal: false,
    desabilitarCampoCnpj: false,
    desabilitarEndBairro: true,
    desabilitarCamposEndereco: true,
    desabilitarEndBairroHospedagem: true,
    desabilitarCamposEnderecoHospedagem: true,
    visibleCadTpHosp: false,
    visibleCadTpVeiculos: false,
    visibleHospedagem: false,
    visibleVeiculos: false,
    idEmpresa: null,
    active: "",
    cnpj: "",
    razaoSocial: "",
    nomeFantasia: "",
    dataAbertura: "",
    telefone: "",
    celular: "",
    email: "",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    idHospedagem: null,
    idHospedagemDesativar: null,
    qntPessoasDesativar: "",
    nomeTipoHospedagemDesativar: "",
    enderecoHospedagemDesativar: "",
    cidadeHospedagemDesativar: "",
    activeHospedagem: "",
    tipoHospedagem: {
      idTipoHospedagem: null,
      nomeTipoHospedagem: {
        children: null,
        key: null,
        value: null,
      },
    },
    tiposHospedagens: [{}],
    tipoHospedagemCad: "",
    registroTurismo: "",
    qntPessoas: "",
    descricaoLocal: "",
    cepHospedagem: "",
    enderecoHospedagem: "",
    numeroHospedagem: "",
    complementoHospedagem: "",
    bairroHospedagem: "",
    cidadeHospedagem: "",
    estadoHospedagem: "",
    idVeiculo: null,
    idVeiculoDesativar: null,
    activeVeiculo: "",
    tipoVeiculo: {
      idTipoVeiculo: null,
      nomeTipoVeiculo: {
        children: null,
        key: null,
        value: null,
      },
    },
    tiposVeiculos: [{}],
    nomeVeiculo: "",
    fabricanteVeiculo: "",
    modeloVeiculo: "",
    numAssentosVeiculo: "",
    tipoAssentosVeiculo: "",
    banheiro: false,
    acessibilidade: false,
    rntrcVeiculo: "",
    descricaoVeiculo: "",
    nomeTipoVeiculoCad: "",
    fabricanteCad: "",
    modeloCad: "",
    numAssentosVeiculoCad: "",
    tipoAssentosVeiculoCad: "",
    descricaoVeiculoCad: "",
    banheiroCad: false,
    acessibilidadeCad: false,
    nomeVeiculoDesativar: "",
    qntAssentosDesativar: "",
    tipoAssentosVeiculoDesativar: "",
    tipoVeiculoDesativar: "",
    dataHosting: [{}],
    dataVehicles: [{}],
  };

  dataCompany = {};

  dataHosting = {};

  dataVehicle = {};

  dataHostingType = {};

  dataCompanyHosting = {};

  dataVehiclesType = {};

  dataCompanyVehicles = {};

  async componentDidMount() {
    if (this.props.match.params.cnpj != null) {
      try {
        const empresa = await api.get(`api/persons/company/`, {
          params: {
            cnpj: this.props.match.params.cnpj
          }
        })
        this.popularCamposEmpresaEdit(empresa);
        this.setState({
          permiteAvancarPassos: true,
        });
      } catch (error) {
        if (error.response) {
          notification.error({
            message: `Não foi possível carregar os dados para edição`,
            description: `Motivo: ${error.response.data.message}`
          })
        }
      }
      try {
        this.recuperarHospedagens();
      } catch (error) {
        if (error.response) {
          notification.warning({
            message: `Não foi possível carregar as hospedagens da empresa`,
          })
        }
      }
      try {
        this.recuperarVeiculos();
      } catch (error) {
        if (error.response) {
          notification.warning({
            message: `Não foi possível carregar os veículos da empresa`,
          })
        }
      }
    }
    this.recuperarTipoHospedagens();
    this.recuperarTipoVeiculos();
  }


  showModalTpHospedagem = () => {
    this.setState({
      visibleCadTpHosp: true,
    });
  };

  showModalTpVeiculos = () => {
    this.setState({
      visibleCadTpVeiculos: true,
    })
  }

  showModalHospedagem = (x) => {
    this.setState({
      idHospedagemDesativar: x.idHospedagem,
      qntPessoasDesativar: x.qntPessoas,
      nomeTipoHospedagemDesativar: x.tpHosp,
      enderecoHospedagemDesativar: x.endereco,
      cidadeHospedagemDesativar: x.cidade,
      visibleHospedagem: true,
    });
  };

  showModalVeiculo = (y) => {
    this.setState({
      idVeiculoDesativar: y.idVeiculo,
      nomeVeiculoDesativar: y.nomeVeiculo,
      qntAssentosDesativar: y.qntAssentos,
      tipoAssentosVeiculoDesativar: y.tpAssento,
      tipoVeiculoDesativar: y.tpVeiculo,
      visibleVeiculos: true,
    });
  };

  confirmarModalCadTpHospedagem = (e) => {
    this.cadastrarTipoHospedagem(e);
    this.setState({
      visibleCadTpHosp: false,
    });
  };

  confirmarModalCadTpVeiculo = (e) => {
    this.cadastrarTipoVeiculo(e);
    this.setState({
      visibleCadTpVeiculos: false,
    });
  };

  confirmarModalHospedagem = () => {
    this.desativaHospedagem();
    this.setState({
      visibleHospedagem: false,
    });
  };

  confirmarModalVeiculo = () => {
    this.desativaVeiculo();
    this.setState({
      visibleVeiculos: false,
    });
  };

  cancelarModal = () => {
    this.setState({
      visibleVeiculos: false,
      visibleCadTpHosp: false,
      visibleCadTpVeiculos: false,
      visibleHospedagem: false,
    });
  };

  removeCaractEspecial(texto) {
    return texto.replace(/[^a-zA-Z0-9]/g, '');
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

  saveCompany = async (e) => {
    e.preventDefault();
    this.setState({ loadingAvancar: true })
    if (this.state.idEmpresa != null) {
      try {
        this.popularCamposEmpresaPost();
        await api.put('api/persons/company', this.dataCompany, {
          params: {
            cnpj: this.state.cnpj,
          }
        })
        notification.success({
          message: `Empresa atualizada com sucesso`,
        });
        this.nextStep();
      } catch (error) {
        if (error.response) {
          notification.error({
            message: `Não foi possível atualizar Empresa`,
            description: `Motivo: ${error.response.data.message}`
          });
        }
      } finally {
        this.setState({ loadingAvancar: false })
      }
    } else {
      try {
        this.popularCamposEmpresaPost();
        await api.post('api/persons/company', this.dataCompany);
        notification.success({
          message: `Empresa cadastrada com sucesso`,
        });
        this.setState({
          permiteAvancarPassos: true,
        });
        this.nextStep();
      }
      catch (error) {
        if (error.response) {
          notification.error({
            message: `Não foi possível Salvar Empresa`,
            description: `Motivo: ${error.response.data.message}`
          });
        }
      } finally {
        this.setState({ loadingAvancar: false })
      }
    }
  };

  saveHosting = async (e) => {
    e.preventDefault();
    this.setState({ loadingAvancar: true })
    if (this.state.idHospedagem != null) {
      try {
        this.popularCamposHospedagemPost();
        await api.put('api/hosting', this.dataHosting);
        notification.success({
          message: `Hospedagem atualizada com sucesso`,
        });
        this.limpaCamposHospedagem();
        this.recuperarHospedagens();
      } catch (error) {
        if (error.response) {
          notification.error({
            message: 'Não foi possível Salvar Hospedagem',
            description: `Motivo: ${error.response.data.message}`
          });
        }
      } finally {
        this.setState({ loadingAvancar: false })
      }
    } else {
      try {
        this.popularCamposHospedagemPost();
        await api.post('api/hosting', this.dataHosting);
        notification.success({
          message: `Hospedagem adicionada com sucesso`,
        });
        this.limpaCamposHospedagem();
        this.recuperarHospedagens();
      }
      catch (error) {
        if (error.response) {
          notification.error({
            message: 'Não foi possível Salvar Hospedagem',
            description: `Motivo: ${error.response.data.message}`
          });
        }
      } finally {
        this.setState({ loadingAvancar: false })
      }
    }
  }

  saveVehicle = async (e) => {
    e.preventDefault();
    this.setState({ loadingAvancar: true })
    if (this.state.idVeiculo != null) {
      try {
        this.popularCamposVeiculoPost();
        await api.put('api/vehicles', this.dataVehicle);
        notification.success({
          message: `Veículo atualizado com sucesso`,
        });
        this.limpaCamposVeiculos();
        this.recuperarVeiculos();
      } catch (error) {
        if (error.response) {
          notification.error({
            message: 'Não foi possível atualizar veículo',
            description: `Motivo: ${error.response.data.message}`
          });
        }
      } finally {
        this.setState({ loadingAvancar: false })
      }
    } else {
      try {
        this.popularCamposVeiculoPost();
        await api.post('api/vehicles', this.dataVehicle);
        notification.success({
          message: `Veículo adicionado com sucesso`,
        });
        this.limpaCamposVeiculos();
        this.recuperarVeiculos();
      }
      catch (error) {
        if (error.response) {
          notification.error({
            message: 'Não foi possível salvar veículo',
            description: `Motivo: ${error.response.data.message}`
          });
        }
      } finally {
        this.setState({ loadingAvancar: false })
      }
    }
  }


  enderecoEmpresaCep = async () => {
    const cepIn = this.removeCaractEspecial(this.state.cep);
    this.setState({
      desabilitarCamposEndereco: true,
      desabilitarEndBairro: true
    })
    if (cepIn.length !== 8) {
      notification.error({
        message: 'CEP informado é inválido.',
        description: 'Favor inserir um Cep, com 8 números'
      });
      return;
    }
    this.setState({ loadingCep: true });
    try {
      const enderecoCompleto = await cep(cepIn);

      if (enderecoCompleto) {
        this.popularCamposEmpresaConsultaCep(enderecoCompleto);
      }
      if (!enderecoCompleto.street) {
        notification.warning({
          message: 'Cep consultado com avisos',
          description: 'Cep geral, favor inserir Endereço e Bairro'
        });
        this.setState({ desabilitarEndBairro: false })
      }
    } catch (error) {
      notification.error({
        message: 'Falha ao consultar CEP',
        description: 'Insira o endereço manualmente'
      });
      this.setState({
        desabilitarCamposEndereco: false,
        desabilitarEndBairro: false
      });
    } finally {
      this.setState({ loadingCep: false })
    }
  };

  enderecoHospedagemCep = async () => {
    const cepIn = this.removeCaractEspecial(this.state.cepHospedagem);
    this.setState({
      desabilitarCamposEnderecoHospedagem: true,
      desabilitarEndBairroHospedagem: true
    })
    if (cepIn.length !== 8) {
      notification.error({
        message: 'CEP informado é inválido.',
        description: 'Favor inserir um Cep, com 8 números'
      });
      return;
    }
    this.setState({ loadingCep: true });
    try {
      const enderecoCompleto = await cep(cepIn);

      if (enderecoCompleto) {
        this.popularCamposHospedagemConsultaCep(enderecoCompleto);
      }
      if (!enderecoCompleto.street) {
        notification.warning({
          message: 'Cep consultado com avisos',
          description: 'Cep geral, favor inserir Endereço e Bairro'
        });
        this.setState({ desabilitarEndBairroHospedagem: false })
      }
    } catch (error) {
      notification.error({
        message: 'Falha ao consultar CEP',
        description: 'Insira o endereço manualmente'
      });
      this.setState({
        desabilitarCamposEnderecoHospedagem: false,
        desabilitarEndBairroHospedagem: false
      });
    } finally {
      this.setState({ loadingCep: false })
    }
  };

  async recuperarHospedagens() {
    const hospedagensEmpresa = await api.get(`api/hosting`, {
      params: {
        cnpj: this.removeCaractEspecial(this.state.cnpj)
      }
    })
    this.popularTabelaHospedagem(hospedagensEmpresa);
  }

  async recuperarTipoHospedagens() {
    try {
      const tiposHospedagens = await api.get('/api/hostingtype');
      this.popularTiposHospedagem(tiposHospedagens);
    } catch (error) {
      if (error.response) {
        notification.error({
          message: `Não foi possível carregar os tipos de hospedagens`,
          description: `Motivo: ${error.response.data.message}`
        })
      }
    }
  }

  async recuperarTipoVeiculos() {
    try {
      const tiposVeiculos = await api.get('api/vehicles/type/all');
      this.popularTiposVeiculos(tiposVeiculos);
    } catch (error) {
      if (error.response) {
        notification.error({
          message: `Não foi possível carregar os tipos de veículos`,
          description: `Motivo: ${error.response.data.message}`
        })
      }
    }
  }

  async recuperarVeiculos() {
    const veiculosEmpresa = await api.get(`api/vehicles/cnpj`, {
      params: {
        cnpj: this.removeCaractEspecial(this.state.cnpj)
      }
    })
    this.popularTabelaVeiculos(veiculosEmpresa);
  }

  async alterarHospedagemEmpresa(x) {
    let idHospedagem = x.idHospedagem
    try {
      const hospedagemEmpresa = await api.get(`api/hosting/id`, {
        params: {
          id: idHospedagem,
        }
      })
      this.popularCamposHospedagemEdit(hospedagemEmpresa);
    } catch (error) {
      if (error.response) {
        notification.error({
          message: `Não foi possível carregar os dados para edição`,
          description: `Motivo: ${error.response.data.message}`
        })
      }
    }
  }

  async cadastrarTipoHospedagem(e) {
    e.preventDefault();
    if (this.state.tipoHospedagemCad === "" || this.state.tipoHospedagemCad === null) {
      notification.warning({
        message: 'Não é possível Salvar Tipo de Hospedagem sem preencher todos os campos',
      });
    } else {
      this.setState({ loadingModal: true })
      try {
        this.populaCamposCadastroTpHospedagem();
        await api.post('api/hostingtype', this.dataHostingType);
        notification.success({
          message: `Tipo de hospedagem adicionado com sucesso`,
        });
        this.recuperarTipoHospedagens();
      }
      catch (error) {
        if (error.response) {
          notification.error({
            message: 'Não foi possível Salvar Tipo de Hospedagem',
            description: `Motivo: ${error.response.data.message}`
          });
        }
      } finally {
        this.setState({ loadingModal: false })
      }
    }
  }

  async cadastrarTipoVeiculo(e) {
    e.preventDefault();
    if (this.state.nomeTipoVeiculoCad === "" || this.state.fabricanteCad === "" ||
      this.state.modeloCad === "" || this.state.numAssentosVeiculoCad === "" || this.state.tipoAssentosVeiculoCad === "") {
      notification.warning({
        message: 'Não é possível Salvar Tipo de Veículo sem preencher todos os campos',
      });
    } else {
      this.setState({ loadingModal: true })
      try {
        this.populaCamposCadastroTpVeiculo();
        await api.post('api/vehicles/type', this.dataVehiclesType);
        notification.success({
          message: `Tipo de veículo adicionado com sucesso`,
        });
        this.recuperarTipoVeiculos();
      }
      catch (error) {
        if (error.response) {
          notification.error({
            message: 'Não foi possível Salvar Tipo de Veículo',
            description: `Motivo: ${error.response.data.message}`
          });
        }
      } finally {
        this.setState({ loadingModal: false })
      }
    }
  }

  async desativaHospedagem() {
    try {
      this.populaCamposHospedagemDesativar();
      await api.put('api/hosting', this.dataCompanyHosting);
      notification.warning({
        message: `Hospedagem excluída com sucesso`,
      });
      this.recuperarHospedagens();
    } catch (error) {
      if (error.response) {
        notification.error({
          message: `Algo de errado aconteceu`,
          description: `Motivo: ${error.response.data.message}`
        });
      }
    }
  }

  async ativarHospedagemEmpresa() {

  }

  async alterarVeiculoEmpresa(y) {
    let idVeiculo = y.idVeiculo
    try {
      const veiculoEmpresa = await api.get(`api/vehicles/id`, {
        params: {
          id: idVeiculo,
        }
      })
      this.popularCamposVeiculoEdit(veiculoEmpresa);
    } catch (error) {
      if (error.response) {
        notification.error({
          message: `Não foi possível carregar os dados para edição`,
          description: `Motivo: ${error.response.data.message}`
        })
      }
    }
  }

  async desativaVeiculo() {
    try {
      this.populaCamposVeiculoDesativar();
      await api.put('api/vehicles', this.dataCompanyVehicles);
      notification.warning({
        message: `Veículo desativado com sucesso`,
      });
      this.recuperarVeiculos();
    } catch (error) {
      if (error.response) {
        notification.error({
          message: `Algo de errado aconteceu`,
          description: `Motivo: ${error.response.data.message}`
        });
      }
    }
  }

  async ativarVeiculoEmpresa() {

  }

  populaCamposHospedagemDesativar() {
    this.dataCompanyHosting = {
      active: false,
      id_hosting: this.state.idHospedagemDesativar,
    }
  }

  populaCamposVeiculoDesativar() {
    this.dataCompanyVehicles = {
      active: false,
      id_vehicle: this.state.idVeiculoDesativar,
    }
  }

  populaCamposCadastroTpHospedagem() {
    this.dataHostingType = {
      name_hosting_type: this.state.tipoHospedagemCad,
    }
  }

  populaCamposCadastroTpVeiculo() {
    this.dataVehiclesType = {
      accessibility: this.state.acessibilidadeCad,
      bathroom: this.state.banheiroCad,
      description: this.state.descricaoVeiculoCad,
      name_hosting_type: this.state.tipoHospedagemCad,
      manufacturer: this.state.fabricanteCad,
      model: this.state.modeloCad,
      name_vehicle_type: this.state.nomeTipoVeiculoCad,
      num_seats: this.state.numAssentosVeiculoCad,
      seats_type: this.state.tipoAssentosVeiculoCad,
    }
  }

  popularCamposEmpresaPost() {
    this.dataCompany = {
      active: true,
      adresses: [
        {
          additional: this.state.complemento,
          adress: this.state.endereco,
          adress_number: this.state.numero,
          city: this.state.cidade,
          neighborhood: this.state.bairro,
          state: this.state.estado,
          zip_code: this.state.cep,
        }
      ],
      company: {
        active: true,
        cnpj: this.removeCaractEspecial(this.state.cnpj),
        fantasy_name: this.state.nomeFantasia,
        open_date: this.state.dataAbertura,
        social_reason: this.state.razaoSocial,
        state_regis: "",
      },
      contacts: [
        {
          cell_phone: this.removeCaractEspecial(this.state.celular),
          email: this.state.email,
          phone: this.removeCaractEspecial(this.state.telefone),
        }
      ]
    };
  }

  popularCamposHospedagemPost() {
    this.dataHosting = {
      active: true,
      adress:
      {
        additional: this.state.complementoHospedagem,
        adress: this.state.enderecoHospedagem,
        adress_number: this.state.numeroHospedagem,
        city: this.state.cidadeHospedagem,
        neighborhood: this.state.bairroHospedagem,
        state: this.state.estadoHospedagem,
        zip_code: this.removeCaractEspecial(this.state.cepHospedagem),
      },
      document: this.removeCaractEspecial(this.state.cnpj),
      features_hosting: this.state.descricaoLocal,
      hosting_type: {
        id_hosting_type: this.state.tipoHospedagem.idTipoHospedagem,
        name_hosting_type: this.state.tipoHospedagem.nomeTipoHospedagem.key,
      },
      id_hosting: this.state.idHospedagem,
      quantity_person: this.state.qntPessoas,
      tourism_regis: this.state.registroTurismo,
    }
  };

  popularCamposVeiculoPost() {
    this.dataVehicle = {
      active: true,
      id_vehicle: this.state.idVeiculo,
      cnpj: this.removeCaractEspecial(this.state.cnpj),
      id_vehicle_type: this.state.tipoVeiculo.idTipoVeiculo,
      rntrc: this.state.rntrcVeiculo
    }
  }

  popularCamposEmpresaEdit(empresaSistema) {
    this.setState({
      active: empresaSistema.data.company.active,
      idEmpresaSistema: empresaSistema.data.id_person,
      cnpj: empresaSistema.data.company.cnpj,
      razaoSocial: empresaSistema.data.company.social_reason,
      nomeFantasia: empresaSistema.data.company.fantasy_name,
      dataAbertura: empresaSistema.data.company.open_date,
      telefone: empresaSistema.data.contacts[0].phone,
      celular: empresaSistema.data.contacts[0].cell_phone,
      email: empresaSistema.data.contacts[0].email,
      cep: empresaSistema.data.adresses[0].zip_code,
      endereco: empresaSistema.data.adresses[0].adress,
      numero: empresaSistema.data.adresses[0].adress_number,
      complemento: empresaSistema.data.adresses[0].additional,
      bairro: empresaSistema.data.adresses[0].neighborhood,
      cidade: empresaSistema.data.adresses[0].city,
      estado: empresaSistema.data.adresses[0].state,
      desabilitarCampoCnpj: true,
    })
  }

  popularCamposHospedagemEdit(hospedagem) {
    this.setState({
      activeHospedagem: hospedagem.data.active,
      idHospedagem: hospedagem.data.id_hosting,
      registroTurismo: hospedagem.data.tourism_regis,
      qntPessoas: hospedagem.data.quantity_person,
      descricaoLocal: hospedagem.data.features_hosting,
      tipoHospedagem: {
        idTipoHospedagem: hospedagem.data.hosting_type.id_hosting_type,
        nomeTipoHospedagem: {
          key: hospedagem.data.hosting_type.name_hosting_type,
        }
      },
      cepHospedagem: hospedagem.data.adress.zip_code,
      enderecoHospedagem: hospedagem.data.adress.adress,
      numeroHospedagem: hospedagem.data.adress.adress_number,
      complementoHospedagem: hospedagem.data.adress.additional,
      bairroHospedagem: hospedagem.data.adress.neighborhood,
      cidadeHospedagem: hospedagem.data.adress.city,
      estadoHospedagem: hospedagem.data.adress.state,
    })
  }

  popularTabelaHospedagem(HospedagemEmpresa) {
    let x = [];
    HospedagemEmpresa.data.forEach((item, index) => {
      x.push({
        key: index,
        active: item.active,
        idHospedagem: item.id_hosting,
        tpHosp: item.hosting_type.name_hosting_type,
        qntPessoas: item.quantity_person,
        endereco: item.adress.adress,
        cidade: item.adress.city,
      })
    });
    this.setState({ dataHosting: x })
  }

  popularCamposVeiculoEdit(veiculoEmpresa) {
    this.setState({
      activeVeiculo: veiculoEmpresa.data.active,
      idVeiculo: veiculoEmpresa.data.id_vehicle,
      tipoVeiculo: {
        idTipoVeiculo: veiculoEmpresa.data.vehicle_type.id_vehicle_type,
        nomeTipoVeiculo: {
          key: veiculoEmpresa.data.vehicle_type.name_vehicle_type,
        }
      },
      nomeVeiculo: veiculoEmpresa.data.vehicle_type.name_vehicle_type,
      fabricanteVeiculo: veiculoEmpresa.data.vehicle_type.manufacturer,
      modeloVeiculo: veiculoEmpresa.data.vehicle_type.model,
      numAssentosVeiculo: veiculoEmpresa.data.vehicle_type.num_seats,
      tipoAssentosVeiculo: veiculoEmpresa.data.vehicle_type.seats_type,
      banheiro: veiculoEmpresa.data.vehicle_type.bathroom,
      acessibilidade: veiculoEmpresa.data.vehicle_type.accessibility,
      rntrcVeiculo: veiculoEmpresa.data.rntrc,
      descricaoVeiculo: veiculoEmpresa.data.vehicle_type.description,
    })
  }

  popularTabelaVeiculos(veiculosEmpresa) {
    let y = [];
    veiculosEmpresa.data.forEach((item, index) => {
      y.push({
        key: index,
        active: item.active,
        idVeiculo: item.id_vehicle,
        nomeVeiculo: item.vehicle_type.name_vehicle_type,
        qntAssentos: item.vehicle_type.num_seats,
        tpAssento: item.vehicle_type.seats_type,
        tpVeiculo: item.vehicle_type.model,
      })
    });
    this.setState({ dataVehicles: y })
  }

  popularCamposEmpresaConsultaCep = (data) => {
    this.setState({
      endereco: data.street,
      bairro: data.neighborhood,
      cidade: data.city,
      estado: data.state
    })
  };

  popularCamposHospedagemConsultaCep = (data) => {
    this.setState({
      enderecoHospedagem: data.street,
      bairroHospedagem: data.neighborhood,
      cidadeHospedagem: data.city,
      estadoHospedagem: data.state
    })
  }

  popularTiposHospedagem(tiposHospedagem) {
    let hospedagens = []
    tiposHospedagem.data.forEach((item) => {
      hospedagens.push({
        idTipoHospedagem: item.id_hosting_type,
        nomeTipoHospedagem: item.name_hosting_type,
      })
    });
    this.setState({
      tiposHospedagens: hospedagens,
    })
  }

  popularTiposVeiculos(tiposVeiculos) {
    let veiculos = []
    tiposVeiculos.data.forEach((item) => {
      veiculos.push({
        idTipoVeiculo: item.id_vehicle_type,
        nomeTipoVeiculo: item.name_vehicle_type,
        acessibilidade: item.accessibility,
        banheiro: item.bathroom,
        fabricante: item.manufacturer,
        modelo: item.model,
        numAssentos: item.num_seats,
        tipoAssento: item.seats_type,
        descricaoVeiculo: item.description,
      })
    });
    this.setState({
      tiposVeiculos: veiculos,
    })
  }

  popularCamposVeiculoChangeDropdown(value, key) {
    this.setState({
      tipoVeiculo: {
        idTipoVeiculo: value,
        nomeTipoVeiculo: key
      }
    })
    this.state.tiposVeiculos.forEach((item) => {
      if (item.idTipoVeiculo === value) {
        this.setState({
          nomeVeiculo: item.nomeTipoVeiculo,
          fabricanteVeiculo: item.fabricante,
          modeloVeiculo: item.modelo,
          descricaoVeiculo: item.descricaoVeiculo,
          numAssentosVeiculo: item.numAssentos,
          tipoAssentosVeiculo: item.tipoAssento,
          banheiro: item.banheiro,
          acessibilidade: item.acessibilidade,
        })
      }
    })
  }

  limpaCamposHospedagem() {
    this.setState({
      idHospedagem: null,
      idTipoHospedagem: null,
      registroTurismo: "",
      qntPessoas: "",
      descricaoLocal: "",
      cepHospedagem: "",
      enderecoHospedagem: "",
      numeroHospedagem: "",
      complementoHospedagem: "",
      bairroHospedagem: "",
      cidadeHospedagem: "",
      estadoHospedagem: ""
    })
  }

  limpaCamposVeiculos() {
    this.setState({
      idVeiculo: null,
      idTipoVeiculo: null,
      idVeiculoDesativar: null,
      activeVeiculo: "",
      nomeVeiculo: "",
      fabricanteVeiculo: "",
      modeloVeiculo: "",
      numAssentosVeiculo: "",
      tipoAssentosVeiculo: "",
      banheiro: false,
      acessibilidade: false,
      rntrcVeiculo: "",
      descricaoVeiculo: "",
      nomeTipoVeiculoCad: "",
      fabricanteCad: "",
      modeloCad: "",
      numAssentosVeiculoCad: "",
      tipoAssentosVeiculoCad: "",
      banheiroCad: false,
      acessibilidadeCad: false,
    })
  }

  toBackList = () => {
    this.props.history.push("/admin/Company/CompanyList.jsx")
  }

  onChangeStep = current => {
    if(this.state.permiteAvancarPassos){
      this.setState({ current });
    } else {
      notification.warning({
        message: "Favor preencher a aba Dados Principais",
        description: "Necessário para poder cadastrar Hospedagem ou Transporte."
      })
    }
  };

  nextStep = () => {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  previousStep = () => {
    this.setState({ current: this.state.current - 1 });
  }

  onChange = (event) => {
    const state = Object.assign({}, this.state);
    const field = event.target.name;
    state[field] = event.target.value;
    this.setState(state);
  }

  render() {
    const { current } = this.state;

    return (

      <div className="content">
        <Card content={
          <Grid fluid>
            <Modal
              title="Cadastro Tipo Hospedagem"
              visible={this.state.visibleCadTpHosp}
              onOk={this.confirmarModalCadTpHospedagem}
              onCancel={this.cancelarModal}
              footer={[
                <Button key="back" onClick={this.cancelarModal}>
                  Cancelar
                </Button>,
                <Button key="submit" type="primary" htmlType="submit" loading={this.state.loadingModal}
                  onClick={this.confirmarModalCadTpHospedagem}>
                  Cadastrar
                </Button>,
              ]}
              centered
            >
              <Row>
                <div className="col-md-2"></div>
                <div className="col-md-8" style={{ textAlign: 'center' }}>
                  <form name="formTipoHospedagem" onSubmit={this.confirmarModalCadTpHospedagem}>
                    <ControlLabel>Nome Tipo Hospedagem</ControlLabel>
                    <input name="tipoHospedagemCad" value={this.state.tipoHospedagemCad}
                      type="text" className="form-control" required
                      placeholder="Tipo Hospedagem" onChange={this.onChange} />
                  </form>
                </div>
                <div className="col-md-2"></div>
              </Row>
              <Row>
              </Row>
            </Modal>

            <Modal
              title="Cadastro Tipo Veículo"
              visible={this.state.visibleCadTpVeiculos}
              onOk={this.confirmarModalCadTpVeiculo}
              onCancel={this.cancelarModal}
              footer={[
                <Button key="back" onClick={this.cancelarModal}>
                  Cancelar
                </Button>,
                <Button key="submit" type="primary" loading={this.state.loadingModal}
                  onClick={this.confirmarModalCadTpVeiculo}>
                  Cadastrar
                </Button>,
              ]}
              centered
              width={600}
            >
              <form name="formTipoVeiculo" onSubmit={this.confirmarModalCadTpVeiculo}>
                <Row>
                  <div className="col-md-4">
                    <ControlLabel>Nome Tipo Veiculo</ControlLabel>
                    <input name="nomeTipoVeiculoCad" value={this.state.nomeTipoVeiculoCad}
                      type="text" className="form-control"
                      placeholder="Nome Tipo Veículo" onChange={this.onChange} />
                  </div>
                  <div className="col-md-4" style={{ textAlign: 'center' }}>
                    <ControlLabel>Fabricante</ControlLabel>
                    <input name="fabricanteCad" value={this.state.fabricanteCad}
                      type="text" className="form-control"
                      placeholder="Fabricante do Veículo" onChange={this.onChange} />
                  </div>
                  <div className="col-md-4" style={{ textAlign: 'center' }}>
                    <ControlLabel>Modelo</ControlLabel>
                    <input name="modeloCad" value={this.state.modeloCad}
                      type="text" className="form-control"
                      placeholder="Modelo do Veículo" onChange={this.onChange} />
                  </div>
                </Row>
                <Row>
                  <div className="col-md-4">
                    <ControlLabel style={{ marginTop: "10px" }}>Número de assentos</ControlLabel>
                    <input name="numAssentosVeiculoCad" value={this.state.numAssentosVeiculoCad}
                      type="text" className="form-control"
                      placeholder="Número de assentos" onChange={this.onChange} />
                  </div>
                  <div className="col-md-4" style={{ textAlign: 'center' }}>
                    <ControlLabel style={{ marginTop: "10px" }}>Tipo de assentos</ControlLabel>
                    <input name="tipoAssentosVeiculoCad" value={this.state.tipoAssentosVeiculoCad}
                      type="text" className="form-control"
                      placeholder="Leito, Convencional" onChange={this.onChange} />
                  </div>
                </Row>
                <Row>
                  <div className="col-md-6" style={{ textAlign: 'center' }}>
                    <ControlLabel style={{ marginTop: "10px" }}>Banheiro</ControlLabel>
                    <Row>
                      <Radio.Group name="banheiroCad" onChange={this.onChange} value={this.state.banheiroCad}
                        style={{ marginTop: "10px" }}>
                        <Radio value={true}>Sim</Radio>
                        <Radio value={false}>Não</Radio>
                      </Radio.Group>
                    </Row>
                  </div>
                  <div className="col-md-6" style={{ textAlign: 'center' }}>
                    <ControlLabel style={{ marginTop: "10px" }}>Acessibilidade</ControlLabel>
                    <Row>
                      <Radio.Group name="acessibilidadeCad" onChange={this.onChange} value={this.state.acessibilidadeCad}
                        style={{ marginTop: "10px" }}>
                        <Radio value={true}>Sim</Radio>
                        <Radio value={false}>Não</Radio>
                      </Radio.Group>
                    </Row>
                  </div>
                </Row>
                <Row>
                  <div className="col-md-12">
                    <ControlLabel style={{ marginTop: "10px" }}>Descrição do veículo:</ControlLabel>
                    <TextArea rows={4} name="descricaoVeiculoCad" value={this.state.descricaoVeiculoCad}
                      type="text" className="form-control" style={{ padding: "8px 12px", marginTop: "10px" }}
                      placeholder="Características gerais, possui frigobar TV, entre outros."
                      required onChange={this.onChange} />
                  </div>
                </Row>
              </form>
              <Row>
              </Row>
            </Modal>

            <Modal
              title="Confirmação"
              visible={this.state.visibleHospedagem}
              onOk={this.confirmarModalHospedagem}
              onCancel={this.cancelarModal}
              okText="Confirmar"
              cancelText="Cancelar"
              centered
            >
              <Row>
                <div className="col-md-12" style={{ textAlign: 'center' }}>
                  <ControlLabel style={{ marginTop: "10px" }}>Tem certeza que deseja desativar a Hospedagem?</ControlLabel>
                </div>
              </Row>
              <Row>
                <div className="col-md-6" style={{ textAlign: 'center' }}>
                  <ControlLabel style={{ marginTop: "10px" }}>Tipo Hospedagem</ControlLabel>
                  <input name="nomeTipoHospedagemDesativar" value={this.state.nomeTipoHospedagemDesativar}
                    type="text" className="form-control" disabled style={{ textAlign: "center" }} />
                </div>
                <div className="col-md-6" style={{ textAlign: 'center' }}>
                  <ControlLabel style={{ marginTop: "10px" }}>Qnt Pessoas</ControlLabel>
                  <input name="qntPessoasDesativar" value={this.state.qntPessoasDesativar}
                    type="text" className="form-control" disabled style={{ textAlign: "center" }} />
                </div>
              </Row>
              <Row>
                <div className="col-md-6" style={{ textAlign: 'center' }}>
                  <ControlLabel style={{ marginTop: "10px" }}>Endereço</ControlLabel>
                  <input name="enderecoHospedagemDesativar" value={this.state.enderecoHospedagemDesativar}
                    type="text" className="form-control" disabled style={{ textAlign: "center" }} />
                </div>
                <div className="col-md-6" style={{ textAlign: 'center' }}>
                  <ControlLabel style={{ marginTop: "10px" }}>Cidade</ControlLabel>
                  <input name="cidadeHospedagemDesativar" value={this.state.cidadeHospedagemDesativar}
                    type="text" className="form-control" disabled style={{ textAlign: "center" }} />
                </div>
              </Row>
            </Modal>

            <Modal
              title="Confirmação"
              visible={this.state.visibleVeiculos}
              onOk={this.confirmarModalVeiculo}
              onCancel={this.cancelarModal}
              okText="Confirmar"
              cancelText="Cancelar"
              centered
            >
              <Row>
                <div className="col-md-12" style={{ textAlign: 'center' }}>
                  <ControlLabel style={{ marginTop: "10px" }}>Tem certeza que deseja desativar o Veículo?</ControlLabel>
                </div>
              </Row>
              <Row>
                <div className="col-md-6" style={{ textAlign: 'center' }}>
                  <ControlLabel style={{ marginTop: "10px" }}>Nome Veículo</ControlLabel>
                  <input name="nomeVeiculoDesativar" value={this.state.nomeVeiculoDesativar}
                    type="text" className="form-control" disabled style={{ textAlign: "center" }} />
                </div>
                <div className="col-md-6" style={{ textAlign: 'center' }}>
                  <ControlLabel style={{ marginTop: "10px" }}>Tipo Veículo</ControlLabel>
                  <input name="tipoVeiculoDesativar" value={this.state.tipoVeiculoDesativar}
                    type="text" className="form-control" disabled style={{ textAlign: "center" }} />
                </div>
              </Row>
              <Row>
                <div className="col-md-6" style={{ textAlign: 'center' }}>
                  <ControlLabel style={{ marginTop: "10px" }}>Qnt Assentos</ControlLabel>
                  <input name="qntAssentosDesativar" value={this.state.qntAssentosDesativar}
                    type="text" className="form-control" disabled style={{ textAlign: "center" }} />
                </div>
                <div className="col-md-6" style={{ textAlign: 'center' }}>
                  <ControlLabel style={{ marginTop: "10px" }}>Tipo Assento</ControlLabel>
                  <input name="tipoAssentosVeiculoDesativar" value={this.state.tipoAssentosVeiculoDesativar}
                    type="text" className="form-control" disabled style={{ textAlign: "center" }} />
                </div>
              </Row>
            </Modal>
            <Row>
              <>
                <Steps
                  type="navigation"
                  current={current}
                  onChange={this.onChangeStep}
                  className="site-navigation-steps"
                >
                  <Step title="Dados Principais" >
                  </Step>
                  <Step title="Hospedagem" >
                  </Step>
                  <Step title="Transporte" />
                </Steps>
              </>
            </Row>
            <p></p>
            {(current === 0) ? (
              <Row>
                <Col md={12}>
                  <form name="formEmpresa" onSubmit={this.saveCompany}>
                    <Row>
                      <div className="col-md-2">
                        <ControlLabel>CNPJ</ControlLabel>
                        <InputMask mask="99.999.999/9999-99" name="cnpj" value={this.state.cnpj}
                          type="text" className="form-control" onBlur={this.validaCnpj(this.state.cnpj)}
                          placeholder="00.000.000/0000-00" required onChange={this.onChange} disabled={this.state.desabilitarCampoCnpj} />
                      </div>
                      <div className="col-md-4">
                        <ControlLabel>Razão Social</ControlLabel>
                        <input name="razaoSocial" value={this.state.razaoSocial}
                          type="text" className="form-control"
                          placeholder="Razão Social" required onChange={this.onChange} />
                      </div>
                      <div className="col-md-4">
                        <ControlLabel>Nome Fantasia</ControlLabel>
                        <input name="nomeFantasia" value={this.state.nomeFantasia}
                          type="text" className="form-control"
                          placeholder="Nome Fantasia" required onChange={this.onChange} />
                      </div>
                      <div className="col-md-2">
                        <ControlLabel>Data de Abertura</ControlLabel>
                        <input name="dataAbertura" value={this.state.dataAbertura}
                          type="date" className="form-control"
                          placeholder="xx/xx/xxxx" required onChange={this.onChange} />
                      </div>
                    </Row>
                    <Row>
                      <div className="col-md-2">
                        <ControlLabel>Telefone</ControlLabel>
                        <InputMask mask="(99) 9999-9999" name="telefone" value={this.state.telefone}
                          type="text" className="form-control"
                          placeholder="(XX) XXXX-XXXX" required onChange={this.onChange} />
                      </div>
                      <div className="col-md-2">
                        <ControlLabel>Celular</ControlLabel>
                        <InputMask mask="(99) 99999-9999" name="celular" value={this.state.celular}
                          type="text" className="form-control"
                          placeholder="(XX) XXXXX-XXXX" onChange={this.onChange} />
                      </div>
                      <div className="col-md-3">
                        <ControlLabel>Email</ControlLabel>
                        <input name="email" value={this.state.email}
                          type="email" className="form-control" required
                          placeholder="xxxxxx@xxxxx.xxx.xx" onChange={this.onChange} />
                      </div>
                    </Row>

                    <Row>
                      <div className="col-md-3">
                        <ControlLabel>CEP</ControlLabel>
                        <InputMask name="cep" className="form-control" value={this.state.cep}
                          placeholder="00000-000" type="text" mask="99999-999"
                          required onChange={this.onChange} />
                      </div>
                      <div className="col-md-2" style={{ marginTop: '38px', marginBottom: '38px' }}>
                        <Button style={{ height: '35%' }} onClick={this.enderecoEmpresaCep} size="middle"
                          type="primary" loading={this.state.loadingCep}>Consultar Cep</Button>
                      </div>
                    </Row>
                    <Row>
                      <div className="col-md-6">
                        <ControlLabel>Endereço</ControlLabel>
                        <input name="endereco" value={this.state.endereco}
                          type="text" className="form-control"
                          placeholder="Rua xxxxxxxxxxx" onChange={this.onChange}
                          disabled={this.state.desabilitarEndBairro} />
                      </div>
                      <div className="col-md-3">
                        <ControlLabel>Número</ControlLabel>
                        <input name="numero" value={this.state.numero}
                          type="text" className="form-control"
                          placeholder="123" onChange={this.onChange} />
                      </div>
                      <div className="col-md-3">
                        <ControlLabel>Complemento</ControlLabel>
                        <input name="complemento" value={this.state.complemento}
                          type="text" className="form-control"
                          placeholder="Bloco A" onChange={this.onChange} />
                      </div>
                    </Row>
                    <Row>
                      <div className="col-md-4">
                        <ControlLabel>Bairro</ControlLabel>
                        <input name="bairro" value={this.state.bairro}
                          type="text" className="form-control"
                          placeholder="Jardim Aurora" onChange={this.onChange}
                          disabled={this.state.desabilitarEndBairro} />
                      </div>
                      <div className="col-md-4">
                        <ControlLabel>Cidade</ControlLabel>
                        <input name="cidade" value={this.state.cidade}
                          type="text" className="form-control"
                          placeholder="Londrina" onChange={this.onChange}
                          disabled={this.state.desabilitarCamposEndereco} />
                      </div>
                      <div className="col-md-4">
                        <ControlLabel>Estado</ControlLabel>
                        <input name="estado" value={this.state.estado}
                          type="text" className="form-control"
                          placeholder="Paraná" onChange={this.onChange}
                          disabled={this.state.desabilitarCamposEndereco} />
                      </div>
                    </Row>
                    <div className="ant-row ant-row-end">
                      <div className="ant-col">
                        <Button size="middle" onClick={this.toBackList}>
                          Voltar
                    </Button>
                      </div>
                      <div className="ant-col">
                        <Button type="primary" htmlType="submit" size="middle" loading={this.state.loadingAvancar}>
                          Avançar
                    </Button>
                      </div>
                    </div>
                    <div className="clearfix" />
                  </form>
                </Col>
              </Row>
            ) : null}
            {(current === 1) ?
              <Row>
                <Col md={12}>
                  <form name="formHospedagem" onSubmit={this.saveHosting}>
                    <Row>
                      <div className="col-md-2">
                        <ControlLabel>Tipo da hospedagem</ControlLabel>
                        <Select
                          style={{ textAlign: 'left', marginTop: '10px', fontSize: '14px', width: '100%' }}
                          showSearch
                          required
                          value={this.state.tipoHospedagem.idTipoHospedagem}
                          name="tipoHospedagem"
                          placeholder="Tipo hospedagem"
                          onChange={(value, key) =>
                            this.setState({
                              tipoHospedagem: {
                                idTipoHospedagem: value,
                                nomeTipoHospedagem: key
                              }
                            })
                          }
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {this.state.tiposHospedagens.map((item) => (
                            <Option value={item.idTipoHospedagem} key={item.nomeTipoHospedagem}>
                              {item.nomeTipoHospedagem}
                            </Option>
                          ))}
                        </Select>
                      </div>
                      <div className="col-md-2" style={{ marginTop: '35px', marginBottom: '38px' }}>
                        <Button style={{ height: '35%' }} onClick={this.showModalTpHospedagem} size="middle"
                          type="primary">Cadastrar Tipo Hospedagem</Button>
                      </div>
                    </Row>
                    <Row>
                      <div className="col-md-3">
                        <ControlLabel>Registro Ministério Turismo</ControlLabel>
                        <input name="registroTurismo" value={this.state.registroTurismo}
                          type="text" className="form-control"
                          placeholder="José" onChange={this.onChange} />
                      </div>
                      <div className="col-md-3">
                        <ControlLabel>Qnt Pessoas possíveis</ControlLabel>
                        <input name="qntPessoas" value={this.state.qntPessoas}
                          type="number" className="form-control"
                          placeholder="50" required onChange={this.onChange} />
                      </div>
                      <div className="col-md-4">
                        <ControlLabel>Descrição do Local:</ControlLabel>
                        <TextArea rows={4} name="descricaoLocal" value={this.state.descricaoLocal}
                          type="text" className="form-control" style={{ padding: "8px 12px", marginTop: "10px" }}
                          placeholder="Características do local, como sao os quartos
                          Cozinha, Banheiros, Local com piscina, e etc." required onChange={this.onChange} />
                      </div>
                    </Row>
                    <Row>
                      <div className="col-md-3">
                        <ControlLabel>CEP</ControlLabel>
                        <InputMask name="cepHospedagem" className="form-control" value={this.state.cepHospedagem}
                          placeholder="00000-000" type="text" mask="99999-999"
                          required onChange={this.onChange} />
                      </div>
                      <div className="col-md-2" style={{ marginTop: '38px', marginBottom: '38px' }}>
                        <Button style={{ height: '35%' }} onClick={this.enderecoHospedagemCep} size="middle"
                          type="primary" loading={this.state.loadingCep}>Consultar Cep</Button>
                      </div>
                    </Row>
                    <Row>
                      <div className="col-md-6">
                        <ControlLabel>Endereço</ControlLabel>
                        <input name="enderecoHospedagem" value={this.state.enderecoHospedagem}
                          type="text" className="form-control"
                          placeholder="Rua xxxxxxxxxxx" onChange={this.onChange}
                          disabled={this.state.desabilitarEndBairroHospedagem} />
                      </div>
                      <div className="col-md-3">
                        <ControlLabel>Número</ControlLabel>
                        <input name="numeroHospedagem" value={this.state.numeroHospedagem}
                          type="text" className="form-control"
                          placeholder="123" onChange={this.onChange} />
                      </div>
                      <div className="col-md-3">
                        <ControlLabel>Complemento</ControlLabel>
                        <input name="complementoHospedagem" value={this.state.complementoHospedagem}
                          type="text" className="form-control"
                          placeholder="Bloco A" onChange={this.onChange} />
                      </div>
                    </Row>
                    <Row>
                      <div className="col-md-4">
                        <ControlLabel>Bairro</ControlLabel>
                        <input name="bairroHospedagem" value={this.state.bairroHospedagem}
                          type="text" className="form-control"
                          placeholder="Jardim Aurora" onChange={this.onChange}
                          disabled={this.state.desabilitarEndBairroHospedagem} />
                      </div>
                      <div className="col-md-4">
                        <ControlLabel>Cidade</ControlLabel>
                        <input name="cidadeHospedagem" value={this.state.cidadeHospedagem}
                          type="text" className="form-control"
                          placeholder="Londrina" onChange={this.onChange}
                          disabled={this.state.desabilitarCamposEnderecoHospedagem} />
                      </div>
                      <div className="col-md-4">
                        <ControlLabel>Estado</ControlLabel>
                        <input name="estadoHospedagem" value={this.state.estadoHospedagem}
                          type="text" className="form-control"
                          placeholder="Paraná" onChange={this.onChange}
                          disabled={this.state.desabilitarCamposEnderecoHospedagem} />
                      </div>
                    </Row>
                    <div className="ant-row ant-row-end">
                      <div className="ant-col">

                        <Button size="middle" htmlType="submit"
                          type="primary" loading={this.state.loadingAvancar}>Adicionar</Button>
                      </div>
                    </div>
                  </form>
                  <div className="content">
                    <Table columns={this.columnsHosp} dataSource={this.state.dataHosting} bordered scroll={{ x: 100 }} pagination={{
                      showTotal: total =>
                        `Total de ${total} ${total > 1 ? 'itens' : 'item'}`,
                      showQuickJumper: true,
                      showSizeChanger: true,
                    }} />
                  </div>
                  <div className="ant-row ant-row-end">
                    <div className="ant-col">
                      <Button type="info" size="middle" onClick={this.previousStep}>
                        Voltar
                    </Button>
                    </div>
                    <div className="ant-col">
                      <Button type="primary" size="middle" onClick={this.nextStep}>
                        Avançar
                    </Button>
                    </div>
                  </div>
                </Col>
              </Row>
              : null}
            {(current === 2) ?
              <Row>
                <Col md={12}>
                  <form name="formVeiculos" onSubmit={this.saveVehicle}>
                    <Row>
                      <div className="col-md-2">
                        <ControlLabel>Tipo do veículo</ControlLabel>
                        <Select
                          style={{ textAlign: 'left', marginTop: '10px', fontSize: '14px', width: '100%' }}
                          showSearch
                          required
                          value={this.state.tipoVeiculo.idTipoVeiculo}
                          name="tipoVeiculo"
                          placeholder="Tipo veículo"
                          onChange={(value, key) =>
                            this.popularCamposVeiculoChangeDropdown(value, key)
                          }
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {this.state.tiposVeiculos.map((item) => (
                            <Option value={item.idTipoVeiculo} key={item.nomeTipoVeiculo}>
                              {item.nomeTipoVeiculo}
                            </Option>
                          ))}
                        </Select>
                      </div>
                      <div className="col-md-2" style={{ marginTop: '35px', marginBottom: '38px' }}>
                        <Button style={{ height: '35%' }} onClick={this.showModalTpVeiculos} size="middle"
                          type="primary">Cadastrar Tipo Veículo</Button>
                      </div>
                    </Row>
                    <Row>
                      <div className="col-md-3">
                        <ControlLabel>Nome Veículo</ControlLabel>
                        <input name="nomeVeiculo" value={this.state.nomeVeiculo}
                          type="text" className="form-control" disabled
                          placeholder="Veiculo Eldorado" required onChange={this.onChange} />
                      </div>
                      <div className="col-md-2">
                        <ControlLabel>Fabricante</ControlLabel>
                        <input name="fabricanteVeiculo" value={this.state.fabricanteVeiculo}
                          type="text" className="form-control" disabled
                          placeholder="Mercedes" required onChange={this.onChange} />
                      </div>
                      <div className="col-md-2">
                        <ControlLabel>Modelo</ControlLabel>
                        <input name="modeloVeiculo" value={this.state.modeloVeiculo}
                          type="text" className="form-control" disabled
                          placeholder="RS2525" required onChange={this.onChange} />
                      </div>
                      <div className="col-md-5">
                        <ControlLabel>Descrição do veículo:</ControlLabel>
                        <TextArea rows={4} name="descricaoVeiculo" value={this.state.descricaoVeiculo}
                          type="text" className="form-control" style={{ padding: "8px 12px", marginTop: "10px" }}
                          placeholder="Características gerais, possui frigobar, TV, entre outros."
                          required onChange={this.onChange} disabled />
                      </div>
                    </Row>
                    <Row>
                      <div className="col-md-2">
                        <ControlLabel>Número de assentos</ControlLabel>
                        <input name="numAssentosVeiculo" value={this.state.numAssentosVeiculo}
                          type="text" className="form-control" disabled
                          placeholder="45" required onChange={this.onChange} />
                      </div>
                      <div className="col-md-3">
                        <ControlLabel>Tipo de assentos</ControlLabel>
                        <input name="tipoAssentosVeiculo" value={this.state.tipoAssentosVeiculo}
                          type="text" className="form-control" disabled
                          placeholder="Leito" required onChange={this.onChange} />
                      </div>
                      <div className="col-md-2" style={{ textAlign: 'center' }}>
                        <ControlLabel>Banheiro</ControlLabel>
                        <Row>
                          <Radio.Group name="banheiro" onChange={this.onChange} value={this.state.banheiro}
                            style={{ marginTop: "20px" }} disabled>
                            <Radio value={true}>Sim</Radio>
                            <Radio value={false}>Não</Radio>
                          </Radio.Group>
                        </Row>
                      </div>
                      <div className="col-md-2" style={{ textAlign: 'center' }}>
                        <ControlLabel>Acessibilidade</ControlLabel>
                        <Radio.Group name="acessibilidade" onChange={this.onChange} value={this.state.acessibilidade}
                          style={{ marginTop: "20px" }} disabled>
                          <Radio value={true}>Sim</Radio>
                          <Radio value={false}>Não</Radio>
                        </Radio.Group>
                      </div>
                      <div className="col-md-3">
                        <ControlLabel>RNTRC</ControlLabel>
                        <input name="rntrcVeiculo" value={this.state.rntrcVeiculo}
                          type="text" className="form-control"
                          placeholder="123456" required onChange={this.onChange} />
                      </div>
                    </Row>
                    <div className="ant-row ant-row-end">
                      <div className="ant-col">
                        <Button size="middle" htmlType="submit"
                          type="primary" loading={this.state.loadingAvancar}>Adicionar</Button>
                      </div>
                    </div>
                  </form>
                  <div className="content">
                    <Table columns={this.columnsVehicles} dataSource={this.state.dataVehicles} bordered scroll={{ x: 100 }} pagination={{
                      showTotal: total =>
                        `Total de ${total} ${total > 1 ? 'itens' : 'item'}`,
                      showQuickJumper: true,
                      showSizeChanger: true,
                    }} />
                  </div>
                  <div className="ant-row ant-row-end">
                    <div className="ant-col">
                      <Button type="info" size="middle" onClick={this.previousStep}>
                        Voltar
                    </Button>
                    </div>
                    <div className="ant-col">
                      <Button type="primary" size="middle" onClick={this.toBackList}>
                        Finalizar
                    </Button>
                    </div>
                  </div>
                </Col>
              </Row>
              : null}
          </Grid>
        } />

      </div>
    )
  }
}
export default SystemCompanyInsert;