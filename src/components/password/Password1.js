import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import * as React from 'react';

const Password1 = ({ handleClick }) => {

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs" style={{ overflow: 'hidden' }}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img src="/static/media/logo.3745e555c6be936e8008.gif" style={{ width: '150px', height: '80px' }} />
          <br></br>
          <Typography textAlign={'center'} style={{ fontFamily: "font-medium", fontSize: '18pt', color: 'gray' }}>
            비밀번호를 잊으셨다구요?
            <br></br>
            걱정마세요!!
            <br></br>
            제가 찾을 수 있도록 도와드릴게요!
          </Typography>
        </Box>
        <box sx={{ width: '100%', height: '100%', alignItems: 'center' }}>
          <img style={{ width: '100%', height: '100%' }} src={"https://search.pstatic.net/sunny/?src=https%3A%2F%2Fi.pinimg.com%2F736x%2F70%2Faa%2Fdb%2F70aadb580a93ca72f7b8591bf89df19d.jpg&type=a340"} />
        </box>
        < Button onClick={handleClick}
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
          비밀번호 찾으러 가기
        </Button>
      </Container>
    </ThemeProvider>
  );
}

export default Password1