import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { styled } from '@mui/system';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { SPRING_API_URL } from "../../config";
import thumbImage from '../../public/01.png';
import { useNavigate } from 'react-router';


const JoinPhoneNum1 = ({ handleClick, setUserTel, setCheckNum, backClick }) => {
    const [progress, setProgress] = useState(0);
    const [isTelValid, setIsTelValid] = useState(true);
    const navi = useNavigate();

    const checkPhone = (tel) => {
        axios.post(`${SPRING_API_URL}/checkphone`, tel)
            .then(response => {
                console.log(response.data); // 서버로부터의 응답을 출력합니다.
                setCheckNum(() => response.data.item)
            })
            .catch(error => {
                console.error('An error occurred:', error); // 오류를 출력합니다.
            });
    };

    const checkFullUserInfo = async (tel) => {
        try {
            const response = await axios.post(`${SPRING_API_URL}/checkuser`, { userId: tel });

            if (response.data.item.msg === "canJoin") {
                console.log(response.data);
                return false;  // Not already registered
            }
            if (response.data.item.msg === "canNotJoin") {
                console.log(response.data);
                return true;  // Already registered
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
        return false;  // Default value
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);

        if (!/^(01[016789]{1})[0-9]{3,4}[0-9]{4}$/.test(data.get('userTel'))) {
            setIsTelValid(false);
            return;
        }

        setIsTelValid(true);

        try {
            const alreadyRegistered = await checkFullUserInfo(data.get('userTel'));

            if (alreadyRegistered) {
                alert('이미 가입된 회원입니다.');
                navi("/login") //true
            } else {
                checkPhone(data.get('userTel'));
                setUserTel(() => data.get('userTel'));
                handleClick() //false
            }
        } catch (error) {
            console.error("An error occurred during handleSubmit:", error);
        }
    };





    // 원의 left 값을 progress에 바인딩하기 위해 styled 컴포넌트 대신 일반 함수 컴포넌트를 사용합니다.
    const Circle = styled('div')(({ progress }) => ({
        position: 'absolute',
        left: `calc(${progress}% - 15px)`,
        top: '50%',
        transform: 'translateY(-50%)',
        width: '40px',
        height: '40px',
        backgroundImage: `url(${thumbImage})`, // 가져온 이미지를 배경 이미지로 사용합니다.
        backgroundSize: 'cover', // 필요에 따라 배경 이미지 크기를 조절합니다.
        zIndex: 2,
        transition: "left 500ms ease-out"
    }));

    function LinearProgressWithLabel() {
        const [progress, setProgress] = useState(0);

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
                light: '#ff7961',
                main: '#E55C25',
                dark: '#ba000d',

            },
            secondary: {
                main: '#1976d2', // 원하는 secondary 색상 값
            },
        },
    });

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

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs" style={{ overflow: 'hidden' }} >
                <CssBaseline />
                <Box
                    sx={{
                        position: 'relative', // 추가
                        minHeight: '80vh',
                        maxHeight: '80vh',
                        marginTop: 12.5
                    }}
                >
                    <IconButton
                        sx={{
                            position: 'absolute',
                            top: "-9.1vh",
                        }}
                        onClick={() => {
                            backClick();
                        }}
                    >
                        <ArrowBackIosIcon />
                    </IconButton>

                    <Typography variant="h5" fontSize="12pt" gutterBottom textAlign={'center'} style={{ fontFamily: "font-medium", color: 'gray' }}>
                        어흥과 함께할
                    </Typography>
                    <Typography variant="h1" fontSize="18pt" textAlign={'center'} style={{ fontFamily: "font-medium", color: 'black' }}>
                        내 핸드폰 번호는?
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
                        <Grid container spacing={2} style={{ marginTop: '7.8vh' }}>
                            <Grid item xs={12} >
                                <TextField
                                    required
                                    fullWidth
                                    id="userTel"
                                    label="핸드폰 번호 입력"
                                    name="userTel"
                                    autoComplete="off"
                                    placeholder='01012345678'
                                    inputProps={{ maxLength: 11 }}
                                    error={!isTelValid}
                                    helperText={!isTelValid && "전화번호 형식에 맞추어 입력해 주세요."}
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
                                    color: 'black',
                                    height: '5.7vh',
                                    fontFamily: "font-medium",
                                    mt: 3,
                                    mb: 2,
                                    backgroundColor: '#FEA53D', // 평소 색상
                                    '&:hover': {
                                        backgroundColor: '#FEB158', // 호버 시 색상
                                    },
                                }}
                            >
                                인증번호 보내기
                            </Button>
                        </Box>
                    </Box>
                </Box>
                <ThemeProvider theme={theme}>
                    <Box sx={{ width: '100%', height: "6.5vh", marginTop: '-8%' }}>
                        <LinearProgressWithLabel value={progress} />
                    </Box>
                </ThemeProvider>
            </Container>
        </ThemeProvider>
    );
};

export default JoinPhoneNum1;