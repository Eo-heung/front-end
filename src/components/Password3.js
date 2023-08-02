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

const Password3 = () => {
  const [progress, setProgress] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
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
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" value={progress} /> {/* 변경: color prop 제거 */}
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(progress)}%`}</Typography>
        </Box>
      </Box>
    );
  }

  const theme = createTheme({
    palette: {
      primary: {
        main: '#E55C25', // 원하는 색상으로 변경
      },
    },
  });

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5" fontSize="10pt" gutterBottom textAlign={'center'}>
            인증번호를 보내드렸어요!
          </Typography>
          <Typography variant="h6" fontSize="20pt" textAlign={'center'}>
            문자함에서 확인한<br />내 인증번호를 입력해주세요!
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="code"
                  label="인증번호 입력"
                  name="code"
                  autoComplete="off"
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
                <Box sx={{ width: '100%' }}>
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