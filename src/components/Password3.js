import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/system';
import thumbImage from '../public/image.png.png';

// 원의 left 값을 progress에 바인딩하기 위해 styled 컴포넌트 대신 일반 함수 컴포넌트를 사용합니다.
const Circle = styled('div')(({ progress }) => ({
  position: 'absolute',
  left: `calc(${progress}% - 5px)`,
  top: '50%',
  transform: 'translateY(-50%)',
  width: '40px',
  height: '40px',
  backgroundImage: `url(${thumbImage})`, // 가져온 이미지를 배경 이미지로 사용합니다.
  backgroundSize: 'cover', // 필요에 따라 배경 이미지 크기를 조절합니다.
  zIndex: 2,
  transition: "left 500ms ease-out"
}));

const Password3 = () => {
  const [progress, setProgress] = useState(0);
  const [hasError, setHasError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  const handleCodeChange = (event) => {
    const code = event.target.value;
    // 정규식을 사용하여 숫자 이외의 다른 문자가 있는지 확인합니다.
    const containsNonDigit = /\D/.test(code);

    // 숫자 이외의 다른 문자가 포함되어 있으면 hasError를 true로 설정합니다.
    setHasError(containsNonDigit);
  };

  const defaultTheme = createTheme();

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
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%', height: '20px' }}>
        <Box sx={{ position: 'relative', flex: 14 }}>
          <LinearProgress variant="determinate" value={progress} />
          <Circle progress={progress} />
        </Box>
        <Box sx={{ flex: 1, marginLeft: 1 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(progress)}%`}</Typography>
        </Box>
      </Box>
    );
  }

  const theme = createTheme({
    palette: {
      primary: {
        main: '#E55C25',
      },
    },
  });


  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            height: '608.57px',
            marginTop: 8
          }}
        >
          <Typography variant="h5" fontSize="10pt" gutterBottom textAlign={'center'}>
            인증번호를 보내드렸어요!
          </Typography>
          <br></br>
          <br></br>
          <Typography variant="h6" fontSize="20pt" textAlign={'center'}>
            문자함에서 확인한<br />내 인증번호를 입력해주세요!
          </Typography>
          <br></br>
          <br></br>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
            <Grid container spacing={2} >
              <Grid item xs={12} >
                <TextField
                  required
                  fullWidth
                  id="code"
                  label="인증번호 입력"
                  name="code"
                  autoComplete="off"
                  onChange={handleCodeChange} // 코드 입력 시 handleChange 함수 호출
                  error={hasError} // hasError 상태에 따라 에러 스타일 적용
                  helperText={hasError ? '숫자 이외의 다른 문자가 입력되었습니다.' : ''} // 에러 메시지
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
                  mt: 3,
                  mb: 2,
                  backgroundColor: '#FFB471', // 평소 색상
                  '&:hover': {
                    backgroundColor: '#E55C25', // 호버 시 색상
                  },
                }}
              >
                인증하기
              </Button>
              <Link href="/login" variant="body2">
                로그인하러가기
              </Link>

              <ThemeProvider theme={theme}>
                <Box sx={{ width: '100%', marginTop: "47%" }}>
                  <LinearProgressWithLabel value={progress} />
                </Box>
              </ThemeProvider>
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Password3;