import { Visibility, VisibilityOff } from '@mui/icons-material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { IconButton, InputAdornment } from '@mui/material';
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

function LinearProgressWithLabel() {
    const [progress, setProgress] = useState(16.67);

    useEffect(() => {
        const timer = setTimeout(() => {
            setProgress(33.333);
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
                <Typography variant="body2" color="black" sx={{ width: '30px' }}>{'2 / 6'}</Typography>
            </Box>
        </Box>
    );
}

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

const JoinPW = ({ handleClick, setUserPw, backClick }) => {
    const [progress, setProgress] = useState(0);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const handleClickShowPassword1 = () => setShowPassword1((show) => !show);
    const handleClickShowPassword2 = () => setShowPassword2((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        console.log(password);
        setPasswordMatch(true); // 입력 값이 변경될 때 에러 메시지 초기화
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
        setPasswordMatch(true); // 입력 값이 변경될 때 에러 메시지 초기화
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (password === confirmPassword) {
            setIsAuthenticated(true);
            if (/^.{8,20}$/.test(password)) {
                setUserPw(password);
                handleClick();
            } else {
                alert("8-20자 사이의 비밀번호를 설정해주세요.")
            }
        } else {
            setIsAuthenticated(false);
            setPasswordMatch(false);
        }
    };



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
                        어흥 입장시에 사용할
                    </Typography>
                    <Typography variant="h1" fontSize="18pt" textAlign={'center'} style={{ fontFamily: "font-medium", color: 'black' }}>
                        비밀번호를 입력해 주세요
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
                        <Grid container spacing={2} style={{ marginTop: '60px' }}>
                            <Grid item xs={12} >
                                <TextField
                                    required
                                    fullWidth
                                    id="password"
                                    label="비밀번호 입력"
                                    name="password"
                                    autoComplete="off"
                                    type={showPassword1 ? 'text' : 'password'}
                                    value={password}
                                    onChange={handlePasswordChange}
                                    sx={{ marginBottom: '16px' }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword1}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword1 ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <TextField
                                    required
                                    fullWidth
                                    id="confirmPassword"
                                    label="비밀번호 확인"
                                    name="confirmPassword"
                                    type={showPassword2 ? 'text' : 'password'}
                                    autoComplete="off"
                                    onChange={handleConfirmPasswordChange}
                                    error={!passwordMatch}
                                    helperText={!passwordMatch ? '비밀번호가 일치하지 않습니다.' : ''}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword2}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword2 ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
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
                                type='submit'
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
                                {'다음'}
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

export default JoinPW;