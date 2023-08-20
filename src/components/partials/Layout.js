import React, { useState } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import Nav from "../partials/Nav";
import Main from "../partials/Main";

const Layout = () => {

  return (
    <>
      <Header></Header>

      <Nav></Nav>

      <Main></Main>

      <Footer></Footer>
    </>
  );
};

export default Layout;
