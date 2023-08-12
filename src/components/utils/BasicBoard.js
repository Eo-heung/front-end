import * as React from 'react';
import Container from '@mui/material/Container';
import { styled } from '@mui/system';

const StyledContainerBase = ({ children, ...props }) => {
    return (
        <Container maxWidth="md" {...props}>
            {children}
        </Container>
    );
};

const BasicBoard = styled(StyledContainerBase)`
    margin: 10px auto;
    max-width: 700px;
    height: 70%;
    border: 1px solid #FCBE71;
    box-sizing: border-box;
    text-align: left;

    @media (max-width: 992px) {
        width: 90%;
    }
`;

export default BasicBoard;