import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import PropTypes from 'prop-types';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';

function LinearProgressWithLabel(props) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

const Password4 = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [progress, setProgress] = useState(66);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setProgress(100);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    const theme = createTheme({
        palette: {
            primary: {
                main: '#E55C25', // 원하는 색상으로 변경
            },
        },
    });

    LinearProgressWithLabel.propTypes = {
        value: PropTypes.number.isRequired,
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
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
            console.log('비밀번호 일치:', password);
        } else {
            setIsAuthenticated(false);
            setPasswordMatch(false);
            console.log('비밀번호가 일치하지 않습니다.');
        }
    };

    const defaultTheme = createTheme();

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="h5" fontSize="10pt" gutterBottom textAlign={'center'}>
                        어흥!
                    </Typography>
                    <Typography variant="h6" fontSize="20pt" textAlign={'center'}>
                        변경할 비밀번호를 입력해주세요
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="password"
                                    label="비밀번호 입력"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="confirmPassword"
                                    label="비밀번호 확인"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    error={!passwordMatch}
                                    helperText={!passwordMatch ? '비밀번호가 일치하지 않습니다.' : ''}
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
                                    backgroundColor: isAuthenticated ? '#4CAF50' : '#FFB471',
                                    '&:hover': {
                                        backgroundColor: isAuthenticated ? '#4CAF50' : '#E55C25',
                                    },
                                }}
                            >
                                {isAuthenticated ? '변경 성공!' : '변경하기'}
                            </Button>
                            {isAuthenticated && (
                                <Typography variant="body2" color="text.secondary" mt={1}>
                                    비밀번호 변경에 성공했어요!
                                </Typography>
                            )}
                            <Link href="/login" variant="body2">
                                로그인하러가기
                            </Link>
                            <ThemeProvider theme={theme}>
                                <Box sx={{ width: '100%' }}>
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

export default Password4;