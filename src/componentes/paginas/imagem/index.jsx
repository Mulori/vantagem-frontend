

function Imagem(){
    const url = localStorage.getItem('exibir_imagem');

    document.body.style.backgroundColor = '#000';

    return(
        <div className="d-flex justify-content-center bg-dark" >
            <img src={url} style={{position: 'relative', height: '100vh', width: '100vh' }} />
        </div>
    )
}


export default Imagem;