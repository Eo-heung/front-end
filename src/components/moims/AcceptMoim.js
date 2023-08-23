import React, { useState, useEffect, useRef } from 'react';
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

const StyledDiv = styled('div')`
    padding: 1.5rem 3rem;
    border: 0.5px solid grey;
    border-radius: 8px;
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

    const { moimId, moimRegId } = useParams();

    console.log(moimId, moimRegId);

    const [moimData, setMoimData] = useState("");
    const [applicant, setApplicant] = useState("");

    const isMounted = useRef(true);

    const fetchMoimData = async () => {
        try {
            const response = await axios.get(`http://localhost:9000/moim/view-moim/${moimId}`);
            const data = response.data.item.moimDTO;

            if (isMounted.current) {
                setMoimData({
                    moimTitle: data.moimTitle,
                    userId: data.userId
                });
            }

        } catch (e) {
            console.error("Error fetching moim data", e);
        }
    };

    const fetchApplicant = async () => {
        try {
            const response = await axios.get(`http://localhost:9000/moimReg/get-applicant/${moimId}/${moimRegId}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                }
            });

            if (response.data && isMounted.current) {
                setApplicant(response.data.item);
            }

        } catch (e) {
            console.error("Error fetching applicant data", e);
        }
    };

    console.log(applicant);

    useEffect(() => {
        fetchMoimData();
        fetchApplicant();

        return () => {
            isMounted.current = false;
        };
    }, [moimId, moimRegId]);

    const handleAcceptance = async (moimRegId, decision) => {
        const nowStatus = decision === "accepted" ? "APPROVED" : "REJECTED";
        const alertMessage = decision === "accepted" ? "가입 신청을 수락했어요." : "가입 신청을 거절했어요.";

        try {
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
                navi(`/list-accept-moim/${moimId}`);
            }
        } catch (err) {
            console.error("Error occurred handling acceptance: ", err);
            alert("신청 처리에 실패했어요.");
        }
    };

    return (
        <BasicBoard>
            <StyledForm>
                <StyledBox>
                    <PageTitle>{`${moimData.moimTitle} 모임에 가입하고 싶습니다.`}</PageTitle>
                    <StyledDiv>
                        <img
                            src={applicant.moimProfile && `data:image/jpeg;base64,${applicant.moimProfile}`}
                            alt="모임 프로필 사진"
                            style={{ width: '200px', height: '200px', borderRadius: '50%', objectFit: 'cover', border: '0.5px solid #adb5bd', cursor: 'pointer', marginBottom: '1rem' }}
                        >
                        </img>
                        <ApplicantInfoBox border={0} my={0}>
                            <ApplicantTitle>신청자</ApplicantTitle>
                            <ApplicantInfo variant="body1">{applicant.applicantUserNickname}</ApplicantInfo>
                        </ApplicantInfoBox>
                        <ApplicantInfoBox border={0} my={2}>
                            <ApplicantTitle>지역</ApplicantTitle>
                            <ApplicantInfo variant="body1">{applicant.applicantUserAddr}</ApplicantInfo>
                        </ApplicantInfoBox>
                        <ApplicantInfoBox border={0} my={2}>
                            <ApplicantTitle>신청일</ApplicantTitle>
                            <ApplicantInfo variant="body1">{applicant.applicationDate && applicant.applicationDate.slice(0, 10)}</ApplicantInfo>
                        </ApplicantInfoBox>
                        <ApplicantInfoBox border={0} my={2}>
                            <ApplicantTitle>신청 상태</ApplicantTitle>
                            <ApplicantInfo variant="body1">{applicant.regStatus === "WAITING" ? "가입 대기" : applicant.regStatus}</ApplicantInfo>
                        </ApplicantInfoBox>
                    </StyledDiv>
                    <ButtonRow>
                        <StyledButton onClick={() => handleAcceptance(applicant.moimRegId, "accepted")} variant="contained" size="large">수락</StyledButton>
                        <StyledButton onClick={() => handleAcceptance(applicant.moimRegId, "declined")} variant="contained" size="large">거절</StyledButton>
                    </ButtonRow>
                </StyledBox>
            </StyledForm>
            <StyledLink to="/list-moim">목록으로 돌아가기</StyledLink>
        </BasicBoard>
    );
};

export default AcceptMoim;