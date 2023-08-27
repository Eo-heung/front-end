import MenuIcon from "@mui/icons-material/Menu";
import { Paper } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Stomp } from "@stomp/stompjs";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import styled from "styled-components";
import logo from "../../public/logo.gif";
import "../../css/partials/Header.css";

const StyledTypography = styled(Typography)`
  color: #000;
  cursor: pointer;
  marginleft: 10px;
  &:hover {
    color: #ffb471;
  }
`;

const Header = ({ getFriendList, userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 992);
  const menuRef = useRef();
  const [isLogout, setIsLogout] = useState(false);
  const navi = useNavigate();

  // online, offline 기능 구현
  const stompClient = useRef(null);

  useEffect(() => {
    console.log(userId);

    console.log("--------------------------------");

    if (!sessionStorage.getItem("ACCESS_TOKEN")) {
      navi("/login");
      return; // 이후 로직 실행을 중단
    } else {
      if (userId) {
        const socketFactory = () =>
          new SockJS("http://localhost:9000/websocket-endpoint");
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
    { text: "채팅", link: "/chatting" },
    { text: "모임", link: "/list-moim" },
    { text: "마이페이지", link: "/mypage" },
  ];

  // 로그아웃 함수
  const logout = () => {
    stompClient.current.send(
      `/app/online-status/${userId}`,
      {},
      JSON.stringify({ status: "offline" })
    );

    sessionStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("REFRESH_TOKEN");
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
      <nav className="sb-topnav navbar bg-light">
        <div
          style={{
            width: "20%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Link className="navbar-brand" to="/">
            <img
              src={logo}
              style={{
                width: "13vw",
                height: "12vh",
              }}
            />
          </Link>
        </div>
        <div
          style={{
            width: "60%",
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
                <div className="nav-item dropdown">
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
            width: "20%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Link className="navbar-logout" to="/" onClick={logout}>
            <StyledTypography
              variant="body2"
              style={{
                marginRight: "10px",
              }}
            >
              로그아웃
            </StyledTypography>
          </Link>
          <Link className="navbar-credit" to="/charge">
            <StyledTypography
              variant="body2"
              style={{
                marginLeft: "10px",
              }}
            >
              곶감 충전
            </StyledTypography>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Header;
