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
import { styled } from '@mui/system';
import thumbImage from '../../public/image.png.png';

const JoinLocal2 = () => {
    const [progress, setProgress] = useState(0);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });
    };

    // 원의 left 값을 progress에 바인딩하기 위해 styled 컴포넌트 대신 일반 함수 컴포넌트를 사용합니다.


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

    const defaultTheme = createTheme();

    function LinearProgressWithLabel() {
        const [progress, setProgress] = useState(80.9523);

        useEffect(() => {
            const timer = setTimeout(() => {
                setProgress(85.7142);
            }, 500);

            return () => {
                clearTimeout(timer);
            };
        }, []);


        return (
            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%', height: '20px' }}>
                <Box sx={{ position: 'relative', flex: 14 }}>
                    <LinearProgress variant="determinate" value={progress} />
                    <Circle progress={progress} />
                </Box>
                <Box sx={{ flex: 1, marginLeft: 1 }}>
                    <Typography variant="body2" color="text.secondary">{`${Math.round(progress)}%`}</Typography>
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
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        height: '608.57px',
                        marginTop: 8
                    }}
                >
                    <Typography variant="h5" fontSize="10pt" gutterBottom textAlign={'center'}>
                        어흥을 시작할
                    </Typography>
                    <br></br>
                    <br></br>
                    <Typography variant="h6" fontSize="20pt" textAlign={'center'}>
                        내 지역은
                    </Typography>
                    <br></br>
                    <br></br>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
                        <Grid container spacing={2} >
                            <Grid item xs={12} >
                                <TextField
                                    required
                                    fullWidth
                                    id="code"
                                    label="사용자가 입력한 지역"
                                    name="code"
                                    autoComplete="off"
                                />
                            </Grid>
                        </Grid>

                        <Typography variant="h6" fontSize="20pt" textAlign={'center'}>
                            이곳이 맞나요?
                        </Typography>

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
                                아니에요
                            </Button>
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
                                맞아요
                            </Button>

                            <ThemeProvider theme={theme}>
                                <Box sx={{ width: '100%', marginTop: "47%" }}>
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

export default JoinLocal2;