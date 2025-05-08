import React from "react";
import '../assets/Header.css';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="header-container">
            <Link to="/" className='headerMenu'>
                VideoWall
            </Link>
            <Link to="/mapa" className='headerMenu'>
                Mapa
            </Link>
            <Link to="/registros" className='headerMenu'>
                Registros
            </Link>
            <Link to="/ajustes" className='headerMenu'>
                Ajustes
            </Link>
            <button onClick={handleLogout} className='headerMenu' style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}>
                Cerrar sesión
            </button>
        </div>
    );
}

export default Header;
