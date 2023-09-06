import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Button, IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import * as React from 'react';
import secondImage from '../../public/02.png'; // 추가된 이미지 가져오기
import logo from '../../public/logo_color.GIF';

const Join = ({ handleClick }) => {
    const defaultTheme = createTheme();

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs" style={{ overflow: 'hidden' }}>
                <CssBaseline />
                <Box
                    sx={{
                        position: 'relative',
                        minHeight: '80vh',
                        maxHeight: '80vh',
                        marginTop: 8,
                        display: 'flex',        // 추가: 가운데 정렬을 위한 flex 설정
                        flexDirection: 'column', // 세로 방향으로 내용 배치
                        alignItems: 'center'    // 가운데 정렬
                    }}
                >
                    <IconButton
                        sx={{
                            position: 'absolute',
                            top: "-5.3vh",
                            left: '0'
                        }}
                        onClick={() => {
                            window.history.back();
                        }}
                    >
                        <ArrowBackIosIcon />
                    </IconButton>
                    <img alt='어흥 로고' src={logo} style={{ width: '150px', height: '80px', marginBottom: '20px' }} />
                    <hr></hr>
                    <Typography variant="h5" fontSize="12pt" gutterBottom textAlign={'center'} style={{ fontFamily: "font-medium", color: 'gray' }}>
                        어흥! 반가워요!
                    </Typography>
                    <Typography variant="h1" fontSize="18pt" textAlign={'center'} style={{ fontFamily: "font-medium", color: 'black', marginBottom: '0vh' }}>
                        당신에 대해 알려주세요!
                    </Typography>
                    <img alt="" style={{ width: '100%', height: '100%', marginTop: '-5vh' }} src={secondImage} />
                </Box>
                <br></br>
                <Button onClick={handleClick}
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{
                        color: 'black',
                        height: '5.7vh',
                        mb: 2,
                        fontFamily: "font-medium",
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