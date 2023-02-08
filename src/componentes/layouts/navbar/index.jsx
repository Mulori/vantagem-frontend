import { useLocation, useNavigate } from 'react-router-dom'
import $ from 'jquery';

import './styles.css'

function Navbar() {

    var Navegacao = useNavigate();

    $(document).ready(function() {
        function resetarSeletor() {
            var tabsNewAnim = $('#navbarSupportedContent');
            var activeItemNewAnim = tabsNewAnim.find('.active');
            var activeWidthNewAnimHeight = activeItemNewAnim.innerHeight();
            var activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
            var itemPosNewAnimTop = activeItemNewAnim.position();
            var itemPosNewAnimLeft = activeItemNewAnim.position();

            $('.hori-selector').css({
                'top': itemPosNewAnimTop.top + 'px',
                'left': itemPosNewAnimLeft.left + 'px',
                'height': activeWidthNewAnimHeight + 'px',
                'width': activeWidthNewAnimWidth + 'px'
            });
        }

        $('#navbarSupportedContent').on('click', 'li', function(e) {
            $('#navbarSupportedContent ul li').removeClass('active');
            $(this).addClass('active');

            var activeWidthNewAnimHeight = $(this).innerHeight();
            var activeWidthNewAnimWidth = $(this).innerWidth();
            var itemPosNewAnimTop = $(this).position();
            var itemPosNewAnimLeft = $(this).position();

            $('.hori-selector').css({
                'top': itemPosNewAnimTop.top + 'px',
                'left': itemPosNewAnimLeft.left + 'px',
                'height': activeWidthNewAnimHeight + 'px',
                'width': activeWidthNewAnimWidth + 'px'
            });
        });

        $('.navbar-toggler').click(function() {
            setTimeout(function() {
                resetarSeletor();
            }, 500);
        });

        $(window).resize(function() {
            setTimeout(function() {
                resetarSeletor();
            }, 500);
        });

        setTimeout(function() {
            resetarSeletor();
        }, 500);
    });

    var caminho_atual = useLocation();
    if (caminho_atual.pathname !== '/login' && caminho_atual.pathname !== '/registro') {
        return (

            <nav className='navbar navbar-expand-lg navbar-light m-2 navbar-mainbg'>
                <a className='navbar-brand navbar-logo'>Olá, {localStorage.getItem('nome_usuario_vantagem')}!</a>
                <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'>
                    <i className='fa fa-bars text-white'></i>
                </button>
                <div className='collapse navbar-collapse' id='navbarSupportedContent'>
                    <ul className='navbar-nav mx-auto'>
                        <div className='hori-selector'>
                            <div className='left'></div>
                            <div className='right'></div>
                        </div>
                        <li className='nav-item active px-2'>
                            <a className='nav-link'><i className='fa fa-tachometer'></i> Início</a>
                        </li>
                        <li className='nav-item px-2'>
                            <a className='nav-link' ><i className='fa fa-users'></i> Alunos</a>
                        </li>
                        <li className='nav-item px-2'>
                            <a className='nav-link' ><i className='fa fa-graduation-cap'></i> Escolas</a>
                        </li>
                        <li className='nav-item px-2'>
                            <a className='nav-link' ><i className='fa fa-map-marker'></i> Rotas</a>
                        </li>
                        <li className='nav-item px-2'>
                            <a className='nav-link'><i className='fa fa-usd' aria-hidden='true'></i> Mensalidades</a>
                        </li>
                        <li className='nav-item px-2' id='navbar-perfil'>
                            <a  onClick={() => Navegacao('/perfil')}><i class='fa fa-user'></i> Meu Perfil</a>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}

export default Navbar