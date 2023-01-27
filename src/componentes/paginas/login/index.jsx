import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import ValidaAutenticacao from '../../funcoes/autenticacao';
import api from '../../../controller/api';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './styles.css';

function Login() {
    const Navegacao = useNavigate();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    useEffect(() => {
        document.title = "VANTAGEM | Login"
    }, [])    
    
    if (ValidaAutenticacao()) {
        return (
            <Navigate to="/" replace={true} />
        );
    }

    function FormRealizarLogin(e){
        e.preventDefault();      
      
        let json = {
            email: email.trim(),
            senha: senha.trim()
        }
        
        api.post("/api/v1/acesso", json)
        .then((res) => {
            localStorage.setItem("codigo_usuario_vantagem", res.data.codigo);
            localStorage.setItem("nome_usuario_vantagem", res.data.nome);
            localStorage.setItem("sobrenome_usuario_vantagem", res.data.sobrenome);
            localStorage.setItem("tipo_cadastro_usuario_vantagem", res.data.tipo_cadastro);
            localStorage.setItem("token_usuario_vantagem", res.data.token);
            Navegacao("/")
        })
        .catch((err) => {
            notificarErro(err.response.data)
            return;
        });
    }

    const notificarErro = (e) => toast.error(e, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        icon: false,
    });

    return (
        <div className="container-fluid h-100 container-auth">
            <div className="row h-100" style={{'min-height': '100vh'}}>
                <div className="col d-flex flex-column justify-content-center bg-light">
                    <div className="container-form mx-auto w-100 p-3">
                        <h2 className="label-inicio">Olá! Seja muito bem-vindo(a).</h2>
                        <h4 className="font-weight-light mb-5">Autentique-se para continuar.</h4>
                        <form method='POST' onSubmit={FormRealizarLogin}>
                            <div className="form-row mb-4">
                                <div className="form-group col-12 px-2">
                                    <span for="input_email">Endereço de E-mail:</span>
                                    <input type="email" className="form-control w-100 bordas-arredondadas" id="input_email" required onChange={(e) => setEmail(e.target.value)}/>
                                </div>
                            </div>
                            <div className="form-row mt-4">
                                <div className="form-group col-12 px-2">
                                    <span for="input_senha">Senha:</span>
                                    <input type="password" className="form-control w-100 bordas-arredondadas" id="input_senha" required onChange={(e) => setSenha(e.target.value)}/>
                                </div>
                            </div>
                            <div className="form-row mt-5">
                                <div className="form-group col-12 px-2">
                                    <button type="submit" className="btn btn-primary btn-block w-100 bordas-arredondadas">Acessar</button>
                                </div>
                            </div>
                            <div className="form-row mt-2 d-flex justify-content-center">
                                <span className="text-right">Não possui uma conta? <Link to="/registro">Crie uma agora!</Link></span>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="col d-none d-md-block col-right bg-primary col-background">

                </div>
            </div>

            <ToastContainer />
        </div>
    )
}

export default Login