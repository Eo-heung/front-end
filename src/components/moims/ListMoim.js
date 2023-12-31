import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, Typography, CardMedia, TextField, Select, MenuItem, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { styled } from '@mui/system';
import BasicBoard from '../utils/BasicBoard.js';
import TopButton from '../utils/TopButton.js';
import { throttle } from 'lodash';
import { SPRING_API_URL } from '../../config';

const StyledContainer = styled('div')`
    position: fixed;
    top: 115px;
    right: 0;
    left: 400px;
    padding: 1.5rem 3rem;
    height: 310px;
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

const CategoryContainer = styled('div')`
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
    gap: 10px;
`;

const CategoryButton = styled(Button)`
    background-color: #608796;
    color: #fff;
    &:hover {
        background-color: #FCBE71;
        color: #fff;
    }
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

const SearchButton = styled(Button)`
    background-color: #FCBE71;
    color: #fff;
    &:hover {
        background-color: #FCBE71;
        color: #fff;
    }
`;

const PageTitle = styled('h3')`
    margin-bottom: 1.5rem;
`;

const StyledLink = styled(Link)`
    margin: 1rem auto;
    text-decoration: none;
`;

const StyledButton = styled(Button)`
    margin-left: 12rem;
    background-color: #FCBE71;
    color: #fff;
    &:hover {
        background-color: #FCBE71;
        color: #fff;
    }
`;

const StyledScrollDiv = styled('div')`
    margin-top: 310px;
    margin-left: 1rem;
    width: 90%;
`;

const LoadingText = styled('div')`
    font-size: 2.5rem;
    text-align: center;
    padding: 20px 0;
    color: grey;
`;

