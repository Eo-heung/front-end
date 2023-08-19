import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/system';
import axios from 'axios';
import BasicBoard from '../utils/BasicBoard.js';
import { data as detaildata } from './data2.js';

const StyledTypography = styled(Typography)`
    margin-bottom: 10px;
    color: ${grey[800]};
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

const ViewMoim = () => {
    const [moimDetail, setMoimDetail] = useState(detaildata[0]);

    useEffect(() => {
        const getMoimDetail = async () => {
            try {
                const response = await axios.get('http://localhost:9000/view-moim');
                if (response.data) {
                    setMoimDetail(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch moim detail:", error);
            }
        };

        getMoimDetail();
    }, []);

    return (
        <BasicBoard>
            <StyledTypography variant="h6" style={{ marginTop: "1rem" }}>{moimDetail.moimCategory}</StyledTypography>
            <StyledTypography variant="h4">{moimDetail.moimTitle}</StyledTypography>
            <MoimInfoRow>
                <Typography variant="body1">모임장</Typography>
                <Typography variant="body1">{moimDetail.userNickname}</Typography>
            </MoimInfoRow>
            <MoimInfoRow>
                <Typography variant="body1">{moimDetail.moimAddr}</Typography>
                <Typography variant="body1">{moimDetail.currentMoimUser}/{moimDetail.maxMoimUser}</Typography>
            </MoimInfoRow>
            <StyledTypography variant="body1">{moimDetail.moimContent}</StyledTypography>
            <StyledLink to="/list-moim">목록으로 돌아가기</StyledLink>
        </BasicBoard>
    );
};

export default ViewMoim;