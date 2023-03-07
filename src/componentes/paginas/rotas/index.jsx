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

    function onSubmit(e){
        e.preventDefault();

        let formData = new FormData();
            formData.append('avatar', e.target[0].files[0]);
            console.log(formData);
            api.post("/api/v1/upload/avatar/" + localStorage.getItem("codigo_usuario_vantagem"), formData, { headers: { Authorization: localStorage.getItem('token_usuario_vantagem') } })
            .then(res => {
                console.log(res.data.payload)
            })
            .catch(console.log);            
    }

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
                    <div className='row d-flex g-2'>
                        <div className='col-sm-4'>
                            <Card>
                                <Card.Header className='fix-card-header-border-radius'>
                                </Card.Header>
                                <Card.Body>
                                    <div className='row'>
                                        <form id="form" onSubmit={onSubmit} enctype="multipart/form-data">
                                            <input type="file" name="avatar" />
                                            <br/>
                                            <button type="submit" name="upload">Fazer Upload</button>
                                        </form>
                                    </div>
                                </Card.Body>
                                <Card.Footer className='fix-card-footer-border-radius'>
                                </Card.Footer>
                            </Card>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            <ToastContainer />
        </div>
    );
}

export default Rotas;