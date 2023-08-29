import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Button, IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import * as React from 'react';

const Join = ({ handleClick }) => {
    const defaultTheme = createTheme();

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs" style={{ overflow: 'hidden' }}>
                <CssBaseline />
                <Box
                    sx={{
                        position: 'relative',
                        minHeight: '608.57px',
                        maxHeight: '608.57px',
                        marginTop: 8,
                        display: 'flex',        // 추가: 가운데 정렬을 위한 flex 설정
                        flexDirection: 'column', // 세로 방향으로 내용 배치
                        alignItems: 'center'    // 가운데 정렬
                    }}
                >
                    <IconButton
                        sx={{
                            position: 'absolute',
                            top: "-34px",
                            left: '0'
                        }}
                        onClick={() => {
                            window.history.back();
                        }}
                    >
                        <ArrowBackIosIcon />
                    </IconButton>
                    <img alt='어흥 로고' src="/static/media/logo.3745e555c6be936e8008.gif" style={{ width: '150px', height: '80px', marginBottom: '20px' }} />
                    <Typography variant="h5" fontSize="12pt" gutterBottom textAlign={'center'} style={{ fontFamily: "font-medium", color: 'gray' }}>
                        어흥! 반가워요!
                    </Typography>
                    <Typography variant="h1" fontSize="18pt" textAlign={'center'} style={{ fontFamily: "font-medium", color: 'black', marginBottom: '20px' }}>
                        당신에 대해 알려주세요!
                    </Typography>
                    <img alt='' style={{ width: '100%', height: '100%' }} src={"https://search.pstatic.net/sunny/?src=https%3A%2F%2Fi.pinimg.com%2F736x%2F70%2Faa%2Fdb%2F70aadb580a93ca72f7b8591bf89df19d.jpg&type=a340"} />
                </Box>
                <Button onClick={handleClick}
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
                    회원가입 하기
                </Button>
            </Container>
        </ThemeProvider>
    );
};

export default Join;