import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { StyledBasicContainer, StyledPaper, StyledContainer, Styled, StyledHead, StyledRow, StyledCell, StyledHeaderCell, StyledMainHeaderCell, StyledText, StyledFooter } from '../utils/StyledTable';
import { ListMoimSearchContainer, ListMoimTextField, ListMoimSelect, ListMoimMenuItem, ListMoimSearchButton } from '../utils/StyledListMoim';
import { SPRING_API_URL } from '../../config';
import ListPagination from '../utils/Pagination';

const MoimNoticeList = ({ setActiveTab }) => {
    const navi = useNavigate();
    const location = useLocation();

    const { moimId } = useParams();
    const [userRole, setUserRole] = useState({ isMember: false, isLeader: false });

    const [notices, setNotices] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [keyword, setKeyword] = useState("");
    const [searchType, setSearchType] = useState("all");
    const [orderBy, setOrderBy] = useState("descending");

    const [isMainPage, setIsMainPage] = useState(
        location.pathname.split("/").pop() === "" || location.pathname.split("/").pop() === "moim-board"
    );

    useEffect(() => {
        setIsMainPage(
            location.pathname.split("/").pop() === "" || location.pathname.split("/").pop() === "moim-board"
        );
    }, [location.pathname]);

    useEffect(() => {
        const verifyUserRole = async () => {
            try {
                const response = await axios.post(`${SPRING_API_URL}/board/${moimId}/verify-role`, {}, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                    }
                });

                setUserRole(response.data.item);
            } catch (err) {
                console.error("Error verifying user role", err);
            }
        };

        verifyUserRole();
    }, [moimId]);

    const fetchNotices = async (currentPage) => {
        try {
            const response = await axios.post(`${SPRING_API_URL}/board/${moimId}/notice-board`, {}, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                },
                params: {
                    currentPage: currentPage - 1,
                    keyword: keyword,
                    searchType: searchType,
                    orderBy: orderBy
                }
            });
            setNotices(response.data.item.content);
            setTotalPages(response.data.paginationInfo.totalPages);
        } catch (err) {
            console.error("Error fetching moim notices", err);
        }
    };

    useEffect(() => {
        if (!moimId || moimId == "undefined") {
            console.error("moimId is not defined.");
            return;
        }

        fetchNotices(currentPage);
    }, [moimId, currentPage, keyword, searchType, orderBy]);

    const handleSearch = () => {
        setCurrentPage(1);
        fetchNotices();
        console.log("검색", notices);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const onPageChange = (e, page) => {
        console.log("Page changed to: ", page);
        setCurrentPage(page);
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
                                        <StyledText onClick={() => navi(`/${moimId}/moim-board/notice-board`)}>
                                            공지 게시판
                                        </StyledText>
                                    </StyledMainHeaderCell>
                                    <StyledMainHeaderCell>
                                        {userRole.isLeader ? (
                                            <StyledText
                                                style={{ fontSize: "1rem" }}
                                                onClick={() => navi(`/${moimId}/create-board`, { state: { boardType: "NOTICE" } })}
                                            >
                                                글쓰기
                                            </StyledText>
                                        ) : null}
                                    </StyledMainHeaderCell>
                                </StyledRow>
                            ) : (
                                <StyledRow>
                                    <StyledHeaderCell style={{ width: "650px", fontSize: "1.2rem" }}>공지 목록</StyledHeaderCell>
                                    <StyledHeaderCell style={{ width: "180px" }}>작성자</StyledHeaderCell>
                                    <StyledHeaderCell style={{ width: "170px" }}>작성일</StyledHeaderCell>
                                </StyledRow>
                            )}
                        </StyledHead>
                        <tbody>
                            {Array.isArray(notices) && notices.slice(0, isMainPage ? 5 : notices.length).map((notice) => (
                                <StyledRow key={notice.boardId}>
                                    <StyledCell
                                        style={{ width: "650px", cursor: "pointer" }}
                                        onClick={() => {
                                            navi(`/${moimId}/moim-board/notice-board/${notice.boardId}`);
                                        }}
                                    >
                                        {notice.boardTitle}
                                    </StyledCell>
                                    <StyledCell style={{ width: "180px" }}>{notice.userName}</StyledCell>
                                    <StyledCell style={{ width: "170px" }}>{notice.boardRegdate.slice(0, 10)}</StyledCell>
                                </StyledRow>
                            ))}
                        </tbody>
                    </Styled>
                    {!isMainPage ? (
                        <StyledFooter>
                            <ListPagination
                                count={totalPages}
                                page={currentPage}
                                onChange={onPageChange}
                            ></ListPagination>
                            <ListMoimSearchContainer>
                                {userRole.isLeader ? (
                                    <ListMoimTextField
                                        style={{ marginLeft: "5rem" }}
                                        size="small"
                                        variant="outlined"
                                        placeholder="검색어를 입력하세요."
                                        onChange={(e) => setKeyword(e.target.value)}
                                        onKeyDown={handleKeyDown} />
                                ) : (
                                    <ListMoimTextField
                                        style={{ marginLeft: "10rem" }}
                                        size="small"
                                        variant="outlined"
                                        placeholder="검색어를 입력하세요."
                                        onChange={(e) => setKeyword(e.target.value)}
                                        onKeyDown={handleKeyDown} />
                                )}
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
                                {userRole.isLeader ? (
                                    <ListMoimSearchButton
                                        variant="contained"
                                        size="normal"
                                        onClick={() => navi(`/${moimId}/create-board`, { state: { boardType: "NOTICE" } })}>
                                        글쓰기
                                    </ListMoimSearchButton>
                                ) : (
                                    <ListMoimSearchButton
                                        variant="contained"
                                        size="normal"
                                        style={{ display: "none" }}
                                        onClick={() => navi(`/${moimId}/create-board`, { state: { boardType: "NOTICE" } })}>
                                        글쓰기
                                    </ListMoimSearchButton>
                                )}
                            </ListMoimSearchContainer>
                        </StyledFooter>
                    ) : null}
                </StyledContainer>
            </StyledPaper>
        </StyledBasicContainer>
    );
};

export default MoimNoticeList;