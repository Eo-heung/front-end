import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, CardMedia, TextField, Select, MenuItem, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { styled } from '@mui/system';
import { data as importedData } from './data.js';
import BasicBoard from '../utils/BasicBoard.js';
import TopButton from '../utils/TopButton.js';

const StyledContainer = styled('div')`
    position: fixed;
    top: 115px;
    right: 0;
    left: 400px;
    padding: 1.5rem 3rem;
    height: 180px;
    width: 90%;
    z-index: 1001;
    background-color: #fff;
    &.fixed {
        position: fixed;
        padding: 1.5rem 3rem;
        width: 90%;
        z-index: 100;
    }
    @media (max-width: 992px) {
        left: 0;
    }
`;

const SearchContainer = styled('div')`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const StyledTextField = styled(TextField)`
    width: 250px;
    & .MuiOutlinedInput-root {
        &:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline {
            border-color: #FCBE71;
        }
        &.Mui-focused .MuiInputLabel-root {
            color: #FCBE71;
        }
    }
`;

const StyledSelect = styled(Select)`
    &&.MuiOutlinedInput-root {
        &:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline {
            border-color: #FCBE71;
        }
        &.Mui-focused .MuiInputLabel-root {
            color: #FCBE71;
        }
    }

    && .MuiMenu-paper {
        .MuiListItem-root:hover {
            background-color: #FCBE71;
            color: white;
        }
    }
`;

const StyledMenuItem = styled(MenuItem)`
    &&:hover {
        background-color: #FCBE71;
        color: white;
    }
`;

const StyledLink = styled(Link)`
    margin: 1rem auto;
    text-decoration: none;
`;

const StyledButton = styled(Button)`
    position: fixed;
    top: 200px;
    right: 20%;
    z-index: 1001;
`;

const StyledCard = styled(Card)`
    display: flex;
    gap: 1.5rem;
    padding: 1.5rem;
    width: 100%;
    background-color: #fff;
    color: #000;
    cursor: pointer;
`;

const StyledCardMedia = styled(CardMedia)`
    height: 160px;
    width: 160px;
    
    @media (max-width: 992px) {
        display: none;
    }
`;

const CardInfo = styled('div')`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex-grow: 1;
`;


const MoimInfoRow = styled('div')`
    display: flex;
    justify-content: flex-start;
    gap: 30px;
`;

const EllipsisText = styled(Typography)`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    width: 600px;

    @media (max-width: 992px) {
        width: 200px;
    }
`;

const ListMoim = () => {
    // const [data, setData] = useState([]);
    const [data, setData] = useState(importedData);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [category, setCategory] = useState('all');
    const [scrollActive, setScrollActive] = useState(false);

    const scrollHandler = () => {
        if (window.scrollY > 100) {
            setScrollActive(true);
        } else {
            setScrollActive(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', scrollHandler);
        return () => {
            window.removeEventListener('scroll', scrollHandler);
        };
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:1234/list-moim?page=${page}`);
            setData(prev => [...prev, ...response.data]);
            if (response.data.length === 0) {
                setHasMore(false);
            } else {
                setPage(prev => prev + 1);
            }
        } catch (error) {
            console.log("Error fetching data: ", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <BasicBoard>
            <StyledContainer className={scrollActive ? 'fixed' : ''}>
                <h3 style={{ marginBottom: "1rem" }}>모임 목록</h3>
                <SearchContainer>
                    <StyledTextField variant="outlined" placeholder="검색어를 입력하세요." onChange={(e) => setSearchKeyword(e.target.value)} />
                    <StyledSelect value={category} onChange={(e) => setCategory(e.target.value)}>
                        <StyledMenuItem value="all">전체</StyledMenuItem>
                        <StyledMenuItem value="subject">주제별</StyledMenuItem>
                        <StyledMenuItem value="region">지역별</StyledMenuItem>
                        <StyledMenuItem value="newest">최신순</StyledMenuItem>
                    </StyledSelect>
                </SearchContainer>
                <StyledButton component={StyledLink} to="/create-moim" variant="contained" color="primary">
                    새로운 모임 만들기
                </StyledButton>
            </StyledContainer>
            <div style={{ marginTop: "180px" }}>
                <InfiniteScroll
                    dataLength={data.length}
                    next={fetchData}
                    hasMore={hasMore}
                    scrollableTarget={document}
                >
                    {data.map(moim => (
                        <StyledLink to={`/view-moim/${moim.moimId}`}>
                            <StyledCard key={moim.moimId}>
                                <StyledCardMedia
                                    component="img"
                                    image={moim.imageURL}
                                    alt="moim image"
                                />
                                <CardInfo>
                                    <CardContent>
                                        <Typography variant="h6">{moim.moimCategory}</Typography>
                                        <Typography variant="h5">{moim.moimTitle}</Typography>
                                        <MoimInfoRow>
                                            <Typography variant="body1">{moim.moimAddr}</Typography>
                                            <Typography variant="body1">{moim.currentMoimUser}/{moim.maxMoimUser}</Typography>
                                        </MoimInfoRow>
                                        <EllipsisText variant="body1">{moim.moimContent}</EllipsisText>
                                    </CardContent>
                                </CardInfo>
                            </StyledCard>
                        </StyledLink>
                    ))}
                </InfiniteScroll>
            </div>
            <TopButton />
        </BasicBoard>
    );
};

export default ListMoim;