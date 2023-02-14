import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card } from 'react-bootstrap';
import $ from 'jquery';
import api from '../../../controller/api';
import './styles.css'

function Veiculos() {
    const [listaVeiculos, setListaVeiculos] = useState(null);
    var caminho_atual = useLocation();

    useEffect(() => {
        BaixarVeiculos();
        document.title = "VANTAGEM | Meus Veículos"
    }, []);

    var Navegacao = useNavigate();

    function BaixarVeiculos() {
        const codigo_usuario = localStorage.getItem('codigo_usuario_vantagem');

        api.get('/api/v1/veiculo', { headers: { Authorization: localStorage.getItem('token_usuario_vantagem'), usuario: codigo_usuario } })
        .then((res) => {
            setListaVeiculos(res.data);
        })
        .catch((err) => {
            alert(err.response.data);
        })
    }

    $(document).ready(function() {
        if (caminho_atual.pathname.startsWith('/veiculos')) {
            $('#navbarSupportedContent ul li').removeClass('active');
            $('#navbar-veiculos').addClass('active');
        }
    });

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
                            <button onClick={() => Navegacao('/veiculos/cadastrar')} className='btn btn-primary w-100' id='btn-novo-veiculo'><i class='fa fa-bus' aria-hidden='true'></i> Novo Veículo</button>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body>
                    <div className='row d-flex g-2'>
                        {!listaVeiculos ? null : listaVeiculos.map(item => 
                            <div className='col-sm-4'>
                                <Card>
                                    <Card.Header className='fix-card-header-border-radius'>
                                        <h3 className='my-auto'>{item.veiculo_modelo}</h3>
                                    </Card.Header>
                                    <Card.Body>
                                        <div className='row'>
                                            <div className='col-sm-3 text-center'>
                                                <img class='rounded-circle' src='https://i.imgur.com/2T1Dwwa.png' alt='Generic placeholder image' width='140' height='140'/>
                                            </div>
                                            <div className='col-sm-9'>
                                                <div className="row h-100">
                                                    <div className="col d-flex flex-column justify-content-center">
                                                        <span><strong>Marca: </strong><span>{item.veiculo_marca}</span></span>
                                                        <span><strong>Lugares: </strong><span>{item.veiculo_lugares}</span></span>
                                                        <div className="dropdown-divider"></div>
                                                        <span><strong>Placa: </strong><span>{item.veiculo_placa}</span></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card.Body>
                                    <Card.Footer className='fix-card-footer-border-radius'>
                                        <button className='btn btn-primary w-100' onClick={() => Navegacao("/veiculos/detalhe/" + item.codigo)}><i class="fa fa-bars" aria-hidden="true"></i> Ver Detalhes</button>
                                    </Card.Footer>
                                </Card>
                            </div>
                        )}
                    </div>
                </Card.Body>
            </Card>

            <ToastContainer />
        </div>
    );
}

export default Veiculos;