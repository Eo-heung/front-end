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
import CryptoJS from 'crypto-js';
import React, { useEffect, useState } from 'react';
import thumbImage from '../../public/image.png.png';

const JoinLocal1 = ({ handleClick, doubleClick, setUserAddr1, setUserAddr2, setUserAddr3 }) => {
    const [progress, setProgress] = useState(0);
    const [ipData, setIpData] = useState(null);
    const [selectedButton, setSelectedButton] = useState(null);



    const getIpClient = async () => {
        try {
            const response = await axios.get('https://ipinfo.io?token=bbcd593b7e1ceb');
            setIpData(() => response.data.ip);
        } catch (error) {
        }
    };

    function makeSignature(timestamp, accessKey, secretKey, ip) {
        var space = " ";				// one space
        var newLine = "\n";				// new line
        var method = "GET";				// method
        var url = "/geolocation/v2/geoLocation?ip=" + ip + "&responseFormatType=json";	// url (include query string)

        var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
        hmac.update(method);
        hmac.update(space);
        hmac.update(url);
        hmac.update(newLine);
        hmac.update(timestamp);
        hmac.update(newLine);
        hmac.update(accessKey);

        var hash = hmac.finalize();

        return hash.toString(CryptoJS.enc.Base64);
    }

    async function getGeoLocation() {
        const timestamp = Date.now().toString();
        const accessKey = '68NSDY1QB7C7QACw2KsJ';
        const secretKey = 'rY2VzROP9LsE1XIUz0hkyK2rmpbVXWd8Xb95i8nY';

        const signature = makeSignature(timestamp, accessKey, secretKey, ipData);

        try {
            console.log(ipData + signature)

            const response = await axios.get('https://proxy.cors.sh/https://geolocation.apigw.ntruss.com/geolocation/v2/geoLocation', {
                params: {
                    'ip': ipData,
                    'responseFormatType': 'json',
                },
                headers: {
                    'x-cors-api-key': 'temp_6f485b2f379d20b65ecbcdcb03664f46',
                    'x-ncp-apigw-timestamp': timestamp,
                    'x-ncp-iam-access-key': accessKey,
                    'x-ncp-apigw-signature-v2': signature,
                }
            });

            if (response.data.geoLocation.r1 === '서울특별시' || '경기도' || '인천광역시') {
                setUserAddr1(() => '수도권');
            } else if (response.data.geoLocation.r1 === '강원도') {
                setUserAddr1(() => '강원권');
            } else if (response.data.geoLocation.r1 === '충청북도' || '충청남도' || '대전광역시' || '세종특별자치시') {
                setUserAddr1(() => '충청권');
            } else if (response.data.geoLocation.r1 === '전라북도' || '전라남도' || '광주광역시') {
                setUserAddr1(() => '전라권');
            } else if (response.data.geoLocation.r1 === '경상북도' || '경상남도' || '부산광역시' || '대구광역시' || '울산광역시') {
                setUserAddr1(() => '경상권');
            } else if (response.data.geoLocation.r1 === '제주특별자치도') {
                setUserAddr1(() => '제주권');
            }

            setUserAddr2(() => response.data.geoLocation.r1);
            setUserAddr3(() => response.data.geoLocation.r2);

            doubleClick();

        } catch (error) {
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
                getGeoLocation(ipData);
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
        const [progress, setProgress] = useState(71.4285);

        useEffect(() => {
            const timer = setTimeout(() => {
                setProgress(76.1904);
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
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
                        <Grid container spacing={2} >

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
                                    mt: 3,
                                    mb: 2,
                                    backgroundColor: '#FFB471', // 평소 색상
                                    '&:hover': {
                                        backgroundColor: '#E55C25', // 호버 시 색상
                                    },
                                }}
                            >
                                내가 직접 입력할래요
                            </Button>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={() => setSelectedButton('location')}
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    backgroundColor: '#FFB471', // 평소 색상
                                    '&:hover': {
                                        backgroundColor: '#E55C25', // 호버 시 색상
                                    },
                                }}
                            >
                                내 위치로 찾아주세요
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

export default JoinLocal1;