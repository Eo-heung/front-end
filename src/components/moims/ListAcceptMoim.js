import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { styled } from '@mui/system';
import { Button, Typography, Box, Card, CardContent, CardMedia, TextField, Select, MenuItem } from '@mui/material';
import { grey } from '@mui/material/colors';
import axios from 'axios';
import BasicBoard from '../utils/BasicBoard.js';
import TopButton from '../utils/TopButton.js';
import { throttle } from 'lodash';
import { SPRING_API_URL } from '../../config';

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

const StyledSelect = styled(Select)`
    width: 120px;
    &&.MuiOutlinedInput-root {
        &:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline {
            border-color: #FCBE71;
        }
        &.Mui-focused .MuiInputLabel-root {
            color: #FCBE71;
        }
    }

    && .MuiMenu-paper {
        .MuiListItem-root:hover {
            background-color: #FCBE71;
            color: white;
        }
    }
`;

const StyledMenuItem = styled(MenuItem)`
    &&:hover {
        background-color: #FCBE71;
        color: white;
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

const StyledScrollDiv = styled('div')`
    margin-top: 180px;
    margin-left: 1rem;
    width: 90%;
`;

const LoadingText = styled('div')`
    text-align: center;
    padding: 20px 0;
    font-size: 2.5rem;
    color: grey;
`;

const NoApplicantText = styled('div')`
    text-align: center;
    padding: 20px 0;
    font-size: 2.5rem;
    color: grey;
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
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [isLastPage, setIsLastPage] = useState(false);

    const { moimId } = useParams();
    const [moimData, setMoimData] = useState("");

    const [applicantList, setApplicantList] = useState([]);
    const [scrollActive, setScrollActive] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchType, setSearchType] = useState("all");
    const [orderBy, setOrderBy] = useState("ascending");

    const scrollHandler = useMemo(() =>
        throttle(() => {
            if (window.scrollY > 100) {
                setScrollActive(true);
            } else {
                setScrollActive(false);
            }

            const scrollHeight = document.documentElement.scrollHeight;
            const scrollTop = document.documentElement.scrollTop;
            const clientHeight = document.documentElement.clientHeight;

            if (scrollTop + clientHeight >= scrollHeight) {
                if (!isLastPage) {
                    setPage(prevPage => prevPage + 1);
                }
                window.scrollTo({ scrollTop });
                return;
            }
        }, 500), [page]);

    const handleOrderBy = () => {
        setPage(1);
        setApplicantList([]);
        setOrderBy(orderBy === 'ascending' ? 'descending' : 'ascending');
        fetchData();
    };

    const handleSearch = () => {
        setPage(1);
        setApplicantList([]);
        setOrderBy(orderBy === 'ascending' ? 'descending' : 'ascending');
        fetchData();
    }

    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        }
    }, []);

    const fetchMoimData = async () => {
        try {
            const response = await axios.get(`${SPRING_API_URL}/moim/view-moim/${moimId}`);
            const data = response.data.item.moimDTO;

            if (isMounted.current) {
                setIsLastPage(data.lastPage);
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

    console.log(sessionStorage.getItem("ACCESS_TOKEN"));

    const fetchApplicantList = async (moimId) => {
        try {
            setIsLoading(true);

            const apiEndPoint = orderBy === 'ascending'
                ? `${SPRING_API_URL}/moimReg/get-applicant-list/asc/${moimId}`
                : `${SPRING_API_URL}/moimReg/get-applicant-list/desc/${moimId}`;

            const response = await axios.post(apiEndPoint, {}, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                },
                params: {
                    page: page - 1,
                    searchKeyword: searchKeyword,
                    searchType: searchType,
                    orderBy: orderBy
                }
            });

            if (response.data) {
                setIsLastPage(response.data.lastPage);
                return response.data.items;
            }
            return [];
        } catch (e) {
            console.error("Error fetching applicant list data", e);
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        window.addEventListener("scroll", scrollHandler);

        return () => {
            window.removeEventListener("scroll", scrollHandler);
        }
    }, [moimId, page, orderBy]);

    const fetchData = async () => {
        await fetchMoimData();
        const applicantsFromServer = await fetchApplicantList(moimId);
        setApplicantList(applicantsFromServer);
    };

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

            const response = await axios.post(`${SPRING_API_URL}/moimReg/${moimRegId}/applicant-state?nowStatus=${nowStatus}`, payload, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                }
            });

            if (response.data.statusCode === 200) {
                alert(alertMessage);
                window.location.replace(`/list-accept-moim/${moimRegId}`);
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
                    <StyledSelect value={searchType} displayEmpty onChange={(e) => setSearchType(e.target.value)}>
                        <StyledMenuItem value="all">전체</StyledMenuItem>
                        <StyledMenuItem value="nickname">신청자</StyledMenuItem>
                    </StyledSelect>
                    <SearchButton variant="contained" size="large" onClick={handleSearch}>검색</SearchButton>
                    <SearchButton variant="contained" size="large" onClick={handleOrderBy}>
                        {orderBy === 'ascending' ? '최신순' : '등록순'}
                    </SearchButton>
                </SearchContainer>
            </StyledContainer>
            <StyledScrollDiv>
                {applicantList && applicantList.length > 0 ? (
                    applicantList.map(applicant => (
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
                    ))
                ) : (
                    !isLoading && <NoApplicantText>아직은 신청자가 없어요.</NoApplicantText>
                )}
                {isLoading && <LoadingText>새로운 목록을 불러오고 있어요.</LoadingText>}
                {isLastPage && !isLoading && <LoadingText>신청자 목록의 마지막 페이지예요.</LoadingText>}
            </StyledScrollDiv>
            <TopButton />
        </BasicBoard>
    );
};

export default ListAcceptMoim;