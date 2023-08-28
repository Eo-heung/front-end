import { styled } from '@mui/system';
import { Link } from 'react-router-dom';

export const StyledBasicContainer = styled('div')`
    padding: 0 0 1.5rem 0;
`;

export const StyledPaper = styled('div')`
    width: 100%;
    overflow: hidden;
`;

export const StyledContainer = styled('div')`
    max-height: 600px;
    overflow-y: auto;
        
    scrollbar-width: none; 
    ::-ms-overflow-style: -ms-autohiding-scrollbar;
    ::-webkit-scrollbar {
        width: 0;
        height: 0;
    }
`;

export const Styled = styled('table')`
    width: 100%;
    border-collapse: collapse;
`;

export const StyledHead = styled('thead')`
    background-color: #fff;
`;

export const StyledRow = styled('tr')`
    line-height: 18px;
`;

export const StyledCell = styled('td')`
    padding: 16px;
    border-bottom: 1px solid #FCBE71;
    text-align: left;
`;

export const StyledHeaderCell = styled(StyledCell)`
    font-weight: bold;
`;

export const StyledMainHeaderCell = styled('td')`
    padding: 16px;
    border-bottom: 1px solid #FCBE71;
    text-align: left;
    font-weight: bold;
`;

export const StyledLink = styled(Link)`
    cursor: pointer;
    text-decoration: none;
    font-size: 1.2rem;
`;

export const StyledText = styled('span')`
    font-size: 1.2rem;
        cursor: pointer;
        &:hover {
            color: #FCBE71;
        }
`;