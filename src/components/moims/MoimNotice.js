import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BoardContainer, BoardInfoRow, BoardTitle, BoardInfo, BoardContent, BoardMessage } from '../utils/StyledBoard';
import { ButtonZone, StyledButton } from '../utils/StyledCreate';

const MoimNotice = (props) => {
    const navi = useNavigate();
    const { moimId, boardId, type } = props;

    const [boardDetail, setBoardDetail] = useState(null);

    useEffect(() => {
        const fetchBoardDetail = async () => {
            if (!props.type) {
                console.error("Board type is not set");
                return;
            }

            try {
                const response = await axios.post(`http://localhost:9000/board/${moimId}/view-board/${boardId}`, {}, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                    }
                });

                setBoardDetail(response.data.item.boardDTO);
            } catch (err) {
                console.error("Error fetching board details", err);
            }
        };

        fetchBoardDetail();
    }, [moimId, boardId, props.type]);

    const handleEditClick = () => {
        navi(`/${moimId}/create-board/${boardId}`, { state: { boardType: "NOTICE" } });
    };

    return (
        <BoardContainer>
            <BoardTitle>{boardDetail && boardDetail.boardTitle}</BoardTitle>
            <BoardInfoRow>
                <BoardInfo>{boardDetail && boardDetail.userNickname}</BoardInfo>
                <BoardInfo>{boardDetail && boardDetail.boardRegdate}</BoardInfo>
            </BoardInfoRow>
            <BoardContent>{boardDetail && boardDetail.boardContent}</BoardContent>
            <ButtonZone>
                <StyledButton type="button" variant="contained" size="large" onClick={handleEditClick}>수정</StyledButton>
                <StyledButton type="button" variant="contained" size="large">삭제</StyledButton>
            </ButtonZone>
        </BoardContainer>
    );
};

export default MoimNotice;