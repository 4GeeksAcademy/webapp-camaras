import React from "react";
import { Link } from 'react-router-dom';


function AjustesMenu() {

    return(
        <div className="">
            <Link to="/ajustes" className='headerMenu'>
            Cuentas
            </Link>
            <Link to="/ajustes1" className='headerMenu'>
            Cámaras
            </Link>
        </div>
    )
}

export default AjustesMenu;