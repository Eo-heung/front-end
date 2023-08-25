import MenuIcon from "@mui/icons-material/Menu";
import { Paper } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Stomp } from "@stomp/stompjs";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import styled from "styled-components";
import "../../css/partials/Header.css";

const StyledTypography = styled(Typography)`
  color: #000;
  cursor: pointer;

  &:hover {
    color: #ffb471;
  }
`;

const StyledRightContainer = styled.div`
    margin-left: auto;
  `;

const Header = ({ getFriendList }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 992);
  const menuRef = useRef();
  const [isLogout, setIsLogout] = useState(false);
  const navi = useNavigate();

  // online, offline 기능 구현
  const stompClient = useRef(null);

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
      navi("/login");
      return; // 이후 로직 실행을 중단
    }
    else {

      const socketFactory = () => new SockJS('http://localhost:9000/websocket-endpoint');
      stompClient.current = Stomp.over(socketFactory);

      stompClient.current.connect({}, (frame) => {
        // 온라인 상태임을 알릴 로직 (예: 서버에 메시지 전송)
        stompClient.current.send(`/app/online-status/${userId}`, {}, JSON.stringify({ status: 'online' }));

        stompClient.current.subscribe(`/topic/user-status-updates/${userId}`, function (message) {
          // 여기서 알림을 수신
          getFriendList();  // 상태 변경 알림을 수신하면 getFriendList 함수를 호출
        });
      });

      window.addEventListener('beforeunload', () => {
        // 페이지나 브라우저 창을 닫을 때 실행될 로직
        stompClient.current.send(`/app/online-status/${userId}`, {}, JSON.stringify({ status: 'offline' }));
      });

      // Heartbeat 설정
      const heartbeatInterval = setInterval(() => {
        console.log('heartbeatheartbeatheartbeatheartbeatheartbeatheartbeatheartbeatheartbeatheartbeat');
        if (stompClient.current && stompClient.current.connected) {
          stompClient.current.send(`/app/heartbeat/${userId}`, {}, {});
        }
      }, 3 * 60 * 1000); // 3분마다

      return () => {
        clearInterval(heartbeatInterval);
        // 오프라인 상태임을 알릴 로직 (예: 서버에 메시지 전송 전 연결 해제)
        stompClient.current.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const icons = [
    { text: "홈", link: "/" },
    { text: "채팅", link: "/chatting" },
    { text: "모임", link: "/list-moim" },
    { text: "예시", link: "/textchatting" },
    { text: "예시", link: "/multichatting" },
    { text: "마이페이지", link: "/mypage" },
  ];


  // 로그아웃 함수
  const logout = () => {
    const userId = sessionStorage.getItem('userId');
    stompClient.current.send(`/app/online-status/${userId}`, {}, JSON.stringify({ status: 'offline' }));

    sessionStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("REFRESH_TOKEN");
    sessionStorage.removeItem("userId");
    setIsLogout(true);
    alert('로그아웃 성공');
  };

  useEffect(() => {
    if (isLogout) {
      navi("/login");
    }
  }, [isLogout]);

  return (
    <div className={`sb-nav-fixed mainpage ${(isDesktop || isOpen) ? 'open' : 'closed'}`}>
      <nav className="sb-topnav navbar navbar-expand navbar-light bg-light">
        <Link className="navbar-brand" to="/">
          <Paper elevation={0} style={{ width: '100%', height: '100%' }}>
            <img src="https://i.postimg.cc/RFMVM5qM/logo.png" />
          </Paper>
        </Link>
        {!isDesktop && (
          <div ref={menuRef} onMouseLeave={() => setIsOpen(false)}>
            <MenuIcon
              className="menu-icon"
              fontSize='large'
              onMouseOver={() => setIsOpen(true)}
            />
            {isOpen && (
              <div className="nav-item dropdown">
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                  {icons.map((icon, index) => (
                    <li key={index}><Link className="dropdown-item" to={icon.link}>
                      <Typography variant="h6" fontWeight="bold" className="btn btn-link btn-lg order-1 order-lg-0">{icon.text}</Typography>
                    </Link></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        {isDesktop && icons.map((icon, index) => (
          <Link to={icon.link} key={index}>
            <Typography variant="h6" fontWeight="bold" className="btn btn-link btn-lg order-1 order-lg-0" id={`sidebarToggle${index}`}>
              {icon.text}
            </Typography>
          </Link>
        ))}
        <StyledRightContainer>
          <Link className="navbar-logout" to="/" onClick={logout}>
            <StyledTypography variant="body2">로그아웃</StyledTypography>
          </Link>
          <Link className="navbar-credit" to="/charge">
            <StyledTypography variant="body2">곶감 충전</StyledTypography>
          </Link>
        </StyledRightContainer>
      </nav>
    </div >
  );
};

export default Header;
