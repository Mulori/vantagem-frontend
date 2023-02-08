import { BrowserRouter, Routes, Route } from "react-router-dom";

import Painel from "../paginas/painel";
import Login from "../paginas/login";
import Registro from "../paginas/registro";
import Perfil from "../paginas/perfil";
import Veiculos from "../paginas/meusVeiculos";
import CadastrarVeiculo from "../paginas/meusVeiculos/cadastrarVeiculo";

import Navbar from "../layouts/navbar";

import RotaPrivada from "./rotas_privadas";

function Rotas() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<RotaPrivada> <Painel /> </RotaPrivada>}/>                
                <Route path="/painel" element={<RotaPrivada> <Painel /> </RotaPrivada>}/>
                <Route path="/login" element={<Login />}/>
                <Route path="/registro" element={<Registro />}/>
                <Route path="/perfil" element={<RotaPrivada> <Perfil /> </RotaPrivada>}/>
                <Route path="/veiculos" element={<RotaPrivada> <Veiculos /> </RotaPrivada>}/>
                <Route path="/veiculos/cadastrar" element={<RotaPrivada> <CadastrarVeiculo /> </RotaPrivada>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default Rotas