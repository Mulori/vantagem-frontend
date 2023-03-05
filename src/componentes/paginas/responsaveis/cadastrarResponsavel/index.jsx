import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import './styles.css';

function CadastrarResponsavel() {
    useEffect(() => {
        document.title = "VANTAGEM | Cadastrar Aluno"
    }, []);

    var Navegacao = useNavigate();

    return(
        <div className='p-2'>
            <Card>
                <Card.Header className='fix-card-header-border-radius'>
                    <div className='row'><span className='h1 my-auto'>Cadastrar Responsável</span></div>
                </Card.Header>
                <Card.Body>
                    
                </Card.Body>
                <Card.Footer className='fix-card-footer-border-radius'>

                </Card.Footer>
            </Card>
        </div>
    )
}

export default CadastrarResponsavel;