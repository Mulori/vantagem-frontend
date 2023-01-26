import { useNavigate } from 'react-router-dom'

function Painel() {
    const Navegacao = useNavigate();

    function Desconectar(){
        localStorage.clear();
        return Navegacao("/login");
    }
     
    return (
        <div>
        </div>
    )
}

export default Painel