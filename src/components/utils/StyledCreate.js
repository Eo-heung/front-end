import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
import { TextField, Box, Button, Typography } from '@mui/material';

export const StyledForm = styled('form')`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 100%;
    max-width: 700px;
    `;

export const StyledBox = styled(Box)`
        margin-top: 1rem;
        width: 100%;
    `;

export const WriteZone = styled('div')`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    width: 100%;
    margin-bottom: 1.5rem;
`;

export const PageTitle = styled('h3')`
    margin-bottom: 1rem;
`;

export const StyledButton = styled(Button)`
    margin-top: 10px;
    background-color: #FCBE71;
    &:hover {
        background-color: #FCBE71;
    }
`;

export const CounterTypography = styled(Typography)`
  color: #CED7D4;
  align-self: flex-end;
`;

export const CounterBox = styled(Box)`
    width: 100%;
    max-width: 700px;
`;

export const StyledTextField = styled(TextField)`
    width: 100%;
    max-width: 700px;
    & .MuiOutlinedInput-root {
        &:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline {
            border-color: #FCBE71;
        }
        &.Mui-focused .MuiInputLabel-root {
            color: #FCBE71;
        }
    }
    @media (max-width: 992px) {
        width: 100%;
    }
`;

export const StyledLink = styled(Link)`
    margin: 1rem auto;
    text-decoration: none;
`;

export const ImageAttaZone = styled('div')`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 700px;
    height: 200px;
    border: 1px solid grey;
`;

export const ButtonZone = styled('div')`
    display:flex;
    align-items: center;
    gap: 30px;
`;