import React, { useEffect, useState } from 'react';
import { Box, Typography, Container } from '@mui/material';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/system';
import axios from 'axios';
import BasicBoard from '../utils/BasicBoard.js';
import { data as detaildata } from './data2.js';

const StyledBox = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 2rem;
`;

const StyledTypography = styled(Typography)`
    margin-bottom: 10px;
    color: ${grey[800]};
`;

const MoimInfoRow = styled('div')`
    display: flex;
    justify-content: flex-start;
    gap: 30px;
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
            <StyledBox>
                <StyledTypography variant="h6">{moimDetail.moimCategory}</StyledTypography>
                <StyledTypography variant="h4">{moimDetail.moimTitle}</StyledTypography>
                <MoimInfoRow>
                    <Typography variant="body1">{moimDetail.moimAddr}</Typography>
                    <Typography variant="body1">{moimDetail.currentMoimUser}/{moimDetail.maxMoimUser}</Typography>
                </MoimInfoRow>
                <StyledTypography variant="h6">{moimDetail.userNickname}</StyledTypography>
                <StyledTypography variant="body1">{moimDetail.moimContent}</StyledTypography>
            </StyledBox>
        </BasicBoard>
    );
};

export default ViewMoim;