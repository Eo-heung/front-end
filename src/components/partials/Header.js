import React, { useState, useEffect, useRef } from "react";
import "../../css/partials/Header.css";
import { Link, useNavigate } from "react-router-dom";
import { Paper } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import styled from "styled-components";
import axios from "axios";

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

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 992);
  const menuRef = useRef();
  const [isLogout, setIsLogout] = useState(false);


  const navi = useNavigate();

  const icons = [
    { text: "홈", link: "/" },
    { text: "채팅", link: "/" },
    { text: "모임", link: "/list-moim" },
    { text: "예시", link: "/" },
    { text: "마이페이지", link: "/mypage" },
  ];

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 로그아웃 함수
  const logout = () => {
    sessionStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("REFRESH_TOKEN");
    sessionStorage.removeItem("userId");
    setIsLogout(true);
    alert('로그아웃 성공');

    // try {
    //   await axios.post('http://localhost:9000/logout', {}, {
    //     headers: {
    //       Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
    //     }
    //   });

    // } catch (e) {
    //   console.error("Server logout error:", e);
    //   alert('로그아웃 실패. 다시 시도해주세요.');
    // }
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