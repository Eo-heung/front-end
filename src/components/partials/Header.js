import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import { Stomp } from "@stomp/stompjs";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import styled from "styled-components";
import { SPRING_API_URL } from "../../config";
import "../../css/partials/Header.css";
import logo from "../../public/logo.gif";
import { Remove } from "@mui/icons-material";
import { useCookies } from "react-cookie";

const StyledTypography = styled(Typography)`
  color: #000;
  cursor: pointer;
  &:hover {
    color: #ffb471;
  }
  margin: auto;
`;

const Header = ({ getFriendList, userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 992);
  const menuRef = useRef();
  const [isLogout, setIsLogout] = useState(false);
  const navi = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies();
  // online, offline 기능 구현
  const stompClient = useRef(null);

  useEffect(() => {
    console.log(userId);

    if (!sessionStorage.getItem("ACCESS_TOKEN")) {
      navi("/login");
      return; // 이후 로직 실행을 중단
    } else {
      if (userId) {
        const socketFactory = () =>
          new SockJS(`${SPRING_API_URL}/websocket-endpoint`);
        stompClient.current = Stomp.over(socketFactory);

        stompClient.current.connect({}, (frame) => {
          stompClient.current.send(
            `/app/online-status/${userId}`,
            {},
            JSON.stringify({ status: "online" })
          );

          stompClient.current.subscribe(
            `/topic/user-status-updates/${userId}`,
            function (message) {
              getFriendList();
            }
          );
        });

        const beforeUnloadHandler = () => {
          stompClient.current.send(
            `/app/online-status/${userId}`,
            {},
            JSON.stringify({ status: "offline" })
          );
        };

        window.addEventListener("beforeunload", beforeUnloadHandler);

        const heartbeatInterval = setInterval(() => {
          console.log("Sending heartbeat...");
          if (stompClient.current && stompClient.current.connected) {
            stompClient.current.send(`/app/heartbeat/${userId}`, {}, {});
          }
        }, 3 * 60 * 1000);

        return () => {
          clearInterval(heartbeatInterval);
          window.removeEventListener("beforeunload", beforeUnloadHandler);
          stompClient.current.disconnect();
        };
      }
    }
  }, [userId]);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuList = [
    { text: "랜덤채팅", link: "/chatting" },
    { text: "소모임", link: "/moim-controller" },
    { text: "어흥톡", link: "/talk" },
  ];

  // 로그아웃 함수
  const logout = () => {
    const isConfirmed = window.confirm("정말로 로그아웃 하시겠습니까?");
    if (!isConfirmed) return;

    stompClient.current.send(
      `/app/online-status/${userId}`,
      {},
      JSON.stringify({ status: "offline" })
    );
    removeCookie('userId')
    removeCookie('userNickname')
    removeCookie('userAddr3')
    removeCookie('userGender')
    sessionStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("REFRESH_TOKEN");
    sessionStorage.removeItem("userId");
    setIsLogout(true);
    alert("로그아웃 성공");
  };

  useEffect(() => {
    if (isLogout) {
      navi("/login");
    }
  }, [isLogout]);

  return (
    <div className={`sb-nav-fixed ${isDesktop || isOpen ? "open" : "closed"}`}>
      <nav className="sb-topnav navbar bg-light" style={{}}>
        <div
          style={{
            width: "15%",
            height: "100%",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <Link className="navbar-brand" to="/">
              <img
                src={logo}
                style={{
                  marginLeft: "13%",
                  width: "70%",
                  height: "100%",
                  // width: "90px",
                  // height: "200px",
                }}
              />
            </Link>
          </div>
        </div>
        <div
          style={{
            width: "50%",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          {!isDesktop && (
            <div ref={menuRef} onMouseLeave={() => setIsOpen(false)}>
              <MenuIcon
                className="menu-icon"
                fontSize="large"
                onMouseOver={() => setIsOpen(true)}
                style={{
                  position: "absolute",
                  top: "2.7vh",
                  left: "3vw",
                }}
              />
              {isOpen && (
                <div
                  className="nav-item dropdown"
                  style={{ position: "absolute", top: "2.7vh", left: "6.7vw" }}
                >
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="navbarDropdown"
                  >
                    {menuList.map((eachMenu, index) => (
                      <li key={index}>
                        <Link className="dropdown-item" to={eachMenu.link}>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            className="btn btn-link btn-lg order-1 order-lg-0"
                          >
                            {eachMenu.text}
                          </Typography>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          {isDesktop &&
            menuList.map((eachMenu, index) => (
              <Link to={eachMenu.link} key={index}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  className="btn btn-link btn-lg order-1 order-lg-0"
                  id={`sidebarToggle${index}`}
                >
                  {eachMenu.text}
                </Typography>
              </Link>
            ))}
        </div>
        <div
          style={{
            width: "30%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "1.5vw",
          }}
        >
          <Link className="navbar-logout" to="/mypage">
            <StyledTypography variant="body2">
              <StyledTypography variant="body2">마이페이지</StyledTypography>
            </StyledTypography>
          </Link>

          <Link className="navbar-credit" to="/charge">
            <StyledTypography variant="body2">곶감충전</StyledTypography>
          </Link>
          <Link
            className="navbar-logout"
            to="/"
            onClick={logout}
            style={{
              marginRight: "3vw",
            }}
          >
            <StyledTypography variant="body2">로그아웃</StyledTypography>
          </Link>
        </div>
      </nav>
    </div>
  );
};

// { text: "마이페이지", link: "/mypage" },
//

export default Header;
