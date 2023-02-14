import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card } from 'react-bootstrap';
import api from '../../../../controller/api';
import './styles.css'

function EditarVeiculo() {
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
                <form >
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
                                <button type='button' className='btn btn-danger w-100'><i className="fa fa-floppy-o" aria-hidden="true"></i> Excluir</button>
                            </div>
                            <div className="form-group col-sm-6">
                                <button type='submit' className='btn btn-primary w-100'><i className="fa fa-floppy-o" aria-hidden="true"></i> Salvar</button>
                            </div>
                        </div>
                    </Card.Footer>
                </form>
            </Card>

            <ToastContainer />
        </div>
    );
}

export default EditarVeiculo;