import { Button, Paper, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { Link as RouterLink } from "react-router-dom";
import styled from "styled-components";
import bannerImgBirthday from "../../public/banner_birthday.png";
import bannerImgMoim from "../../public/banner_moim.png";
import bannerImgPolice from "../../public/banner_police.png";
import ex_weather from "../../public/test.png";

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
                        marginTop: "5px",
                        marginBottom: "10px",
                        width: "99%",
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
                  </div>
                )}
              </div>
              <div
                style={{
                  width: "99.9%",
                  height: "100%",
                  display: "flex",
                }}
              >
                <Paper
                  className="text"
                  style={{
                    width: "30%",
                    height: "50vh",
                  }}
                  elevation={3}
                >
                  <div>오늘의 날씨</div>
                  <div>
                    <img
                      src={ex_weather}
                      style={{
                        width: "100%",
                        height: "280px",
                        marginTop: "50px",
                        marginLeft: "5px",
                      }}
                    ></img>
                  </div>
                </Paper>
                <Paper
                  className="text"
                  style={{
                    width: "70%",
                    height: "50vh",
                    marginLeft: "15px",
                  }}
                  elevation={3}
                >
                  <div>금일 리빙포인트</div>
                  <div style={{ display: "flex", gap: "20px" }}>
                    <Card
                      elevation={3}
                      sx={{ maxWidth: 310, height: 410, marginTop: "5px" }}
                      style={{
                        marginTop: "10px",
                      }}
                    >
                      <CardMedia
                        component="img"
                        alt="샌들 씻을 땐 주방세제와 베이킹소다"
                        width="100%"
                        height="auto"
                        image="https://images.chosun.com/resizer/SszMOodJ7lRm0M8XEAg4k80fnYs=/400x225/smart/cloudfront-ap-northeast-1.images.arcpublishing.com/chosun/SFWLFWWB4NGSHKODN6WWGLX264.png"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          [리빙포인트] 샌들 씻을 땐 주방세제와 베이킹소다
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          더러워진 샌들이나 슬리퍼는 주방세제와 베이킹소다를 탄
                          물에 담가두면 깨끗해진다. 솔로 문질러 씻으면 신발이
                          망가지기 쉽다.
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small"><span style={{ fontFamily: "font-light" }}>공유하기</span></Button>
                        <Button size="small"><span style={{ fontFamily: "font-light" }}>바로가기</span></Button>
                      </CardActions>
                    </Card>
                    <Card
                      elevation={3}
                      sx={{ maxWidth: 310, height: 410, marginTop: "5px" }}
                      style={{
                        marginTop: "10px",
                      }}
                    >
                      <CardMedia
                        component="img"
                        alt="[리빙포인트] 맛술 대신 소주"
                        width="100%"
                        height="auto"
                        image="https://images.chosun.com/resizer/JjwsJQLyxXjVZEdPrLGQbKSna2Y=/400x225/smart/cloudfront-ap-northeast-1.images.arcpublishing.com/chosun/QTZ54UVEZFF2TLB662LWH36U4U.png"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          [리빙포인트] 맛술 대신 소주
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          집에 ‘맛술’이 없다면 소주와 설탕을 3대1 비율로 섞어서
                          쓰면 된다. 맛술은 고기의 잡내나 생선 비린내를
                          잡아준다.
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small"><span style={{ fontFamily: "font-light" }}>공유하기</span></Button>
                        <Button size="small"><span style={{ fontFamily: "font-light" }}>바로가기</span></Button>
                      </CardActions>
                    </Card>
                    <Card
                      elevation={3}
                      sx={{ maxWidth: 310, height: 410, marginTop: "5px" }}
                      style={{
                        marginTop: "10px",
                      }}
                    >
                      <CardMedia
                        component="img"
                        alt="[리빙포인트] 우울할 때는 견과류"
                        width="100%"
                        height="auto"
                        image="https://images.chosun.com/resizer/uE_rCBzmpQ6aiPuZFIGJO7f1Ank=/400x225/smart/cloudfront-ap-northeast-1.images.arcpublishing.com/chosun/B4IMSXKI4NCRTHCRCWSZMIJSWU.jpg"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          [리빙포인트] 우울할 때는 견과류
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          호두, 아몬드 등 견과류를 자주 먹으면 행복과 안정감을
                          느끼게 하는 호르몬인 세로토닌 분비가 늘어나 우울증
                          완화에 도움이 된다.
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small"><span style={{ fontFamily: "font-light" }}>공유하기</span></Button>
                        <Button size="small"><span style={{ fontFamily: "font-light" }}>바로가기</span></Button>
                      </CardActions>
                    </Card>
                  </div>
                </Paper>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Main;
