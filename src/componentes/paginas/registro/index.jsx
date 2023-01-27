import { useState, useEffect } from 'react';
import React from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../../controller/api';
import ValidaAutenticacao from '../../funcoes/autenticacao';

import './styles.css';

function Registro() {
    const Navegacao = useNavigate();

    const [nome, setNome] = useState("");
    const [sobrenome, setSobrenome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmaEmail, setConfirmaEmail] = useState("");
    const [confirmaSenha, setConfirmaSenha] = useState("");
    const [tipoCadastro, setTipoCadastro] = useState(1);
    const [documento, setDocumento] = useState("");

    useEffect(() => {
        document.title = "VANTAGEM | Cadastre-se"
    }, [])   

    if (ValidaAutenticacao()) {
        return (
            <Navigate to="/" replace={true} />
        );
    }

    function enviarFormularioRegistro(e) {
        e.preventDefault();
        
        if (confirmaEmail !== email) {
            notificarErro("Os e-mails informados não são iguais.");
            return;
        }

        if (confirmaSenha !== senha) {
            notificarErro("As senhas informadas não são iguais.");
            return;
        }

        let json = {
            nome: nome,
            sobrenome: sobrenome,
            email: email,
            senha: senha,
            tipo_cadastro: tipoCadastro,
            documento: documento
        };

        api.post("/api/v1/registro", json)
        .then((res) => {
            localStorage.setItem("codigo_usuario_vantagem", res.data.codigo);
            localStorage.setItem("nome_usuario_vantagem", res.data.nome);
            localStorage.setItem("sobrenome_usuario_vantagem", res.data.sobrenome);
            localStorage.setItem("tipo_cadastro_usuario_vantagem", res.data.tipo_cadastro);
            localStorage.setItem("token_usuario_vantagem", res.data.token);
            Navegacao("/")
        })
        .catch((err) => {
            notificarErro(err.response.data);
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
            <div className="row h-100" style={{'minHeight': '100vh'}}>
                <div className="col d-flex flex-column justify-content-center bg-light">
                    <div className="container-form mx-auto w-100 p-3">
                        <h2 className="label-inicio">Olá! Seja muito bem-vindo(a).</h2>
                        <h4 className="font-weight-light mb-5">Para continuarmos, preencha as informações básicas de cadastro:</h4>
                        <form method="POST" onSubmit={enviarFormularioRegistro}>
                            <div className="form-row d-flex mb-4">
                                <div className="form-group col-6 px-2">
                                    <span htmlFor="input_nome">Nome:</span>
                                    <input type="text" className="form-control w-100 bordas-arredondadas" autoCapitalize='true' required id="input_nome" onChange={(e) => setNome(e.target.value)}/>
                                </div>
                                <div className="form-group col-6 px-2">
                                    <span htmlFor="input_sobrenome">Sobrenome:</span>
                                    <input type="text" className="form-control w-100 bordas-arredondadas" autoCapitalize='true' required id="input_sobrenome" onChange={(e) => setSobrenome(e.target.value)}/>
                                </div>
                            </div>
                            <div className="form-row d-flex mb-4">
                                <div className="form-group col-12 px-2">
                                    <span htmlFor="input_email">E-mail:</span>
                                    <input type="email" className="form-control w-100 bordas-arredondadas" required id="input_email" onChange={(e) => setEmail(e.target.value)}/>
                                </div>
                            </div>
                            <div className="form-row d-flex mb-4">
                                <div className="form-group col-12 px-2">
                                    <span htmlFor="input_confirma_email">Confirme seu E-mail:</span>
                                    <input type="email" className="form-control w-100 bordas-arredondadas" required id="input_confirma_email" onChange={(e) => setConfirmaEmail(e.target.value)}/>
                                </div>
                            </div>
                            <div className="form-row d-flex mb-4">
                                <div className="form-group col-6 px-2">
                                    <span htmlFor="input_senha">Senha:</span>
                                    <input type="password" className="form-control w-100 bordas-arredondadas" required id="input_senha" onChange={(e) => setSenha(e.target.value)}/>
                                </div>
                                <div className="form-group col-6 px-2">
                                    <span htmlFor="input_confirma_senha">Confirmar Senha:</span>
                                    <input type="password" className="form-control w-100 bordas-arredondadas" required id="input_confirma_senha" onChange={(e) => setConfirmaSenha(e.target.value)}/>
                                </div>
                            </div>
                            <div className="form-row d-flex mb-4">
                                <div className="form-group col-7 px-2">
                                    <span htmlFor="input_tipo_cadastro">Tipo de Cadastro:</span>
                                    <select className="form-control w-100 bordas-arredondadas" id="input_tipo_cadastro" value={tipoCadastro} onChange={(e) => setTipoCadastro(e.target.value)}>
                                        <option value="1">Aluno / Responsável</option>
                                        <option value="2">Motorista</option>
                                    </select>
                                </div>
                                <div className="form-group col-5 px-2">
                                    <span htmlFor="input_documento">Documento:</span>
                                    <input type="text" className="form-control w-100 bordas-arredondadas" required id="input_documento" onChange={(e) => setDocumento(e.target.value)}/>
                                </div>
                            </div>
                            <div className="form-row mt-5">
                                <div className="form-group col-12 px-2">
                                    <button type="submit" className="btn btn-primary btn-block w-100 bordas-arredondadas">Realizar Cadastro</button>
                                </div>
                            </div>
                            <div className="form-row mt-2 d-flex justify-content-center">
                                <span className="text-right">Já possui uma conta? <Link to="/login">Realizar Login.</Link></span>
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

export default Registro