import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { StyledBasicContainer, StyledPaper, StyledContainer, Styled, StyledHead, StyledRow, StyledCell, StyledHeaderCell, StyledMainHeaderCell, StyledText } from '../utils/StyledTable';
import boardData from '../data/boardData';
import { stubFalse } from 'lodash';

const FreeBoardList = ({ moimId, isMainPage = stubFalse, onFreeListClick, fetchBoardDetail, setActiveContent, setBoardType }) => {
    const navi = useNavigate();

    const [boards, setBoards] = useState([]);

    useEffect(() => {
        const fetchFreeBoards = async () => {
            try {
                const response = await axios.post(`http://localhost:9000/board/${moimId}/free-board`, {}, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                    }
                });
                setBoards(response.data);
            } catch (err) {
                console.error("Error fetching free boards", err);
            }
        };

        fetchFreeBoards();
    }, [moimId]);

    // useEffect(() => {
    //     setBoards(boardData);
    // }, []);

    return (
        <StyledBasicContainer>
            <StyledPaper>
                <StyledContainer>
                    <Styled>
                        <StyledHead>
                            {isMainPage ? (
                                <StyledRow>
                                    <StyledMainHeaderCell>
                                        <StyledText onClick={() => onFreeListClick("free")}>
                                            자유 게시판
                                        </StyledText>
                                    </StyledMainHeaderCell>
                                    <StyledMainHeaderCell>
                                        <StyledText
                                            style={{ fontSize: "1rem" }}
                                            onClick={() => {
                                                setActiveContent("write");
                                                setBoardType("FREE");
                                            }}
                                        >
                                            글쓰기
                                        </StyledText>
                                    </StyledMainHeaderCell>
                                </StyledRow>
                            ) : (
                                <StyledRow>
                                    <StyledHeaderCell style={{ width: "700px", fontSize: "1.2rem" }}>제목</StyledHeaderCell>
                                    <StyledHeaderCell style={{ width: "150px" }}>작성자</StyledHeaderCell>
                                    <StyledHeaderCell style={{ width: "170px" }}>작성일</StyledHeaderCell>
                                </StyledRow>
                            )}
                        </StyledHead>
                        <tbody>
                            {boards.slice(0, isMainPage ? 5 : boards.length).map((board) => (
                                <StyledRow key={board.boardId}>
                                    <StyledCell
                                        style={{ width: "700px", cursor: "pointer" }}
                                        onClick={fetchBoardDetail}
                                    >
                                        {board.boardTitle}
                                    </StyledCell>
                                    <StyledCell style={{ width: "150px" }}>{board.userNickname}</StyledCell>
                                    <StyledCell style={{ width: "170px" }}>{board.boardRegdate}</StyledCell>
                                </StyledRow>
                            ))}
                        </tbody>
                    </Styled>
                </StyledContainer>
            </StyledPaper>
        </StyledBasicContainer>
    );
};

export default FreeBoardList;