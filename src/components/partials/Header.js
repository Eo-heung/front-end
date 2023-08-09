import React, { useState, useEffect, useRef } from 'react';
import '../../css/partials/Style.css';
import '../../css/partials/Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { Paper } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 992);
    const menuRef = useRef();
    const navi = useNavigate();

    const icons = [
        { text: "홈", link: "/" },
        { text: "채팅", link: "/" },
        { text: "모임", link: "/" },
        { text: "예시", link: "/" },
        { text: "예시", link: "/" },
    ];

    const handleLogout = () => {
        sessionStorage.removeItem("ACCESS_TOKEN");//토큰제거
        sessionStorage.removeItem("userId");//추가적으로 저장된 userId도 제거
        alert("로그아웃 되었습니다.")
        navi("/login"); //로그인 페이지로 리다이렉트.
    }

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth > 992);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const StyledTypography = styled(Typography)`
        color: #12406A;
        cursor: pointer;

        &:hover {
            color: #FFB471;
        }
    `;

    return (
        <div className={`sb-nav-fixed mainpage ${(isDesktop || isOpen) ? 'open' : 'closed'}`}>
            <nav className="sb-topnav navbar navbar-expand navbar-light bg-light">
                <Link className="navbar-brand" to="/">
                    <Paper style={{ width: '100%', height: '100%' }}>
                        <img src="https://i.postimg.cc/TwkbNDNV/aa.png" />
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
                                            <Typography variant="h4" fontWeight="bold" className="btn btn-link btn-lg order-1 order-lg-0">{icon.text}</Typography>
                                        </Link></li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
                {isDesktop && icons.map((icon, index) => (
                    <Link to={icon.link} key={index}>
                        <Typography variant="h4" fontWeight="bold" className="btn btn-link btn-lg order-1 order-lg-0" id={`sidebarToggle${index}`}>
                            {icon.text}
                        </Typography>
                    </Link>
                ))}
                <Link className="navbar-logout" onClick={handleLogout}><StyledTypography variant="h6" fontWeight="bold">로그아웃</StyledTypography></Link>
                <Link className="navbar-credit" to="/"><StyledTypography variant="h6" fontWeight="bold">곶감 충전</StyledTypography></Link>
            </nav>
        </div >
    );
};

export default Header;