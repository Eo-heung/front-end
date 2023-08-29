import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import thumbImage from '../../public/01.png';
import { SPRING_API_URL, REDIRECT_URL } from "../../config";

const JoinLocal1 = ({ handleClick, doubleClick, setUserAddr1, setUserAddr2, setUserAddr3 }) => {
    const [progress, setProgress] = useState(0);
    const [ipData, setIpData] = useState(null);
    const [selectedButton, setSelectedButton] = useState(null);



    const getIpClient = async () => {
        try {
            const response = await axios.get('https://ipinfo.io?token=bbcd593b7e1ceb');
            setIpData(() => response.data.ip);
        } catch (error) {
            alert("adblock 크롬 확장자를 종료해주시거나, '내가 직접 입력할래요'를 통해서 입력부탁드립니다.")
        }
    };

    async function getLocation(ip) {
        try {
            console.log(ipData);

            const response = await axios.get(`${SPRING_API_URL}/getlocation`, {
                params: {
                    ip: ip
                }
            });

            console.log(response);
            setUserAddr1(() => response.data.item.geoLocation.r1);
            setUserAddr2(() => response.data.item.geoLocation.r2);
            setUserAddr3(() => response.data.item.geoLocation.r3);

        } catch {

        }
    }

    useEffect(() => {
        getIpClient();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        await getIpClient();

        if (selectedButton === 'input') {
            handleClick();
        }
        if (selectedButton === 'location') {
            if (ipData) {
                getLocation(ipData);
                doubleClick();
            }
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

    const defaultTheme = createTheme();

    function LinearProgressWithLabel() {
        const [progress, setProgress] = useState(66.66);

        useEffect(() => {
            const timer = setTimeout(() => {
                setProgress(83.333);
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
                    <Typography variant="body2" color="black" sx={{ width: '30px' }}>{'5 / 6'}</Typography>
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
            <Container component="main" maxWidth="xs" style={{ overflow: 'hidden' }}>
                <CssBaseline />
                <Box
                    sx={{
                        minHeight: '608.57px',
                        maxHeight: '608.57px',
                        marginTop: 12.5
                    }}
                >
                    <Typography variant="h5" fontSize="12pt" gutterBottom textAlign={'center'} style={{ fontFamily: "font-medium", color: 'gray' }}>
                        어흥을 이용할
                    </Typography>
                    <Typography variant="h1" fontSize="18pt" textAlign={'center'} style={{ fontFamily: "font-medium", color: 'black' }}>
                        내 지역은?
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
                        <Grid container spacing={2} style={{ marginTop: '60px' }}>

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
                                onClick={() => setSelectedButton('input')}
                                sx={{
                                    color: 'black',
                                    height: '44px',
                                    mt: 3,
                                    backgroundColor: '#FEA53D', // 평소 색상
                                    '&:hover': {
                                        backgroundColor: '#FEB158', // 호버 시 색상
                                    },
                                }}
                            >
                                직접 입력할게요
                            </Button>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={() => setSelectedButton('location')}
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
                                내 위치를 찾아주세요
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

export default JoinLocal1;