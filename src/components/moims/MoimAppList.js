import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ListMoimSearchButton } from '../utils/StyledListMoim';

const MoimAppList = () => {
    const navi = useNavigate();
    const { moimId } = useParams();

    return (
        <div>
            <ListMoimSearchButton
                variant="contained"
                size="normal"
                onClick={() => navi(`/${moimId}/create-appoint`)}>
                글쓰기
            </ListMoimSearchButton>
        </div>
    );
};

export default MoimAppList;