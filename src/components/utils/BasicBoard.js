import * as React from 'react';
import Container from '@mui/material/Container';
import { styled } from '@mui/system';
import '../../css/partials/Style.css';

const StyledContainerBase = ({ children, ...props }) => {
    return (
        <div className="sb-nav-fixed mainpage">
            <div id="layoutSidenav">
                <div id="layoutSidenav_content">
                    <main>
                        <div className="container-fluid px-4">
                            <div className="row">
                                <Container maxWidth="md" {...props}>
                                    {children}
                                </Container>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

const BasicBoard = styled(StyledContainerBase)`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 10px auto;
    padding: 10px;
    width: 100%;
    border: 1px solid #FCBE71;
    box-sizing: border-box;
    text-align: left;
`;

export default BasicBoard;