import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { StyledBasicContainer, StyledPaper, StyledContainer, Styled, StyledHead, StyledRow, StyledCell, StyledHeaderCell, StyledMainHeaderCell, StyledText, StyledFooter } from '../utils/StyledTable';
import { stubFalse } from 'lodash';
import { SPRING_API_URL } from '../../config';
import ListPagination from '../utils/Pagination';
import { ListMoimSearchContainer, ListMoimTextField, ListMoimSelect, ListMoimMenuItem, ListMoimSearchButton } from '../utils/StyledListMoim';

const MoimNoticeList = ({ isMainPage = stubFalse, setActiveTab, setBoardType, setBoardId }) => {
    const navi = useNavigate();

    const { moimId } = useParams();
    const [userRole, setUserRole] = useState({ isMember: false, isLeader: false });

    const [notices, setNotices] = useState([]);

    const [page, setPage] = useState(1);
    const [isLastPage, setIsLastPage] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [searchType, setSearchType] = useState("all");
    const [orderBy, setOrderBy] = useState("descending");

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

    const fetchNotices = async () => {
        try {
            const response = await axios.post(`${SPRING_API_URL}/board/${moimId}/notice-board`, {}, {
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
            setNotices(response.data.content);
            setBoardType(response.data.content.boardType);
        } catch (err) {
            console.error("Error fetching moim notices", err);
        }
    };

    useEffect(() => {
        if (!moimId || moimId == "undefined") {
            console.error("moimId is not defined.");
            return;
        }

        fetchNotices();
    }, [moimId]);

    const handleSearch = () => {
        setPage(1);
        setNotices([]);
        fetchNotices();
        console.log("검색", notices);
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
                                        <StyledText onClick={() => setActiveTab("공지 게시판")}>
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
                                    <StyledHeaderCell style={{ width: "650px", fontSize: "1.2rem" }}>공지 제목</StyledHeaderCell>
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
                                            setActiveTab("게시글");
                                            setBoardType("NOTICE");
                                            setBoardId(notice.boardId);
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
                            <ListPagination></ListPagination>
                            <ListMoimSearchContainer>
                                {userRole.isLeader ? (
                                    <ListMoimTextField
                                        style={{ marginLeft: "5rem" }}
                                        size="small"
                                        variant="outlined"
                                        placeholder="검색어를 입력하세요."
                                        onChange={(e) => setKeyword(e.target.value)} />
                                ) : (
                                    <ListMoimTextField
                                        style={{ marginLeft: "10rem" }}
                                        size="small"
                                        variant="outlined"
                                        placeholder="검색어를 입력하세요."
                                        onChange={(e) => setKeyword(e.target.value)} />
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