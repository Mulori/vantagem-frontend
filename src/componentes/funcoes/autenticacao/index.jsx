function ValidaAutenticacao() {
    const codigo_usuario = localStorage.getItem("codigo_usuario_vantagem");

    if (codigo_usuario) {
        return true;
    } else {
        return false;
    }
}

export default ValidaAutenticacao