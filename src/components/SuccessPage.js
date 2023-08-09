import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const SuccessPage = () => {
  return (
    <Container>
      <Typography variant="h1" align="center">
        로그인 성공!
      </Typography>
      <Typography variant="h5" align="center" gutterBottom>
        환영합니다! 로그인에 성공하였습니다.
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button variant="contained" color="primary" component={Link} to="/login">
          홈으로 돌아가기
        </Button>
      </div>
    </Container>
  );
};

export default SuccessPage;