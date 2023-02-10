import { useState, useEffect } from 'react';
import React from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../../controller/api';
import apiBrasilAberto from '../../../controller/apiBrasilAberto';
import ValidaAutenticacao from '../../funcoes/autenticacao';
import ConfirmarLottie from '../../../componentes/lotties/confirmar';

import './styles.css';

function Registro() {
    const Navegacao = useNavigate();

    const [tipoCadastro, setTipoCadastro] = useState(null);

    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [cpfCnpj, setCpfCnpj] = useState('');
    const [rg, setRG] = useState('');
    const [email, setEmail] = useState('');
    const [confirmaEmail, setConfirmaEmail] = useState('');

    const [endereco, setEndereco] = useState('');
    const [bairro, setBairro] = useState('');
    const [numero, setNumero] = useState('');
    const [cep, setCEP] = useState('');
    const [estado, setEstado] = useState('');
    const [cidade, setCidade] = useState('');
    const [pais, setPais] = useState('BR');
    const [complemento, setComplemento] = useState('');

    const [senha, setSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');

    const [etapaAtual, setEtapaAtual] = useState(0);

    useEffect(() => {
        document.title = 'VANTAGEM | Cadastre-se'
    }, [])   

    if (ValidaAutenticacao()) {
        return (
            <Navigate to='/' replace={true} />
        );
    }

    function enviarFormularioRegistro(e) {
        e.preventDefault();
        
        if (confirmaEmail !== email) {
            notificarErro('Os e-mails informados não são iguais.');
            return;
        }

        if (confirmaSenha !== senha) {
            notificarErro('As senhas informadas não são iguais.');
            return;
        }

        let json = {
            nome: nome,
            sobrenome: sobrenome,
            email: email,
            senha: senha,
            tipo_cadastro: tipoCadastro
        };

        api.post('/api/v1/registro', json)
        .then((res) => {
            localStorage.setItem('codigo_usuario_vantagem', res.data.codigo);
            localStorage.setItem('nome_usuario_vantagem', res.data.nome);
            localStorage.setItem('sobrenome_usuario_vantagem', res.data.sobrenome);
            localStorage.setItem('tipo_cadastro_usuario_vantagem', res.data.tipo_cadastro);
            localStorage.setItem('token_usuario_vantagem', res.data.token);
            Navegacao('/');
        })
        .catch((err) => {
            notificarErro(err.response.data);
            return;
        });
    }

    const notificarErro = (e) => toast.error(e, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        icon: false,
    });

    const etapas = [
        {
            id: 'TIPO_CONTA',
            titulo: 'Olá! Muito bom te ver por aqui.',
            subtitulo: 'Para começar, selecione abaixo o seu perfil:'
        },
        {
            id: 'INFORMACOES_PESSOAIS',
            titulo: 'Precisamos de algumas informações pessoais suas...',
            subtitulo: 'Não compartilharemos nenhuma de suas informações pessoais, fique tranquilo!'
        },
        {
            id: 'INFORMACOES_ENDERECO',
            titulo: 'Certo. E qual é o seu endereço?',
            subtitulo: 'Lembre-se de colocar o seu endereço atual...'
        },
        {
            id: 'SEGURANCA',
            titulo: 'Agora vamos criar uma senha para você!',
            subtitulo: 'Crie uma senha forte, pois ela é muito importante para sua segurança.'
        },
        {
            id: 'ENVIANDO_FORMULARIO',
            titulo: 'Legal! Recebemos o seu cadastro.',
            subtitulo: 'Vamos validar suas informações e liberaremos o seu acesso o mais rápido possível!'
        }
    ];

    function proximaPagina() {
        setEtapaAtual((prevState) => prevState + 1);
    }

    function paginaAnterior() {
        setEtapaAtual((prevState) => prevState - 1);
    }

    function resetarTipoCadastro() {
        setTipoCadastro(null);
        paginaAnterior();
    }

    function validarTipoPerfil() {
        if (!tipoCadastro) {
            notificarErro('Por favor, selecione o seu perfil abaixo.');
            return;
        } else {
            proximaPagina();
        }
    }

    function validarInformacoesPessoais() {
        var retorno = true;

        if (nome === '') { retorno = false; }
        if (sobrenome === '') { retorno = false; }
        if (telefone === '') { retorno = false; }
        if (dataNascimento === '') { retorno = false; }
        if (cpfCnpj === '') { retorno = false; }
        if (rg === '') { retorno = false; }
        if (email === '') { retorno = false; }
        if (confirmaEmail === '') { retorno = false; }

        if (confirmaEmail !== email) { retorno = false; }

        if (!retorno) {
            notificarErro('Por favor, valide todas as suas informações pessoais.');
            return;
        } else {
            proximaPagina();
        }
    }

    function validarEndereco() {
        var retorno = true;

        if (endereco === '') { retorno = false; }
        if (bairro === '') { retorno = false; }
        if (numero === '') { retorno = false; }
        if (cep === '') { retorno = false; }
        if (estado === '') { retorno = false; }
        if (cidade === '') { retorno = false; }
        if (pais === '') { retorno = false; }
        if (complemento === '') { retorno = false; }

        if (!retorno) {
            notificarErro('Por favor, preencha todas as suas informações de endereço.');
            return;
        } else {
            proximaPagina();
        }
    }

    function validarSenhas() {
        var retorno = true;

        if (senha === '' || confirmaSenha === '') { 
            retorno = false; 
        } else {
            if (confirmaSenha !== senha) {
                retorno = false; 
            }
        }

        if (!retorno) {
            notificarErro('Por favor, verifique as senhas informadas.');
            return;
        } else {
            proximaPagina();
        }
    }

    return (
        <div className='container-fluid h-100 container-auth'>
            <div className='row h-100' style={{'minHeight': '100vh'}}>
                <div className='col d-flex flex-column justify-content-center bg-light'>
                    <div className='container-form mx-auto w-100 p-3'>
                        <form method='POST' onSubmit={enviarFormularioRegistro}>

                            <div className="text-center">
                                <h2 className='label-inicio'>{etapas[etapaAtual].titulo}</h2>
                                <p className='font-weight-light mb-5'>{etapas[etapaAtual].subtitulo}</p>
                            </div>

                            
                            {etapas[etapaAtual].id === 'TIPO_CONTA' && (
                                <div className='row d-flex mb-4'>
                                    <div className='form-group col-6'>
                                        <input type='radio' class='btn-check' name='options-outlined' id='btn-aluno' autocomplete='off' onChange={() => setTipoCadastro(1)}/>
                                        <label className='btn btn-secondary text-center' for='btn-aluno'>
                                            <h4 className='my-auto'>Aluno</h4>

                                            <div className='form-row mt-3 mb-3'>
                                                <span className='p-3' style={{'font-size':'400%'}}><i className='fa fa-graduation-cap mx-auto' aria-hidden='true'></i></span>
                                            </div>

                                            <p className='mt-3'>Quero encontrar um <strong>motorista ideal</strong>, acompanhar minhas mensalidades ou ...</p>
                                        </label>
                                    </div>

                                    <div className='form-group col-6'>
                                        <input type='radio' class='btn-check' name='options-outlined' id='btn-motorista' autocomplete='off' onChange={() => setTipoCadastro(2)}/>
                                        <label className='btn btn-secondary text-center' for='btn-motorista'>
                                            <h4 className='my-auto'>Motorista</h4>

                                            <div className='form-row mt-3 mb-3'>
                                                <span className='p-3' style={{'font-size':'400%'}}><i className='fa fa-bus mx-auto' aria-hidden='true'></i></span>
                                            </div>

                                            <p className='mt-3'>Quero encontrar um <strong>motorista ideal</strong>, acompanhar minhas mensalidades ou ...</p>
                                        </label>
                                    </div>
                                    
                                    <div className='form-row mt-5'>
                                        <div className='form-group col-12 px-2'>
                                            <button type='button' className='btn btn-primary btn-block w-100' onClick={validarTipoPerfil}><i class="fa fa-chevron-right" aria-hidden="true"></i> Continuar</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {etapas[etapaAtual].id === 'INFORMACOES_PESSOAIS' && (
                                <div className="informacoes-pessoais">
                                    <div className="row">
                                        <div className="col-md-4 px-2">
                                            <span htmlFor="input_nome">Nome:</span>
                                            <input type="text" className="form-control w-100 bordas-arredondadas" autoCapitalize='true' required id="input_nome" onChange={(e) => setNome(e.target.value)} value={nome}/>
                                        </div>
                                        <div className="col-md-4 px-2">
                                            <span htmlFor="input_sobrenome">Sobrenome:</span>
                                            <input type="text" className="form-control w-100 bordas-arredondadas" autoCapitalize='true' required id="input_sobrenome" onChange={(e) => setSobrenome(e.target.value)} value={sobrenome}/>
                                        </div>
                                        <div className="col-md-4 px-2">
                                            <span htmlFor="input_data_nascimento">Data de Nascimento:</span>
                                            <input type="date" className="form-control w-100 bordas-arredondadas" autoCapitalize='true' required id="input_data_nascimento" onChange={(e) => setDataNascimento(e.target.value)} value={dataNascimento}/>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md px-2">
                                            <span htmlFor="input_email">E-mail:</span>
                                            <input type="email" className="form-control w-100 bordas-arredondadas" required id="input_email" onChange={(e) => setEmail(e.target.value)} value={email}/>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md px-2">
                                            <span htmlFor="input_email_confirmar">Confirmar E-mail:</span>
                                            <input type="email" className="form-control w-100 bordas-arredondadas"  required id="input_email_confirmar" onChange={(e) => setConfirmaEmail(e.target.value)} value={confirmaEmail}/>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md px-2">
                                            <span htmlFor="input_telefone">Celular:</span>
                                            <input type="text" className="form-control w-100 bordas-arredondadas" required id="input_telefone" onChange={(e) => setTelefone(e.target.value)} value={telefone}/>
                                        </div>
                                        <div className="col-md px-2">
                                            <span htmlFor="input_cpf_cnpj">CPF / CNPJ:</span>
                                            <input type="text" className="form-control w-100 bordas-arredondadas" required id="input_cpf_cnpj" onChange={(e) => setCpfCnpj(e.target.value)} value={cpfCnpj}/>
                                        </div>
                                        <div className="col-md px-2">
                                            <span htmlFor="input_rg">RG:</span>
                                            <input type="text" className="form-control w-100 bordas-arredondadas" required id="input_rg" onChange={(e) => setRG(e.target.value)} value={rg}/>
                                        </div>
                                    </div>

                                    <div className='row mt-5 g-2'>
                                        <div className='col-md px-2'>
                                            <button type='button' className='btn btn-secondary btn-block w-100' onClick={resetarTipoCadastro}><i class="fa fa-chevron-left" aria-hidden="true"></i> Voltar</button>
                                        </div>
                                        <div className='col-md px-2'>
                                            <button type='button' className='btn btn-primary btn-block w-100' onClick={validarInformacoesPessoais}><i class="fa fa-chevron-right" aria-hidden="true"></i> Continuar</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {etapas[etapaAtual].id === 'INFORMACOES_ENDERECO' && (
                                <div className="informacoes-pessoais">
                                    <div className="row">
                                        <div className="col-md-6 px-2">
                                            <span htmlFor="input_endereco">Endereço:</span>
                                            <input type="text" className="form-control w-100 bordas-arredondadas" autoCapitalize='true' required id="input_endereco" onChange={(e) => setEndereco(e.target.value)} value={endereco}/>
                                        </div>
                                        <div className="col-md-4 px-2">
                                            <span htmlFor="input_bairro">Bairro:</span>
                                            <input type="text" className="form-control w-100 bordas-arredondadas" autoCapitalize='true' required id="input_bairro" onChange={(e) => setBairro(e.target.value)} value={bairro}/>
                                        </div>
                                        <div className="col-md-2 px-2">
                                            <span htmlFor="input_numero">Número:</span>
                                            <input type="text" className="form-control w-100 bordas-arredondadas" autoCapitalize='true' required id="input_numero" onChange={(e) => setNumero(e.target.value)} value={numero}/>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-4 px-2">
                                            <span htmlFor="input_cep">CEP:</span>
                                            <input type="text" className="form-control w-100 bordas-arredondadas" autoCapitalize='true' required id="input_cep" onChange={(e) => setCEP(e.target.value)} value={cep}/>
                                        </div>
                                        <div className="col-md-2 px-2">
                                            <span htmlFor="input_estado">UF:</span>
                                            <select type="text" className="form-control w-100 bordas-arredondadas" autoCapitalize='true' required id="input_estado" onChange={(e) => setEstado(e.target.value)} value={estado}>
                                                <option value="MG">MG</option>
                                                <option value="SP">SP</option>
                                            </select>
                                        </div>
                                        <div className="col-md-4 px-2">
                                            <span htmlFor="input_cidade">Cidade:</span>
                                            <input type="text" className="form-control w-100 bordas-arredondadas" autoCapitalize='true' required id="input_cidade" onChange={(e) => setCidade(e.target.value)} value={cidade}/>
                                        </div>
                                        <div className="col-md-2 px-2">
                                            <span htmlFor="input_pais">País:</span>
                                            <select type="text" className="form-control w-100 bordas-arredondadas" autoCapitalize='true' required id="input_pais" onChange={(e) => setPais(e.target.value)} value={pais}>
                                                <option value="BR">Brasil</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md px-2">
                                            <span htmlFor="input_complemento">Complemento:</span>
                                            <input type="text" className="form-control w-100 bordas-arredondadas" autoCapitalize='true' required id="input_complemento" onChange={(e) => setComplemento(e.target.value)} value={complemento}/>
                                        </div>
                                    </div>

                                    <div className='row mt-5 g-2'>
                                        <div className='col-md px-2'>
                                            <button type='button' className='btn btn-secondary btn-block w-100' onClick={paginaAnterior}><i class="fa fa-chevron-left" aria-hidden="true"></i> Voltar</button>
                                        </div>
                                        <div className='col-md px-2'>
                                            <button type='button' className='btn btn-primary btn-block w-100' onClick={validarEndereco}><i class="fa fa-chevron-right" aria-hidden="true"></i> Continuar</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {etapas[etapaAtual].id === 'SEGURANCA' && (
                                <div className="informacoes-pessoais">
                                    <div className="row">
                                        <div className="col-md px-2">
                                            <span htmlFor="input_endereco">Senha:</span>
                                            <input type="password" className="form-control w-100 bordas-arredondadas" autoCapitalize='true' required id="input_endereco" onChange={(e) => setSenha(e.target.value)} value={senha}/>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md px-2">
                                            <span htmlFor="input_cep">Confirmar Senha:</span>
                                            <input type="password" className="form-control w-100 bordas-arredondadas" autoCapitalize='true' required id="input_cep" onChange={(e) => setConfirmaSenha(e.target.value)} value={confirmaSenha}/>
                                        </div>
                                    </div>

                                    <div className='row mt-5 g-2'>
                                        <div className='col-md px-2'>
                                            <button type='button' className='btn btn-secondary btn-block w-100' onClick={paginaAnterior}><i class="fa fa-chevron-left" aria-hidden="true"></i> Voltar</button>
                                        </div>
                                        <div className='col-md px-2'>
                                            <button type='button' className='btn btn-primary btn-block w-100' onClick={validarSenhas}><i class="fa fa-chevron-right" aria-hidden="true"></i> Continuar</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {etapas[etapaAtual].id === 'ENVIANDO_FORMULARIO' && (
                                <div className="informacoes-pessoais">
                                    <ConfirmarLottie/>
                                </div>
                            )}

                            <div className='form-row mt-2 d-flex justify-content-center'>
                                <span className='text-right'>Já possui uma conta? <Link to='/login'>Realizar Login.</Link></span>
                            </div>
                        </form>
                    </div>
                </div>
                <div className='col d-none d-md-block col-right bg-primary col-background'>

                </div>
            </div>

            <ToastContainer />
        </div>
    )
}

export default Registro