import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import * as React from 'react';

const Password1 = () => {

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
        <box sx={{ width: '100%', height: '100%', alignItems: 'center' }}>
          <img style={{ width: '100%', height: '100%' }} src={"https://search.pstatic.net/sunny/?src=https%3A%2F%2Fi.pinimg.com%2F736x%2F70%2Faa%2Fdb%2F70aadb580a93ca72f7b8591bf89df19d.jpg&type=a340"} />
        </box>
      </Container>
    </ThemeProvider>
  );
}

export default Password1