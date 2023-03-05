import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import avatarPadrao from '../../../images/imagem-sem-avatar.jpg';
import './styles.css';

function Responsaveis() {
    useEffect(() => {
        document.title = "VANTAGEM | Responsáveis"
    }, []);

    var Navegacao = useNavigate();

    return (
        <div className='p-2'>
            <Card>
                <Card.Header className='fix-card-header-border-radius'>
                    <div className='row'>
                        <span className='h1'>Responsáveis</span>
                    </div>
                    <div className='row d-flex g-2'>
                        <div className='col-md-6'>
                            <input type='text' className='form-control' placeholder='Nome do Responsável' />
                        </div>
                        <div className='col-md-3'>
                            <button onClick={() => Navegacao('/responsaveis/')} className='btn btn-secondary w-100'><i class='fa fa-trash' aria-hidden='true'></i> Limpar Filtro</button>
                        </div>
                        <div className='col-md-3'>
                            <button onClick={() => Navegacao('/responsaveis/cadastrar')} className='btn btn-primary w-100'><i class='fa fa-plus' aria-hidden='true'></i> Cadastrar Responsável</button>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body>
                    <div className='row d-flex g-2'>
                        <div className='col-md-4'>
                            <Card>
                                <Card.Header className='fix-card-header-border-radius'><h3 className='my-auto'>Nome do Responsável</h3></Card.Header>
                                <Card.Body>
                                    <div className='row'>
                                        <div className="col d-flex flex-column justify-content-center">
                                            <span><strong>Endereço do Responsável: </strong><span>N/A</span></span>
                                            <span><strong>Telefone: </strong><span>(00) 0 0000-0000</span></span>
                                            <div className="dropdown-divider"></div>
                                            <span><strong>Alunos Vinculados: </strong><span>0</span></span>
                                        </div>
                                    </div>
                                </Card.Body>
                                <Card.Footer className='fix-card-footer-border-radius'>
                                    <button className='btn btn-primary w-100'><i class="fa fa-bars" aria-hidden="true"></i> Ver Detalhes</button>
                                </Card.Footer>
                            </Card>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Responsaveis