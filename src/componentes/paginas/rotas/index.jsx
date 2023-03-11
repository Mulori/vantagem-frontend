import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card } from 'react-bootstrap';
import $ from 'jquery';
import api from '../../../controller/api';
import './styles.css'

function Rotas() {
    var caminho_atual = useLocation();

    $(document).ready(function() {
        if (caminho_atual.pathname.startsWith('/rotas')) {
            $('#navbarSupportedContent ul li').removeClass('active');
            $('#navbar-rotas').addClass('active');
        }
    });
    
    return(
        <div className='p-2'>
            <Card className='card-veiculos'>
                <Card.Header className='fix-card-header-border-radius'>
                    <div className='row'><span className='h1'>Minhas Rotas</span></div>
                    <div className='row d-flex g-2'>
                        <div className='col-sm-6'>
                            <input type='text' className='form-control' placeholder='Informe o nome do veículo' />
                        </div>
                    </div>
                </Card.Header>
                <Card.Body>
                    
                </Card.Body>
            </Card>

            <ToastContainer />
        </div>
    );
}

export default Rotas;