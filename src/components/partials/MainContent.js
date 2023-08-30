import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import Carousel from "react-material-ui-carousel";
import { Paper, Typography } from "@mui/material";
import styled from "styled-components";
import bannerImgPolice from "../../public/banner_police.png";
import bannerImgBirthday from "../../public/banner_birthday.png";
import bannerImgMoim from "../../public/banner_moim.png";

const Main = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 712);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 712);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // const imageUrls = [
  //   "https://i.postimg.cc/PrP5mdfb/001.png",
  //   "https://i.postimg.cc/T2S6vgGm/002.png",
  //   "https://i.postimg.cc/ZqMSYd31/003.png",
  // ];
  const imageUrls = [bannerImgBirthday, bannerImgPolice, bannerImgMoim];

  const cardHeaders = ["화상채팅", "오늘의 생활팁", "소모임", "예시예시"];

  const CardLink = styled(RouterLink)`
    text-decoration: none;
  `;

  const CardTitle = styled.div`
    display: inline-block;
  `;

  const StyledTypography = styled(Typography)`
    color: #000;
    cursor: pointer;

    &:hover {
      color: #ffb471;
    }
  `;

  return (
    <div className="sb-nav-fixed">
      <div id="layoutSidenav">
        <div id="layoutSidenav_content">
          <main>
            <div className="container-fluid px-4">
              <div className="row">
                {isDesktop && (
                  <div
                    className="carousel-container"
                    style={{
                      marginTop: "1vh",
                      marginBottom: "10px",
                    }}
                  >
                    <Carousel
                      height="30vh"
                      animation="slide"
                      duration={2000}
                      indicators={true}
                      indicatorContainerProps={{
                        style: {
                          zIndex: 1,
                          marginTop: "-35px",
                          position: "relative",
                        },
                      }}
                    >
                      {imageUrls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          style={{
                            maxWidth: "100%",
                            height: "auto",
                          }}
                        />
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
                            <StyledTypography variant="body1">
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
