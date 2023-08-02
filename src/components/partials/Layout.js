import React from 'react'
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import Header from '../partials/Header';
import Footer from '../partials/Footer';
import Nav from '../partials/Nav';
import Main from '../partials/Main';


const Body = styled.li`
padding: 0;
margin: 0;
overflow-x: hidden;
font-size: .875rem;
font-family: 'Roboto', sans-serif;
background: white;
color: black;
border: 1px solid black;
`;


const Layout = () => {
    return (
        <Body>
            <Header></Header>

            <Nav></Nav>

            <Main>
                <Outlet></Outlet>
            </Main>

            <Footer></Footer>
        </Body>
    )
}

export default Layout