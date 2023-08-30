import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { StyledBasicContainer, StyledPaper, StyledContainer, Styled, StyledHead, StyledRow, StyledCell, StyledHeaderCell, StyledMainHeaderCell, StyledText, StyledFooter } from '../utils/StyledTable';
import { stubFalse } from 'lodash';
import { SPRING_API_URL } from '../../config';
import ListPagination from '../utils/Pagination';
import { ListMoimSearchContainer, ListMoimTextField, ListMoimSelect, ListMoimMenuItem, ListMoimSearchButton } from '../utils/StyledListMoim';

const FreeBoardList = ({ isMainPage = stubFalse, setActiveTab, setBoardType, setBoardId }) => {
    const navi = useNavigate();

    const { moimId } = useParams();

    const [boards, setBoards] = useState([]);

    const [page, setPage] = useState(1);
    const [isLastPage, setIsLastPage] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [searchType, setSearchType] = useState("all");
    const [orderBy, setOrderBy] = useState("descending");

    const fetchFreeBoards = async () => {
        try {
            const response = await axios.post(`${SPRING_API_URL}/board/${moimId}/free-board`, {}, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                },
                params: {
                    page: page - 1,
                    keyword: keyword,
                    searchType: searchType,
                    orderBy: orderBy
                }
            });

            setBoards(response.data.content);
            setBoardType(response.data.content.boardType);
        } catch (err) {
            console.error("Error fetching free boards", err);
        }
    };

    useEffect(() => {
        if (!moimId || moimId == "undefined") {
            console.error("moimId is not defined.");
            return;
        }

        fetchFreeBoards();
    }, [moimId]);

    const handleSearch = () => {
        setPage(1);
        setBoards([]);
        fetchFreeBoards();
        console.log("검색", boards);
    };

    return (
        <StyledBasicContainer>
            <StyledPaper>
                <StyledContainer>
                    <Styled>
                        <StyledHead>
                            {isMainPage ? (
                                <StyledRow>
                                    <StyledMainHeaderCell>
                                        <StyledText onClick={() => setActiveTab("자유 게시판")}>
                                            자유 게시판
                                        </StyledText>
                                    </StyledMainHeaderCell>
                                    <StyledMainHeaderCell>
                                        <StyledText
                                            style={{ fontSize: "1rem" }}
                                            onClick={() => navi(`/${moimId}/create-board`, { state: { boardType: "FREE" } })}
                                        >
                                            글쓰기
                                        </StyledText>
                                    </StyledMainHeaderCell>
                                </StyledRow>
                            ) : (
                                <StyledRow>
                                    <StyledHeaderCell style={{ width: "650px", fontSize: "1.2rem" }}>제목</StyledHeaderCell>
                                    <StyledHeaderCell style={{ width: "180px" }}>작성자</StyledHeaderCell>
                                    <StyledHeaderCell style={{ width: "170px" }}>작성일</StyledHeaderCell>
                                </StyledRow>
                            )}
                        </StyledHead>
                        <tbody>
                            {Array.isArray(boards) && boards.slice(0, isMainPage ? 5 : boards.length).map((board) => (
                                <StyledRow key={board.boardId}>
                                    <StyledCell
                                        style={{ width: "650px", cursor: "pointer" }}
                                        onClick={() => {
                                            setActiveTab("게시글");
                                            setBoardType("FREE");
                                            setBoardId(board.boardId);
                                        }}
                                    >
                                        {board.boardTitle}
                                    </StyledCell>
                                    <StyledCell style={{ width: "180px" }}>{board.userName}</StyledCell>
                                    <StyledCell style={{ width: "170px" }}>{board.boardRegdate.slice(0, 10)}</StyledCell>
                                </StyledRow>
                            ))}
                        </tbody>
                    </Styled>
                    {!isMainPage ? (
                        <StyledFooter>
                            <ListPagination></ListPagination>
                            <ListMoimSearchContainer>
                                <ListMoimTextField
                                    style={{ marginLeft: "5rem" }}
                                    size="small"
                                    variant="outlined"
                                    placeholder="검색어를 입력하세요."
                                    onChange={(e) => setKeyword(e.target.value)} />
                                <ListMoimSelect
                                    value={searchType}
                                    displayEmpty
                                    size="small"
                                    onChange={(e) => setSearchType(e.target.value)}>
                                    <ListMoimMenuItem value="all">전체</ListMoimMenuItem>
                                    <ListMoimMenuItem value="title">제목</ListMoimMenuItem>
                                    <ListMoimMenuItem value="content">내용</ListMoimMenuItem>
                                    <ListMoimMenuItem value="nickname">작성자</ListMoimMenuItem>
                                </ListMoimSelect>
                                <ListMoimSearchButton variant="contained" size="normal" onClick={handleSearch}>검색</ListMoimSearchButton>
                                <ListMoimSearchButton
                                    variant="contained"
                                    size="normal"
                                    onClick={() => navi(`/${moimId}/create-board`, { state: { boardType: "FREE" } })}>
                                    글쓰기
                                </ListMoimSearchButton>
                            </ListMoimSearchContainer>
                        </StyledFooter>
                    ) : null}
                </StyledContainer>
            </StyledPaper>
        </StyledBasicContainer>
    );
};

export default FreeBoardList;