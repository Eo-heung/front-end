import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LinearWithValueLabel from './LinearWithValueLabel';


const Password2 = () => {
    const [inProp, setInProp] = useState(false);
    const [showGauge, setShowGauge] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        setInProp(true); // Password3 페이지가 열릴 때
        setShowGauge(true);
        setTimeout(() => {
            setProgress(100);
        }, 3000);
    }, []);

    function Copyright(props) {
        return (
            <Typography variant="body2" color="text.secondary" align="center" {...props}>
                {'Copyright © '}
                <Link color="inherit" href="https://mui.com/">
                    Your Website
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        );
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });
    };

    const defaultTheme = createTheme();
    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: { xs: '100%', sm: '958px' },
                        height: { xs: 'auto', sm: '613px' },
                        margin: 'auto',
                        marginTop: 8
                    }}
                >
                    <Typography variant="h5" fontSize="10pt" gutterBottom textAlign={'center'}>
                        어흥이 알고있는
                    </Typography>
                    <br></br>
                    <br></br>
                    <Typography variant="h6" fontSize="20pt" textAlign={'center'}>
                        내 핸드폰 번호는?
                    </Typography>
                    <br></br>
                    <br></br>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="핸드폰 번호 입력"
                                    name="email"
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
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    backgroundColor: 'grey',
                                    '&:hover': {
                                        backgroundColor: '#E55C25',
                                    }
                                }}
                            >
                                번호인증
                            </Button>
                            <Link href="#" variant="body2">
                                Already have an account? Sign in
                            </Link>
                            {showGauge && <LinearWithValueLabel value={progress} />}
                        </Box>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default Password2;