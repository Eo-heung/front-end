import React, { useState } from "react";
import Footer from "../partials/Footer";
import Header from "../partials/Header";
import Main from "../partials/Main";
import Nav from "../partials/Nav";
import axios from "axios";

const Layout = () => {
  const [friends, setFriends] = useState([]);

  const getFriendList = async () => {
    axios.post('http://localhost:9000/friend/friendList', {}, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
      }
    }).then(res => {
      console.log(res.data);
      const onlineFriends = res.data.items.filter(item => item.online);
      setFriends(onlineFriends);
    }).catch(error => { console.error(error) });
  };

  return (
    <>
      <Header getFriendList={getFriendList} ></Header>

      <Nav friends={friends} getFriendList={getFriendList} ></Nav>

      <Main></Main>

      <Footer></Footer>
    </>
  );
};

export default Layout;
