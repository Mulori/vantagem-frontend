import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'

import './styles.css'
import semAvatar from '../../../images/imagem-sem-avatar.jpg'
import { Card, Badge, Modal } from 'react-bootstrap';
import $ from 'jquery';
import AvatarEditor from 'react-avatar-editor'
import api from '../../../controller/api';
import apiImgur from '../../../controller/apiImgur';

function Perfil(){
    const Navegacao = useNavigate();
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [ultimaAlteracao, setUltimaAlteracao] = useState('');
    const [membroDesde, setMembroDesde] = useState('');
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [email, setEmail] = useState('');
    const [urlAvatar, setUrlAvatar] = useState('');
    const [documento, setDocumento] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [cnh, setCnh] = useState('');
    const [celular, setCelular] = useState('');
    const [sobreMim, setSobreMim] = useState('');
    const [tipoCadastro, setTipoCadastro] = useState('');
    const [modalSenha, setModalSenha] = useState(false);
    const [modalImagem, setModalImagem] = useState(false);
    const [urlImagem, setUrlImagem] = useState('');

    const abrirModalSenha = () => setModalSenha(true);
    const fecharModalSenha = () => setModalSenha(false);

    const abrirModalImagem = () => setModalImagem(true);
    const fecharModalImagem = () => setModalImagem(false);

    function Desconectar(){
        localStorage.clear();
        return Navegacao('/login');
    }

    useEffect(() => {
        BaixarCadastro();
    }, [])

    async function receberArquivoImagem(event) {
        const file = event.target.files[0];

        const clientId = "0d51bfe4294b23a",
        auth = "Client-ID " + clientId;

        const formData = new FormData();
        formData.append("file", file);

        apiImgur.post('/image', formData,
            {
                headers: {
                    Authorization: auth,
                    Accept: "application/json",
                }
            }
        ).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err); 
        })
    }

    function BaixarCadastro(){
        const codigo_usuario = localStorage.getItem('codigo_usuario_vantagem');

        api.get('/api/v1/usuarios/' + codigo_usuario, { headers: { Authorization: localStorage.getItem('token_usuario_vantagem') } } )
        .then((res) => {
            var ultAlt = new Date(res.data.alterado);
            var cadastrado = new Date(res.data.cadastrado);

            setNomeCompleto(res.data.nome + ' ' + res.data.sobrenome)
            setUltimaAlteracao(new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', year: 'numeric'} ).format(ultAlt))
            setMembroDesde(new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', year: 'numeric'} ).format(cadastrado))
            setNome(res.data.nome);
            setSobrenome(res.data.sobrenome);
            setEmail(res.data.email);
            setUrlAvatar(res.data.url_avatar);
            setDocumento(res.data.documento);
            setDataNascimento(res.data.data_nascimento);
            setCnh(res.data.cnh);
            setCelular(res.data.celular);
            setSobreMim(res.data.sobre_mim);
            setTipoCadastro(res.data.tipo_cadastro);
        })
        .catch((err) => {
            console.log(err)
        })
    }

    function AlterarInformacoesPessoais(e){
        e.preventDefalt();
    }

    const MyEditor = () => {
        return (
          <AvatarEditor
            image={urlImagem}
            width={250}
            height={250}
            border={50}
            color={[255, 255, 255, 0.6]} // RGBA
            scale={1.2}
            rotate={0}
          />
        )
    }

    var caminho_atual = useLocation();

    $(document).ready(function() {
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
                                                <img src={semAvatar} className='imagem-avatar imagem-cicle imagem-thumbnail mx-auto'/>
                                            </div>
                                        </div>                                            
                                        <div className='col d-flex flex-column flex-sm-row justify-content-between mb-3'>
                                            <div className='col flex-column my-auto' id='card-dados'>
                                                <h4>{nomeCompleto}</h4>
                                                { tipoCadastro == '2' ? <Badge bg='secondary'>Motorista</Badge> : <Badge bg='secondary'>Aluno/Responsável</Badge> }
                                                <div className='col'>  
                                                    <span className='lbUltimaAlteracao'>Membro desde: {membroDesde}</span>    
                                                </div>                                                    
                                                <div className='col'>   
                                                    <button type='button' class='btn btn-primary bordas-arredondadas mt-2' onClick={abrirModalImagem}><i class='fa fa-fw fa-camera'></i> Alterar Imagem de Perfil</button>                                        
                                                </div>                                                                                                
                                            </div>
                                        </div>                                            
                                    </div>
                                    <div className='row p-1' >
                                        <Card className='card-pers h-100 w-100'>
                                            <Card.Body>
                                                <form method='POST' onSubmit={AlterarInformacoesPessoais}>  
                                                    <span className='display-4' style={{fontSize: '25px'}}><strong>Informações Pessoais</strong></span>
                                                    <div className='form-row mt-3 d-flex flex-column flex-sm-row '>
                                                        <div className='form-group mx-1 col'>
                                                            <label>Nome</label>
                                                            <input className='form-control bordas-arredondadas' maxLength={100} required value={nome} onChange={(e) => setNome(e.target.value)} placeholder='Nome' />
                                                        </div>
                                                        <div className='form-group mx-1 col'>
                                                            <label>Sobrenome</label>
                                                            <input className='form-control bordas-arredondadas' maxLength={100} required value={sobrenome} onChange={(e) => setSobrenome(e.target.value)} placeholder='Sobrenome' />
                                                        </div>
                                                        <div className='form-group mx-1 col'>
                                                            <label>E-mail</label>
                                                            <input className='form-control bordas-arredondadas' maxLength={255} readOnly required value={email} onChange={(e) => setEmail(e.target.value)} placeholder='E-mail' />
                                                        </div>                                                          
                                                    </div>
                                                    <div className='form-row mt-3 d-flex flex-column flex-sm-row'>
                                                        <div className='form-group mx-1 col'>
                                                            <label>Documento (CPF/CNPJ)</label>
                                                            <input className='form-control bordas-arredondadas' maxLength={15} readOnly required value={documento} onChange={(e) => setDocumento(e.target.value)} placeholder='Seu Documento (CPF/CNPJ)' />
                                                        </div>
                                                        { tipoCadastro == '2' ?
                                                        <div className='form-group mx-1 col'>
                                                            <label>CNH</label>
                                                            <input className='form-control bordas-arredondadas' maxLength={15} readOnly value={cnh} onChange={(e) => setCnh(e.target.value)} placeholder='Seu Registro da CNH' />
                                                        </div>
                                                        : null }
                                                        <div className='form-group mx-1 col'>
                                                            <label>Celular</label>
                                                            <input className='form-control bordas-arredondadas' readOnly value={dataNascimento} onChange={(e) => dataNascimento(e.target.value)} placeholder='Seu Número de Celular' />
                                                        </div>
                                                        <div className='form-group mx-1 col'>
                                                            <label>Data de Nascimento</label>
                                                            <input className='form-control bordas-arredondadas' maxLength={12} value={celular} onChange={(e) => setCelular(e.target.value)} placeholder='Sua Data de Nascimento' />
                                                        </div>                                                           
                                                    </div>
                                                    <div className='form-row mt-3 d-flex flex-column flex-sm-row'>
                                                        <div className='form-group mx-1 col'>
                                                            <label>Sobre Mim</label>
                                                            <textarea className='form-control bordas-arredondadas' maxLength={500} rows='5' value={sobreMim} onChange={(e) => setSobreMim(e.target.value)} placeholder='Olá, me chamo...' />
                                                        </div>                                                         
                                                    </div>
                                                    <div className='form-row mt-3 d-flex flex-column flex-sm-row'>
                                                        <div className='form-group mx-1 col '>
                                                            <button type='submit' className='btn btn-primary bordas-arredondadas w-100'><i className='fa fa-hdd-o' aria-hidden='true'></i> Salvar Alterações</button>
                                                        </div>                                                         
                                                    </div>
                                                </form>
                                            </Card.Body>
                                        </Card>  
                                    </div>
                                    { tipoCadastro == '2' ?
                                    <div className='row p-1' >
                                        <Card className='card-pers h-100 w-100'>
                                            <Card.Body>
                                                <form method='POST' onSubmit={AlterarInformacoesPessoais}>  
                                                    <span className='display-4' style={{fontSize: '25px'}}><strong>Informações Financeiras</strong></span>
                                                    <div className='form-row mt-3 d-flex flex-column flex-sm-row '>
                                                        <div className='form-group mx-1 col'>
                                                            <label>Tipo Chave Pix</label>
                                                            <select className='form-control w-100 bordas-arredondadas'>
                                                                <option value='1'>CPF ou CNPJ</option>
                                                                <option value='2'>E-mail</option>
                                                                <option value='3'>Numero de Telefone Celular</option>
                                                                <option value='3'>Chave Aleatória</option>
                                                            </select>
                                                        </div>
                                                        <div className='form-group mx-1 col'>
                                                            <label>Chave Pix (Recebimentos)</label>
                                                            <input className='form-control bordas-arredondadas' readOnly />
                                                        </div>                                                        
                                                    </div>
                                                    <div className='form-row mt-3 d-flex flex-column flex-sm-row'>
                                                        <div className='form-group mx-1 col '>
                                                            <button type='submit' className='btn btn-primary bordas-arredondadas w-100'><i className='fa fa-hdd-o' aria-hidden='true'></i> Salvar Alterações</button>
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
                                                <button className='btn btn-primary btn-form bordas-arredondadas'><i className='fa fa-envelope' aria-hidden='true'></i> Alterar</button> 
                                            </div>                                                                                           
                                        </Card.Body>
                                    </Card>                                  
                                    <Card className='card-pers w-100 mt-2'>
                                        <Card.Body className='p-4'>
                                            <div className='row'>
                                                <h5 className='form-label'>Suporte</h5>
                                            </div>
                                            <div className='row'>
                                                <span>Receba ajuda rápida e gratuita em nosso suporte on-line.</span>
                                                <button className='btn btn-danger btn-primary bordas-arredondadas mt-2'><i className='fa fa-question-circle' aria-hidden='true'></i> Contatar Suporte</button> 
                                            </div> 
                                        </Card.Body>
                                    </Card>
                                    <Card className='card-pers w-100 mt-2'>
                                        <Card.Body className='p-4'>
                                            <div className='row'>
                                                <h5 className='form-label'>Finalizar Sessão</h5>
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
                    <h4 className='modal-title mx-auto'>Redefinição de Senha</h4>
                </Modal.Header>
                <Modal.Body>
                    <p className='text-center'>Para prosseguir com a recuperação da senha da sua conta, precisamos ter
                        certeza que você é realmente o dono da dela.</p>

                    <div className='form-group'>
                        <input type='email' placeholder='Informe o E-mail de Cadastro' className='form-control bordas-arredondadas mt-4'/>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className='d-flex row w-100 gx-2 gy-2'>
                        <div className='col-sm-6'><button className='btn w-100 btn-secondary bordas-arredondadas' data-dismiss='modal'><i className='fa fa-chevron-left' aria-hidden='true'></i> Voltar</button></div>
                        <div className='col-sm-6'><button className='btn w-100 btn-primary bordas-arredondadas'><i className='fa fa-location-arrow' aria-hidden='true'></i> Enviar Solicitação</button></div>
                    </div>
                </Modal.Footer>
            </Modal>

            <Modal className='modal-customizado' id='modal-ajustar-imagem-perfil' show={modalImagem} animation={true} onHide={fecharModalImagem}>
                <Modal.Header>
                    <div class='icon-box'>
                        <i class='fa fa-scissors mx-auto'></i>
                    </div>
                    <h4 class='modal-title mx-auto'>Ajuste da Imagem</h4>
                </Modal.Header>
                <Modal.Body>
                    <div class='img-container text-center'>
                        <div class='row'>
                            <MyEditor/>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className='d-flex row w-100 gx-2 gy-2'>
                        <div className='col'><button className='btn w-100 btn-secondary bordas-arredondadas' data-dismiss='modal'><i className='fa fa-chevron-left' aria-hidden='true'></i> Voltar</button></div>
                        <div className='col'>
                            <label for='inputImagemPerfil' class='btn w-100 btn-primary bordas-arredondadas'><i class='fa fa-fw fa-camera'></i> Alterar Foto de Perfil</label>
                            <input type='file' id='inputImagemPerfil' onChange={e => receberArquivoImagem(e)} style={{'visibility':'hidden'}}/>
                        </div>
                    </div>
                    <div className="d-flex row w-100 gx-2">
                        <div className='col-12'><button className='btn w-100 btn-primary bordas-arredondadas'><i className='fa fa-location-arrow' aria-hidden='true'></i> Enviar Solicitação</button></div>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Perfil