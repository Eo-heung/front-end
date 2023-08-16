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
import thumbImage from '../../public/image.png';

const JoinBirth = ({ handleClick, setUserBirth }) => {
    const [progress, setProgress] = useState(0);
    const [checkBirth, setCheckBirth] = useState(true);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        var dateStr = data.get('birth');
        var year = Number(dateStr.substr(0, 4)); // 입력한 값의 0~4자리까지 (연)
        var month = Number(dateStr.substr(4, 2)); // 입력한 값의 4번째 자리부터 2자리 숫자 (월)
        var day = Number(dateStr.substr(6, 2)); // 입력한 값 6번째 자리부터 2자리 숫자 (일)

        const message = `생년월일이 ${year}년 ${month}월 ${day}일이 맞나요?`

        if (window.confirm(message)) {
            var today = new Date(); // 날짜 변수 선언
            var yearNow = today.getFullYear(); // 올해 연도 가져옴

            if (dateStr.length <= 8) {
                // 연도의 경우 1900 보다 작거나 yearNow 보다 크다면 false를 반환합니다.
                if (1900 > year || year > yearNow) {
                    setCheckBirth(false);

                } else if (month < 1 || month > 12) {
                    setCheckBirth(false);

                } else if (day < 1 || day > 31) {
                    setCheckBirth(false);

                } else if ((month === 4 || month === 6 || month === 9 || month === 11) && day === 31) {
                    setCheckBirth(false);

                } else if (month === 2) {

                    var isleap = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));

                    if (day > 29 || (day === 29 && !isleap)) {
                        setCheckBirth(false);

                    } else {
                        setCheckBirth(true);
                        setUserBirth(() => data.get('birth'));
                        handleClick();
                    }//end of if (day>29 || (day===29 && !isleap))

                } else {
                    setCheckBirth(true);
                    setUserBirth(() => data.get('birth'));
                    handleClick();
                }//end of if

            } else {
                //1.입력된 생년월일이 8자 초과할때 :  auth:false
                setCheckBirth(false);
            }
            //End of method /*


        } else {
            console.log("다시 입력해주세요");
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
        const [progress, setProgress] = useState(50);

        useEffect(() => {
            const timer = setTimeout(() => {
                setProgress(66.666);
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
                    <Typography variant="body2" color="black" sx={{ width: '30px' }}>{'4 / 6'}</Typography>
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
                    <Typography variant="h5" fontSize="12pt" gutterBottom textAlign={'center'}>
                        어흥
                    </Typography>
                    <Typography variant="h1" fontSize="18pt" textAlign={'center'} style={{ fontWeight: 'bold' }}>
                        내 생일은?
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
                        <Grid container spacing={2} >
                            <Grid item xs={12} >
                                <TextField
                                    required
                                    fullWidth
                                    id="birth"
                                    label="생년월일(8자리)을 입력해 주세요."
                                    placeholder='19600101'
                                    name="birth"
                                    autoComplete="off"
                                    inputProps={{ maxLength: 8, pattern: "\\d{8}" }}
                                    error={!checkBirth}
                                    helperText={!checkBirth && "생년월일 형식에 맞추어 입력해 주세요."}
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
                                    height: '44px',
                                    mt: 3,
                                    mb: 2,
                                    backgroundColor: '#FEA53D', // 평소 색상
                                    '&:hover': {
                                        backgroundColor: '#FEB158', // 호버 시 색상
                                    },
                                }}
                            >
                                다음
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

export default JoinBirth;