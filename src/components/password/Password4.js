import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { styled } from "@mui/system";
import axios from "axios";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SPRING_API_URL } from "../../config";
import thumbImage from "../../public/04.png";

// 원의 left 값을 progress에 바인딩하기 위해 styled 컴포넌트 대신 일반 함수 컴포넌트를 사용합니다.
const Circle = styled("div")(({ progress }) => ({
  position: "absolute",
  left: `calc(${progress}% - 5px)`,
  top: "50%",
  transform: "translateY(-50%)",
  width: "40px",
  height: "40px",
  backgroundImage: `url(${thumbImage})`, // 가져온 이미지를 배경 이미지로 사용합니다.
  backgroundSize: "cover", // 필요에 따라 배경 이미지 크기를 조절합니다.
  zIndex: 2,
  transition: "left 500ms ease-out",
}));

function LinearProgressWithLabel() {
  const [progress, setProgress] = useState(66);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <Box sx={{ position: "relative", display: "flex", alignItems: "center", width: "100%", height: "20px", }}>
      <Box sx={{ position: "relative", flex: 14, marginRight: "10px" }}>
        <LinearProgress variant="determinate" value={progress} />
        <Circle progress={progress} />
      </Box>
      <Box sx={{ flex: 1, marginLeft: 3 }}>
        <Typography variant="body2" color="black" sx={{ width: "30px" }} >
          {"3 / 3"}
        </Typography>
      </Box>
    </Box>
  );
}

const Password4 = ({ setUserPw, userTel, backClick }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [progress, setProgress] = useState(66);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navi = useNavigate();

  function ProgressWithLabel(props) {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 50 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const theme = createTheme({
    palette: {
      primary: {
        main: "#E55C25", // 원하는 색상으로 변경
      },
    },
  });

  LinearProgressWithLabel.propTypes = {
    value: PropTypes.number.isRequired,
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordMatch(true); // 입력 값이 변경될 때 에러 메시지 초기화
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    setPasswordMatch(true); // 입력 값이 변경될 때 에러 메시지 초기화
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // 비밀번호의 길이 확인
    if (password.length < 8 || password.length > 20) {
      alert("8-20자 사이의 비밀번호를 설정해주세요.");
      return; // 함수 실행을 여기서 종료
    }

    if (password === confirmPassword) {
      setIsAuthenticated(true);
      console.log("비밀번호 일치:", password);
      setUserPw(() => password);

      const changePassword = async () => {
        try {
          const response = await axios.post(`${SPRING_API_URL}/resetpassword`, {
            userId: userTel,
            userPw: password,
          });

          if (response.data.statusCode === 200) {
            alert("비밀번호가 성공적으로 변경되었습니다.");
            navi("/login");
          } else {
            alert("비밀번호 변경에 실패하였습니다. 다시 시도해주세요.");
          }
        } catch (error) {
          console.log(error);
          alert("서버 오류가 발생하였습니다.");
        }
      };

      changePassword();
    } else {
      setIsAuthenticated(false);
      setPasswordMatch(false);
      console.log("비밀번호가 일치하지 않습니다.");
    }
  };

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs" style={{ overflow: 'hidden' }}>
        <CssBaseline />
        <Box
          sx={{
            position: 'relative', // 추가
            minHeight: '80vh',
            maxHeight: '80vh',
            marginTop: 12.5
          }}
        >
          <IconButton
            sx={{
              position: 'absolute',
              top: "-9.1vh",
            }}
            onClick={() => {
              backClick();
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <Typography variant="h5" fontSize="12pt" gutterBottom textAlign={'center'} style={{ fontFamily: "font-medium", color: 'gray' }}>
            어흥!
          </Typography>
          <Typography variant="h1" fontSize="18pt" textAlign={'center'} style={{ fontFamily: "font-medium", color: 'black' }}>
            변경할 비밀번호를 입력해주세요
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2} style={{ marginTop: '7.8vh' }}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="password"
                  label="비밀번호 입력"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  inputProps={{ minLength: 8, maxLength: 20 }}
                  value={password}
                  onChange={handlePasswordChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="confirmPassword"
                  label="비밀번호 확인"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  inputProps={{ minLength: 8, maxLength: 20 }}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  error={!passwordMatch}
                  helperText={!passwordMatch ? '비밀번호가 일치하지 않습니다.' : ''}
                />
              </Grid>
            </Grid>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mt: 3,
              }}
            >
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{
                  color: 'black',
                  height: '5.7vh',
                  mt: 3,
                  mb: 2,
                  fontFamily: "font-medium",
                  backgroundColor: '#FEA53D', // 평소 색상
                  '&:hover': {
                    backgroundColor: '#FEB158', // 호버 시 색상
                  },
                }}
              >
                {isAuthenticated ? '변경 성공!' : '변경하기'}
              </Button>
              {isAuthenticated && (
                <Typography variant="body2" color="text.secondary" mt={1}>
                  비밀번호 변경에 성공했어요!
                </Typography>
              )}
              <Link href="/login" variant="body2" sx={{ float: "right" }} style={{ fontFamily: "font-medium" }}>
                로그인하러가기
              </Link>
            </Box>
          </Box>
        </Box>
        <ThemeProvider theme={theme}>
          <Box sx={{ width: '100%', height: "6.5vh", marginTop: '-8%' }}>
            <LinearProgressWithLabel value={progress} />
          </Box>
        </ThemeProvider>
      </Container>
    </ThemeProvider>
  );
};

export default Password4;
