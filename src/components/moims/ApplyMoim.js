import React, { useRef } from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { styled } from '@mui/system';
import { Box, Typography, Button, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';
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

const CancelLink = styled(Link)`
    text-decoration: none;
    color: #fff;
    &:hover {
        color: #fff;
    }
`;

const StyledLink = styled(Link)`
    margin: 1rem auto;
    text-decoration: none;
`;

const ApplyMoim = () => {
    const navi = useNavigate();

    const { moimId } = useParams();
    const [moimData, setMoimData] = useState("");
    const [cookies] = useCookies(['userNickname', 'userAddr3']);
    const [userData, setUserData] = useState({
        applicantUserNickname: "",
        applicantuserAddr: "",
        applicantuserId: ""
    });
    const radioRef = useRef(null);

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
                console.error("모임 데이터를 불러오는 중 오류가 발생했습니다.", e);
            }
        };

        fetchMoimData();
    }, [moimId]);

    useEffect(() => {
        if (cookies.userNickname && cookies.userAddr3) {
            setUserData({
                applicantUserNickname: cookies.userNickname,
                applicantuserAddr: cookies.userAddr3,
                applicantuserId: cookies.userId
            });
        }

        console.log(userData);
    }, [cookies]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const radioValue = radioRef.current.querySelector("input:checked").value;

        const payload = {
            applicantUserNickname: userData.userNickname,
            applicantuserAddr: userData.userAddr3,
            applicantuserId: userData.userId,
            radioAnswer: radioValue
        };

        try {
            const response = await axios.post(`http://localhost:9000/moim/apply-moim/${moimId}`, payload, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                }
            });

            console.log(response.data);

            if (response.data.item) {
                alert("신청이 완료되었습니다.");
                navi("/list-moim");
            }
        } catch (e) {
            console.error("데이터 전송 중 오류가 발생했습니다.", e);
        }
    };

    return (
        <BasicBoard>
            <StyledForm id="applyForm" onSubmit={handleSubmit}>
                <StyledBox>
                    <PageTitle>{`${moimData.moimTitle} 모임에 가입해요.`}</PageTitle>
                    <ApplicantInfoBox border={0} my={0}>
                        <ApplicantTitle>신청자</ApplicantTitle>
                        <ApplicantInfo variant="body1">{userData.userNickname}</ApplicantInfo>
                    </ApplicantInfoBox>
                    <ApplicantInfoBox border={0} my={2}>
                        <ApplicantTitle>지역</ApplicantTitle>
                        <ApplicantInfo variant="body1">{userData.userAddr3}</ApplicantInfo>
                    </ApplicantInfoBox>
                    <ApplicantInfoBox border={0} my={2}>
                        <ApplicantTitle>가입 질문</ApplicantTitle>
                        <ApplicantInfo variant="body1">공지 확인 잘 하실 거죠?</ApplicantInfo>
                    </ApplicantInfoBox>
                    <FormControl style={{ marginLeft: "0.5rem" }}>
                        <RadioGroup row ref={radioRef}>
                            <FormControlLabel value="Yes" control={<Radio color="default" />} label="네" />
                            <FormControlLabel value="No" control={<Radio color="default" />} label="아니오" />
                        </RadioGroup>
                    </FormControl>
                    <ButtonRow>
                        <StyledButton type="submit" variant="contained" size="large">가입</StyledButton>
                        <StyledButton variant="contained" size="large"><CancelLink to={`/view-moim/${moimId}`}>취소</CancelLink></StyledButton>
                    </ButtonRow>
                </StyledBox>
            </StyledForm>
            <StyledLink to="/list-moim">목록으로 돌아가기</StyledLink>
        </BasicBoard>
    );
};

export default ApplyMoim;