import React, { useEffect } from 'react';
import axios from 'axios';
import { styled } from '@mui/system';
import { BoardInfoRow, BoardInfo } from '../utils/StyledBoard';
import { StyledTextField } from '../utils/StyledCreate';
import { useState } from 'react';
import { SPRING_API_URL } from '../../config';
import { Button } from '@mui/material';
import ListPagination from '../utils/Pagination';
import CommentModal from '../utils/CommentModal';
import { useLocation, useParams, useNavigate, Link } from 'react-router-dom';
import { ListMoimLoadingText } from '../utils/StyledListMoim';
import { StyledText } from '../utils/StyledTable';

const CommentListTitle = styled('h5')`
    margin-bottom: 1rem;
`;

const CommentList = styled('div')`
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
    padding: 1rem;
    width: 100%;
    border: 1px solid grey;
    border-radius: 8px;
`;

const CommentButtonZone = styled('div')`
    display: flex;
    align-items: center;
    width: 625px;
    gap: 20px;
`;

const CommentButton = styled(Button)`
    margin-top: 5px;
    border-color: #FCBE71;
    color: grey;
    font-weight: bold;
    cursor: pointer;
    &:hover {
        border-color: #FCBE71;
        background-color: #FCBE71;
        color: #fff;
    }
`;

const PagingZone = styled('div')`
    margin-top: 1rem;
`;

const MyCommentList = ({ setActiveTab }) => {
    const navi = useNavigate();
    const location = useLocation();

    const { moimId } = useParams();

    const [comments, setComments] = useState([]);

    const [keyword, setKeyword] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentEditingComment, setCurrentEditingComment] = useState(null);

    const [isInfoPage, setIsInfoPage] = useState(location.pathname.includes('my-moim-info'));

    useEffect(() => {
        setIsInfoPage(location.pathname.includes('my-moim-info'));
    }, [location.pathname]);

    const fetchComments = async () => {
        try {
            const response = await axios.get(`${SPRING_API_URL}/comment/${moimId}/list-my-co`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                },
                params: {
                    currentPage: currentPage - 1,
                    keyword: keyword
                }
            });
            console.log("comments", response.data);

            if (response.data.statusCode === 200) {
                setComments(response.data.pageItems.content);
                setTotalPages(response.data.paginationInfo.totalPages);
                console.log("response.data", response.data);
            } else {
                console.error(response.data.errorMessage);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchComments(currentPage);
    }, [moimId, currentPage]);

    const onPageChange = (e, page) => {
        console.log("Page changed to: ", page);
        setCurrentPage(page);
    };

    const handleModalClose = (isUpdated) => {
        setIsEditModalOpen(false);
        setCurrentEditingComment(null);
        if (isUpdated) {
            fetchComments();
        }
    };

    const handleEditComment = (comment) => {
        setCurrentEditingComment(comment);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (boardId, commentId) => async () => {
        if (!window.confirm("정말로 댓글을 삭제하시겠어요?")) {
            return;
        }

        console.log("boardidididid", boardId);
        console.log("commentId", commentId);

        try {
            const response = await axios.delete(`${SPRING_API_URL}/comment/${moimId}/${boardId}/delete-co/${commentId}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                }
            });

            console.log("response.data.statusCode", response.data);

            if (response.data.statusCode === 200) {
                alert("댓글을 삭제했어요.");
                fetchComments();
            } else {
                alert("댓글을 삭제하지 못했어요.");
            }
        } catch (error) {
            console.error("Error deleting the comment", error);
        }
    };

    return (
        <>
            <CommentList>
                {isInfoPage ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
                        <StyledText onClick={() => navi(`/${moimId}/moim-board/my-comments`)}>
                            내 댓글 목록
                        </StyledText>
                        <StyledText style={{ fontSize: "0.8rem" }} onClick={() => navi(`/${moimId}/moim-board/my-comments`)}>
                            더보기
                        </StyledText>
                    </div>
                ) : (
                    <CommentListTitle>
                        내 댓글 목록
                    </CommentListTitle>
                )}
                {Array.isArray(comments) && comments.length > 0 ? (
                    <>
                        {comments.slice(0, isInfoPage ? 5 : comments.length).map(comment =>
                            <div key={comment.commentId}>
                                <BoardInfoRow style={{ marginTop: "1rem", marginBottom: "0.2rem" }}>
                                    <BoardInfo>{comment.userName}</BoardInfo>
                                    <BoardInfo>{comment.commentRegdate.slice(0, 10)}</BoardInfo>
                                </BoardInfoRow>
                                <div onClick={() => navi(`/${moimId}/moim-board/free-board/${comment.boardId}`)}>
                                    <StyledTextField
                                        name="boardComment"
                                        variant="outlined"
                                        multiline
                                        size="medium"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        value={comment.commentContent || ""}
                                        title="댓글을 클릭하면 게시글로 이동해요."
                                    ></StyledTextField>
                                </div>
                                {isInfoPage ? null : (
                                    <CommentButtonZone>
                                        <CommentButton type="button" variant="outlined" size="small" onClick={() => handleEditComment(comment)}>수정</CommentButton>
                                        <CommentButton type="button" variant="outlined" size="small" onClick={handleDeleteClick(comment.boardId, comment.commentId)}>삭제</CommentButton>
                                    </CommentButtonZone>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <ListMoimLoadingText>아직 작성한 댓글이 없어요.</ListMoimLoadingText>)}
                <CommentModal
                    isOpen={isEditModalOpen}
                    onClose={handleModalClose}
                    comment={currentEditingComment}
                    moimId={moimId}
                    boardId={currentEditingComment ? currentEditingComment.boardId : null}
                />
            </CommentList>
            {isInfoPage ? null : (
                <PagingZone>
                    <ListPagination
                        count={totalPages}
                        page={currentPage}
                        onChange={onPageChange}
                    ></ListPagination>
                </PagingZone>
            )}
        </>
    );
};

export default MyCommentList;