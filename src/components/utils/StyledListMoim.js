import { styled } from '@mui/system';
import { Card, Typography, CardMedia, TextField, Select, MenuItem, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export const ListMoimContainer = styled('div')`
    position: fixed;
    top: 160px;
    right: 0;
    left: 350px;
    padding: 1rem 1.5rem;
    height: 160px;
    width: 100%;
    z-index: 1001;
    background-color: #fff;
    &.fixed {
        position: fixed;
        padding: 1.5rem 3rem;
        width: 90%;
        z-index: 100;
    }
    @media (max-width: 992px) {
        left: 0;
    }
`;

export const ListMoimPageTitle = styled('h3')`
    margin-bottom: 1.5rem;
`;

export const ListMoimCategoryContainer = styled('div')`
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
    gap: 10px;
`;

export const ListMoimSearchContainer = styled('div')`
    display: flex;
    align-items: center;
    gap: 10px;
`;

export const ListMoimTextField = styled(TextField)`
    width: 250px;
    & .MuiOutlinedInput-root {
        &:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline {
            border-color: #FCBE71;
        }
        &.Mui-focused .MuiInputLabel-root {
            color: #FCBE71;
        }
    }
`;

export const ListMoimSelect = styled(Select)`
    width: 120px;
    &&.MuiOutlinedInput-root {
        &:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline {
            border-color: #FCBE71;
        }
        &.Mui-focused .MuiInputLabel-root {
            color: #FCBE71;
        }
    }

    && .MuiMenu-paper {
        .MuiListItem-root:hover {
            background-color: #FCBE71;
            color: white;
        }
    }
`;

export const ListMoimMenuItem = styled(MenuItem)`
    &&:hover {
        background-color: #FCBE71;
        color: white;
    }
`;

export const ListMoimSearchButton = styled(Button)`
    background-color: #FCBE71;
    color: #fff;
    &:hover {
        background-color: #FCBE71;
        color: #fff;
    }
`;

export const ListMoimButton = styled(Button)`
    margin-left: 12rem;
    background-color: #FCBE71;
    color: #fff;
    &:hover {
        background-color: #FCBE71;
        color: #fff;
    }
`;

export const ListMoimAd = styled('div')`
    display: ${props => (props.isHidden ? 'none' : 'flex')};
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100px;
`;

export const ListMoimAdContent = styled('h5')`
    margin: 0 3rem 1.5rem 3rem;
    padding: 1.5rem 3rem;
    border-radius: 8px;
    background-color: #80E12A;
    color: #fff;

    cursor: pointer;
`;

export const ListMoimStyledLink = styled(Link)`
    margin: 1rem auto;
    text-decoration: none;
`;

export const ListMoimScrollDiv = styled('div')`
    margin-top: 160px;
    margin-left: 1rem;
    width: 100%;
`;

export const ListMoimLink = styled(Link)`
    margin: 1rem auto;
    text-decoration: none;
`;

export const ListMoimCard = styled(Card)`
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
    padding: 1.3rem 1.5rem 0 1.5rem;
    width: 100%;
    background-color: #fff;
    color: #000;
    cursor: pointer;
    &:hover {
        border: 1px solid #FCBE71;
        }
`;

export const ListMoimCardMedia = styled(CardMedia)`
    height: 160px;
    width: 160px;
    
    @media (max-width: 992px) {
        display: none;
    }
    `;

export const ListMoimCardInfo = styled('div')`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex-grow: 1;
    `;

export const ListMoimMoimInfoRow = styled('div')`
    display: flex;
    justify-content: flex-start;
    gap: 30px;
    `;

export const ListMoimEllipsisText = styled(Typography)`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    width: 600px;
    
    @media (max-width: 992px) {
        width: 200px;
    }
    `;

export const ListMoimLoadingText = styled('div')`
        font-size: 2.5rem;
        text-align: center;
        padding: 20px 0;
        color: grey;
    `;