import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card } from 'react-bootstrap';
import api from '../../../../controller/api';
import './styles.css'

function CadastrarVeiculo() {
    useEffect(() => {
        document.title = "VANTAGEM | Meus Veículos"
    }, []);

    var Navegacao = useNavigate();
    const Delay = ms => new Promise(res => setTimeout(res, ms));

    const [modelo, setModelo] = useState("");
    const [marca, setMarca] = useState("");
    const [ano, setAno] = useState("");
    const [placa, setPlaca] = useState("");
    const [renavam, setRenavam] = useState("");
    const [lugares, setLugares] = useState(0);

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

    function cadastrarVeiculoMotorista(e) {
        e.preventDefault();

        var codigo_usuario = localStorage.getItem('codigo_usuario_vantagem');

        let json = {
            codigo_usuario: codigo_usuario,
            codigo_motorista: codigo_usuario,
            veiculo_modelo: modelo,
            veiculo_marca: marca,
            veiculo_ano: ano,
            veiculo_placa: placa,
            veiculo_renavam: renavam,
            veiculo_lugares: lugares
        }

        api.post("api/v1/veiculo", json, { headers: { Authorization: localStorage.getItem('token_usuario_vantagem') } })
        .then(async (res) => {
            notificarSucesso("O veículo foi cadastrado com sucesso!");
            await Delay(5000);
            Navegacao(-1);
        })
        .catch((err) => {
            notificarErro(err.response.data);
            return;
        });
    }

    return(
        <div className='p-2'>
            <Card className='card-cadastrar-veiculos'>
                <Card.Header className='fix-card-header-border-radius'>
                    <div className='row'><span className='h1 my-auto'>Cadastrar Veículo</span></div>
                </Card.Header>
                <form onSubmit={cadastrarVeiculoMotorista}>
                    <Card.Body>
                            <div className="row d-flex g-2">
                                <div className="form-group col-sm-6">
                                    <label htmlFor="txt-modelo-veiculo">Modelo do Veículo: </label>
                                    <input type="text" id='txt-modelo-veiculo' maxLength={150} className='form-control' required={true} onChange={(e) => setModelo(e.target.value)} />
                                </div>
                                <div className="form-group col-sm-3">
                                    <label htmlFor="txt-marca-veiculo">Marca do Veículo: </label>
                                    <input type="text" id='txt-marca-veiculo' maxLength={100} className='form-control' required={true} onChange={(e) => setMarca(e.target.value)} />
                                </div>
                                <div className="form-group col-sm-3">
                                    <label htmlFor="txt-ano-veiculo">Ano do Veículo: </label>
                                    <input type="number" id='txt-ano-veiculo' min={1900} max={2100} className='form-control' required={true} onChange={(e) => setAno(e.target.value)} />
                                </div>
                            </div>
                            <div className="row d-flex g-2 mt-2">
                                <div className="form-group col-sm-4">
                                    <label htmlFor="txt-placa-veiculo">Placa do Veículo: </label>
                                    <input type="text" id='txt-placa-veiculo' maxLength={10} className='form-control' required={true} onChange={(e) => setPlaca(e.target.value)} />
                                </div>
                                <div className="form-group col-sm-4">
                                    <label htmlFor="txt-renavam-veiculo">Renavam do Veículo: </label>
                                    <input type="text" id='txt-renavam-veiculo' maxLength={13} className='form-control' required={true} onChange={(e) => setRenavam(e.target.value)} />
                                </div>
                                <div className="form-group col-sm-4">
                                    <label htmlFor="txt-lugares-veiculo">Quantidade de Lugares do Veículo: </label>
                                    <input type="number" id='txt-lugares-veiculo' min={0} max={20} className='form-control' required={true} onChange={(e) => setLugares(e.target.value)} />
                                </div>
                            </div>
                        
                    </Card.Body>
                    <Card.Footer className='fix-card-footer-border-radius'>
                        <div className="row d-flex g-2">
                            <div className="form-group col-sm-3">
                                <button type='submit' className='btn btn-secondary w-100'><i class="fa fa-chevron-left" aria-hidden="true"></i> Voltar</button>
                            </div>
                            <div className="form-group col-sm-3">
                                <button type='submit' className='btn btn-secondary w-100'><i class="fa fa-trash" aria-hidden="true"></i> Limpar Campos</button>
                            </div>
                            <div className="form-group col-sm-6">
                                <button type='submit' className='btn btn-primary w-100'><i class="fa fa-floppy-o" aria-hidden="true"></i> Cadastrar</button>
                            </div>
                        </div>
                    </Card.Footer>
                </form>
            </Card>

            <ToastContainer />
        </div>
    );
}

export default CadastrarVeiculo;