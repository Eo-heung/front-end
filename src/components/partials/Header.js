import React from 'react'
import '../../css/partials/Style.css';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <div className='sb-nav-fixed mainpage'>
            <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
                <Link className="navbar-brand ps-3" to="index.html">Start Bootstrap</Link>
                <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" to="#!"><i
                    className="fas fa-bars"></i></button>
            </nav>
        </div>
    )
}

export default Header