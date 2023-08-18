import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Typography, Button } from '@mui/material';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/system';
import axios from 'axios';
import BasicBoard from '../utils/BasicBoard.js';
import { useCookies } from 'react-cookie';

const StyledTypography = styled(Typography)`
    margin-bottom: 10px;
    color: ${grey[600]};
`;

const MoimInfoRow = styled('div')`
    display: flex;
    justify-content: flex-start;
    gap: 30px;
`;

const StyledLink = styled(Link)`
    margin: 1rem auto;
    text-decoration: none;
`;

const StyledButton = styled(Button)`
    margin: 10px auto;
    background-color: #FCBE71;
    &:hover {
        background-color: #FCBE71;
    }
`;

const ApplyLink = styled(Link)`
    text-decoration: none;
    color: #fff;
    &:hover {
        color: #fff;
    }
`;

const StyledMoimContent = styled('div')`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1.5rem;
    padding: 1rem;
    width: 100%;
    max-width: 700px;
    height: 200px;
    border: 1px solid grey;
`;

const ViewMoim = () => {
    const [moimDetail, setMoimDetail] = useState("");
    const { moimId } = useParams();
    const [id, setId] = useState(null);
    const [moimPic, setMoimPic] = useState(null);
    const [cookie] = useCookies('userNickname');

    useEffect(() => {
        setId(moimId);
    }, [])

    useEffect(() => {
        const getMoimDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:9000/moim/view-moim/${moimId}`);

                console.log(response.data);

                if (response.data) {
                    setMoimDetail(response.data.item.moimDTO);
                    setMoimPic(`data:image/jpeg;base64,${response.data.item.moimPic}`);
                    console.log(moimDetail);
                }
            } catch (error) {
                console.error("Failed to fetch moim detail:", error);
            }
        };

        getMoimDetail();
    }, [id]);

    return (
        <BasicBoard>
            <h5 style={{ marginTop: "1.5rem" }}>{moimDetail.moimCategory}</h5>
            <h1 style={{ marginTop: "0.5rem", marginBottom: "1rem" }}>{moimDetail.moimTitle}</h1>
            <MoimInfoRow style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                <h5>모임장</h5>
                <StyledTypography variant="body1">{moimDetail.moimNickname}</StyledTypography>
            </MoimInfoRow>
            <MoimInfoRow style={{ marginBottom: "1rem" }}>
                <StyledTypography variant="body1">{moimDetail.moimAddr}</StyledTypography>
                <StyledTypography variant="body1">{moimDetail.currentMoimUser}/{moimDetail.maxMoimUser}</StyledTypography>
            </MoimInfoRow>
            <StyledMoimContent>
                <StyledTypography variant="body1">{moimDetail.moimContent}</StyledTypography>
            </StyledMoimContent>
            <img src={moimPic || 'https://cdnimg.melon.co.kr/cm2/artistcrop/images/002/61/143/261143_20210325180240_500.jpg?61e575e8653e5920470a38d1482d7312/melon/resize/416/quality/80/optimize'}
                style={{ maxWidth: '700px', maxHeight: '400px' }}></img>
            {moimDetail.moimNickname === cookie.userNickname ? (
                <>
                    <StyledButton variant="contained" size="large"><ApplyLink to={`/modify-moim/${moimId}`}>수정</ApplyLink></StyledButton>
                    <StyledButton variant="contained" size="large"><ApplyLink to={`/delete-moim/${moimId}`}>삭제</ApplyLink></StyledButton>
                </>
            ) : (
                <StyledButton variant="contained" size="large"><ApplyLink to="/">신청</ApplyLink></StyledButton>
            )}
            <StyledLink to="/list-moim">목록으로 돌아가기</StyledLink>
        </BasicBoard>
    );
};

export default ViewMoim;