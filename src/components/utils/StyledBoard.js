import { styled } from '@mui/system';

export const BoardContainer = styled('div')`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
`;

export const BoardInfoRow = styled('div')`
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
`

export const BoardTitle = styled('h1')`
    margin-bottom: 1rem;
`;

export const BoardInfo = styled('span')`
    font-size: 1rem;
    color: grey;
`;

export const BoardContent = styled('div')`
    padding: 1.5rem;
    border: 1px solid grey;
    border-radius: 8px;
    max-width: 800px;
`;

export const BoardMessage = styled('div')`
    font-size: 2.5rem;
    text-align: center;
    padding: 20px 0;
    color: grey;
`;