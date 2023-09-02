import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CardContent, Typography, Button } from '@mui/material';
import axios from 'axios';
import TopButton from '../utils/TopButton.js';
import { throttle } from 'lodash';
import { ListMoimContainer, ListMoimCategoryContainer, ListMoimSearchContainer, ListMoimTextField, ListMoimSelect, ListMoimMenuItem, ListMoimLink, ListMoimLoadingText, ListMoimCard, ListMoimCardInfo, ListMoimMoimInfoRow, ListMoimEllipsisText, ListMoimScrollDiv, ListMoimSearchButton } from '../utils/StyledListMoim.js';
import { SPRING_API_URL } from '../../config';

const MoimAppList = () => {
    const navi = useNavigate();
    const { moimId } = useParams();

    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isLastPage, setIsLastPage] = useState(false);
    const [scrollActive, setScrollActive] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);

    const [state, setState] = useState({
        data: [],
        keyword: "",
        searchType: "all",
        appType: "all",
        orderBy: "descending",
        hoveredButton: null
    });

    const scrollHandler = useCallback(() => {
        if (window.scrollY > 100) {
            setScrollActive(true);
        } else {
            setScrollActive(false);
        }

        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight - 100 && !initialLoad) {
            if (!isLastPage && !isLoading) {
                setCurrentPage(prevPage => prevPage + 1);
            }
        }
    }, [isLastPage, isLoading]);

    const renderAppTypeButton = (label) => (
        <Button
            size="medium"
            variant={state.appType === label || state.hoveredButton === label ? 'contained' : 'outlined'}
            style={{
                backgroundColor: (state.appType === label || state.hoveredButton === label) ? '#FCBE71' : '#fff',
                borderColor: '#FCBE71',
                color: (state.appType === label || state.hoveredButton === label) ? '#fff' : '#000',
                fontWeight: state.appType === label ? 'bold' : 'normal',
            }}
            onClick={() => setState(prev => ({ ...prev, appType: label }))}
            onMouseEnter={() => setState(prev => ({ ...prev, hoveredButton: label }))}
            onMouseLeave={() => setState(prev => ({ ...prev, hoveredButton: null }))}
        >
            {label}
        </Button>
    );

    const fetchData = (page, appType) => {
        setIsLoading(true);

        console.log("currentPage", currentPage);
        console.log("appType", state.appType);

        axios.get(`${SPRING_API_URL}/appointment/${moimId}/list`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
            },
            params: {
                currentPage: currentPage - 1,
                appType: state.appType,
                keyword: state.keyword,
                searchType: state.searchType,
                orderBy: state.orderBy
            }
        })
            .then(response => {
                console.log("fetchData", response.data);
                const apps = Object.values(response.data.item.content);
                const newData = apps.filter(app => !state.data.some(d => d.appBoardId === app.appBoardId));
                setIsLastPage(response.data.lastPage);
                setState(prev => ({
                    ...prev,
                    data: [...prev.data, ...newData],
                }));
            })
            .then(() => {
                setIsLoading(false);
                setInitialLoad(false);
            })
            .catch(error => {
                console.log("Error fetching data: ", error);
            });
    };

    useEffect(() => {
        window.addEventListener('scroll', scrollHandler);
        return () => {
            window.removeEventListener('scroll', scrollHandler);
        };
    }, [scrollHandler]);

    useEffect(() => {
        fetchData(currentPage, state.appType);
    }, [currentPage, state.appType]);

    const handleOrderBy = () => {
        setCurrentPage(1);
        setState(prev => ({
            ...prev,
            data: [],
            orderBy: prev.orderBy === "ascending" ? "descending" : "ascending"
        }));
    };

    const handleSearch = () => {
        setCurrentPage(1);
        setState(prev => ({
            ...prev,
            data: []
        }));
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <>
            <ListMoimContainer className={scrollActive ? 'fixed' : ''}>
                <ListMoimCategoryContainer>
                    {renderAppTypeButton("all")}
                    {renderAppTypeButton("ONLINE")}
                    {renderAppTypeButton("OFFLINE")}
                </ListMoimCategoryContainer>
                <ListMoimSearchContainer>
                    <ListMoimTextField
                        variant="outlined"
                        placeholder="검색어를 입력하세요."
                        onChange={(e) => setState(prev => ({ ...prev, keyword: e.target.value }))}
                        onKeyDown={handleKeyDown} />
                    <ListMoimSelect value={state.searchType} displayEmpty size="large" onChange={(e) => setState(prev => ({ ...prev, searchType: e.target.value }))}>
                        <ListMoimMenuItem value="all">전체</ListMoimMenuItem>
                        <ListMoimMenuItem value="title">제목</ListMoimMenuItem>
                        <ListMoimMenuItem value="content">내용</ListMoimMenuItem>
                    </ListMoimSelect>
                    <ListMoimSearchButton variant="contained" size="large" onClick={handleSearch}>검색</ListMoimSearchButton>
                    <ListMoimSearchButton variant="contained" size="large" onClick={handleOrderBy}>
                        {state.orderBy === 'descending' ? '등록순' : '최신순'}
                    </ListMoimSearchButton>
                    <ListMoimSearchButton
                        variant="contained"
                        size="normal"
                        onClick={() => navi(`/${moimId}/create-appoint`)}>
                        만남 모집 글쓰기
                    </ListMoimSearchButton>
                </ListMoimSearchContainer>
            </ListMoimContainer>
            <ListMoimScrollDiv>
                {state.data && state.data.map(app => (
                    <ListMoimLink>
                        <ListMoimCard variant="outlined">
                            <ListMoimCardInfo>
                                <CardContent>
                                    <Typography variant="body1">{app.appType}</Typography>
                                    <Typography gutterBottom variant="h4">{app.appTitle}</Typography>
                                    <ListMoimMoimInfoRow>
                                        {app.appType === "OFFLINE" &&
                                            < Typography variant="body1">{app.appLocation}</ Typography>
                                        }
                                        <Typography variant="body1">{app.appFixedUser || "1"}/{app.maxAppUser}</Typography>
                                    </ListMoimMoimInfoRow>
                                    <ListMoimEllipsisText variant="body1">{app.appContent}</ListMoimEllipsisText>
                                </CardContent>
                            </ListMoimCardInfo>
                        </ListMoimCard>
                    </ListMoimLink>
                ))}
                {isLoading && <ListMoimLoadingText>새로운 목록을 불러오고 있어요.</ListMoimLoadingText>}
                {isLastPage && !isLoading && <ListMoimLoadingText>모임 목록의 마지막 페이지예요.</ListMoimLoadingText>}
            </ListMoimScrollDiv >
            <TopButton />
        </>
    );
};

export default MoimAppList;