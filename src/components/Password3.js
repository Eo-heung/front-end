import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LinearWithValueLabel from './LinearWithValueLabel3';

const Password3 = () => {
  const [inProp, setInProp] = useState(false);
  const [showGauge, setShowGauge] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setInProp(true); // Password3 페이지가 열릴 때
    setShowGauge(true);
    setTimeout(() => {
      setProgress(100);
    }, 3000);
  }, []);

  function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
          Your Website
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  const defaultTheme = createTheme();
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
                  backgroundColor: '#D9D9D9', // 평소 색상
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

              {showGauge && <LinearWithValueLabel value={progress} />} {/* 추가: 프로그레스 바 */}
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Password3;