const StyledCard = styled(Card)`
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
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
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [isLastPage, setIsLastPage] = useState(false);

    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchType, setSearchType] = useState("all");
    const [category, setCategory] = useState("전체");
    const [scrollActive, setScrollActive] = useState(false);
    const [orderBy, setOrderBy] = useState("ascending");

    const scrollHandler = useMemo(() =>
        throttle(() => {

            if (window.scrollY > 100) {
                setScrollActive(true);
            } else {
                setScrollActive(false);
            }

            const scrollHeight = document.documentElement.scrollHeight;
            const scrollTop = document.documentElement.scrollTop;
            const clientHeight = document.documentElement.clientHeight;

            if (scrollTop + clientHeight >= scrollHeight) {
                if (!isLastPage) {
                    setPage(prevPage => prevPage + 1);
                }
                window.scrollTo({ scrollTop });
                return;
            }
        }, 500), [page]);

    useEffect(() => {
        fetchData();
        window.addEventListener('scroll', scrollHandler);
        return () => {
            window.removeEventListener('scroll', scrollHandler);
        };
    }, [page, orderBy]);

    useEffect(() => {
        fetchData();
    }, [category]);

    const fetchData = () => {
        setIsLoading(true);

        let actualCategory = category;
        let actualSearchType = searchType;

        if (category === "전체") {
            actualCategory = null;
        }

        if (searchType === "all") {
            actualSearchType = null;
        }

        const apiEndPoint = orderBy === 'ascending'
            ? `${SPRING_API_URL}/moim/list-moim/asc`
            : `${SPRING_API_URL}/moim/list-moim/desc`;

        axios.post(apiEndPoint, {}, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
            },
            params: {
                page: page - 1,
                category: actualCategory,
                searchKeyword: searchKeyword,
                searchType: actualSearchType,
                orderBy: orderBy
            }
        })
            .then(response => {
                console.log(response.data);
                const moims = Object.values(response.data.items);

                setIsLastPage(response.data.lastPage);
                setData(moims);
            })
            .then(() => {
                setIsLoading(false);
            })
            .catch(error => {
                console.log("Error fetching data: ", error);
                setIsLoading(false);
            });
    };

    const handleOrderBy = () => {
        setPage(1);
        setData([]);
        setOrderBy(orderBy === "ascending" ? "descending" : "ascending");
        fetchData();
    };

    return (
        <BasicBoard>
            <StyledContainer className={scrollActive ? 'fixed' : ''}>
                <PageTitle>모임 목록</PageTitle>
                <CategoryContainer>
                    <CategoryButton variant="contained" size="large" onClick={() => setCategory("전체")}>전체</CategoryButton>
                    <CategoryButton variant="contained" size="large" onClick={() => setCategory("인문학/책")}>인문학/책</CategoryButton>
                    <CategoryButton variant="contained" size="large" onClick={() => setCategory("운동")}>운동</CategoryButton>
                    <CategoryButton variant="contained" size="large" onClick={() => setCategory("요리/맛집")}>요리/맛집</CategoryButton>
                    <CategoryButton variant="contained" size="large" onClick={() => setCategory("공예/만들기")}>공예/만들기</CategoryButton>
                    <CategoryButton variant="contained" size="large" onClick={() => setCategory("원예")}>원예</CategoryButton>
                </CategoryContainer>
                <CategoryContainer>
                    <CategoryButton variant="contained" size="large" onClick={() => setCategory("동네친구")}>동네친구</CategoryButton>
                    <CategoryButton variant="contained" size="large" onClick={() => setCategory("음악/악기")}>음악/악기</CategoryButton>
                    <CategoryButton variant="contained" size="large" onClick={() => setCategory("반려동물")}>반려동물</CategoryButton>
                    <CategoryButton variant="contained" size="large" onClick={() => setCategory("여행")}>여행</CategoryButton>
                    <CategoryButton variant="contained" size="large" onClick={() => setCategory("문화/여가")}>문화/여가</CategoryButton>
                </CategoryContainer>
                <SearchContainer>
                    <StyledTextField variant="outlined" placeholder="검색어를 입력하세요." onChange={(e) => setSearchKeyword(e.target.value)} />
                    <StyledSelect value={category} onChange={(e) => setSearchKeyword(e.target.value)}>
                        <StyledMenuItem value="all">전체</StyledMenuItem>
                        <StyledMenuItem value="title">제목</StyledMenuItem>
                        <StyledMenuItem value="content">내용</StyledMenuItem>
                        <StyledMenuItem value="nickname">작성자</StyledMenuItem>
                    </StyledSelect>
                    <SearchButton variant="contained" size="large">검색</SearchButton>
                    <SearchButton variant="contained" size="large" onClick={handleOrderBy}>
                        {orderBy === 'ascending' ? '최신순' : '등록순'}
                    </SearchButton>
                    <StyledButton component={StyledLink} to="/create-moim" variant="contained" size="large">
                        새로운 모임 만들기
                    </StyledButton>
                </SearchContainer>
            </StyledContainer>
            <StyledScrollDiv>
                {data && data.map(moim => (
                    <StyledLink to={`/view-moim/${moim.moimId}`} key={moim.moimId}>
                        <StyledCard variant="outlined">
                            <StyledCardMedia
                                component="img"
                                image={moim.moimPic && `data:image/jpeg;base64,${moim.moimPic}` || 'https://cdnimg.melon.co.kr/cm2/artistcrop/images/002/61/143/261143_20210325180240_500.jpg?61e575e8653e5920470a38d1482d7312/melon/resize/416/quality/80/optimize'}
                                alt="moim image"
                            />
                            <CardInfo>
                                <CardContent>
                                    <Typography variant="h6">{moim.moimCategory}</Typography>
                                    <Typography variant="h5">{moim.moimTitle}</Typography>
                                    <MoimInfoRow>
                                        <Typography variant="body1">{moim.moimAddr}</Typography>
                                        <Typography variant="body1">{moim.currentMoimUser || "1"}/{moim.maxMoimUser}</Typography>
                                    </MoimInfoRow>
                                    <EllipsisText variant="body1">{moim.moimContent}</EllipsisText>
                                </CardContent>
                            </CardInfo>
                        </StyledCard>
                    </StyledLink>
                ))}
                {isLoading && <LoadingText>새로운 목록을 불러오고 있어요.</LoadingText>}
                {isLastPage && !isLoading && <LoadingText>모임 목록의 마지막 페이지예요.</LoadingText>}
            </StyledScrollDiv>
            <TopButton />
        </BasicBoard>
    );
};

export default ListMoim;