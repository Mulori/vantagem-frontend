import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card, Badge, Modal } from 'react-bootstrap';
import $ from 'jquery';
import InputMask from 'react-input-mask';
import api from '../../../controller/api';
import './styles.css'

function Veiculos() {
    const [listaVeiculos, setListaVeiculos] = useState(null);

    useEffect(() => {
        BaixarVeiculos();
        document.title = "VANTAGEM | Meus Veículos"
    }, []);

    function BaixarVeiculos() {
        const codigo_usuario = localStorage.getItem('codigo_usuario_vantagem');

        api.get('/api/v1/veiculo/' + codigo_usuario, { headers: { Authorization: localStorage.getItem('token_usuario_vantagem') } })
        .then((res) => {
            setListaVeiculos(res.data);
        })
        .catch((err) => {
            alert(err.response.data);
        })
    }

    return(
        <div className='p-2'>
            <Card className='card-veiculos'>
                <Card.Header className='fix-card-header-border-radius'>
                    <div className='row'><span className='h1'>Meus Veículos</span></div>
                    <div className='row d-flex g-2'>
                        <div className='col-sm-6'>
                            <input type='text' className='form-control' placeholder='Informe o nome do veículo' />
                        </div>
                        <div className='col-sm-6'>
                            <button className='btn btn-primary w-100' id='btn-novo-veiculo'><i class='fa fa-bus' aria-hidden='true'></i> Novo Veículo</button>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body>
                    <div className='row d-flex g-2'>
                        {!listaVeiculos ? null : listaVeiculos.map(item => 
                            <div className='col-sm-4'>
                                <Card>
                                    <Card.Header className='fix-card-header-border-radius'>
                                        <h3>{item.modelo}</h3>
                                    </Card.Header>
                                    <Card.Body>
                                        <div className='row'>
                                            <div className='col-sm-3 text-center'>
                                                <img class='rounded-circle' src={item.imagem} alt='Generic placeholder image' width='140' height='140'/>
                                            </div>
                                            <div className='col-sm-9'>
                                                <div className="row h-100">
                                                    <div className="col d-flex flex-column justify-content-center">
                                                        <span><strong>Marca: </strong><span>{item.marca}</span></span>
                                                        <span><strong>Lugares: </strong><span>{item.lugares}</span></span>
                                                        <div className="dropdown-divider"></div>
                                                        <span><strong>Placa: </strong><span>{item.placa}</span></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card.Body>
                                    <Card.Footer className='fix-card-footer-border-radius'>
                                        <button className='btn btn-primary w-100'><i class="fa fa-bars" aria-hidden="true"></i> Ver Detalhes</button>
                                    </Card.Footer>
                                </Card>
                            </div>
                        )}
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}

export default Veiculos;