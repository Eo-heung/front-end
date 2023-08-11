import styled from '@emotion/styled';
import { Avatar, Button, Container, Paper, Typography } from '@mui/material';
import React from 'react';

const StyledContainer = styled(Container)`
    padding: 32px;
`;

const Profile = styled.div`
    display: 'flex';
    flexDirection: 'column';
    alignItems: 'center';
    marginBottom: '24px';
`;

const LargeAvatar = styled(Avatar)`
    width: 80px;
    height: 80px;
    marginBottom: 8px;
`;

const Mypage = () => {
    return (
        <StyledContainer>
            <Paper elevation={3} padding={2}>
                <Profile>
                    <LargeAvatar alt="Profile Picture" />
                    <Typography variant="h5">Username</Typography>
                </Profile>
                <Button variant="contained" color="primary" fullWidth>
                    프로필 수정
                </Button>
                {/* 다른 버튼이나 추가적인 마이페이지 내용을 여기에 추가하면 됩니다. */}
            </Paper>
        </StyledContainer>
    );
};

export default Mypage;
