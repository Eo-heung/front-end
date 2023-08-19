import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import * as React from 'react';


const Join = ({ handleClick }) => {

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
                    <img src="https://i.postimg.cc/RFMVM5qM/logo.png" />
                    <br></br>
                    <br></br>
                    <Typography component="h1" variant="h5" textAlign={'center'}>
                        어흥! 반가워요!<br></br>
                        당신에 대해 알려주세요<br></br>

                    </Typography>
                    <br></br>
                    <br></br>
                </Box>
                <Box sx={{ width: '100%', height: '100%', alignItems: 'center' }}>
                    <img style={{ width: '100%', height: '100%' }} src={"https://search.pstatic.net/sunny/?src=https%3A%2F%2Fi.pinimg.com%2F736x%2F70%2Faa%2Fdb%2F70aadb580a93ca72f7b8591bf89df19d.jpg&type=a340"} />
                </Box>
                <Button onClick={handleClick}
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{
                        color: 'black',
                        height: '44px',
                        mt: 3,
                        mb: 2,
                        backgroundColor: '#FEA53D', // 평소 색상
                        '&:hover': {
                            backgroundColor: '#FEB158', // 호버 시 색상
                        },
                    }}
                >
                    회원가입 하기
                </Button>
            </Container>
        </ThemeProvider>
    );
};

export default Join;