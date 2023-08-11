import React from 'react';
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
      <CameraChatting></CameraChatting>
      <Main></Main>
      <Footer></Footer>
    </>
  );
};
