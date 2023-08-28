import { styled } from '@mui/system';


export const TabContainer = styled('div')`
    position: fixed;
    top: 115px;
    right: 0;
    left: 400px;
    padding: 1.5rem 3rem;
    height: 75px;
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

export const TabContent = styled('div')`
    display: flex;
    align-items: center;
    margin-top: 75px;
    padding: 1.5rem 3rem;
    width: 100%;
    gap: 10px;
`;