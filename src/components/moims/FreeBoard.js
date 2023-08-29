import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BoardContainer, BoardInfoRow, BoardTitle, BoardInfo, BoardContent } from '../utils/StyledBoard';
import { ButtonZone, StyledButton } from '../utils/StyledCreate';

const FreeBoard = (props) => {
    const navi = useNavigate();
    const { moimId, boardId, type } = props;

    const [boardDetail, setBoardDetail] = useState(null);
    const [boardPics, setBoardPics] = useState([]);

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
                setBoardPics(response.data.item.boardPics);
                console.log("response.data", response.data.item.boardDTO);
            } catch (err) {
                console.error("Error fetching board details", err);
            }
        };

        fetchBoardDetail();
    }, [moimId, boardId, props.type]);

    const handleEditClick = () => {
        navi(`/${moimId}/create-board/${boardId}`, { state: { boardType: "FREE" } });
    };

    return (
        <BoardContainer>
            <BoardTitle>{boardDetail && boardDetail.boardTitle}</BoardTitle>
            <BoardInfoRow>
                <BoardInfo>{boardDetail && boardDetail.userName}</BoardInfo>
                <BoardInfo>{boardDetail && boardDetail.boardRegdate.slice(0, 10)}</BoardInfo>
            </BoardInfoRow>
            <BoardContent>{boardDetail && boardDetail.boardContent}</BoardContent>
            {
                boardPics.map((pic, index) => (
                    <img
                        key={index}
                        src={`data:image/jpeg;base64,${pic}`}
                        alt={`게시글-사진-${index}`}
                        style={{ marginBottom: "1.5rem", maxWidth: "650px", maxHeight: "650px" }}
                    />
                ))
            }
            <ButtonZone style={{ marginTop: "1.5rem" }}>
                <StyledButton type="button" variant="contained" size="large" onClick={handleEditClick}>수정</StyledButton>
                <StyledButton type="button" variant="contained" size="large">삭제</StyledButton>
            </ButtonZone>
        </BoardContainer>
    );
};

export default FreeBoard;