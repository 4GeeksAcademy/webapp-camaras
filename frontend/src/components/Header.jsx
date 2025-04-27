import React from "react";
import '../assets/Header.css'
import { Link } from 'react-router-dom';

function Header() {

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
        </div>
    )
}

export default Header;