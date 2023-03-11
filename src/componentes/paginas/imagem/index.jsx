

function Imagem(){
    const url = localStorage.getItem('exibir_imagem');


    document.body.style = "background-image: url('" + url + "'); background-repeat: no-repeat; background-size: cover; background-attachment:fixed;";

    document.title = 'VANTAGEM | Imagem';

    return(
        <div class="text-center">
        </div>
    )
}


export default Imagem;