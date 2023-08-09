import React from "react";
import styled from "styled-components";
import { Outlet } from "react-router-dom";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import Nav from "../partials/Nav";
import Main from "../partials/Main";
import CameraChatting from "../../components/CameraChatting";
// import TextChatting from "../../components/TextChatting";
import "../../css/partials/Style.css";

const Layout = () => {
  return (
    <>
      <Header></Header>
      <Nav></Nav>
      <CameraChatting></CameraChatting>
      <Outlet></Outlet>
      <Footer></Footer>
    </>
  );
};

export default Layout;
