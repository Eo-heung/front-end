import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import Carousel from "react-material-ui-carousel";
import { Paper, Typography } from "@mui/material";
import styled from "styled-components";
import axios from "axios";
import bannerImgPolice from "../../public/banner_police.png";
import bannerImgBirthday from "../../public/banner_birthday.png";
import bannerImgMoim from "../../public/banner_moim.png";

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
                    asdf
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
                  </div>
                )}
              </div>
              <div className="row">
                {/* {cardHeaders.map((header, index) => ( */}
                {weatherState.loading === false ? (
                  <div className="col-xl-6">
                    <div className="card mb-4">
                      <div className="card-header">
                        <CardTitle>
                          <CardLink to="/">
                            <StyledTypography variant="body1">
                              오늘 날씨는 어때
                            </StyledTypography>
                          </CardLink>
                        </CardTitle>
                      </div>
                      <div className="card-body">
                        <div>
                          <div>{(weatherState.temp - 273.15).toFixed(0)}°</div>
                          <img src={imgSrc} alt="weather icon" />
                          {weatherState.desc}
                          <div>
                            최고: {(weatherState.temp_max - 273.15).toFixed(0)}°
                          </div>
                          <div>
                            최저: {(weatherState.temp_min - 273.15).toFixed(0)}°
                          </div>
                          <div>{weatherState.humidity}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}
                {/* ))} */}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Main;
