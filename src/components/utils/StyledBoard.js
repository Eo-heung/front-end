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
    justify-content: space-between;
    margin: 0 auto;
    margin-bottom: 1rem;
    gap: 30px;
`

export const BoardTitle = styled('h1')`
    margin-bottom: 1rem;
`;

export const BoardInfo = styled('span')`
    width: 180px;
    font-size: 1rem;
    color: grey;
`;

export const BoardContent = styled('div')`
    padding: 1.5rem;
    border: 1px solid grey;
    border-radius: 8px;
    width: 100%;
    max-width: 700px;
    min-height: 300px;
    margin-bottom: 1.5rem;
`;

export const BoardMessage = styled('div')`
    font-size: 2.5rem;
    text-align: center;
    padding: 20px 0;
    color: grey;
`;