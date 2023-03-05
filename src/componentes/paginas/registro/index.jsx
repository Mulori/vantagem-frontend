import { useState, useEffect } from 'react';
import React from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../../controller/api';
import { removerMascara } from '../../funcoes/geral';
import ValidaAutenticacao from '../../funcoes/autenticacao';
import ConfirmarLottie from '../../../componentes/lotties/confirmar';
import InputMask from 'react-input-mask';
import logo from '../../../images/LOGOVANTAGEM.png';
import Select from 'react-select'

import './styles.css';

function Registro() {
    const Navegacao = useNavigate();
    const [todosEstados, setTodosEstados] = useState(null);
    const [todasCidades, setTodasCidades] = useState(null);
    const [todosBairros, setTodosBairros] = useState(null);

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

    const [jsonEstado, setJsonEstado] = useState(null);

    const [senha, setSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');

    const [etapaAtual, setEtapaAtual] = useState(0);

    useEffect(() => {
        document.title = 'VANTAGEM | Cadastre-se'
        ObterTodosEstados();
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
            confirma_email: confirmaEmail,
            senha: senha,
            tipo_cadastro: tipoCadastro,
            documento: cpfCnpj,
            data_nascimento: dataNascimento,
            celular: removerMascara(telefone),
            rg: rg,
            endereco: endereco,
            numero: numero,
            complemento: complemento,
            cep: removerMascara(cep),
            codigo_bairro: bairro
        };

        api.post('/api/v1/registro', json)
        .then((res) => {
            proximaPagina();
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

    function ObterTodosEstados(){
        api.get('/api/v1/cep/estado', { headers: { cep: 'busca-cep' } })
        .then((res) => {
            console.log(res.data)
            setTodosEstados(res.data)
        })
        .catch((err) => {
            notificarErro(err.response.data);
            return;
        });
    }

    function ObterTodasCidades(uf){
        setEstado(uf)
        setTodasCidades(null);
        setTodosBairros(null);

        api.get('/api/v1/cep/estado/'+uf+'/cidade', { headers: { cep: 'busca-cep' } })
        .then((res) => {
            setTodasCidades(res.data)
        })
        .catch((err) => {
            notificarErro(err.response.data);
            return;
        });
    }

    function ObterTodosBairros(id_cidade){
        setCidade(id_cidade);
        setBairro(null);
        setTodosBairros(null);

        var array = [];

        api.get('/api/v1/cep/estado/cidade/' + id_cidade + '/bairro', { headers: { cep: 'busca-cep' } })
        .then((res) => {
            setTodosBairros(res.data)
        })
        .catch((err) => {
            notificarErro(err.response.data);
            return;
        });
    }

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
        var mensagem = '';

        if (nome === '') { notificarErro('Por favor, informe seu nome,'); return; }
        if (sobrenome === '') { notificarErro('Por favor, informe seu sobrenome,');  return;  }
        if (telefone === '') { notificarErro('Por favor, informe seu celular.');  return;  }
        if (dataNascimento === '') { notificarErro('Por favor, informe sua data de nascimento.'); return;  }
        if (cpfCnpj === '') { notificarErro('Por favor, informe seu CPF ou CNPJ.'); return;  }
        if (rg === '') { notificarErro('Por favor, informe seu RG.'); return;  }
        if (email === '') { notificarErro('Por favor, informe seu e-mail.'); return;  }
        if (confirmaEmail === '') { notificarErro('Por favor, confirme seu e-mail'); return;  }

        if (confirmaEmail !== email) { notificarErro('Os e-mails não são correspondentes.'); return;  }

        proximaPagina();
    }

    function validarEndereco() {
        var retorno = true;

        if (endereco === '') { retorno = false; }
        if (bairro === '') { retorno = false; }
        if (numero === '') { retorno = false; }
        if (cep === '') { retorno = false; }

        if (!retorno) {
            notificarErro('Por favor, preencha todas as suas informações de endereço.');
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

                            <div className='row d-flex mb-4 g-2 text-center justify-content-center'>
                                <img src={logo} alt='' className='logo-imagem' />
                            </div>

                            <div className='text-center'>
                                <h2 className='label-inicio'>{etapas[etapaAtual].titulo}</h2>
                                <p className='font-weight-light mb-5'>{etapas[etapaAtual].subtitulo}</p>
                            </div>

                            
                            {etapas[etapaAtual].id === 'TIPO_CONTA' && (
                                <div className='row d-flex mb-4 g-2'>
                                    <div className='form-group col-md-6'>
                                        <input type='radio' className='btn-check' name='options-outlined' id='btn-aluno' autoComplete='off' onChange={() => setTipoCadastro(1)}/>
                                        <label className='btn btn-secondary text-center w-100' for='btn-aluno'>
                                            <h4 className='my-auto'>Aluno</h4>

                                            <div className='form-row mt-3 mb-3'>
                                                <span className='p-3' style={{'font-size':'400%'}}><i className='fa fa-graduation-cap mx-auto' aria-hidden='true'></i></span>
                                            </div>

                                            <p className='mt-3'>Quero encontrar um <strong>motorista ideal</strong>...</p>
                                        </label>
                                    </div>

                                    <div className='form-group col-md-6'>
                                        <input type='radio' className='btn-check' name='options-outlined' id='btn-motorista' autoComplete='off' onChange={() => setTipoCadastro(2)}/>
                                        <label className='btn btn-secondary text-center w-100' for='btn-motorista'>
                                            <h4 className='my-auto'>Motorista</h4>

                                            <div className='form-row mt-3 mb-3'>
                                                <span className='p-3' style={{'font-size':'400%'}}><i className='fa fa-bus mx-auto' aria-hidden='true'></i></span>
                                            </div>

                                            <p className='mt-3'>Quero encontrar <strong>novos passageiros</strong>...</p>
                                        </label>
                                    </div>
                                    
                                    <div className='form-row mt-5'>
                                        <div className='form-group col-12 px-2'>
                                            <button type='button' className='btn btn-primary btn-block w-100' onClick={validarTipoPerfil}><i className='fa fa-chevron-right' aria-hidden='true'></i> Continuar</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {etapas[etapaAtual].id === 'INFORMACOES_PESSOAIS' && (
                                <div className='informacoes-pessoais'>
                                    <div className='row'>
                                        <div className='col-md-4 px-2'>
                                            <span htmlFor='input_nome'>Nome:</span>
                                            <input type='text' className='form-control w-100 bordas-arredondadas' maxLength={100} autoCapitalize='true' required id='input_nome' onChange={(e) => setNome(e.target.value)} value={nome}/>
                                        </div>
                                        <div className='col-md-4 px-2'>
                                            <span htmlFor='input_sobrenome'>Sobrenome:</span>
                                            <input type='text' className='form-control w-100 bordas-arredondadas' maxLength={100} autoCapitalize='true' required id='input_sobrenome' onChange={(e) => setSobrenome(e.target.value)} value={sobrenome}/>
                                        </div>
                                        <div className='col-md-4 px-2'>
                                            <span htmlFor='input_data_nascimento'>Data de Nascimento:</span>
                                            <input type='date' className='form-control w-100 bordas-arredondadas' autoCapitalize='true' required id='input_data_nascimento' onChange={(e) => setDataNascimento(e.target.value)} value={dataNascimento}/>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-md px-2'>
                                            <span htmlFor='input_email'>E-mail:</span>
                                            <input type='email' className='form-control w-100 bordas-arredondadas' maxLength={255} required id='input_email' onChange={(e) => setEmail(e.target.value)} value={email}/>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-md px-2'>
                                            <span htmlFor='input_email_confirmar'>Confirmar E-mail:</span>
                                            <input type='email' className='form-control w-100 bordas-arredondadas'  maxLength={255} required id='input_email_confirmar' onChange={(e) => setConfirmaEmail(e.target.value)} value={confirmaEmail}/>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-md px-2'>
                                            <span htmlFor='input_telefone'>Celular:</span>
                                            <InputMask type='text' className='form-control w-100 bordas-arredondadas' id='input_telefone' required={true} mask='(99) 99999-9999' placeholder='(00) 00000-0000' onChange={(e) => setTelefone(e.target.value)} value={telefone}></InputMask>
                                        </div>
                                        <div className='col-md px-2'>
                                            <span htmlFor='input_cpf_cnpj'>{tipoCadastro === 1 ? 'CPF' : 'CNPJ'}</span>
                                            {
                                                tipoCadastro === 1 ? 
                                                <InputMask type='text' className='form-control w-100 bordas-arredondadas' required={true} mask='999.999.999-99' placeholder='000.000.000-00' id='input_cpf_cnpj' onChange={(e) => setCpfCnpj(e.target.value)} value={cpfCnpj}></InputMask>
                                                :
                                                <InputMask type='text' className='form-control w-100 bordas-arredondadas' required={true} mask='99.999.999/9999-99' placeholder='00.000.000/0000-00' id='input_cpf_cnpj' onChange={(e) => setCpfCnpj(e.target.value)} value={cpfCnpj}></InputMask>
                                            }
                                        </div>
                                        <div className='col-md px-2'>
                                            <span htmlFor='input_rg'>RG:</span>
                                            <input type='text' className='form-control w-100 bordas-arredondadas' maxLength={15} required id='input_rg' onChange={(e) => setRG(e.target.value)} value={rg}/>
                                        </div>
                                    </div>

                                    <div className='row mt-5 g-2'>
                                        <div className='col-md px-2'>
                                            <button type='button' className='btn btn-secondary btn-block w-100' onClick={resetarTipoCadastro}><i className='fa fa-chevron-left' aria-hidden='true'></i> Voltar</button>
                                        </div>
                                        <div className='col-md px-2'>
                                            <button type='button' className='btn btn-primary btn-block w-100' onClick={validarInformacoesPessoais}><i className='fa fa-chevron-right' aria-hidden='true'></i> Continuar</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {etapas[etapaAtual].id === 'INFORMACOES_ENDERECO' && (
                                <div className='informacoes-pessoais'>
                                    <div className='row'>
                                        <div className='col-md-2 px-2'>
                                            <span htmlFor='input_pais'>País:</span>
                                            <select type='text' className='form-control w-100 bordas-arredondadas' autoCapitalize='true' required id='input_pais' onChange={(e) => setPais(e.target.value)} value={pais}>
                                                <option value='BR'>Brasil</option>
                                            </select>
                                        </div>
                                        <div className='col-md-2 px-2'>
                                            <span htmlFor='input_estado'>Estado:</span>
                                            <select type='text' className='form-control w-100 bordas-arredondadas' autoCapitalize='true' required id='input_estado' onChange={(e) => ObterTodasCidades(e.target.value)} value={estado}>
                                                {
                                                    !todosEstados ? null : 
                                                    todosEstados.map(item => <option value={item.uf}>{item.nome}</option>)
                                                }
                                            </select>
                                        </div>
                                        <div className='col-md-4 px-2'>
                                            <span htmlFor='input_cidade'>Cidade:</span>
                                            <select type='text' className='form-control w-100 bordas-arredondadas' autoCapitalize='true' required id='input_cidade' onChange={(e) => ObterTodosBairros(e.target.value)} value={cidade}>
                                                {
                                                    !todasCidades ? null : 
                                                    todasCidades.map(item => <option value={item.id_cidade}>{item.nome}</option>)
                                                }
                                            </select>
                                        </div>
                                        <div className='col-md-4 px-2'>
                                            <span htmlFor='input_bairro'>Bairro:</span>
                                            <select type='text' className='form-control w-100 bordas-arredondadas' autoCapitalize='true' required id='input_bairro' onChange={(e) => setBairro(e.target.value)} value={bairro}>
                                                {
                                                    !todosBairros ? null : 
                                                    todosBairros.map(item => <option value={item.id_bairro}>{item.nome}</option>)
                                                }
                                            </select>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-md-8 px-2'>
                                            <span htmlFor='input_endereco'>Endereço:</span>
                                            <input type='text' className='form-control w-100 bordas-arredondadas' maxLength={100} autoCapitalize='true' required id='input_endereco' onChange={(e) => setEndereco(e.target.value)} value={endereco}/>
                                        </div>

                                        <div className='col-md-2 px-2'>
                                            <span htmlFor='input_numero'>Número:</span>
                                            <input type='text' className='form-control w-100 bordas-arredondadas' maxLength={10} autoCapitalize='true' required id='input_numero' onChange={(e) => setNumero(e.target.value)} value={numero}/>
                                        </div>
                                        
                                        <div className='col-md-2 px-2'>
                                            <span htmlFor='input_cep'>CEP:</span>
                                            <InputMask type='text' className='form-control w-100 bordas-arredondadas' maxLength={10} required={true} mask='99999-999' placeholder='00000-000' onChange={(e) => setCEP(e.target.value)} value={cep}></InputMask>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-md px-2'>
                                            <span htmlFor='input_complemento'>Complemento:</span>
                                            <input type='text' className='form-control w-100 bordas-arredondadas' maxLength={150} autoCapitalize='true' required id='input_complemento' onChange={(e) => setComplemento(e.target.value)} value={complemento}/>
                                        </div>
                                    </div>

                                    <div className='row mt-5 g-2'>
                                        <div className='col-md px-2'>
                                            <button type='button' className='btn btn-secondary btn-block w-100' onClick={paginaAnterior}><i className='fa fa-chevron-left' aria-hidden='true'></i> Voltar</button>
                                        </div>
                                        <div className='col-md px-2'>
                                            <button type='button' className='btn btn-primary btn-block w-100' onClick={validarEndereco}><i className='fa fa-chevron-right' aria-hidden='true'></i> Continuar</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {etapas[etapaAtual].id === 'SEGURANCA' && (
                                <div className='informacoes-pessoais'>
                                    <div className='row'>
                                        <div className='col-md px-2'>
                                            <span htmlFor='input_endereco'>Senha:</span>
                                            <input type='password' className='form-control w-100 bordas-arredondadas' maxLength={12} autoCapitalize='true' required id='input_endereco' onChange={(e) => setSenha(e.target.value)} value={senha}/>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-md px-2'>
                                            <span htmlFor='input_cep'>Confirmar Senha:</span>
                                            <input type='password' className='form-control w-100 bordas-arredondadas' maxLength={12} autoCapitalize='true' required id='input_cep' onChange={(e) => setConfirmaSenha(e.target.value)} value={confirmaSenha}/>
                                        </div>
                                    </div>

                                    <div className='row mt-5 g-2'>
                                        <div className='col-md px-2'>
                                            <button type='button' className='btn btn-secondary btn-block w-100' onClick={paginaAnterior}><i className='fa fa-chevron-left' aria-hidden='true'></i> Voltar</button>
                                        </div>
                                        <div className='col-md px-2'>
                                            <button type='submit' className='btn btn-primary btn-block w-100' ><i className='fa fa-chevron-right' aria-hidden='true'></i> Continuar</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {etapas[etapaAtual].id === 'ENVIANDO_FORMULARIO' && (
                                <div className='informacoes-pessoais'>
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