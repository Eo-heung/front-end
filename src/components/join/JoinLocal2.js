import { Button, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import React, { useEffect, useState } from 'react';
import DaumPostcode from "react-daum-postcode";
import thumbImage from '../../public/01.png';

const JoinLocal2 = ({ handleClick, setUserAddr1, setUserAddr2, setUserAddr3 }) => {
    const [progress, setProgress] = useState(0);
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const complete = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }
        console.log(data)
        console.log(fullAddress)
        console.log(data.zonecode)

        setUserAddr1(() => data.sido);
        setUserAddr2(() => data.sigungu);
        setUserAddr3(() => data.bname);
        handleClick();

    }

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

    function LinearProgressWithLabel() {
        const [progress, setProgress] = useState(83.333);

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
            secondary: {
                main: '#4a4a4a',
            },
            background: {
                paper: '#f3f3f3',
            }
        },
        typography: {
            h6: {
                fontWeight: 700,
            },
        },
    });

    const theme1 = createTheme({
        palette: {
            primary: {
                main: '#adb5bd',
            },
        },
    });

    return (
        <ThemeProvider theme={theme1}>
            <Container component="main" maxWidth="xs" style={{ overflow: 'hidden' }}>
                <CssBaseline />
                <Box sx={{
                    minHeight: '608.57px',
                    maxHeight: '608.57px',
                    marginTop: 12.5,
                }}>
                    <Typography variant="h5" fontSize="12pt" gutterBottom textAlign={'center'}>
                        어흥을 이용할
                    </Typography>
                    <Typography variant="h1" fontSize="18pt" textAlign={'center'} style={{ fontWeight: 'bold' }}>
                        내 지역는?
                    </Typography>
                    <Box component="form" sx={{ mt: 3, width: '100%', textAlign: 'center' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sx={{
                            }}>

                                <TextField
                                    readOnly
                                    fullWidth
                                    value={"주소를 입력해 주세요."}
                                    onClick={handleOpen}
                                    sx={{
                                        backgroundColor: '#e9ecef',
                                    }}
                                >주소 검색</TextField>
                            </Grid>

                        </Grid>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                mt: 3,
                            }}
                        ></Box>

                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleOpen}
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
                            주소 검색하기
                        </Button>
                        <Dialog open={open} onClose={handleClose} style={{ marginTop: '120px' }}>
                            <DialogTitle>주소 검색</DialogTitle>
                            <DialogContent>
                                <DaumPostcode
                                    autoClose
                                    style={{ width: '400px', height: '480px' }} // 높이와 너비는 원하는 대로 조절
                                    onComplete={data => {
                                        complete(data);
                                        handleClose(); // 검색 완료 후 팝업 닫기
                                    }}
                                />
                            </DialogContent>
                        </Dialog>
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

export default JoinLocal2;