import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
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
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import thumbImage from '../../public/04.png';

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
  const [progress, setProgress] = useState(33);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(66);
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
          {"2 / 3"}
        </Typography>
      </Box>
    </Box>
  );
}

const Password3 = ({ handleClick, backClick, checkNum, userTel }) => {
  const [progress, setProgress] = useState(0);
  const [hasError, setHasError] = useState(false);
  const navi = useNavigate();

  const idCheck = async () => {
    try {
      const response = await axios.post('http://localhost:9000/idcheck', {
        userId: userTel
      });
      console.log(response);
      return response.data; // 반환된 데이터를 리턴합니다.
    } catch (error) {
      console.log(error);
      return null; // 에러 발생 시 null을 리턴합니다.
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(data.get('code'));

    // 인증번호 확인하는 if 문
    if (data.get('code') !== checkNum) {
      // 인증번호 틀렸을 때
      alert("인증번호를 다시 확인해주세요.");

    } else {
      // 인증번호 맞을 때
      const response = idCheck();
      if (response !== "") {
        alert("인증이 완료되었습니다.");
        // 다음페이지 넘어가기
        handleClick();
      }
      else {
        // 유저가 없는 상황
        alert("가입된 정보가 없습니다.");
        navi("/login");
      }
    }
  };

  const handleCodeChange = (event) => {
    const code = event.target.value;
    // 정규식을 사용하여 숫자 이외의 다른 문자가 있는지 확인합니다.
    const containsNonDigit = /\D/.test(code);

    // 숫자 이외의 다른 문자가 포함되어 있으면 hasError를 true로 설정합니다.
    setHasError(containsNonDigit);
  };

  const defaultTheme = createTheme();


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
            minHeight: '608.57px',
            maxHeight: '608.57px',
            marginTop: 12.5
          }}
        >
          <IconButton
            sx={{
              position: 'absolute',
              top: "-70px",
            }}
            onClick={() => {
              backClick();
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <Typography variant="h5" fontSize="12pt" gutterBottom textAlign={'center'} style={{ fontFamily: "font-medium", color: 'gray' }}>
            인증번호를 보내드렸어요!
          </Typography>
          <Typography variant="h1" fontSize="18pt" textAlign={'center'} style={{ fontFamily: "font-medium", color: 'black' }}>
            내 인증번호를 입력해주세요!
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>

            <Grid container spacing={2} style={{ marginTop: '60px' }}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="code"
                  label="인증번호 입력"
                  name="code"
                  autoComplete="off"
                  onChange={handleCodeChange} // 코드 입력 시 handleChange 함수 호출
                  inputProps={{ maxLength: 6 }}
                  error={hasError} // hasError 상태에 따라 에러 스타일 적용
                  helperText={
                    hasError ? "숫자 이외의 다른 문자가 입력되었습니다." : ""
                  } // 에러 메시지
                />
                <Link sx={{ float: "right", cursor: 'pointer' }} onClick={backClick} >
                  전화번호를 잘못입력하셨나요??
                </Link>
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
                  height: '44px',
                  fontFamily: "font-medium",
                  mt: 3,
                  mb: 2,
                  backgroundColor: '#FEA53D', // 평소 색상
                  '&:hover': {
                    backgroundColor: '#FEB158', // 호버 시 색상
                  },
                }}
              >
                인증하기
              </Button>
              <Link href="/login" variant="body2" sx={{ float: "right" }} onClick={backClick} style={{ fontFamily: "font-medium" }}>
                로그인하러가기
              </Link>
            </Box>
          </Box>
        </Box>
        <ThemeProvider theme={theme}>
          <Box sx={{ width: '100%', height: "50px", marginTop: '-8%' }}>
            <LinearProgressWithLabel value={progress} />
          </Box>
        </ThemeProvider>
      </Container>
    </ThemeProvider>
  );
};

export default Password3;
