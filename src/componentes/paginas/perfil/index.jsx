import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles.css'
import semAvatar from '../../../images/imagem-sem-avatar.jpg'
import { Card, Badge, Modal } from 'react-bootstrap';
import $ from 'jquery';
import InputMask from 'react-input-mask';
import api from '../../../controller/api';
import { removerMascara, formataStringData, formatarCPFCNPJ, formataDataHora } from '../../../componentes/funcoes/geral';

function Perfil(){
    const Navegacao = useNavigate();
    var caminho_atual = useLocation();

    const [nomeCompleto, setNomeCompleto] = useState('');
    const [membroDesde, setMembroDesde] = useState('');
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [email, setEmail] = useState('');
    const [urlAvatar, setUrlAvatar] = useState(null);
    const [documento, setDocumento] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [cnh, setCnh] = useState(null);
    const [celular, setCelular] = useState('');
    const [sobreMim, setSobreMim] = useState('');
    const [tipoCadastro, setTipoCadastro] = useState();
    const [modalSenha, setModalSenha] = useState(false);
    const [modalEmail, setModalEmail] = useState(false);
    const [modalAvatar, setModalAvatar] = useState(false);
    const [senhaAntiga, setSenhaAntiga] = useState('');
    const [senhaNova, setSenhaNova] = useState('');
    const [senhaNovaConfirmar, setSenhaConfirmar] = useState('');
    const [novoEmail, setNovoEmail] = useState('');
    const [confirmeEmail, setConfirmeEmail] = useState('');
    const [senhaAlteraEmail, setSenhaAlteraEmail] = useState('');
    const [usuarioFinanceiroTipoChave, setUsuarioFinanceiroTipoChave] = useState(1);
    const [usuarioFinanceiroChave, setUsuarioFinanceiroChave] = useState(null);

    const abrirModalSenha = () => setModalSenha(true);
    const fecharModalSenha = () => setModalSenha(false);

    const abrirModalEmail = () => setModalEmail(true);
    const fecharModalEmail = () => setModalEmail(false);

    const abrirModalAvatar = () => setModalAvatar(true);
    const fecharModalAvatar = () => setModalAvatar(false);

    function Desconectar(){
        localStorage.clear();
        return Navegacao('/login');
    }

    useEffect(() => {
        BaixarCadastro();
        document.title = "VANTAGEM | Meu Perfil"
    }, []);

    function BaixarCadastro(){
        const codigo_usuario = localStorage.getItem('codigo_usuario_vantagem');

        api.get('/api/v1/usuarios/' + codigo_usuario, { headers: { Authorization: localStorage.getItem('token_usuario_vantagem') } } )
        .then((res) => {
            var cadastrado = new Date(res.data.cadastrado);
            var nascimento = new Date(res.data.data_nascimento);

            setNomeCompleto(res.data.nome + ' ' + res.data.sobrenome);
            setMembroDesde(new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', year: 'numeric'} ).format(cadastrado));
            setNome(res.data.nome);
            setSobrenome(res.data.sobrenome);
            setEmail(res.data.email);
            setDocumento(res.data.documento);

            setUrlAvatar(res.data.url_avatar);

            if(res.data.data_nascimento){
                setDataNascimento(formataDataHora(res.data.data_nascimento));
            }
            
            setCnh(res.data.cnh);
            setCelular(res.data.celular);
            setSobreMim(res.data.sobre_mim);
            setTipoCadastro(res.data.tipo_cadastro);
            
            if(res.data.usuario_financeiro.length > 0){
                setUsuarioFinanceiroTipoChave(res.data.usuario_financeiro[0].tipo_chave_pix);
                setUsuarioFinanceiroChave(res.data.usuario_financeiro[0].chave_pix);
            }            
        })
        .catch((err) => {
            console.log(err)
        })
    }

    function AlterarImagemPerfil(e){
        e.preventDefault();

        let formData = new FormData();
            formData.append('upload', e.target[0].files[0]);
            console.log(formData);
            api.post("/api/v1/upload/avatar/" + localStorage.getItem("codigo_usuario_vantagem"), formData, { headers: { Authorization: localStorage.getItem('token_usuario_vantagem') } })
            .then(res => {
                fecharModalAvatar();
                BaixarCadastro();
                notificarSucesso('Imagem alterada com sucesso');
            })
            .catch(err => {
                console.log(err);
                notificarErro(err.response.data);
            });            
    }

    function AlterarInformacoesPessoais(e){
        e.preventDefault();

        let json = {
            nome: nome.trim(),
            sobrenome: sobrenome.trim(),
            celular: !celular ? "" : removerMascara(celular),
            data_nascimento: !dataNascimento ? "" : formataStringData(dataNascimento),
            sobre_mim: !sobreMim ? "" : sobreMim,
        }

        api.put("/api/v1/usuarios/" + localStorage.getItem("codigo_usuario_vantagem") + "/alteraInformacao", json, { headers: { Authorization: localStorage.getItem('token_usuario_vantagem') } })
        .then((ret) => {
            notificarSucesso(ret.data);
            BaixarCadastro();
        })
        .catch((err) => {
            notificarErro(err.response.data);
            return;
        });
    }

    function SalvarInformacoesFinanceiras(e){
        e.preventDefault();

        const codigo_usuario = localStorage.getItem("codigo_usuario_vantagem");

        let json = {
            codigo_usuario: parseInt(codigo_usuario),
            tipo_chave_pix: parseInt(usuarioFinanceiroTipoChave),
            chave_pix: usuarioFinanceiroChave.trim()
        }

        api.post("/api/v1/usuariofinanceiro", json, { headers: {Authorization: localStorage.getItem('token_usuario_vantagem') }})
        .then((ret) => {
            notificarSucesso(ret.data);
        })
        .catch((err) => {
            notificarErro(err.response.data);
            return;
        });
    }

    function AlterarSenha(e) {
        e.preventDefault();

        let json = {
            senha_antiga: !senhaAntiga ? "" : senhaAntiga.trim(),
            senha_nova: !senhaNova ? "" : senhaNova.trim(),
            confirma_senha: !senhaNovaConfirmar ? "" : senhaNovaConfirmar.trim(),
        }

        api.put("/api/v1/usuarios/" + localStorage.getItem("codigo_usuario_vantagem") + "/alteraSenha", json, { headers: {Authorization: localStorage.getItem('token_usuario_vantagem') }})
        .then((ret) => {
            notificarSucesso(ret.data);
            BaixarCadastro();
            fecharModalSenha();
        })
        .catch((err) => {
            notificarErro(err.response.data);
            return;
        });
    }

    function AlterarEmail(e) {
        e.preventDefault();

        let json = {
            email_novo: !novoEmail ? "" : novoEmail.trim(),
            confirma_email: !confirmeEmail ? "" : confirmeEmail.trim(),
            confirma_senha: !senhaAlteraEmail ? "" : senhaAlteraEmail.trim(),
        }

        api.put("/api/v1/usuarios/" + localStorage.getItem("codigo_usuario_vantagem") + "/alteraEmail", json, { headers: {Authorization: localStorage.getItem('token_usuario_vantagem') }})
        .then((ret) => {
            notificarSucesso(ret.data);
            BaixarCadastro();
            fecharModalEmail();
        })
        .catch((err) => {
            notificarErro(err.response.data);
            return;
        });
    }

    $(document).ready(function() {

        if ($(window).width() <= 900) {
            $('#card-right').addClass('mt-10');
            $('#card-dados').addClass('text-center');
        } else {
            $('#card-right').removeClass('mt-10');
            $('#card-dados').removeClass('text-center');
        }

        $(window).resize(function() {
            if ($(window).width() <= 900) {
                $('#card-right').addClass('mt-10');
                $('#card-dados').addClass('text-center');
            } else {
                $('#card-right').removeClass('mt-10');
                $('#card-dados').removeClass('text-center');
            }
        });

        if (caminho_atual.pathname.startsWith('/perfil')) {
            $('#navbarSupportedContent ul li').removeClass('active');
            $('#navbar-perfil').addClass('active');
        }
    });

    function ExibirImagemFullScreen(url){

        if(!urlAvatar){
            return;
        }

        localStorage.removeItem('exibir_imagem');
        localStorage.setItem('exibir_imagem', url);
        Navegacao('/imagem');
    }

    const notificarErro = (e) => toast.error(e, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        icon: false,
    });

    const notificarSucesso = (e) => toast.success(e, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "light",
        icon: false,
    });

    return(
        <div className='p-2'>
            <Card className='card-pers p-0'>
                <Card.Header className='h1 fix-card-header-border-radius'>Meu Perfil</Card.Header>
                <Card.Body className='px-1 py-3'>
                    <div className='row d-flex w-100 mx-auto'>
                        <div className='col-md-9'>
                            <Card className='card-pers h-100 w-100'>
                                <Card.Body className='p-3 pb-10'>            
                                    <div className='row'>
                                        <div className='col-12 col-sm-auto mb-3 d-flex justify-content-center'>
                                            <div id='div-imagem-perfil'>
                                                <a onClick={() => ExibirImagemFullScreen(urlAvatar)} >
                                                    <img src={urlAvatar ? urlAvatar : semAvatar} className='imagem-avatar imagem-cicle imagem-thumbnail mx-auto'/>
                                                </a>
                                            </div>
                                        </div>                                            
                                        <div className='col d-flex flex-column flex-sm-row justify-content-between mb-3'>
                                            <div className='col flex-column my-auto' id='card-dados'>
                                                <h4>{nomeCompleto}</h4>                                                
                                                { !tipoCadastro ? null : tipoCadastro === 2 ? <Badge bg='secondary'>Motorista</Badge> : <Badge bg='secondary'>Aluno/Respons??vel</Badge> }
                                                <div className='col'>  
                                                    <span className='lbUltimaAlteracao'>Membro desde: {membroDesde}</span>    
                                                </div>                                                    
                                                <div className='col'>   
                                                    <button type='button' onClick={abrirModalAvatar} className='btn btn-primary bordas-arredondadas mt-2'><i className='fa fa-fw fa-camera'></i> Alterar Imagem de Perfil</button>                                        
                                                </div>                                                                                                
                                            </div>
                                        </div>                                            
                                    </div>
                                    <div className='row p-1' >
                                        <Card className='card-pers h-100 w-100'>
                                            <Card.Body>
                                                <form method='POST' onSubmit={AlterarInformacoesPessoais}>  
                                                    <span className='display-4' style={{fontSize: '25px'}}><strong>Informa????es Pessoais</strong></span>
                                                    <div className='form-row mt-3 d-flex flex-column flex-sm-row '>
                                                        <div className='form-group mx-1 col'>
                                                            <label>Nome:</label>
                                                            <input className='form-control bordas-arredondadas' maxLength={100} required={true} value={nome} onChange={(e) => setNome(e.target.value)} placeholder='Nome' />
                                                        </div>
                                                        <div className='form-group mx-1 col'>
                                                            <label>Sobrenome:</label>
                                                            <input className='form-control bordas-arredondadas' maxLength={100} required={true} value={sobrenome} onChange={(e) => setSobrenome(e.target.value)} placeholder='Sobrenome' />
                                                        </div>
                                                        <div className='form-group mx-1 col'>
                                                            <label>E-mail:</label>
                                                            <input className='form-control bordas-arredondadas' maxLength={255} readOnly required={true} value={email} onChange={(e) => setEmail(e.target.value)} placeholder='E-mail' />
                                                        </div>                                                          
                                                    </div>
                                                    <div className='form-row mt-3 d-flex flex-column flex-sm-row'>
                                                        <div className='form-group mx-1 col'>
                                                            <label>CPF/CNPJ:</label>
                                                            <input className='form-control bordas-arredondadas' maxLength={15} readOnly required={true} value={formatarCPFCNPJ(documento)} onChange={(e) => setDocumento(e.target.value)} placeholder='Seu Documento (CPF/CNPJ)' />
                                                        </div>
                                                        { tipoCadastro === 2 ?
                                                        <div className='form-group mx-1 col'>
                                                            <label>CNH:</label>
                                                            <input className='form-control bordas-arredondadas' maxLength={15} readOnly value={cnh} onChange={(e) => setCnh(e.target.value)} placeholder='Seu Registro da CNH' />
                                                        </div>
                                                        : null }
                                                        <div className='form-group mx-1 col'>
                                                            <label>Celular</label>
                                                            <InputMask className='form-control bordas-arredondadas' required={true} mask="(99) 9.9999-9999" placeholder='(00) 0.0000-0000' value={celular} onChange={(e) => setCelular(e.target.value)}></InputMask>
                                                        </div>
                                                        <div className='form-group mx-1 col'>
                                                            <label>Data de Nascimento</label>
                                                            <InputMask className='form-control bordas-arredondadas' required={true} mask="99/99/9999" placeholder='00/00/0000' value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)}></InputMask>
                                                        </div>
                                                    </div>
                                                    <div className='form-row mt-3 d-flex flex-column flex-sm-row'>
                                                        <div className='form-group mx-1 col'>
                                                            <label>Sobre Mim:</label>
                                                            <textarea className='form-control bordas-arredondadas' maxLength={500} rows='5' value={sobreMim} onChange={(e) => setSobreMim(e.target.value)} placeholder='Ol??, me chamo...' />
                                                        </div>                                                         
                                                    </div>
                                                    <div className='form-row mt-3 d-flex flex-column flex-sm-row'>
                                                        <div className='form-group mx-1 col '>
                                                            <button type='submit' className='btn btn-primary bordas-arredondadas w-100'><i className='fa fa-hdd-o' aria-hidden='true'></i> Salvar Altera????es</button>
                                                        </div>                                                         
                                                    </div>
                                                </form>
                                            </Card.Body>
                                        </Card>  
                                    </div>
                                    { !tipoCadastro ? null : tipoCadastro === 2 ?
                                    <div className='row p-1' >
                                        <Card className='card-pers h-100 w-100'>
                                            <Card.Body>
                                                <form method='POST' onSubmit={SalvarInformacoesFinanceiras}>  
                                                    <span className='display-4' style={{fontSize: '25px'}}><strong>Informa????es Financeiras</strong></span>
                                                    <div className='form-row mt-3 d-flex flex-column flex-sm-row '>
                                                        <div className='form-group mx-1 col'>
                                                            <label>Tipo Chave Pix:</label>
                                                            <select className='form-control w-100 bordas-arredondadas' value={usuarioFinanceiroTipoChave ? usuarioFinanceiroTipoChave : 1 } onChange={(e) => setUsuarioFinanceiroTipoChave(e.target.value)}>
                                                                <option value='1'>CPF ou CNPJ</option>
                                                                <option value='2'>E-mail</option>
                                                                <option value='3'>Numero de Telefone Celular</option>
                                                                <option value='3'>Chave Aleat??ria</option>
                                                            </select>
                                                        </div>
                                                        <div className='form-group mx-1 col'>
                                                            <label>Chave Pix (Recebimentos):</label>
                                                            <input className='form-control bordas-arredondadas' value={usuarioFinanceiroChave ? usuarioFinanceiroChave : "" } maxLength={800} onChange={(e) => setUsuarioFinanceiroChave(e.target.value)} />
                                                        </div>                                                        
                                                    </div>
                                                    <div className='form-row mt-3 d-flex flex-column flex-sm-row'>
                                                        <div className='form-group mx-1 col '>
                                                            <button type='submit' className='btn btn-primary bordas-arredondadas w-100'><i className='fa fa-hdd-o' aria-hidden='true'></i> Salvar Altera????es</button>
                                                        </div>                                                         
                                                    </div>
                                                </form>
                                            </Card.Body>
                                        </Card>  
                                    </div>
                                    : null }
                                </Card.Body>
                            </Card>
                        </div>
                        <div className='col-md-3 mb-2'>
                            <Card className='card-pers w-100 mt-10' id='card-right'>
                                <Card.Body className='p-2'>
                                    <Card className='card-pers w-100'>
                                        <Card.Body className='p-4'>
                                            <div className='row'>
                                                <h5 className='form-label'>Alterar Minha Senha</h5>
                                            </div>
                                            <div className='row'>
                                                <button className='btn btn-primary btn-form bordas-arredondadas' onClick={abrirModalSenha}><i className='fa fa-unlock-alt' aria-hidden='true'></i> Alterar</button> 
                                            </div>                                                                                           
                                        </Card.Body>
                                    </Card>    
                                    <Card className='card-pers w-100 mt-2'>
                                        <Card.Body className='p-4'>
                                            <div className='row'>
                                                <h5 className='form-label'>Alterar Meu E-mail</h5>
                                            </div>
                                            <div className='row'>
                                                <button className='btn btn-primary btn-form bordas-arredondadas' onClick={abrirModalEmail}><i className='fa fa-envelope' aria-hidden='true'></i> Alterar</button> 
                                            </div>                                                                                           
                                        </Card.Body>
                                    </Card>                                  
                                    <Card className='card-pers w-100 mt-2'>
                                        <Card.Body className='p-4'>
                                            <div className='row'>
                                                <h5 className='form-label'>Suporte</h5>
                                            </div>
                                            <div className='row'>
                                                <span>Receba ajuda r??pida e gratuita em nosso suporte on-line.</span>
                                                <button className='btn btn-danger btn-primary bordas-arredondadas mt-2'><i className='fa fa-question-circle' aria-hidden='true'></i> Contatar Suporte</button> 
                                            </div> 
                                        </Card.Body>
                                    </Card>
                                    <Card className='card-pers w-100 mt-2'>
                                        <Card.Body className='p-4'>
                                            <div className='row'>
                                                <h5 className='form-label'>Finalizar Sess??o</h5>
                                            </div>
                                            <div className='row'>
                                                <button className='btn btn-danger btn-form bordas-arredondadas' onClick={Desconectar}><i className='fa fa-sign-out' aria-hidden='true'></i> Desconectar</button> 
                                            </div>                                                                                           
                                        </Card.Body>
                                    </Card>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>  
                </Card.Body>
            </Card>

            <Modal className='modal-customizado' show={modalSenha} animation={true} onHide={fecharModalSenha}>
                <Modal.Header>
                    <div className='icon-box'>
                        <i className='fa fa-lock mx-auto'></i>
                    </div>
                    <h4 className='modal-title mx-auto'>Redefini????o de Senha</h4>
                </Modal.Header>
                <form method='POST' onSubmit={AlterarSenha}>
                    <Modal.Body>
                        <p className='text-center'>Para prosseguir com a altera????o da sua senha, preencha os campos abaixo:</p>
                        <div className='form-group'>
                            <label>Senha Atual:</label>
                            <input type='password' placeholder='Informe sua Senha Atual' required={true} onChange={(e) => setSenhaAntiga(e.target.value)} className='form-control bordas-arredondadas'/>
                        </div>
                        <div className='form-group mt-3'>
                            <label>Nova Senha:</label>
                            <input type='password' placeholder='Informe a Senha Nova' required={true} onChange={(e) => setSenhaNova(e.target.value)} className='form-control bordas-arredondadas'/>
                        </div>
                        <div className='form-group mt-3'>
                            <label>Confirmar a Nova Senha:</label>
                            <input type='password' placeholder='Confirme a Senha Nova' required={true} onChange={(e) => setSenhaConfirmar(e.target.value)} className='form-control bordas-arredondadas'/>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className='d-flex row w-100 gx-2 gy-2'>
                            <div className='col-sm-6'><button className='btn w-100 btn-secondary bordas-arredondadas' type='button' onClick={fecharModalSenha}><i className='fa fa-chevron-left' aria-hidden='true'></i> Voltar</button></div>
                            <div className='col-sm-6'><button className='btn w-100 btn-primary bordas-arredondadas' type='submit'><i className='fa fa-check' aria-hidden='true'></i> Confirmar</button></div>
                        </div>
                    </Modal.Footer>
                </form>
            </Modal>

            <Modal className='modal-customizado' show={modalEmail} animation={true} onHide={fecharModalEmail}>
                <Modal.Header>
                    <div className='icon-box'>
                        <i className='fa fa-envelope mx-auto'></i>
                    </div>
                    <h4 className='modal-title mx-auto'>Altera????o de E-mail</h4>
                </Modal.Header>

                <form method='POST' onSubmit={AlterarEmail}>
                    <Modal.Body>
                        <p className='text-center'>Para prosseguir com a altera????o do seu e-mail, preencha os campos abaixo:</p>

                        <div className='form-group mt-3'>
                            <label>Novo e-mail:</label>
                            <input type='email' placeholder='Informe o novo e-mail' required={true} onChange={(e) => setNovoEmail(e.target.value)} className='form-control bordas-arredondadas'/>
                        </div>
                        <div className='form-group'>
                            <label>Confirme o e-mail:</label>
                            <input type='email' placeholder='Confirme o novo e-mail' required={true} onChange={(e) => setConfirmeEmail(e.target.value)} className='form-control bordas-arredondadas'/>
                        </div>                        
                        <div className="dropdown-divider mt-4"></div>
                        <div className='form-group mt-3'>
                            <label>Confirmar Sua Senha:</label>
                            <input type='password' placeholder='Confirme a sua Senha' required={true} onChange={(e) => setSenhaAlteraEmail(e.target.value)} className='form-control bordas-arredondadas'/>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className='d-flex row w-100 gx-2 gy-2'>
                            <div className='col-sm-6'><button className='btn w-100 btn-secondary bordas-arredondadas' type='button' onClick={fecharModalEmail}><i className='fa fa-chevron-left' aria-hidden='true'></i> Voltar</button></div>
                            <div className='col-sm-6'><button className='btn w-100 btn-primary bordas-arredondadas' type='submit'><i className='fa fa-check' aria-hidden='true'></i> Confirmar</button></div>
                        </div>
                    </Modal.Footer>
                </form>
            </Modal>

            <Modal className='modal-customizado' show={modalAvatar} animation={true} onHide={fecharModalAvatar}>
                <Modal.Header>
                    <div className='icon-box'>
                        <i className='fa fa-envelope mx-auto'></i>
                    </div>
                    <h4 className='modal-title mx-auto'>Altera????o de Imagem</h4>
                </Modal.Header>

                <form method='POST' id="form-imagem-avatar" onSubmit={AlterarImagemPerfil} enctype="multipart/form-data">
                    <Modal.Body>
                        <p className='text-center'>Para prosseguir com a altera????o da sua imagem de perfil, selecione a imagem desejada:</p>
                        <div className='form-group mt-3'>
                            <input type="file" required accept="image/*" name="avatar" />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className='d-flex row w-100 gx-2 gy-2'>
                            <div className='col-sm-6'><button className='btn w-100 btn-secondary bordas-arredondadas'  type='button' onClick={fecharModalAvatar}><i className='fa fa-chevron-left' aria-hidden='true'></i> Voltar</button></div>
                            <div className='col-sm-6'><button className='btn w-100 btn-primary bordas-arredondadas' name='upload' type='submit'><i className='fa fa-check' aria-hidden='true'></i> Alterar</button></div>
                        </div>
                    </Modal.Footer>
                </form>
            </Modal>

            <ToastContainer />
        </div>
    )
}

export default Perfil