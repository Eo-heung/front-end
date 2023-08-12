import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, CardMedia, TextField, Select, MenuItem, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import styled from 'styled-components';
import { data as importedData } from './data.js';
import BasicBoard from '../utils/BasicBoard.js';
import TopButton from '../utils/TopButton.js';

const TitleContainer = styled.div`
    margin-top: 1rem;
    margin-bottom: 1.5rem;
`;

const StyledCard = styled(Card)`
    display: flex;
    width: 100%;
    gap: 20px;
    margin-bottom: 1.5rem;
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

const CardInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex-grow: 1;
`;


const MoimInfoRow = styled.div`
    display: flex;
    justify-content: flex-start;
    gap: 30px;
`;

const EllipsisText = styled(Typography)`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    width: 500px;

    @media (max-width: 992px) {
        width: 200px;
    }
`;

const SearchContainer = styled.div`
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

const ListMoim = () => {
    // const [data, setData] = useState([]);
    const [data, setData] = useState(importedData);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [category, setCategory] = useState('all');

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
            <TitleContainer>
                <Typography variant="h4" style={{ marginBottom: "1rem" }}>모임 목록</Typography>
                <SearchContainer>
                    <StyledTextField variant="outlined" placeholder="검색어를 입력하세요." onChange={(e) => setSearchKeyword(e.target.value)} />
                    <StyledSelect value={category} onChange={(e) => setCategory(e.target.value)}>
                        <StyledMenuItem value="all">전체</StyledMenuItem>
                        <StyledMenuItem value="subject">주제별</StyledMenuItem>
                        <StyledMenuItem value="region">지역별</StyledMenuItem>
                        <StyledMenuItem value="newest">최신순</StyledMenuItem>
                    </StyledSelect>
                </SearchContainer>
                <StyledLink to="/create-moim">새로운 모임 만들기</StyledLink>
            </TitleContainer>
            <InfiniteScroll
                dataLength={data.length}
                next={fetchData}
                hasMore={hasMore}
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
            <TopButton />
        </BasicBoard>
    );
};

export default ListMoim;