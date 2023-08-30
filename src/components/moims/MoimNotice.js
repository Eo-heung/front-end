import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BoardContainer, BoardInfoRow, BoardTitle, BoardInfo, BoardContent, BoardMessage } from '../utils/StyledBoard';
import { ButtonZone, StyledButton } from '../utils/StyledCreate';
import { SPRING_API_URL } from '../../config';

const MoimNotice = (props) => {
    const navi = useNavigate();
    const { moimId, boardId, type } = props;

    const [userRole, setUserRole] = useState({ isMember: false, isLeader: false });

    const [boardDetail, setBoardDetail] = useState(null);
    const [boardPics, setBoardPics] = useState([]);

    useEffect(() => {
        const verifyUserRole = async () => {
            try {
                const response = await axios.post(`${SPRING_API_URL}/board/${moimId}/verify-role`, {}, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                    }
                });

                setUserRole(response.data.item);
            } catch (err) {
                console.error("Error verifying user role", err);
            }
        };

        verifyUserRole();
    }, [moimId]);

    useEffect(() => {
        const fetchBoardDetail = async () => {
            if (!props.type) {
                console.error("Board type is not set");
                return;
            }

            try {
                const response = await axios.post(`${SPRING_API_URL}/board/${moimId}/view-board/${boardId}`, {}, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                    }
                });

                setBoardDetail(response.data.item.boardDTO);
                setBoardPics(response.data.item.boardPics);
            } catch (err) {
                console.error("Error fetching board details", err);
            }
        };

        fetchBoardDetail();
    }, [moimId, boardId, props.type]);

    const handleEditClick = () => {
        navi(`/${moimId}/create-board/${boardId}`, { state: { boardType: "NOTICE" } });
    };

    const handleDeleteClick = async () => {
        if (!window.confirm("정말로 게시글을 삭제하시겠어요?")) {
            return;
        }

        try {
            const response = await axios.post(`${SPRING_API_URL}/board/${moimId}/delete-board/${boardId}`, {}, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                }
            });

            if (response.data.statusCode === 200) {
                alert(response.data.item.msg);
                navi(`/${moimId}/moim-board?label=공지 게시판`);
            } else {
                alert(response.data.errorMessage);
            }
        } catch (error) {
            console.error("Error deleting the board", error);
        }
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
            {userRole.isLeader ? (
                <ButtonZone style={{ marginTop: "1.5rem" }}>
                    <StyledButton type="button" variant="contained" size="large" onClick={handleEditClick}>수정</StyledButton>
                    <StyledButton type="button" variant="contained" size="large" onClick={handleDeleteClick}>삭제</StyledButton>
                </ButtonZone>
            ) : null}
        </BoardContainer>
    );
};

export default MoimNotice;