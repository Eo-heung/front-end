import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../partials/Footer";
import Header from "../partials/Header";
import Main from "../partials/Main";
import Nav from "../partials/Nav";
import { SPRING_API_URL, REDIRECT_URL } from "../../config";

const Layout = () => {
  const navi = useNavigate();
  const [friends, setFriends] = useState([]);
  const [userId, setUserId] = useState("");
  const [isUserInfoLoaded, setIsUserInfoLoaded] = useState(false);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const res = await axios.post(`${SPRING_API_URL}/getUserInfo`, {}, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
          },
        });

        console.log(res.data);
        const banDateObj = new Date(res.data.item.ban);

        const formattedBanDate = `${banDateObj.getFullYear()}년 ${banDateObj.getMonth() + 1}월 ${banDateObj.getDate()}일 ${banDateObj.getHours()}시 ${banDateObj.getMinutes()}분 ${banDateObj.getSeconds()}초`;

        const banDateTime = banDateObj.getTime();
        const currentDateTime = new Date().getTime();

        if (res.data.item.ban && banDateTime > currentDateTime) {
          sessionStorage.removeItem("ACCESS_TOKEN");
          localStorage.removeItem("REFRESH_TOKEN");
          alert(`${formattedBanDate}까지 이용이 금지되었어요..
          고객센터로 문의해주세요!`);
          navi("/login");
        }
        setIsUserInfoLoaded(true);
      } catch (error) {
        console.error(error);
      }
    };

    getUserInfo();
  }, []);



  const getFriendList = async () => {
    try {
      const res = await axios.post(
        `${SPRING_API_URL}/friend/friendList`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
          },
        }
      );

      console.log(res.data);
      const onlineFriends = res.data.items.filter((item) => item.online);
      setUserId(res.data.item.userId);
      setFriends(onlineFriends);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    isUserInfoLoaded === true ? (
      <div className="layoutWrapper">
        <Header userId={userId} getFriendList={getFriendList}></Header>
        <Nav friends={friends} getFriendList={getFriendList}></Nav>
        <div className="layoutContent">
          <Main ></Main>
        </div>
        <Footer></Footer>
      </div>
    ) : (
      <div></div>
    )
  );
};

export default Layout;
