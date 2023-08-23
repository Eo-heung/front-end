import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { styled } from '@mui/system';
import { Button, Typography, Box, Card, CardContent, CardMedia, TextField, Select, MenuItem } from '@mui/material';
import { grey } from '@mui/material/colors';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import BasicBoard from '../utils/BasicBoard.js';
import TopButton from '../utils/TopButton.js';

const StyledContainer = styled('div')`
    position: fixed;
    top: 115px;
    right: 0;
    left: 400px;
    padding: 1.5rem 3rem;
    height: 180px;
    width: 90%;
    z-index: 1001;
    background-color: #fff;
    &.fixed {
        position: fixed;
        padding: 1.5rem 3rem;
        width: 90%;
        z-index: 100;
    }
    @media (max-width: 992px) {
        left: 0;
    }
`;

const SearchContainer = styled('div')`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const StyledTextField = styled(TextField)`
    width: 280px;
    & .MuiOutlinedInput-root {
        &:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline {
            border-color: #FCBE71;
        }
        &.Mui-focused .MuiInputLabel-root {
            color: #FCBE71;
        }
    }
`;

const SearchButton = styled(Button)`
    background-color: #FCBE71;
    color: #fff;
    &:hover {
        background-color: #FCBE71;
        color: #fff;
    }
`;

const StyledCardMedia = styled(CardMedia)`
    height: 160px;
    width: 160px;
    @media (max-width: 992px) {
        display: none;
    }
`;

const PageTitle = styled('h3')`
    margin-bottom: 1.5rem;
`;

const CardLink = styled(Link)`
    margin: 1rem auto;
    text-decoration: none;
`;

const StyledCard = styled(Card)`
    display: flex;
    gap: 0.5rem;
    padding: 1.5rem;
    width: 100%;
    background-color: #fff;
    color: #000;
    cursor: pointer;
`;

const StyledCardContent = styled(CardContent)`
    width: 400px;
`;

const ApplicantInfoBox = styled(Box)`
    display: flex;
    alignItems: center;
    margin: 0.5rem;
`;

const ApplicantTitle = styled('h5')`
    width: 110px;
`;

const ApplicantInfo = styled(Typography)`
    color: ${grey[600]};
`;

const ButtonRow = styled('div')`
    display: flex;
    justify-content: center;
    margin: auto;
    gap: 30px;
`;

const StyledButton = styled(Button)`
    background-color: #FCBE71;
    &:hover {
        background-color: #FCBE71;
        color: #fff;
    }
