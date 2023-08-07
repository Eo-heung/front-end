import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../partials/Header';
import Footer from '../partials/Footer';
import Nav from '../partials/Nav';
import Main from '../partials/Main';
import '../../css/partials/Style.css';

const Layout = () => {
    return (
        <>
            <Header></Header>

            <Nav></Nav>

            <Main>
                <Outlet></Outlet>
            </Main>

            <Footer></Footer>

        </>
    );
};

export default Layout;