import {
    Box, Button, Container, CssBaseline, FormControl, Grid,
    InputLabel, LinearProgress, MenuItem, Select, TextField,
    ThemeProvider,
    Typography,
    createTheme, styled
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import thumbImage from '../../public/image.png.png';

const JoinFavorite = ({ handleClick, setUserHobby1, setUserHobby2, setUserHobby3 }) => {
    const [hobby, setHobby] = useState('');
    const [interest, setInterest] = useState('');
    const [food, setFood] = useState('');
    const [progress, setProgress] = useState(0);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setUserHobby1(() => hobby);
        setUserHobby2(() => interest);
        setUserHobby3(() => food);

        handleClick(); // 여기서 handleClick은 props로 전달된 함수입니다.
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
        const [progress, setProgress] = useState(85.7142);

        useEffect(() => {
            const timer = setTimeout(() => {
                setProgress(100);
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
                        어흥과 함께할
                    </Typography>
                    <br></br>
                    <br></br>
                    <Typography variant="h6" fontSize="20pt" textAlign={'center'}>
                        내 관심사는?
                    </Typography>
                    <br></br>
                    <br></br>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
                        <Grid container spacing={2} >
                            <Grid item xs={12} >

                                <FormControl fullWidth>
                                    <InputLabel>관심사</InputLabel>
                                    <Select
                                        value={hobby}
                                        label='관심사'
                                        onChange={(e) => setHobby(e.target.value)}
                                        sx={{ marginBottom: '10px' }}
                                    >
                                        <MenuItem value="101">인문학/책 </MenuItem>
                                        <MenuItem value="102">운동</MenuItem>
                                        <MenuItem value="103">요리/맛집</MenuItem>
                                        <MenuItem value="104">공예/만들기</MenuItem>
                                        <MenuItem value="105">원예</MenuItem>
                                        <MenuItem value="106">동네친구</MenuItem>
                                        <MenuItem value="107">음악/악기</MenuItem>
                                        <MenuItem value="108">반려동물</MenuItem>
                                        <MenuItem value="109">여행</MenuItem>
                                        <MenuItem value="110">기타</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel>좋아하는 음악종류</InputLabel>
                                    <Select
                                        label='좋아하는 음악종류'
                                        value={interest}
                                        onChange={(e) => setInterest(e.target.value)}
                                        sx={{ marginBottom: '10px' }}
                                    >
                                        <MenuItem value="201">클래식</MenuItem>
                                        <MenuItem value="202">재즈</MenuItem>
                                        <MenuItem value="203">POP</MenuItem>
                                        <MenuItem value="204">발라드</MenuItem>
                                        <MenuItem value="205">힘합</MenuItem>
                                        <MenuItem value="206">디스코</MenuItem>
                                        <MenuItem value="207">록</MenuItem>
                                        <MenuItem value="208">KPOP</MenuItem>
                                        <MenuItem value="209">트로트</MenuItem>
                                        <MenuItem value="210">EDM</MenuItem>
                                        <MenuItem value="211">댄스</MenuItem>
                                        <MenuItem value="212">기타</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel>좋아하는 음식</InputLabel>
                                    <Select
                                        label='좋아하는 음식'
                                        value={food}
                                        onChange={(e) => setFood(e.target.value)}
                                        sx={{ marginBottom: '10px' }}
                                    >
                                        <MenuItem value="301">한식</MenuItem>
                                        <MenuItem value="302">중식</MenuItem>
                                        <MenuItem value="303">일식</MenuItem>
                                        <MenuItem value="304">양식</MenuItem>
                                        <MenuItem value="305">기타</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    required
                                    fullWidth
                                    id="code"
                                    label="기타 등등.."
                                    name="code"
                                    autoComplete="off"
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
                                    mt: 3,
                                    mb: 2,
                                    backgroundColor: '#FFB471', // 평소 색상
                                    '&:hover': {
                                        backgroundColor: '#E55C25', // 호버 시 색상
                                    },
                                }}
                            >
                                나중에 알려줄래:)
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
                                선택 완료!
                            </Button>

                            <ThemeProvider theme={theme}>
                                <Box sx={{ width: '100%', marginTop: "20%" }}>
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

export default JoinFavorite;