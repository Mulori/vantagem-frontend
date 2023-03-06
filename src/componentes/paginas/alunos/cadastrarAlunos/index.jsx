import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import InputMask from 'react-input-mask';
import { ToastContainer, toast } from 'react-toastify';
import api from '../../../../controller/api';
import $ from 'jquery';
import './styles.css';

function CadastrarAluno() {
    useEffect(() => {
        document.title = 'VANTAGEM | Cadastrar Aluno';
        ObterTodosEstadosIda();
        ObterTodosEstadosVolta();
    }, []);

    var caminho_atual = useLocation();

    $(document).ready(function() {
        if (caminho_atual.pathname.startsWith('/alunos')) {
            $('#navbarSupportedContent ul li').removeClass('active');
            $('#navbar-alunos').addClass('active');
        }
    });

    var Navegacao = useNavigate();

    const [todosEstadosIda, setTodosEstadosIda] = useState(null);
    const [todasCidadesIda, setTodasCidadesIda] = useState(null);
    const [todosBairrosIda, setTodosBairrosIda] = useState(null);

    const [todosEstadosVolta, setTodosEstadosVolta] = useState(null);
    const [todasCidadesVolta, setTodasCidadesVolta] = useState(null);
    const [todosBairrosVolta, setTodosBairrosVolta] = useState(null);

    const [nomeAluno, setNomeAluno] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [nomeResponsavel, setNomeResponsavel] = useState('');
    const [cpfResponsavel, setCpfResponsavel] = useState('');
    const [telefoneResponsavel, setTelefoneResponsavel] = useState('');

    const [enderecoIda, setEnderecoIda] = useState('');
    const [bairroIda, setBairroIda] = useState('');
    const [numeroIda, setNumeroIda] = useState('');
    const [cepIda, setCEPIda] = useState('');
    const [estadoIda, setEstadoIda] = useState('');
    const [cidadeIda, setCidadeIda] = useState('');
    const [paisIda, setPaisIda] = useState('BR');

    const [enderecoVolta, setEnderecoVolta] = useState('');
    const [bairroVolta, setBairroVolta] = useState('');
    const [numeroVolta, setNumeroVolta] = useState('');
    const [cepVolta, setCEPVolta] = useState('');
    const [estadoVolta, setEstadoVolta] = useState('');
    const [cidadeVolta, setCidadeVolta] = useState('');
    const [paisVolta, setPaisVolta] = useState('BR');

    const [escola, setEscola] = useState('');
    const [periodo, setPeriodo] = useState('');
    const [tipoTransporte, setTipoTransporte] = useState('');
    const [mensalidade, setMensalidade] = useState('');

    const [informaEnderecoVolta, setInformaEnderecoVolta] = useState(false); 

    function ObterTodosEstadosIda(){
        api.get('/api/v1/cep/estado', { headers: { cep: 'busca-cep' } })
        .then((res) => {
            console.log(res.data)
            setTodosEstadosIda(res.data)
        })
        .catch((err) => {
            notificarErro(err.response.data);
            return;
        });
    }

    function ObterTodasCidadesIda(uf){
        setEstadoIda(uf)
        setTodasCidadesIda(null);
        setTodosBairrosIda(null);

        api.get('/api/v1/cep/estado/'+uf+'/cidade', { headers: { cep: 'busca-cep' } })
        .then((res) => {
            setTodasCidadesIda(res.data)
        })
        .catch((err) => {
            notificarErro(err.response.data);
            return;
        });
    }

    function ObterTodosBairrosIda(id_cidade){
        setCidadeIda(id_cidade);
        setBairroIda(null);
        setTodosBairrosIda(null);

        var array = [];

        api.get('/api/v1/cep/estado/cidade/' + id_cidade + '/bairro', { headers: { cep: 'busca-cep' } })
        .then((res) => {
            setTodosBairrosIda(res.data)
        })
        .catch((err) => {
            notificarErro(err.response.data);
            return;
        });
    }

    function ObterTodosEstadosVolta(){
        api.get('/api/v1/cep/estado', { headers: { cep: 'busca-cep' } })
        .then((res) => {
            console.log(res.data)
            setTodosEstadosVolta(res.data)
        })
        .catch((err) => {
            notificarErro(err.response.data);
            return;
        });
    }

    function ObterTodasCidadesVolta(uf){
        setEstadoVolta(uf)
        setTodasCidadesVolta(null);
        setTodosBairrosVolta(null);

        api.get('/api/v1/cep/estado/'+uf+'/cidade', { headers: { cep: 'busca-cep' } })
        .then((res) => {
            setTodasCidadesVolta(res.data)
        })
        .catch((err) => {
            notificarErro(err.response.data);
            return;
        });
    }

    function ObterTodosBairrosVolta(id_cidade){
        setCidadeVolta(id_cidade);
        setBairroVolta(null);
        setTodosBairrosVolta(null);

        var array = [];

        api.get('/api/v1/cep/estado/cidade/' + id_cidade + '/bairro', { headers: { cep: 'busca-cep' } })
        .then((res) => {
            setTodosBairrosVolta(res.data)
        })
        .catch((err) => {
            notificarErro(err.response.data);
            return;
        });
    }

    function VerificarEnderecoVolta() {
        setInformaEnderecoVolta(!informaEnderecoVolta); 
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

    return(
        <div className='p-2'>
            <Card>
                <Card.Header className='fix-card-header-border-radius'>
                    <div className='row'><span className='h1 my-auto'>Cadastrar Aluno</span></div>
                </Card.Header>
                <form action=''>
                    <Card.Body>
                        <div className='row'>
                            <div className='col-md-3 px-2'>
                                <label htmlFor='inputNomeAluno'>Nome do Aluno:</label>
                                <input type='text' id='inputNomeAluno' required={true} className='form-control' onChange={(e) => setNomeAluno(e.target.value)}/>
                            </div>
                            <div className='col-md px-2'>
                                <label htmlFor="inputDataNascimentoAluno">Data de Nascimento:</label>
                                <input type='date' id='inputDataNascimentoAluno' required={true} className='form-control' onChange={(e) => setDataNascimento(e.target.value)}/>
                            </div>
                            <div className="col-md-3 px-2">
                                <label htmlFor="inputNomeResponsavel">Nome do Responsável:</label>
                                <input type="text" id='inputNomeResponsavel' required={true} className='form-control' onChange={(e) => setNomeResponsavel(e.target.value)}/>
                            </div>
                            <div className="col-md px-2">
                                <label htmlFor="inputDocumentoResponsavel">CPF do Responsável:</label>
                                <InputMask type='text' className='form-control' required={true} mask='999.999.999-99' id='inputDocumentoResponsavel' onChange={(e) => setCpfResponsavel(e.target.value)}></InputMask>
                            </div>
                            <div className="col-md px-2">
                                <label htmlFor="inputTelefoneResponsavel">Telefone do Responsável:</label>
                                <InputMask type='text' className='form-control' required={true} mask='(99) 9 9999-9999' id='inputTelefoneResponsavel' onChange={(e) => setTelefoneResponsavel(e.target.value)}></InputMask>
                            </div>
                        </div>

                        <div className="dropdown-divider"></div>

                        <div className="row">
                            <div className="col-md px-2">
                                <label htmlFor="">País:</label>
                                <select name="" id="inputPais" required={true} className='form-control'>
                                    <option value="" disabled>Selecione o País</option>
                                    <option value="BR" selected>Brasil</option>
                                </select>
                            </div>
                            <div className="col-md px-2">
                                <label htmlFor="">Estado:</label>
                                <select type='text' className='form-control' required={true} autoCapitalize='true' id='inputEstado' onChange={(e) => ObterTodasCidadesIda(e.target.value)} value={estadoIda}>
                                    <option value="" disabled selected>Selecione o Estado</option>
                                    {
                                        !todosEstadosIda ? null : 
                                        todosEstadosIda.map(item => <option value={item.uf}>{item.nome}</option>)
                                    }
                                </select>
                            </div>
                            <div className="col-md px-2">
                                <label htmlFor="">Cidade:</label>
                                <select type='text' className='form-control' required={true} autoCapitalize='true' id='inputCidade' onChange={(e) => ObterTodosBairrosIda(e.target.value)} value={cidadeIda}>
                                    <option value="" disabled selected>Selecione a Cidade</option>
                                    {
                                        !todasCidadesIda ? null : 
                                        todasCidadesIda.map(item => <option value={item.id_cidade}>{item.nome}</option>)
                                    }
                                </select>
                            </div>
                            <div className="col-md px-2">
                                <label htmlFor="">Bairro:</label>
                                <select type='text' className='form-control' required={true} autoCapitalize='true' id='inputBairro' value={bairroIda}>
                                    <option value="" disabled selected>Selecione o Bairro</option>
                                    {
                                        !todosBairrosIda ? null : 
                                        todosBairrosIda.map(item => <option value={item.id_bairro}>{item.nome}</option>)
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-8 px-2">
                                <label htmlFor="">Endereço de Busca:</label>
                                <input type="text" className='form-control' required={true} id="inputEndereco" onChange={(e) => setEnderecoIda(e.target.value)} />
                            </div>
                            <div className="col-md px-2">
                                <label htmlFor="">Número:</label>
                                <input type="number" className='form-control' id="inputNumero" onChange={(e) => setNumeroIda(e.target.value)}/>
                            </div>
                            <div className="col-md px-2">
                                <label htmlFor="">CEP:</label>
                                <input type="text" className='form-control' required={true} id="inputCEP" onChange={(e) => setCEPIda(e.target.value)}/>
                            </div>
                        </div>

                        <div className="dropdown-divider"></div>

                        <div className="row">
                            <div className="col-md px-2">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="inputAdicionarEnderecoVolta" onChange={(e) => VerificarEnderecoVolta()}/>
                                    <label class="form-check-label" for="inputAdicionarEnderecoVolta">Adicionar Endereço de Volta</label>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md px-2">
                                <label htmlFor="">País:</label>
                                <select name="" id="inputPais" disabled={!informaEnderecoVolta} className='form-control'>
                                    <option value="" disabled>Selecione o País</option>
                                    <option value="BR" selected>Brasil</option>
                                </select>
                            </div>
                            <div className="col-md px-2">
                                <label htmlFor="">Estado:</label>
                                <select type='text' className='form-control' autoCapitalize='true' required disabled={!informaEnderecoVolta} id='inputEstado' onChange={(e) => ObterTodasCidadesVolta(e.target.value)} value={estadoVolta}>
                                    <option value="" disabled selected>Selecione o Estado</option>
                                    {
                                        !todosEstadosVolta ? null : 
                                        todosEstadosVolta.map(item => <option value={item.uf}>{item.nome}</option>)
                                    }
                                </select>
                            </div>
                            <div className="col-md px-2">
                                <label htmlFor="">Cidade:</label>
                                <select type='text' className='form-control' disabled={!informaEnderecoVolta} autoCapitalize='true' required id='inputCidade' onChange={(e) => ObterTodosBairrosVolta(e.target.value)} value={cidadeVolta}>
                                    <option value="" disabled selected>Selecione a Cidade</option>
                                    {
                                        !todasCidadesVolta ? null : 
                                        todasCidadesVolta.map(item => <option value={item.id_cidade}>{item.nome}</option>)
                                    }
                                </select>
                            </div>
                            <div className="col-md px-2">
                                <label htmlFor="">Bairro:</label> 
                                <select type='text' className='form-control' disabled={!informaEnderecoVolta} autoCapitalize='true' required id='inputBairro' value={bairroVolta}>
                                    <option value="" disabled selected>Selecione o Bairro</option>
                                    {
                                        !todosBairrosVolta ? null : 
                                        todosBairrosVolta.map(item => <option value={item.id_bairro}>{item.nome}</option>)
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-8 px-2">
                                <label htmlFor="">Endereço de Volta:</label>
                                <input type="text" disabled={!informaEnderecoVolta} className='form-control' id="inputEndereco" onChange={(e) => setEnderecoVolta(e.target.value)}/>
                            </div>
                            <div className="col-md px-2">
                                <label htmlFor="">Número:</label>
                                <input type="number" disabled={!informaEnderecoVolta} className='form-control' id="inputNumero" onChange={(e) => setNumeroVolta(e.target.value)}/>
                            </div>
                            <div className="col-md px-2">
                                <label htmlFor="">CEP:</label>
                                <input type="text" disabled={!informaEnderecoVolta} className='form-control' id="inputCEP" onChange={(e) => setCEPVolta(e.target.value)}/>
                            </div>
                        </div>
                        <div className="row mt-2">
                            <span><strong>OBS: </strong>Se não for adicionado, o endereço de volta será o mesmo que o de busca.</span>
                        </div>

                        <div className="dropdown-divider"></div>

                        <div className="row">
                            <div className="col-md-4 px-2">
                                <label htmlFor="">Escola:</label>
                                <select name="" id="inputEscola" required={true} className='form-control' onChange={(e) => setEscola(e.target.value)}>
                                    <option value="" disabled selected>Selecione a Escola</option>
                                </select>
                            </div>
                            <div className="col-md px-2">
                                <label htmlFor="">Período:</label>
                                <select name="" id="inputPeriodo" required={true} className='form-control' onChange={(e) => setPeriodo(e.target.value)}>
                                    <option value="" disabled selected>Selecione o Período</option>
                                </select>
                            </div>
                            <div className="col-md px-2">
                                <label htmlFor="">Tipo de Transporte:</label>
                                <select name="" id="inputTipoTransporte" required={true} className='form-control' onChange={(e) => setTipoTransporte(e.target.value)}>
                                    <option value="" disabled selected>Selecione o Tipo de Transporte</option>
                                </select>
                            </div>
                            <div className="col-md px-2">
                                <label htmlFor="">Valor da Mensalidade:</label>
                                <input type="text" className='form-control' required={true} id='inputValorMensalidade' onChange={(e) => setMensalidade(e.target.value)}/>
                            </div>
                        </div>

                    </Card.Body>
                    <Card.Footer className='fix-card-footer-border-radius'>
                        <div className="row g-2">
                            <div className="col-md-6 px-2">
                                <button type='submit' className='btn btn-primary w-100'><i class="fa fa-check-square-o" aria-hidden="true"></i> Cadastrar Aluno</button>
                            </div>
                            <div className="col-md-3 px-2">
                                <button type='reset' className='btn btn-secondary w-100'><i class="fa fa-trash-o" aria-hidden="true"></i> Limpar Campos</button>
                            </div>
                            <div className="col-md-3 px-2">
                                <button type='button' className='btn btn-secondary w-100'><i class="fa fa-chevron-left" aria-hidden="true"></i> Voltar</button>
                            </div>
                        </div>
                    </Card.Footer>
                </form>
            </Card>
            <ToastContainer />
        </div>
    )
}

export default CadastrarAluno;