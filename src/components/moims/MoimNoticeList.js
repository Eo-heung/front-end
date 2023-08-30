import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { StyledBasicContainer, StyledPaper, StyledContainer, Styled, StyledHead, StyledRow, StyledCell, StyledHeaderCell, StyledMainHeaderCell, StyledText } from '../utils/StyledTable';
import { stubFalse } from 'lodash';
import { SPRING_API_URL } from '../../config';

const MoimNoticeList = ({ isMainPage = stubFalse, setActiveTab, setBoardType, setBoardId }) => {
    const navi = useNavigate();

    const { moimId } = useParams();

    const [notices, setNotices] = useState([]);

    useEffect(() => {
        if (!moimId || moimId == "undefined") {
            console.error("moimId is not defined.");
            return;
        }

        const fetchNotices = async () => {
            try {
                const response = await axios.post(`${SPRING_API_URL}/board/${moimId}/notice-board`, {}, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                    }
                });
                setNotices(response.data.content);
                setBoardType(response.data.content.boardType);
            } catch (err) {
                console.error("Error fetching moim notices", err);
            }
        };

        fetchNotices();
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
                                        <StyledText onClick={() => setActiveTab("공지 게시판")}>
                                            공지 게시판
                                        </StyledText>
                                    </StyledMainHeaderCell>
                                    <StyledMainHeaderCell>
                                        <StyledText
                                            style={{ fontSize: "1rem" }}
                                            onClick={() => navi(`/${moimId}/create-board`, { state: { boardType: "NOTICE" } })}
                                        >
                                            글쓰기
                                        </StyledText>
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
                </StyledContainer>
            </StyledPaper>
        </StyledBasicContainer>
    );
};

export default MoimNoticeList;