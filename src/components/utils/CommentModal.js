import { Modal, Box, Typography } from "@mui/material";
import { useState } from "react";
import { ButtonZone, StyledButton, StyledTextField } from "./StyledCreate";
import { SPRING_API_URL } from '../../config';
import axios from "axios";
import { useEffect } from "react";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
};

const CommentModal = ({ isOpen, onClose, comment, moimId, boardId, onUpdate }) => {
    const [updatedContent, setUpdatedContent] = useState("");

    useEffect(() => {
        if (comment) {
            setUpdatedContent(comment.commentContent);
        }
    }, [comment]);

    const handleCommentUpdate = async () => {
        try {
            const response = await axios.put(`${SPRING_API_URL}/comment/${moimId}/${boardId}/modify-co/${comment.commentId}`, {}, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                },
                params: {
                    content: updatedContent
                }
            });

            if (response.data.statusCode === 200) {
                alert("댓글을 수정했어요.");
                onClose(true);
            } else {
                alert(response.data.errorMessage);
            }
        } catch (err) {
            console.error("Error modifying comment", err);
        }
    };

    const handleUpdate = () => {
        handleCommentUpdate();
    };

    const handleClose = () => {
        onClose();
        setUpdatedContent("");
    };

    if (!isOpen) return null;

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="modal-comment-title"
            aria-describedby="modal-comment-description"
        >
            <Box sx={style}>
                <Typography id="modal-comment-title" variant="h6" component="h2" style={{ marginBottom: "1rem" }}>
                    수정할 내용을 입력해주세요.
                </Typography>
                <StyledTextField
                    name="boardComment"
                    variant="outlined"
                    multiline
                    size="medium"
                    value={updatedContent}
                    onChange={(e) => setUpdatedContent(e.target.value)}
                ></StyledTextField>
                <ButtonZone>
                    <StyledButton type="button" variant="contained" size="large" onClick={handleUpdate}>수정</StyledButton>
                    <StyledButton type="button" variant="contained" size="large" onClick={handleClose}>닫기</StyledButton>
                </ButtonZone>
            </Box>
        </Modal>
    );
};

export default CommentModal;