`;

const ListAcceptMoim = () => {
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 3;

    const { moimId } = useParams();

    const [moimData, setMoimData] = useState("");
    const [applicantList, setApplicantList] = useState([]);
    const [scrollActive, setScrollActive] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [sortOrder, setSortOrder] = useState("ascending");

    const scrollHandler = () => {
        if (window.scrollY > 100) {
            setScrollActive(true);
        } else {
            setScrollActive(false);
        }
    };

    const sortedApplicants = useMemo(() => {
        if (sortOrder === 'ascending') {
            return [...applicantList].sort((a, b) => a.moimRegId - b.moimRegId);
        } else {
            return [...applicantList].sort((a, b) => b.moimRegId - a.moimRegId);
        }
    }, [applicantList, sortOrder]);

    const toggleSortOrder = () => {
        setSortOrder(prevOrder => (prevOrder === 'ascending' ? 'descending' : 'ascending'));
    };

    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        }
    }, []);

    const fetchMoimData = async () => {
        try {
            const response = await axios.get(`http://localhost:9000/moim/view-moim/${moimId}`);
            const data = response.data.item.moimDTO;

            if (isMounted.current) {
                setMoimData({
                    moimTitle: data.moimTitle,
                    userId: data.userId,
                    moimId: data.moimId
                });
            }

        } catch (e) {
            console.error("Error fetching moim data", e);
        }
    };

    const fetchApplicantList = async (moimId) => {
        try {
            const response = await axios.post(`http://localhost:9000/moimReg/get-applicant-list/${moimId}`, {}, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                }
            });

            if (response.data) {
                return response.data;
            }
            return [];
        } catch (e) {
            console.error("Error fetching applicant list data", e);
            return [];
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchMoimData();
            const applicantsFromServer = await fetchApplicantList(moimId);
            const waitingApplicants = applicantsFromServer.filter(applicant => applicant.regStatus === 'WAITING');
            setApplicantList(waitingApplicants);
        };

        fetchData();

        window.addEventListener("scroll", scrollHandler);

        return () => {
            window.removeEventListener("scroll", scrollHandler);
        }
    }, [moimId]);

    console.log(applicantList);

    const handleAcceptance = async (e, moimRegId, decision) => {
        e.preventDefault();

        const nowStatus = decision === "accepted" ? "APPROVED" : "REJECTED";
        const alertMessage = decision === "accepted" ? "가입 신청을 수락했어요." : "가입 신청을 거절했어요.";

        try {
            const applicant = applicantList.find(app => app.moimRegId === moimRegId);

            if (!applicant) {
                console.error("해당 moimRegId와 일치하는 신청서를 찾지 못했습니다.");
                return;
            }

            const payload = {
                applicantUserId: applicant.applicantUserId,
                organizerUserId: moimData.userId
            };
            console.log(payload);

            const response = await axios.post(`http://localhost:9000/moimReg/${moimRegId}/applicant-state?nowStatus=${nowStatus}`, payload, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                }
            });

            if (response.data.statusCode === 200) {
                alert(alertMessage);
                const updatedApplicants = applicantList.filter(applicant => applicant.moimRegId !== moimRegId);
                setApplicantList(updatedApplicants);
            }
        } catch (err) {
            console.error("Error occurred handling acceptance: ", err);
            alert("신청 처리에 실패했어요.");
        }
    };

    return (
        <BasicBoard>
            <StyledContainer className={scrollActive ? 'fixed' : ''}>
                <PageTitle>{`${moimData.moimTitle} 모임의 신청자 목록`}</PageTitle>
                <SearchContainer>
                    <StyledTextField variant="outlined" placeholder="검색할 닉네임을 입력하세요." onChange={(e) => setSearchKeyword(e.target.value)} />
                    <SearchButton variant="contained" size="large">검색</SearchButton>
                    <SearchButton variant="contained" size="large" onClick={toggleSortOrder}>
                        {sortOrder === 'ascending' ? '최신순' : '신청순'}
                    </SearchButton>
                </SearchContainer>
            </StyledContainer>
            <div style={{ marginTop: "180px", width: "90%" }}>
                <InfiniteScroll
                    dataLength={applicantList ? applicantList.length : 0}
                    next={fetchApplicantList}
                    hasMore={hasMore}
                >
                    {applicantList && applicantList.map(applicant => (
                        <CardLink to={`/accept-moim/${moimData.moimId}/${applicant.moimRegId}`} key={applicant.applicantUserId}>
                            <StyledCard variant="outlined">
                                <StyledCardMedia
                                    component="img"
                                    image={applicant.moimProfile && `data:image/jpeg;base64,${applicant.moimProfile}`}
                                    alt="모임 프로필 사진"
                                />
                                <StyledCardContent>
                                    <ApplicantInfoBox border={0} my={0}>
                                        <ApplicantTitle>신청자</ApplicantTitle>
                                        <ApplicantInfo variant="body1">{applicant.applicantUserNickname}</ApplicantInfo>
                                    </ApplicantInfoBox>
                                    <ApplicantInfoBox border={0} my={2}>
                                        <ApplicantTitle>신청일</ApplicantTitle>
                                        <ApplicantInfo variant="body1">
                                            {applicant.applicationDate.slice(0, 10)}
                                        </ApplicantInfo>
                                    </ApplicantInfoBox>
                                    <ApplicantInfoBox border={0} my={2}>
                                        <ApplicantTitle>신청 상태</ApplicantTitle>
                                        <ApplicantInfo variant="body1">
                                            {applicant.regStatus === "WAITING" ? "가입 대기" : applicant.regStatus}
                                        </ApplicantInfo>
                                    </ApplicantInfoBox>
                                </StyledCardContent>
                                <ButtonRow>
                                    <StyledButton onClick={(e) => handleAcceptance(e, applicant.moimRegId, "accepted")} variant="contained" size="large">수락</StyledButton>
                                    <StyledButton onClick={(e) => handleAcceptance(e, applicant.moimRegId, "declined")} variant="contained" size="large">거절</StyledButton>
                                </ButtonRow>
                            </StyledCard>
                        </CardLink>
                    ))}
                </InfiniteScroll>
            </div>
            <TopButton />
        </BasicBoard>
    );
};

export default ListAcceptMoim;