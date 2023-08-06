import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'; // Button 컴포넌트 추가
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';


const JoinComplete = ({ join }) => {

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
                        어흥! 환영해요!<br></br>
                        선물로 곶감을 드렸어요
                    </Typography>
                    <br></br>
                    <Typography sx={{ fontSize: '5px' }}
                    >곶감사서 너에게 곧감..
                    </Typography>
                    <br></br>
                    <br></br>

                </Box>
                <Box sx={{ width: '100%', height: '100%', alignItems: 'center' }}>
                    <img style={{ width: '100%', height: '100%' }} src={"https://search.pstatic.net/sunny/?src=https%3A%2F%2Fi.pinimg.com%2F736x%2F70%2Faa%2Fdb%2F70aadb580a93ca72f7b8591bf89df19d.jpg&type=a340"} />
                </Box>
                <Button type="button"
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={join}
                    sx={{
                        mt: 3,
                        mb: 2,
                        backgroundColor: '#FFB471', // 평소 색상
                        '&:hover': {
                            backgroundColor: '#E55C25', // 호버 시 색상
                        },
                    }}
                >
                    어흥 시작하기
                </Button>
            </Container>
        </ThemeProvider>
    );
};

export default JoinComplete;