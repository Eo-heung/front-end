import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Divider, IconButton, InputAdornment } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Carousel from "react-material-ui-carousel";
import { useNavigate } from "react-router-dom";
import { SPRING_API_URL, REDIRECT_URL } from "../config";

const Login = () => {
  const navi = useNavigate();
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");
  const [token, setToken] = useState();
  const [remember, setRemember] = useState(false);
  const [cookies, setCookie] = useCookies(["userNickname", "userAddr3"]);

  const loginSuccessHandler = (data) => {
    console.log("Received data:", data);
    if (data.userName) {
      setCookie("userNickname", data.userName, { path: "/" });
    }
    if (data.userAddr3) {
      setCookie("userAddr3", data.userAddr3, { path: "/" });
    }
    if (data.userId) {
      setCookie("userId", data.userId, { path: "/" });
    }
  };

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changeUserId = useCallback((e) => {
    setUserId(() => e.target.value);
  }, []);

  const changeUserPw = useCallback((e) => {
    setUserPw(() => e.target.value);
  }, []);

  const SocialKakao = () => {
    const Rest_api_key = "d85c142dc0c92939902ad3248688e8ad"; // 환경 변수에서 API 키 가져오기
    const redirect_uri = `${REDIRECT_URL}/auth`;
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;

    window.location.href = kakaoURL;
  };
  const SocialNaver = () => {
    const Rest_api_key = "fK9M_7tC_kI7hRd4QXQG"; // 환경 변수에서 API 키 가져오기
    const redirect_uri = `${REDIRECT_URL}/oauth`;
    const state = "1234";
    const naverURL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${Rest_api_key}&state=${state}&redirect_uri=${redirect_uri}`;

    window.location.href = naverURL;
  };

  useEffect(() => {
    if (sessionStorage.getItem("ACCESS_TOKEN")) {
      setToken(() => sessionStorage.getItem("ACCESS_TOKEN"));
      console.log(token);
    }
  }, []);

  useEffect(() => {
    if (token) {
      axios
        .post(`${SPRING_API_URL}/verify`, token)
        .then((response) => {
          console.log(response);
          if (response.data.item) {
            navi("/"); // 토큰이 유효하면 지정된 경로로 이동
          }
        })
        .catch((e) => {
          console.log(e);
          localStorage.removeItem("REFRESH_TOKEN");
          sessionStorage.removeItem("ACCESS_TOKEN");
        });
    }
  }, [token]);

  useEffect(() => {
    if (localStorage.getItem("REFRESH_TOKEN") != null) {
      if (sessionStorage.getItem("ACCESS_TOKEN") != null) {
        setToken(() => sessionStorage.getItem("ACCESS_TOKEN"));
        console.log(token);
      } else {
        sessionStorage.setItem(
          "ACCESS_TOKEN",
          localStorage.getItem("REFRESH_TOKEN")
        );
        setToken(() => sessionStorage.getItem("ACCESS_TOKEN"));
      }
    } else {
      setToken(() => sessionStorage.getItem("ACCESS_TOKEN"));
    }
  }, []);

  useEffect(() => {
    if (token) {
      axios
        .post(`${SPRING_API_URL}/verify`, token)
        .then((response) => {
          console.log(response);
          if (response.data.item) {
            navi("/"); // 토큰이 유효하면 지정된 경로로 이동
          }
        })
        .catch((e) => {
          console.log(e);
          localStorage.removeItem("REFRESH_TOKEN");
          sessionStorage.removeItem("ACCESS_TOKEN");
        });
    }
  }, [token]);

  const login = useCallback((e) => {
    e.preventDefault();
    console.log(`remember1: ${remember}`);
    const loginAxios = async () => {
      const user = {
        userId: userId,
        userPw: userPw,
      };

      const remembers = remember;

      console.log(user);

      try {
        const response = await axios.post(`${SPRING_API_URL}/login`, {
          userId: userId,
          userPw: userPw,
        });

        console.log(response);

        if (response.data && response.data.item.token) {
          console.log(`remember login : ${remembers}`);
          if (remembers === false) {
            alert(`${response.data.item.userName}님 환영합니다.`);
            sessionStorage.setItem("ACCESS_TOKEN", response.data.item.token);
            sessionStorage.setItem("userId", response.data.item.userId);
            navi("/");
            try {
              const userInfoResponse = await axios.post(
                `${SPRING_API_URL}/getUserInfo`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${sessionStorage.getItem(
                      "ACCESS_TOKEN"
                    )}`,
                  },
                }
              );
              if (userInfoResponse.data && userInfoResponse.data.item) {
                loginSuccessHandler(userInfoResponse.data.item);
              }
            } catch (e) {
              console.log("Error fetching user info: ", e);
            }
          } else if (remembers === true) {
            alert(`${response.data.item.userName}님 환영합니다.`);
            localStorage.setItem("REFRESH_TOKEN", response.data.item.token);
            sessionStorage.setItem("ACCESS_TOKEN", response.data.item.token);
            sessionStorage.setItem("userId", response.data.item.userId);
            navi("/");
            try {
              const userInfoResponse = await axios.post(
                `${SPRING_API_URL}/getUserInfo`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${sessionStorage.getItem(
                      "ACCESS_TOKEN"
                    )}`,
                  },
                }
              );
              if (userInfoResponse.data && userInfoResponse.data.item) {
                loginSuccessHandler(userInfoResponse.data.item);
              }
            } catch (e) {
              console.log("Error fetching user info: ", e);
            }
          }
        }
      } catch (e) {
        console.log(e);
        if (e.response.data.errorMessage === "id not exist") {
          alert("아이디가 존재하지 않습니다.");
          return;
        } else if (e.response.data.errorMessage === "wrong pw") {
          alert("비밀번호가 틀렸습니다.");
          return;
        } else {
          alert("알 수 없는 오류가 발생했습니다. 관리자에게 문의하세요.");
          return;
        }
      }
    };

    loginAxios();
  });
  const defaultTheme = createTheme({
    palette: {
      primary: {
        main: "#FEA53D",
      },
      secondary: {
        main: "#FEB158",
      },
    },
  });

  // 캐러셀
  function CarouselItem({ src }) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Paper
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img sx={{ width: "80%", height: "80%" }} src={src} />
        </Paper>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      {console.log(`remember : ${remember}`)}
      <Grid
        container
        component="main"
        sx={{
          minWidth: "512px",
          width: "60%",
          height: "100vh",
          alignItems: "center",
          margin: "auto",
        }}
      >
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            height: "70%",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "contain",
            backgroundPosition: "center",
            overflow: "hidden",
          }}
        >
          <Carousel
            height={600}
            animation="slide"
            navButtonsAlwaysVisible="true"
            indicatorContainerProps={{
              style: {
                marginBottom: "10%",
                textAlign: "center",
              },
            }}
            duration={1000}
            sx={{ width: "100%", height: "100%" }}
          >
            <CarouselItem src="https://item.kakaocdn.net/do/1dd07538dc742e6020f3cf7e59555cd9f43ad912ad8dd55b04db6a64cddaf76d" />
            <CarouselItem src="https://search.pstatic.net/sunny/?src=https%3A%2F%2Fi.pinimg.com%2F736x%2F70%2Faa%2Fdb%2F70aadb580a93ca72f7b8591bf89df19d.jpg&type=a340" />
            <CarouselItem src="https://search.pstatic.net/sunny/?src=https%3A%2F%2Fi.pinimg.com%2F736x%2F2d%2Fd3%2F65%2F2dd365fb484e791a027d03092a5de7c5.jpg&type=sc960_832" />
          </Carousel>
        </Grid>
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
          sx={{ height: "70%", overflowY: "auto" }}
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              component="h1"
              variant="h5"
              sx={{ fontWeight: "bold", marginBottom: "10px" }}
            >
              우리가 함께하는 이 순간
            </Typography>
            <Typography component="h1" variant="h4" sx={{ fontWeight: "bold" }}>
              어 흥!
            </Typography>
            <Box component="form" onSubmit={login} sx={{ mt: 1 }}>
              <TextField
                margin="dense"
                fullWidth
                id="userId"
                label="휴대폰 번호를 입력해 주세요."
                name="userId"
                autoFocus
                type="text"
                required
                FormHelperTextProps={{ hidden: true }}
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                onChange={changeUserId}
              />
              <TextField
                margin="dense"
                fullWidth
                name="userPw"
                label="비밀번호를 입력해 주세요."
                id="userPw"
                type={showPassword ? "text" : "password"}
                required
                onChange={changeUserPw}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    value="remember"
                    color="primary"
                  />
                }
                label="날 기억해줘!"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, fontWeight: "bold", fontSize: "15px" }}
              >
                어흥하러 가기
              </Button>
              <Grid container sx={{ marginBottom: "35px" }}>
                <Grid item xs>
                  <Link
                    href="/findpassword"
                    variant="body2"
                    sx={{
                      color: "#1565c0",
                      textDecorationColor: "#1565c0",
                      ":hover": {
                        color: "#1565c0",
                        opacity: 0.7,
                      },
                    }}
                  >
                    앗! 비밀번호를 까먹었을 땐?
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    href="/signup"
                    variant="body2"
                    sx={{
                      color: "#1565c0",
                      textDecorationColor: "#1565c0",
                      ":hover": {
                        color: "#1565c0",
                        opacity: 0.7,
                      },
                    }}
                  >
                    {"계정이 없으신가요?"}
                  </Link>
                </Grid>
              </Grid>
              <Divider sx={{ marginBottom: "20px" }} />
              <Typography
                component="h2"
                variant="h6"
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  marginBottom: "20px",
                }}
              >
                소셜 로그인
              </Typography>
              <Grid
                container
                sx={{ width: "70%", height: "75px", margin: "0 auto" }}
                spacing={0}
              >
                <Grid
                  item
                  xs={6}
                  sx={{ paddingLeft: "56px", paddingTop: "10px" }}
                >
                  <Link href="#" onClick={SocialNaver}>
                    <Box
                      sx={{
                        width: "70%",
                        height: "70%",
                        backgroundImage:
                          "url(https://www.inavi.com/Content2/Images/mobileLogin/social-login-naver-icon.svg)",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                      }}
                    />
                  </Link>
                </Grid>
                <Grid
                  item
                  xs={6}
                  sx={{
                    paddingLeft: "26px",
                    paddingRight: "30px",
                    paddingTop: "10px",
                  }}
                >
                  <Link href="#" onClick={SocialKakao}>
                    <Box
                      sx={{
                        width: "70%",
                        height: "70%",
                        backgroundImage:
                          "url(https://i0.wp.com/forhappywomen.com/wp-content/uploads/2018/11/%EC%82%B0%EB%B6%80%EC%9D%B8%EA%B3%BC-%ED%8F%AC%ED%95%B4%ED%94%BC%EC%9A%B0%EB%A8%BC-%EB%AC%B8%EC%9D%98-%EC%B9%B4%EC%B9%B4%EC%98%A4%ED%94%8C%EB%9F%AC%EC%8A%A4%EC%B9%9C%EA%B5%AC-%EB%B2%84%ED%8A%BC.png?resize=586%2C586&ssl=1)",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                      }}
                    />
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Login;
