import * as React from 'react';
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
import Paper from '@mui/material/Paper';
import { Carousel } from 'react-responsive-carousel'; // don't forget to import the CSS for Carousel as well
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import LinearWithValueLabel from './LinearWithValueLabel';

const Password1 = () => {

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

  const defaultTheme = createTheme();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

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
          <Typography sx={{ fontSize: '5px' }}
          >대충 회사 로고나 이름</Typography>
          <br></br>
          <br></br>
          <Typography component="h1" variant="h5" textAlign={'center'}>
            비밀번호를 잊으셨다구요?
            <br></br>
            걱정마세요!!
            <br></br>
            제가 찾을 수 있도록 도와드릴게요!
          </Typography>
          <br></br>
          <br></br>
        </Box>
        {/* 캐러셀 내부에 이미지 넣고 싶으면, 아래에 paper 복사해서 Carousel 내부에 추가한 후, img src 맞춰서 넣으면 됨. */}
        <box height={600} animation='slide' navButtonsAlwaysVisible='true' duration={1000} sx={{ width: '100%', height: '100%', alignItems: 'center' }}>
          <img style={{ width: '100%', height: '100%' }} src={"https://search.pstatic.net/sunny/?src=https%3A%2F%2Fi.pinimg.com%2F736x%2F70%2Faa%2Fdb%2F70aadb580a93ca72f7b8591bf89df19d.jpg&type=a340"} />
        </box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}

export default Password1