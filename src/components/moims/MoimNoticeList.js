import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { StyledBasicContainer, StyledPaper, StyledContainer, Styled, StyledHead, StyledRow, StyledCell, StyledHeaderCell, StyledMainHeaderCell, StyledText } from '../utils/StyledTable';
import noticeData from '../data/noticeData';
import { stubFalse } from 'lodash';

const MoimNoticeList = ({ moimId, isMainPage = stubFalse, onNoticeListClick, fetchBoardDetail }) => {
    const navi = useNavigate();

    const [notices, setNotices] = useState([]);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await axios.post(`http://localhost:9000/board/${moimId}/notice-board`, {}, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                    }
                });
                setNotices(response.data);
            } catch (err) {
                console.error("Error fetching moim notices", err);
            }
        };

        fetchNotices();
    }, [moimId]);

    // useEffect(() => {
    //     setNotices(noticeData);
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
                                        <StyledText onClick={() => onNoticeListClick("notice")}>
                                            공지 게시판
                                        </StyledText>
                                    </StyledMainHeaderCell>
                                </StyledRow>
                            ) : (
                                <StyledRow>
                                    <StyledHeaderCell style={{ width: "700px", fontSize: "1.2rem" }}>공지 제목</StyledHeaderCell>
                                    <StyledHeaderCell style={{ width: "150px" }}>작성자</StyledHeaderCell>
                                    <StyledHeaderCell style={{ width: "170px" }}>작성일</StyledHeaderCell>
                                </StyledRow>
                            )}
                        </StyledHead>
                        <tbody>
                            {notices.slice(0, isMainPage ? 5 : notices.length).map((notice) => (
                                <StyledRow key={notice.boardId}>
                                    <StyledCell
                                        style={{ width: "700px", cursor: "pointer" }}
                                        onClick={fetchBoardDetail}
                                    >
                                        {notice.boardTitle}
                                    </StyledCell>
                                    <StyledCell style={{ width: "150px" }}>{notice.moimNickname}</StyledCell>
                                    <StyledCell style={{ width: "170px" }}>{notice.boardRegdate}</StyledCell>
                                </StyledRow>
                            ))}
                        </tbody>
                    </Styled>
                </StyledContainer>
            </StyledPaper>
        </StyledBasicContainer>
    );
};

export default MoimNoticeList;