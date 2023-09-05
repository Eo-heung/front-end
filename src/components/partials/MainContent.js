import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import Carousel from "react-material-ui-carousel";
import { Paper, Typography } from "@mui/material";
import styled from "styled-components";
import axios from "axios";
import bannerImgPolice from "../../public/banner_police.png";
import bannerImgBirthday from "../../public/banner_birthday.png";
import ex_sun from "../../public/ex_sun.png";
import bannerImgMoim from "../../public/banner_moim.png";
import { fontSize } from "@mui/system";

const Main = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 712);
  const [weatherState, setWeatherState] = useState({
    temp: 0,
    temp_max: 0,
    temp_min: 0,
    humidity: 0,
    desc: "",
    icon: "",
    loading: true,
  });

  useEffect(() => {
    const cityName = "Seoul";
    const apiKey = process.env.REACT_APP_WEATHER_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
    axios
      .get(url)
      .then((responseData) => {
        console.log(responseData);
        const data = responseData.data;
        setWeatherState({
          temp: data.main.temp,
          temp_max: data.main.temp_max,
          temp_min: data.main.temp_min,
          humidity: data.main.humidity,
          desc: data.weather[0].description,
          icon: data.weather[0].icon,
          loading: false,
        });
      })
      .catch((error) => console.log(error));
    const handleResize = () => setIsDesktop(window.innerWidth > 712);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const imageUrls = [bannerImgBirthday, bannerImgPolice, bannerImgMoim];

  const cardHeaders = [
    "오늘 날씨는 어때",
    "오늘의 식단 추천",
    "오늘의 뉴스",
    "예시예시",
  ];

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

  const imgSrc = `http://openweathermap.com/img/w/${weatherState.icon}.png`;

  return (
    <div className="sb-nav-fixed">
      <div id="layoutSidenav">
        <div id="layoutSidenav_content">
          <main>
            <div className="container-fluid px-4">
              <div className="row">
                {isDesktop && (
                  <div>

                    <div
                      className="carousel-container"
                      style={{
                        marginBottom: "10px",
                      }}
                    >

                      <Carousel
                        height="20vh"
                        animation="slide"
                        duration={2000}
                        indicators={true}
                        indicatorContainerProps={{
                          style: {
                            zIndex: 1,
                            // marginTop: "-35px",
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
                              width: "100%",
                              height: "100%",
                            }}
                          />
                        ))}
                      </Carousel>

                    </div>


                    {/* 뉴스으으으으으으으으으으으 */}
                    <div className="row" style={{
                      width: "100%",
                      display: "flex",
                      gap: "29.5px",
                      alignItems: "center",
                      displayItems: "center",
                      justifyContent: "center",
                    }}>


                      <div className="col-xl-6" style={{ width: "49%" }} >
                        <div className="card mb-4">
                          <div className="card-header" style={{ height: "5vh" }}>

                            <CardTitle>
                              얍얍
                            </CardTitle>
                          </div>
                          <div className="card-body" style={{ height: "57.5vh" }}>
                            <StyledTypography variant="body1">
                              내용
                            </StyledTypography>
                          </div>
                        </div>
                      </div>

                      <div className="col-xl-6" style={{ width: "49%" }}>
                        <div className="card mb-4">
                          <div className="card-header" style={{ height: "5vh" }}>
                            <CardTitle>
                              <CardLink to="/">
                                오늘 날씨는 어때??
                              </CardLink>
                            </CardTitle>
                          </div>
                          <div className="card-body" style={{ height: "24.5vh" }}>
                            <StyledTypography variant="body1">
                              <img
                                src={ex_sun}
                                style={{
                                  // marginLeft: "15px",
                                  width: "30%",
                                  height: "30%",
                                  marginBottom: "30px"
                                }}
                              />
                              내용
                            </StyledTypography>
                          </div>
                        </div>

                        <div className="card mb-4">
                          <div className="card-header" style={{ height: "5vh" }}>
                            <CardTitle>
                              <CardLink to="/">
                                이게 제목이지
                              </CardLink>
                            </CardTitle>
                          </div>
                          <div className="card-body" style={{ height: "24.5vh" }}>
                            <StyledTypography variant="body1">
                              내용
                            </StyledTypography>
                          </div>
                        </div>
                      </div>



                    </div>


                  </div>
                )}
              </div>




            </div>
          </main>
        </div>
      </div >
    </div >
  );
};

export default Main;
