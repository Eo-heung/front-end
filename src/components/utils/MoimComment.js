import React from 'react';
import axios from 'axios';
import { styled } from '@mui/system';
import { BoardInfoRow, BoardInfo } from './StyledBoard';
import { StyledButton, StyledTextField } from './StyledCreate';
import { useState } from 'react';
import { SPRING_API_URL } from '../../config';

const CommentContainer = styled('div')`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    max-width: 700px;
    padding: 1rem;
    border: 1px solid grey;
    border-radius: 8px;
`;

const CommentSubmit = styled('div')`
    display: flex;
    alignItems: center;
    padding: 0.5rem 0.3rem;
    width: 100%;
    gap: 10px;
`;

const CommentList = styled('div')`
    margin-top: 1rem;
    padding: 1rem;
    width: 100%;
    border: 1px solid grey;
    border-radius: 8px;
`;

const MoimComment = ({ moimId, boardId }) => {
    const [commentContent, setCommentContent] = useState("");
    const [comments, setComments] = useState([]);

    const handleCommentSubmit = async () => {
        try {
            const response = await axios.post(`${SPRING_API_URL}/comment/${moimId}/${boardId}/create-co`, {}, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                },
                params: {
                    content: commentContent
                }
            });

            if (response.data.statusCode === 200 || response.data.statusCode === 201) {
                alert("성공적으로 댓글을 등록했어요.");
                setComments([...comments, response.data.item]);
                setCommentContent("");
            } else {
                console.error(response.data.errorMessage);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <CommentContainer>
            <CommentSubmit>
                <StyledTextField
                    name="boardComment"
                    variant="outlined"
                    multiline
                    size="medium"
                    placeholder="댓글을 작성해주세요."
                    style={{ marginTop: "22px" }}
                    onChange={(e) => setCommentContent(e.target.value)}
                ></StyledTextField>
                <StyledButton
                    type="submit"
                    variant="contained"
                    size="large"
                    style={{ height: "80px", width: "110px" }}
                    onClick={handleCommentSubmit}
                >
                    댓글 등록
                </StyledButton>
            </CommentSubmit>
            <CommentList>
                <BoardInfoRow style={{ marginBottom: "0.2rem" }}>
                    <BoardInfo>작성자</BoardInfo>
                    <BoardInfo>작성일</BoardInfo>
                </BoardInfoRow>
                <StyledTextField
                    name="boardComment"
                    variant="outlined"
                    multiline
                    size="medium"
                    disabled
                ></StyledTextField>
            </CommentList>
        </CommentContainer>
    );
};

export default MoimComment;