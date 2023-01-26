import { Navigate } from "react-router-dom";
import ValidaAutenticacao from "../funcoes/autenticacao";

function RotaPrivada({children}) {
    return ValidaAutenticacao() ? children : <Navigate to="/login" />
}

export default RotaPrivada