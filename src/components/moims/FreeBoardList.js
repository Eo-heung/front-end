import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { StyledBasicContainer, StyledPaper, StyledContainer, Styled, StyledHead, StyledRow, StyledCell, StyledHeaderCell, StyledMainHeaderCell, StyledText } from '../utils/StyledTable';
import { stubFalse } from 'lodash';
import { SPRING_API_URL } from '../../config';
import ListPagination from '../utils/Pagination';

const FreeBoardList = ({ isMainPage = stubFalse, setActiveTab, setBoardType, setBoardId }) => {
    const navi = useNavigate();

    const { moimId } = useParams();
    console.log(moimId);

    const [boards, setBoards] = useState([]);

    useEffect(() => {
        if (!moimId || moimId == "undefined") {
            console.error("moimId is not defined.");
            return;
        }

        console.log("moimId", moimId);

        const fetchFreeBoards = async () => {
            try {
                const response = await axios.post(`${SPRING_API_URL}/board/${moimId}/free-board`, {}, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                    }
                });
                setBoards(response.data.content);
                setBoardType(response.data.content.boardType);
                console.log("하이하이", response.data.content);
            } catch (err) {
                console.error("Error fetching free boards", err);
            }
        };

        fetchFreeBoards();
    }, [moimId]);

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
                        <ListPagination></ListPagination>
                    ) : null}
                </StyledContainer>
            </StyledPaper>
        </StyledBasicContainer>
    );
};

export default FreeBoardList;