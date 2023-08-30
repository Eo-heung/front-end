import React, { useState, useEffect, useMemo } from 'react';
import { CardContent, Typography, Button } from '@mui/material';
import axios from 'axios';
import TopButton from '../utils/TopButton.js';
import { styled } from '@mui/system';
import { throttle } from 'lodash';
import { ListMoimSearchContainer, ListMoimTextField, ListMoimSearchButton, ListMoimLink, ListMoimLoadingText, ListMoimCard, ListMoimCardMedia, ListMoimCardInfo, ListMoimMoimInfoRow, ListMoimEllipsisText, ListMoimStyledLink } from '../utils/StyledListMoim.js';
import { SPRING_API_URL } from '../../config';

export const MyMoimContainer = styled('div')`
    position: fixed;
    top: 160px;
    right: 0;
    left: 350px;
    padding: 1rem 1.5rem;
    height: 90px;
    width: 100%;
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

export const MymoimScrollDiv = styled('div')`
    margin-top: 75px;
    margin-left: 1rem;
    width: 100%;
`;

const Mymoim = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [isLastPage, setIsLastPage] = useState(false);

    const [keyword, setKeyword] = useState("");
    const [scrollActive, setScrollActive] = useState(false);
    const [orderBy, setOrderBy] = useState("descending");

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

            if (scrollTop + clientHeight >= scrollHeight / 2) {
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

    const fetchData = () => {
        setIsLoading(true);

        axios.post(`${SPRING_API_URL}/moim/my-moim-list`, {}, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
            },
            params: {
                page: page - 1,
                keyword: keyword,
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

    const handleSearch = () => {
        setPage(1);
        setData([]);
        fetchData();
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <>
            <MyMoimContainer className={scrollActive ? 'fixed' : ''}>
                <ListMoimSearchContainer>
                    <ListMoimTextField
                        variant="outlined"
                        placeholder="검색어를 입력하세요."
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={handleKeyDown} />
                    <ListMoimSearchButton variant="contained" size="large" onClick={handleSearch}>검색</ListMoimSearchButton>
                    <ListMoimSearchButton variant="contained" size="large" onClick={handleOrderBy}>
                        {orderBy === 'ascending' ? '최신순' : '등록순'}
                    </ListMoimSearchButton>
                </ListMoimSearchContainer>
            </MyMoimContainer>
            <MymoimScrollDiv>
                {data && data.map(moim => (
                    <ListMoimLink to={`/${moim.moimId}/moim-board`} key={moim.moimId}>
                        <ListMoimCard variant="outlined">
                            <ListMoimCardMedia
                                component="img"
                                image={moim.moimPic && `data:image/jpeg;base64,${moim.moimPic}` || 'https://cdnimg.melon.co.kr/cm2/artistcrop/images/002/61/143/261143_20210325180240_500.jpg?61e575e8653e5920470a38d1482d7312/melon/resize/416/quality/80/optimize'}
                                alt="moim image"
                            />
                            <ListMoimCardInfo>
                                <CardContent>
                                    <Typography variant="body1">{moim.moimCategory}</Typography>
                                    <Typography gutterBottom variant="h4">{moim.moimTitle}</Typography>
                                    <ListMoimMoimInfoRow>
                                        <Typography variant="body1">{moim.moimAddr}</Typography>
                                        <Typography variant="body1">{moim.currentMoimUser || "1"}/{moim.maxMoimUser}</Typography>
                                    </ListMoimMoimInfoRow>
                                    <ListMoimEllipsisText variant="body1">{moim.moimContent}</ListMoimEllipsisText>
                                </CardContent>
                            </ListMoimCardInfo>
                        </ListMoimCard>
                    </ListMoimLink>
                ))}
                {isLoading && <ListMoimLoadingText>새로운 목록을 불러오고 있어요.</ListMoimLoadingText>}
                {isLastPage && !isLoading && <ListMoimLoadingText>모임 목록의 마지막 페이지예요.</ListMoimLoadingText>}
            </MymoimScrollDiv>
            <TopButton />
        </>
    );
};

export default Mymoim;