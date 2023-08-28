import React from 'react';
import { BoardContainer, BoardInfoRow, BoardTitle, BoardInfo, BoardContent, BoardMessage } from '../utils/StyledBoard';
import { ButtonZone, StyledButton } from '../utils/StyledCreate';
import { boardDetailData } from '../data/boardDetailData';

const FreeBoard = ({ boardDetail, setActiveContent, setEditingBoardId }) => {
    if (!boardDetail) return <BoardMessage>존재하지 않는 게시글입니다.</BoardMessage>

    const handleEditClick = () => {
        setEditingBoardId(boardDetail.boardId);
        setActiveContent("write");
    };

    return (
        <BoardContainer>
            <BoardTitle>{boardDetail.boardTitle}</BoardTitle>
            <BoardInfoRow>
                <BoardInfo>{boardDetail.userNickname}</BoardInfo>
                <BoardInfo>{boardDetail.boardRegdate}</BoardInfo>
            </BoardInfoRow>
            <BoardContent>{boardDetail.boardContent}</BoardContent>
            <ButtonZone>
                <StyledButton onClick={handleEditClick}>수정</StyledButton>
                <StyledButton>삭제</StyledButton>
            </ButtonZone>
        </BoardContainer>
    );
};

export default FreeBoard;