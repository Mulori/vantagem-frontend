import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card, Modal } from 'react-bootstrap';
import api from '../../../../controller/api';
import './styles.css'

function DetalheVeiculo() {
    let { id } = useParams();

    useEffect(() => {
        document.title = "VANTAGEM | Meus Veículos" 
        BaixarVeiculos();      
    }, []);

    var Navegacao = useNavigate();
    
    const [modelo, setModelo] = useState("");
    const [marca, setMarca] = useState("");
    const [ano, setAno] = useState("");
    const [placa, setPlaca] = useState("");
    const [renavam, setRenavam] = useState("");
    const [lugares, setLugares] = useState(0);

    const [modalExclusao, setModalExclusao] = useState(false);

    const abrirModalExclusao = () => setModalExclusao(true);
    const fecharModalExclusao = () => setModalExclusao(false);

    function BaixarVeiculos() {
        const codigo_usuario = localStorage.getItem('codigo_usuario_vantagem');

        api.get('/api/v1/veiculo/' + id, { headers: { Authorization: localStorage.getItem('token_usuario_vantagem'), usuario: codigo_usuario } })
        .then((res) => {
            setModelo(res.data.veiculo_modelo);
            setMarca(res.data.veiculo_marca);
            setAno(res.data.veiculo_ano);
            setPlaca(res.data.veiculo_placa);
            setRenavam(res.data.veiculo_renavam);
            setLugares(res.data.veiculo_lugares);
        })
        .catch((err) => {
            alert(err.response.data);
        })
    }

    function SalvarAlteracoes(e){
        e.preventDefault();

        const usuario = localStorage.getItem('codigo_usuario_vantagem');

        let json = {
            codigo_usuario: parseInt(usuario),
            codigo_motorista: parseInt(usuario),
            veiculo_modelo: modelo.trim(),
            veiculo_marca: marca.trim(),
            veiculo_ano: ano.trim(),
            veiculo_placa: placa.trim(),
            veiculo_renavam: renavam.trim(),
            veiculo_lugares: parseInt(lugares)
        }
        
        api.put("api/v1/veiculo/" + id, json, { headers: { Authorization: localStorage.getItem('token_usuario_vantagem') } })
        .then((res) => {
            notificarSucesso(res.data);
        })
        .catch((err) => {
            console.log(err.response.data)
            notificarErro(err.response.data);
            return;
        });
    }

    function ExcluirVeiculo(e){
        e.preventDefault();

        const usuario = localStorage.getItem('codigo_usuario_vantagem');

        api.delete("api/v1/veiculo/" + id, { headers: { Authorization: localStorage.getItem('token_usuario_vantagem'), usuario: parseInt(usuario) } })
        .then((res) => {
            fecharModalExclusao();
            Navegacao(-1);
            notificarSucesso(res.data);
        })
        .catch((err) => {
            console.log(err.response.data)
            notificarErro(err.response.data);
            return;
        });
    }

    const notificarErro = (e) => toast.error(e, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
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
        draggable: true,
        progress: undefined,
        theme: "light",
        icon: false,
    });

    return(
        <div className='p-2'>
            <Card className='card-cadastrar-veiculos'>
                <Card.Header className='fix-card-header-border-radius'>
                    <div className='row'><span className='h1 my-auto'>Editar Veiculo</span></div>
                </Card.Header>
                <form method='POST' onSubmit={SalvarAlteracoes} >
                    <Card.Body>
                            <div className="row d-flex g-2">
                                <div className="form-group col-sm-6">
                                    <label htmlFor="txt-modelo-veiculo">Modelo do Veículo: </label>
                                    <input type="text" id='txt-modelo-veiculo' value={modelo} maxLength={150} className='form-control' required={true} onChange={(e) => setModelo(e.target.value)} />
                                </div>
                                <div className="form-group col-sm-3">
                                    <label htmlFor="txt-marca-veiculo">Marca do Veículo: </label>
                                    <input type="text" id='txt-marca-veiculo' value={marca} maxLength={100} className='form-control' required={true} onChange={(e) => setMarca(e.target.value)} />
                                </div>
                                <div className="form-group col-sm-3">
                                    <label htmlFor="txt-ano-veiculo">Ano do Veículo: </label>
                                    <input type="number" id='txt-ano-veiculo' value={ano} min={1900} max={2100} className='form-control' required={true} onChange={(e) => setAno(e.target.value)} />
                                </div>
                            </div>
                            <div className="row d-flex g-2 mt-2">
                                <div className="form-group col-sm-4">
                                    <label htmlFor="txt-placa-veiculo">Placa do Veículo: </label>
                                    <input type="text" id='txt-placa-veiculo' value={placa} maxLength={7} className='form-control' required={true} onChange={(e) => setPlaca(e.target.value)} />
                                </div>
                                <div className="form-group col-sm-4">
                                    <label htmlFor="txt-renavam-veiculo">Renavam do Veículo: </label>
                                    <input type="number" id='txt-renavam-veiculo' value={renavam} maxLength={11} className='form-control' required={true} onChange={(e) => setRenavam(e.target.value)} />
                                </div>
                                <div className="form-group col-sm-4">
                                    <label htmlFor="txt-lugares-veiculo">Quantidade de Lugares do Veículo: </label>
                                    <input type="number" id='txt-lugares-veiculo' value={lugares} min={0} max={20} maxLength={3} className='form-control' required={true} onChange={(e) => setLugares(e.target.value)} />
                                </div>
                            </div>
                        
                    </Card.Body>
                    <Card.Footer className='fix-card-footer-border-radius'>
                        <div className="row d-flex g-2">
                            <div className="form-group col-sm-3">
                                <button type='button' className='btn btn-secondary w-100' onClick={() => Navegacao(-1)}><i class="fa fa-chevron-left" aria-hidden="true"></i> Voltar</button>
                            </div>
                            <div className="form-group col-sm-3">
                                <button type='button' className='btn btn-danger w-100' onClick={abrirModalExclusao}><i className="fa fa-floppy-o" aria-hidden="true"></i> Excluir</button>
                            </div>
                            <div className="form-group col-sm-6">
                                <button type='submit' className='btn btn-primary w-100'><i className="fa fa-floppy-o" aria-hidden="true"></i> Salvar</button>
                            </div>
                        </div>
                    </Card.Footer>
                </form>
            </Card>

            <Modal className='modal-customizado' show={modalExclusao} animation={true} onHide={fecharModalExclusao}>
                <Modal.Header>
                    <div className='icon-box'>
                        <i className='fa fa-envelope mx-auto'></i>
                    </div>
                    <h4 className='modal-title mx-auto'>Excluir Veiculo</h4>
                </Modal.Header>

                <form method='POST' onSubmit={ExcluirVeiculo}>
                    <Modal.Body>
                        <p className='text-center'>Para prosseguir com a exclusão do seu veiculo, confirme abaixo:</p>
                        <p className='text-center'></p>
                        <p className='text-center'>Deseja excluir permanentemente o veiculo {modelo}?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className='d-flex row w-100 gx-2 gy-2'>
                            <div className='col-sm-6'><button className='btn w-100 btn-primary bordas-arredondadas' type='submit'><i className='fa fa-check' aria-hidden='true'></i> Sim</button></div>
                            <div className='col-sm-6'><button className='btn w-100 btn-secondary bordas-arredondadas' type='button' onClick={fecharModalExclusao}><i className='fa fa-chevron-left' aria-hidden='true'></i> Não</button></div>        
                        </div>
                    </Modal.Footer>
                </form>
            </Modal>

            <ToastContainer />
        </div>
    );
}

export default DetalheVeiculo;