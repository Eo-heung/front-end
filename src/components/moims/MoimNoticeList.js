import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { StyledBasicContainer, StyledPaper, StyledContainer, Styled, StyledHead, StyledRow, StyledCell, StyledHeaderCell, StyledMainHeaderCell, StyledText } from '../utils/StyledTable';
import noticeData from '../data/noticeData';
import { stubFalse } from 'lodash';

const MoimNoticeList = ({ moimId, isMainPage = stubFalse, onNoticeListClick }) => {
    const navi = useNavigate();

    const [notices, setNotices] = useState([]);

    // useEffect(() => {
    //     const fetchNotices = async () => {
    //         try {
    //             const response = await axios.get(`http://localhost:9000/get-moim-notice-list/${moimId}`);
    //             setNotices(response.data);
    //         } catch (err) {
    //             console.error("Error fetching moim notices", err);
    //         }
    //     };

    //     fetchNotices();
    // }, [moimId]);

    useEffect(() => {
        setNotices(noticeData);
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
                                        <StyledText onClick={() => onNoticeListClick("notice")}>
                                            공지 게시판
                                        </StyledText>
                                    </StyledMainHeaderCell>
                                </StyledRow>
                            ) : (
                                <StyledRow>
                                    <StyledHeaderCell style={{ width: "650px", fontSize: "1.2rem" }}>공지 제목</StyledHeaderCell>
                                    <StyledHeaderCell style={{ width: "200px" }}>작성자</StyledHeaderCell>
                                    <StyledHeaderCell style={{ width: "170px" }}>작성일</StyledHeaderCell>
                                    <StyledHeaderCell style={{ width: "80px" }}>조회</StyledHeaderCell>
                                </StyledRow>
                            )}
                        </StyledHead>
                        <tbody>
                            {notices.slice(0, isMainPage ? 5 : notices.length).map((notice) => (
                                <StyledRow key={notice.id}>
                                    <StyledCell style={{ width: "650px" }}>{notice.title}</StyledCell>
                                    <StyledCell style={{ width: "200px" }}>{notice.moimNickname}</StyledCell>
                                    <StyledCell style={{ width: "170px" }}>{notice.date}</StyledCell>
                                    <StyledCell style={{ width: "80px" }}>{notice.views}</StyledCell>
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