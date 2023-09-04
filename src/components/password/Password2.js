import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { IconButton } from '@mui/material';
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
import React, { useEffect, useState } from "react";
import thumbImage from '../../public/04.png';
import { SPRING_API_URL, REDIRECT_URL } from "../../config";

// 원의 left 값을 progress에 바인딩하기 위해 styled 컴포넌트 대신 일반 함수 컴포넌트를 사용합니다.
const Circle = styled("div")(({ progress }) => ({
  position: "absolute",
  left: `calc(${progress}% - 15px)`,
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
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(33);
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
          {"1 / 3"}
        </Typography>
      </Box>
    </Box>
  );
}

const Password2 = ({ handleClick, setUserTel, setCheckNum, backClick }) => {
  const [progress, setProgress] = useState(0);
  const [isTelValid, setIsTelValid] = useState(true);

  const checkPhone = (tel) => {
    axios
      .post(`${SPRING_API_URL}/checkphone`, tel)
      .then((response) => {
        console.log(response.data); // 서버로부터의 응답을 출력합니다.
        setCheckNum(() => response.data.item);
      })
      .catch((error) => {
        console.error("An error occurred:", error); // 오류를 출력합니다.
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!/^(01[016789]{1})[0-9]{3,4}[0-9]{4}$/.test(data.get("userTel"))) {
      setIsTelValid(false);
    } else {
      setIsTelValid(true);
      setUserTel(() => data.get("userTel"));
      checkPhone(data.get("userTel"));
      alert("인증번호를 발송해드렸습니다.");
      handleClick();
    }
  };

  const defaultTheme = createTheme({
    palette: {
      primary: {
        main: '#FEA53D',
      },
      secondary: {
        main: '#FEB158',
      },
    },
  });
  const theme = createTheme({
    palette: {
      primary: {
        main: "#E55C25",
      },
    },
  });

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

            어흥이 알고있는
          </Typography>
          <Typography variant="h1" fontSize="18pt" textAlign={'center'} style={{ fontFamily: "font-medium", color: 'black' }}>
            내 핸드폰 번호는?
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
            <Grid container spacing={2} style={{ marginTop: '7.8vh' }}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="userTel"
                  label="핸드폰 번호 입력"
                  name="userTel"
                  autoComplete="off"
                  placeholder="01012345678"
                  inputProps={{ maxLength: 11 }}
                  error={!isTelValid}
                  helperText={
                    !isTelValid && "전화번호 형식에 맞추어 입력해 주세요."
                  }
                />
              </Grid>
            </Grid>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
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
                  fontFamily: "font-medium",
                  mt: 3,
                  mb: 2,
                  backgroundColor: '#FEA53D', // 평소 색상
                  '&:hover': {
                    backgroundColor: '#FEB158', // 호버 시 색상
                  },
                }}
              >
                번호인증
              </Button>
              <Link href="/login" variant="body2" sx={{
                float: "right", textDecoration: 'none',
                color: '#1976d2',
                fontFamily: "font-medium",
                '&:hover': {
                  textDecoration: 'underline',
                  color: '#1976d2', // 호버 시 원하는 배경색
                  cursor: 'pointer',
                },
              }}
              >
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

export default Password2;
