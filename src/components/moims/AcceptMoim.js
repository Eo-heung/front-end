import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { styled } from '@mui/system';
import { Box, Typography, Button } from '@mui/material';
import { grey } from '@mui/material/colors';
import axios from 'axios';
import BasicBoard from '../utils/BasicBoard';

const StyledForm = styled('form')`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 100%;
`;

const StyledBox = styled(Box)`
    display: flex;
    flex-direction: column;
    alignItems: flex-start;
    margin-top: 1.5rem;
    width: 100%;
`;

const PageTitle = styled('h3')`
    margin-bottom: 1.5rem;
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
    margin: 10px auto;
    gap: 30px;
`;

const StyledButton = styled(Button)`
    margin: 20px 10px 0 10px;
    background-color: #FCBE71;
    &:hover {
        background-color: #FCBE71;
    }
`;

const StyledLink = styled(Link)`
    margin: 1rem auto;
    text-decoration: none;
`;

const AcceptMoim = () => {
    const navi = useNavigate();

    const { moimId } = useParams();
    const { moimRegId } = useParams();

    const [moimData, setMoimData] = useState("");
    const [applicantData, setApplicantData] = useState({
        applicantUserNickname: "",
        applicantuserAddr: "",
        applicantuserId: "",
        applicationDate: "",
        regStatus: ""
    });

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
        const fetchApplicantData = async () => {
            try {
                const response = await axios.get(`http://localhost:9000/moim/get-applicant/${moimRegId}`, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                    }
                });

                const applicantData = response.data.item;
                setApplicantData(applicantData);

            } catch (e) {
                console.error("Error fetching applicant data", e);
            }
        };

        fetchApplicantData();
    }, [moimRegId]);

    const handleAcceptance = async (e, decision) => {
        e.preventDefault();

        const endpoint = decision === "accepted" ? "approve-moim" : "reject-moim";
        const payload = {
            applicantUserId: applicantData.applicantuserId
        };

        try {
            const response = await axios.post(`http://localhost:9000/moim/${endpoint}/${moimRegId}`, payload, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                }
            });

            if (response.status === 200) {
                alert(`가입 신청을 ${decision === "accepted" ? "수락" : "거절"}했습니다.`);
                navi("`/list-moim-list/${moimId}`");
            }
        } catch (e) {
            console.error("데이터 전송 중 오류가 발생했습니다.", e);
        }
    };

    return (
        <BasicBoard>
            <StyledForm>
                <StyledBox>
                    <PageTitle>{`${moimData.moimTitle} 모임에 가입하고 싶습니다.`}</PageTitle>
                    <ApplicantInfoBox border={0} my={0}>
                        <ApplicantTitle>신청자</ApplicantTitle>
                        <ApplicantInfo variant="body1">{applicantData.applicantUserNickname}</ApplicantInfo>
                    </ApplicantInfoBox>
                    <ApplicantInfoBox border={0} my={2}>
                        <ApplicantTitle>지역</ApplicantTitle>
                        <ApplicantInfo variant="body1">{applicantData.applicantuserAddr}</ApplicantInfo>
                    </ApplicantInfoBox>
                    <ApplicantInfoBox border={0} my={2}>
                        <ApplicantTitle>신청일</ApplicantTitle>
                        <ApplicantInfo variant="body1">{applicantData.applicationDate}</ApplicantInfo>
                    </ApplicantInfoBox>
                    <ApplicantInfoBox border={0} my={2}>
                        <ApplicantTitle>신청 상태</ApplicantTitle>
                        <ApplicantInfo variant="body1">{applicantData.regStatus}</ApplicantInfo>
                    </ApplicantInfoBox>
                    <ButtonRow>
                        <StyledButton onClick={(e) => handleAcceptance(e, "accepted")} variant="contained" size="large">수락</StyledButton>
                        <StyledButton onClick={(e) => handleAcceptance(e, "declined")} variant="contained" size="large">거절</StyledButton>
                    </ButtonRow>
                </StyledBox>
            </StyledForm>
            <StyledLink to="/list-moim">목록으로 돌아가기</StyledLink>
        </BasicBoard>
    );
};

export default AcceptMoim;