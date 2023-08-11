import styled from '@emotion/styled';
import { Container, Divider, Grid, Paper, Typography } from '@mui/material';
import React, { useState } from 'react';

const TabButton = styled.button`
    width: 280px;
  padding: 10px 20px;
  margin-right: 10px;
  border: none;
  border-radius: 5px;
  background-color: #e0e0e0;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &.active {
    background-color: #007BFF;
    color: white;
  }

  &:hover {
    background-color: #c0c0c0;
  }
`;



const ItemWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
`;

const StyledContainer = styled(Container)`
marginLeft: 400px;
maxWidth: 80%;
`;

const BoxContent = styled.div`
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    transition: transform 0.3s ease;
    
    &:hover {
        transform: scale(1.02);
    }
`;

const UserInfoSection = styled.div`
    margin: 20px 0;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
`;


const Mypage = () => {
    const [activeTab, setActiveTab] = useState('tab1');
    return (
        <>
            <div>
                <div className="tabs" style={{ marginLeft: '424px' }}>
                    <TabButton
                        className={activeTab === 'tab1' ? 'active' : ''}
                        onClick={() => setActiveTab('tab1')}
                    >
                        프로필 관리
                    </TabButton>
                    <TabButton
                        className={activeTab === 'tab2' ? 'active' : ''}
                        onClick={() => setActiveTab('tab2')}
                    >
                        내 정보
                    </TabButton>
                    <TabButton
                        className={activeTab === 'tab3' ? 'active' : ''}
                        onClick={() => setActiveTab('tab3')}
                    >
                        활동 내역
                    </TabButton>
                    <TabButton
                        className={activeTab === 'tab4' ? 'active' : ''}
                        onClick={() => setActiveTab('tab4')}
                    >
                        친구 관리
                    </TabButton>

                </div>

                <div className="tab-content">
                    {activeTab === 'tab1' &&
                        <StyledContainer sx={{ marginLeft: '400px' }}>
                            <Paper elevation={3} >
                                <UserInfoSection>
                                    <Grid container spacing={3} direction="column">
                                        {/* 중앙 타이틀 */}
                                        <Grid item xs={12}>
                                            <Typography variant="h1" fontSize="18pt" sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '5px' }}>
                                                프로필 관리
                                            </Typography>
                                        </Grid>

                                        {/* 내용 박스들 */}
                                        <Grid item container spacing={3}>
                                            {/* 왼쪽 박스 */}
                                            <Grid item xs={6} style={{ padding: '24px 50px' }}>
                                                <ItemWrapper>
                                                    <Typography variant="body1">휴대폰 번호:</Typography>
                                                    <Typography variant="body2">010-5366-3404</Typography>
                                                </ItemWrapper>
                                                <Divider />
                                                <ItemWrapper>
                                                    <Typography variant="body1">이메일:</Typography>
                                                    <Typography variant="body2">user@example.com</Typography>
                                                </ItemWrapper>
                                                <Divider />
                                                <ItemWrapper>
                                                    <Typography variant="body1">생년월일:</Typography>
                                                    <Typography variant="body2">2002-01-31</Typography>
                                                </ItemWrapper>
                                                <Divider />
                                                <ItemWrapper>
                                                    <Typography variant="body1">가입일:</Typography>
                                                    <Typography variant="body2">2023-08-10</Typography>
                                                </ItemWrapper>
                                                <Divider />
                                            </Grid>

                                            {/* 오른쪽 박스 */}
                                            <Grid item xs={6} style={{ padding: '24px 50px' }}>
                                                <ItemWrapper>
                                                    <Typography variant="body1">마지막 로그인:</Typography>
                                                    <Typography variant="body2">2023-08-10</Typography>
                                                </ItemWrapper>
                                                <Divider />
                                                <ItemWrapper>
                                                    <Typography variant="body1">마지막 로그인:</Typography>
                                                    <Typography variant="body2">2023-08-10</Typography>
                                                </ItemWrapper>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </UserInfoSection>
                            </Paper>
                        </StyledContainer>}
                    {activeTab === 'tab2' &&
                        <StyledContainer sx={{ marginLeft: '400px' }}>
                            <Paper elevation={3} >
                                <UserInfoSection>
                                    <Grid container spacing={3} direction="column">
                                        {/* 중앙 타이틀 */}
                                        <Grid item xs={12}>
                                            <Typography variant="h1" fontSize="18pt" sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '5px' }}>
                                                내 정보
                                            </Typography>
                                        </Grid>

                                        {/* 내용 박스들 */}
                                        <Grid item container spacing={3}>
                                            {/* 왼쪽 박스 */}
                                            <Grid item xs={6} style={{ padding: '24px 50px' }}>
                                                <ItemWrapper>
                                                    <Typography variant="body1">휴대폰 번호:</Typography>
                                                    <Typography variant="body2">010-5366-3404</Typography>
                                                </ItemWrapper>
                                                <Divider />
                                                <ItemWrapper>
                                                    <Typography variant="body1">이메일:</Typography>
                                                    <Typography variant="body2">user@example.com</Typography>
                                                </ItemWrapper>
                                                <Divider />
                                                <ItemWrapper>
                                                    <Typography variant="body1">생년월일:</Typography>
                                                    <Typography variant="body2">2002-01-31</Typography>
                                                </ItemWrapper>
                                                <Divider />
                                                <ItemWrapper>
                                                    <Typography variant="body1">가입일:</Typography>
                                                    <Typography variant="body2">2023-08-10</Typography>
                                                </ItemWrapper>
                                                <Divider />
                                            </Grid>

                                            {/* 오른쪽 박스 */}
                                            <Grid item xs={6} style={{ padding: '24px 50px' }}>
                                                <ItemWrapper>
                                                    <Typography variant="body1">마지막 로그인:</Typography>
                                                    <Typography variant="body2">2023-08-10</Typography>
                                                </ItemWrapper>
                                                <Divider />
                                                <ItemWrapper>
                                                    <Typography variant="body1">마지막 로그인:</Typography>
                                                    <Typography variant="body2">2023-08-10</Typography>
                                                </ItemWrapper>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </UserInfoSection>
                            </Paper>
                        </StyledContainer>
                    }
                    {activeTab === 'tab3' &&
                        <StyledContainer sx={{ marginLeft: '400px' }}>
                            <Paper elevation={3}>
                                <UserInfoSection>
                                    <Typography variant="h1" fontSize="18pt" sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '5px' }}>
                                        활동 내역
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <BoxContent>
                                                <Typography variant="body1">주문 번호: #12345</Typography>
                                                <Typography variant="body2">상품: 멋진 상품</Typography>
                                                <Typography variant="body2">가격: 100,000원</Typography>
                                                <Typography variant="body2">주문일: 2023-08-10</Typography>
                                            </BoxContent>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <BoxContent>
                                                <Typography variant="body1">주문 번호: #12346</Typography>
                                                <Typography variant="body2">상품: 아름다운 상품</Typography>
                                                <Typography variant="body2">가격: 200,000원</Typography>
                                                <Typography variant="body2">주문일: 2023-08-09</Typography>
                                            </BoxContent>
                                        </Grid>
                                    </Grid>
                                </UserInfoSection>
                            </Paper>
                        </StyledContainer>
                    }
                    {activeTab === 'tab4' &&
                        <StyledContainer sx={{ marginLeft: '400px' }}>
                            <Paper elevation={3}>
                                <UserInfoSection>
                                    <Typography variant="h1" fontSize="18pt" sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '5px' }}>
                                        친구 관리
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <BoxContent>
                                                <Typography variant="body1">주문 번호: #12345</Typography>
                                                <Typography variant="body2">상품: 멋진 상품</Typography>
                                                <Typography variant="body2">가격: 100,000원</Typography>
                                                <Typography variant="body2">주문일: 2023-08-10</Typography>
                                            </BoxContent>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <BoxContent>
                                                <Typography variant="body1">주문 번호: #12346</Typography>
                                                <Typography variant="body2">상품: 아름다운 상품</Typography>
                                                <Typography variant="body2">가격: 200,000원</Typography>
                                                <Typography variant="body2">주문일: 2023-08-09</Typography>
                                            </BoxContent>
                                        </Grid>
                                    </Grid>
                                </UserInfoSection>
                            </Paper>
                        </StyledContainer>
                    }
                </div>
            </div>
        </>
    );
};

export default Mypage;