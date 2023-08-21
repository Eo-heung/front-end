import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { styled } from '@mui/system';
import { Button, Typography, Box, Card, CardContent } from '@mui/material';
import { grey } from '@mui/material/colors';
import axios from 'axios';
import BasicBoard from '../utils/BasicBoard.js';

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

const PageTitle = styled('h3')`
    margin-bottom: 1.5rem;
`;

const StyledButton = styled(Button)`
    position: fixed;
    top: 200px;
    right: 20%;
    z-index: 1001;
    background-color: #FCBE71;
    &:hover {
        background-color: #FCBE71;
        color: #fff;
    }
`;

const StyledCard = styled(Card)`
    display: flex;
    gap: 1.5rem;
    padding: 1.5rem;
    width: 100%;
    background-color: #fff;
    color: #000;
    cursor: pointer;
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

const ListAcceptMoim = () => {
    const { moimId } = useParams();
    const { moimRegId } = useParams();

    const [moimData, setMoimData] = useState("");
    const [applicantList, setApplicantList] = useState([]);

    useEffect(() => {
        const fetchMoimData = async () => {
            try {
                const response = await axios.get(`http://localhost:9000/moim/view-moim/${moimId}`);
                const data = response.data.item.moimDTO;

                setMoimData({
                    moimTitle: data.moimTitle
                });

                return response.data.item;

            } catch (e) {
                console.error("Error fetching moim data", e);
            }
        };

        fetchMoimData();
    }, [moimId]);

    useEffect(() => {
        const fetchApplicantList = async () => {
            try {
                const response = await axios.get(`http://localhost:9000/moim/get-applicant-list/${moimId}`);
                if (response.data && response.data.item) {
                    setApplicantList(response.data.item);
                }
            } catch (error) {
                console.error("Error fetching applicant list data: ", error);
            }
        };

        fetchApplicantList();
    }, [moimRegId]);

    const handleAcceptance = async (userId, decision) => {
        const endpoint = decision === "accepted" ? "approve-moim" : "reject-moim";
        const payload = {
            applicantUserId: userId
        };

        try {
            const response = await axios.post(`http://localhost:9000/moim/${endpoint}/${userId}`, payload, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                }
            });

            if (response.status === 200) {
                alert(`가입 신청을 ${decision === "accepted" ? "수락" : "거절"}했습니다.`);
                const updatedApplicants = applicantList.filter(applicant => applicant.userId !== userId);
                setApplicantList(updatedApplicants);
            }
        } catch (error) {
            console.error("Error handling acceptance: ", error);
        }
    };

    return (
        <BasicBoard>
            <StyledContainer>
                <PageTitle>{`${moimData.moimTitle} 모임의 신청자 목록`}</PageTitle>
            </StyledContainer>
            <div style={{ marginTop: "180px" }}>
                {applicantList && applicantList.map(applicant => (
                    <StyledCard key={applicant.userId}>
                        <CardContent>
                            <ApplicantInfoBox border={0} my={0}>
                                <ApplicantTitle>신청자</ApplicantTitle>
                                <ApplicantInfo variant="body1">{applicant.applicantUserNickname}</ApplicantInfo>
                            </ApplicantInfoBox>
                            <ApplicantInfoBox border={0} my={2}>
                                <ApplicantTitle>신청일</ApplicantTitle>
                                <ApplicantInfo variant="body1">{applicant.applicationDate}</ApplicantInfo>
                            </ApplicantInfoBox>
                            <ApplicantInfoBox border={0} my={2}>
                                <ApplicantTitle>신청 상태</ApplicantTitle>
                                <ApplicantInfo variant="body1">{applicant.regStatus}</ApplicantInfo>
                            </ApplicantInfoBox>
                            <StyledButton onClick={() => handleAcceptance(applicant.applicantuserId, "accepted")} variant="contained">수락</StyledButton>
                            <StyledButton onClick={() => handleAcceptance(applicant.applicantuserId, "declined")} variant="contained">거절</StyledButton>
                        </CardContent>
                    </StyledCard>
                ))}
            </div>
        </BasicBoard>
    );
};

export default ListAcceptMoim;