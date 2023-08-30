import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { IconButton, Link } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import React, { useEffect, useState } from 'react';
import thumbImage from '../../public/01.png';

const JoinPhoneNum2 = ({ handleClick, backClick, checkNum }) => {
    const [progress, setProgress] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);

        if (data.get('code') !== checkNum) {
            alert("인증번호를 다시 확인해주세요.");
        } else {
            alert("인증이 완료되었습니다.");
            handleClick();
        }
    };

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

    const defaultTheme = createTheme({
        palette: {
            primary: {
                main: '#FEA53D',
            },
            secondary: {
                main: '#FEB158',
            },
        },
    });
    function LinearProgressWithLabel() {
        const [progress, setProgress] = useState(16.67);

        useEffect(() => {
            const timer = setTimeout(() => {
                setProgress(16.67);
            }, 500);

            return () => {
                clearTimeout(timer);
            };
        }, []);


        return (
            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%', height: '20px' }}>
                <Box sx={{ position: 'relative', flex: 14, marginRight: "10px" }}>
                    <LinearProgress variant="determinate" value={progress} />
                    <Circle progress={progress} />
                </Box>
                <Box sx={{ flex: 1, marginLeft: 3 }}>
                    <Typography variant="body2" color="black" sx={{ width: '30px' }}>{'1 / 6'}</Typography>
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
            <Container component="main" maxWidth="xs" minHeight='608.57px' maxHeight='608.57px' style={{ overflow: 'hidden' }}>
                <CssBaseline />
                <Box
                    sx={{
                        position: 'relative', // 추가
                        minHeight: '608.57px',
                        maxHeight: '608.57px',
                        marginTop: 12.5
                    }}
                >
                    <IconButton
                        sx={{
                            position: 'absolute',
                            top: "-70px",
                        }}
                        onClick={() => {
                            backClick();
                        }}
                    >
                        <ArrowBackIosIcon />
                    </IconButton>
                    <Typography variant="h5" fontSize="12pt" gutterBottom textAlign={'center'} style={{ fontFamily: "font-medium", color: 'gray' }}>
                        어흥이 인증번호를 보내드렸어요!
                    </Typography>
                    <Typography variant="h1" fontSize="18pt" textAlign={'center'} style={{ fontFamily: "font-medium", color: 'black' }}>
                        문자함에서 확인한
                        내 인증번호는?
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
                        <Grid container spacing={2} style={{ marginTop: '60px' }}>
                            <Grid item xs={12} >
                                <TextField
                                    required
                                    fullWidth
                                    id="code"
                                    label="인증번호 입력"
                                    name="code"
                                    autoComplete="off"
                                    inputProps={{ maxLength: 6, pattern: "\\d{6}" }}
                                    sx={{
                                        marginBottom: '5px'
                                    }}
                                />
                                <Link sx={{
                                    float: 'right',
                                    textDecoration: 'none',
                                    color: 'gray',
                                    '&:hover': {
                                        textDecoration: 'underline',
                                        color: '#FEA53D', // 호버 시 원하는 배경색
                                        cursor: 'pointer'
                                    },
                                }} onClick={backClick}>인증번호가 안왔나요?</Link>
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
                                인증하기
                            </Button>


                        </Box>
                    </Box>
                </Box>
                <ThemeProvider theme={theme}>
                    <Box sx={{ width: '100%', height: "50px", marginTop: '-8%' }}>
                        <LinearProgressWithLabel value={progress} />
                    </Box>
                </ThemeProvider>
            </Container>

        </ThemeProvider>
    );
};

export default JoinPhoneNum2;