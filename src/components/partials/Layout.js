import axios from "axios";
import React, { useState } from "react";
import Footer from "../partials/Footer";
import Header from "../partials/Header";
import Main from "../partials/Main";
import Nav from "../partials/Nav";
import { SPRING_API_URL, REDIRECT_URL } from "../../config";

const Layout = () => {
  const [friends, setFriends] = useState([]);
  const [userId, setUserId] = useState("");

  const getFriendList = async () => {
    axios
      .post(
        `${SPRING_API_URL}/friend/friendList`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        const onlineFriends = res.data.items.filter((item) => item.online);
        setUserId(res.data.item.userId);
        setFriends(onlineFriends);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="layoutWrapper">
      <Header userId={userId} getFriendList={getFriendList}></Header>

      <Nav friends={friends} getFriendList={getFriendList}></Nav>

      <div className="layoutContent">
        <Main ></Main>
      </div>

      <Footer></Footer>
    </div>
  );
};

export default Layout;
