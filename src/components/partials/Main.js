import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import '../../css/partials/Style.css';
import Carousel from 'react-material-ui-carousel';
import { Paper, Typography } from '@mui/material';
import styled from 'styled-components';

const Main = () => {
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 712);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth > 712);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const imageUrls = [
        "https://i.postimg.cc/PrP5mdfb/001.png",
        "https://i.postimg.cc/T2S6vgGm/002.png",
        "https://i.postimg.cc/ZqMSYd31/003.png"
    ];

    const cardHeaders = ["화상채팅", "오늘의 생활팁", "소모임", "예시예시"];

    const CardLink = styled(RouterLink)`
        text-decoration: none;
    `;

    const CardTitle = styled.div`
        display: inline-block;
    `;

    const StyledTypography = styled(Typography)`
        color: #12406A;
        cursor: pointer;

        &:hover {
            color: #FFB471;
        }
    `;

    return (
        <div className="sb-nav-fixed mainpage">
            <div id="layoutSidenav">
                <div id="layoutSidenav_content">
                    <main>
                        <div className="container-fluid px-4">
                            <div className="row">
                                {isDesktop && (
                                    <div className="carousel-container" style={{ marginBottom: "10px" }}>
                                        <Carousel height={230} animation='slide' navButtonsAlwaysVisible='true' duration={3000}
                                            indicators={true} indicatorContainerProps={{
                                                style: {
                                                    zIndex: 1,
                                                    marginTop: "-15px",
                                                    position: "relative"
                                                }
                                            }} sx={{ width: '100%', height: '100%', position: 'relative' }}>
                                            {imageUrls.map((url, index) => (
                                                <Paper key={index} sx={{ position: 'absolute', top: '55%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                                    <img src={url} />
                                                </Paper>
                                            ))}
                                        </Carousel>
                                    </div>
                                )}
                            </div>
                            <div className="row">
                                {cardHeaders.map((header, index) => (
                                    <div key={index} className="col-xl-6">
                                        <div className="card mb-4">
                                            <div className="card-header">
                                                <CardTitle>
                                                    <CardLink to="/">
                                                        <StyledTypography variant="body1" fontWeight="bold">
                                                            {header}
                                                        </StyledTypography>
                                                    </CardLink>
                                                </CardTitle>
                                            </div>
                                            <div className="card-body"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Main;