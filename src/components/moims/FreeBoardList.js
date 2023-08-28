import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { StyledBasicContainer, StyledPaper, StyledContainer, Styled, StyledHead, StyledRow, StyledCell, StyledHeaderCell, StyledMainHeaderCell, StyledText } from '../utils/StyledTable';
import boardData from '../data/boardData';
import { stubFalse } from 'lodash';

const FreeBoardList = ({ moimId, isMainPage = stubFalse, onFreeListClick }) => {
    const navi = useNavigate();

    const [boards, setBoards] = useState([]);

    // useEffect(() => {
    //     const fetchNotices = async () => {
    //         try {
    //             const response = await axios.get(`http://localhost:9000/get-free-board-list/${moimId}`);
    //             setBoards(response.data);
    //         } catch (err) {
    //             console.error("Error fetching free boards", err);
    //         }
    //     };

    //     fetchNotices();
    // }, [moimId]);

    useEffect(() => {
        setBoards(boardData);
    }, []);

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
                                        <StyledText style={{ fontSize: "1rem" }}>
                                            글쓰기
                                        </StyledText>
                                    </StyledMainHeaderCell>
                                </StyledRow>
                            ) : (
                                <StyledRow>
                                    <StyledHeaderCell style={{ width: "650px", fontSize: "1.2rem" }}>제목</StyledHeaderCell>
                                    <StyledHeaderCell style={{ width: "200px" }}>작성자</StyledHeaderCell>
                                    <StyledHeaderCell style={{ width: "170px" }}>작성일</StyledHeaderCell>
                                    <StyledHeaderCell style={{ width: "80px" }}>조회</StyledHeaderCell>
                                </StyledRow>
                            )}
                        </StyledHead>
                        <tbody>
                            {boards.slice(0, isMainPage ? 5 : boards.length).map((board) => (
                                <StyledRow key={board.id}>
                                    <StyledCell style={{ width: "650px" }}>{board.title}</StyledCell>
                                    <StyledCell style={{ width: "200px" }}>{board.userNickname}</StyledCell>
                                    <StyledCell style={{ width: "170px" }}>{board.date}</StyledCell>
                                    <StyledCell style={{ width: "70px" }}>{board.views}</StyledCell>
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