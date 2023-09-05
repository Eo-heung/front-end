import React from "react";
import axios from "axios";
import { styled } from "@mui/system";
import { BoardInfoRow, BoardInfo } from "./StyledBoard";
import { StyledButton, StyledTextField } from "./StyledCreate";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { SPRING_API_URL } from "../../config";
import { Button, Modal } from "@mui/material";
import { useEffect } from "react";
import ListPagination from "./Pagination";
import CommentModal from "./CommentModal";

const CommentContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  max-width: 700px;
  padding: 1rem;
  border: 1px solid grey;
  border-radius: 8px;
`;

const CommentSubmit = styled("div")`
  display: flex;
  align-items: center;
  padding: 0.5rem 0.3rem;
  width: 100%;
  gap: 10px;
`;

const CommentListTitle = styled("h5")`
  margin-bottom: 1rem;
`;

const CommentList = styled("div")`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  padding: 1rem;
  width: 100%;
  border: 1px solid grey;
  border-radius: 8px;
`;

const CommentButtonZone = styled("div")`
  display: flex;
  align-items: center;
  width: 625px;
  gap: 20px;
`;

const CommentButton = styled(Button)`
  margin-top: 5px;
  border-color: #fcbe71;
  color: grey;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    border-color: #fcbe71;
    background-color: #fcbe71;
    color: #fff;
  }
`;

const PagingZone = styled("div")`
  margin-top: 1rem;
`;

const MoimComment = ({ moimId, boardId }) => {
  const [commentContent, setCommentContent] = useState("");
  const [comments, setComments] = useState([]);

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditingComment, setCurrentEditingComment] = useState(null);

  const [userRole, setUserRole] = useState({
    isMember: false,
    isLeader: false,
  });
  const [cookie] = useCookies("userId");

  useEffect(() => {
    const verifyUserRole = async () => {
      try {
        const response = await axios.post(
          `${SPRING_API_URL}/board/${moimId}/verify-role`,
          {},
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
            },
          }
        );

        setUserRole(response.data.item);
      } catch (err) {
        console.error("Error verifying user role", err);
      }
    };

    verifyUserRole();
  }, [moimId]);

  const handleCommentSubmit = async () => {
    try {
      const response = await axios.post(
        `${SPRING_API_URL}/comment/${moimId}/${boardId}/create-co`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
          },
          params: {
            content: commentContent,
          },
        }
      );

      if (
        response.data.statusCode === 200 ||
        response.data.statusCode === 201
      ) {
        alert("성공적으로 댓글을 등록했어요.");
        fetchComments();
        setCommentContent("");
      } else {
        console.error(response.data.errorMessage);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${SPRING_API_URL}/comment/${moimId}/${boardId}/list-co`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
          },
          params: {
            currentPage: currentPage - 1,
          },
        }
      );

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
  }, [moimId, boardId, currentPage]);

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

  const handleDeleteClick = (commentId) => async () => {
    if (!window.confirm("정말로 댓글을 삭제하시겠어요?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `${SPRING_API_URL}/comment/${moimId}/${boardId}/delete-co/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
          },
        }
      );

      if (response.data.statusCode === 200) {
        alert("댓글을 삭제했어요.");
        fetchComments();
      } else {
        alert("댓글을 삭제하지 못했어요.");
      }
    } catch (error) {
      console.error("Error deleting the board", error);
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
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
        ></StyledTextField>
        <StyledButton
          type="submit"
          variant="contained"
          size="large"
          style={{ top: "5px", height: "55px", width: "150px" }}
          onClick={handleCommentSubmit}
        >
          댓글 등록
        </StyledButton>
      </CommentSubmit>
      {Array.isArray(comments) && comments.length > 0 && (
        <>
          <CommentList>
            <CommentListTitle>댓글 목록</CommentListTitle>
            {comments.map((comment) => {
              const isLoginUserTheWriter = comment.userId === cookie.userId;

              return (
                <div key={comment.commentId}>
                  <BoardInfoRow
                    style={{ marginTop: "1rem", marginBottom: "0.2rem" }}
                  >
                    <BoardInfo>{comment.userName}</BoardInfo>
                    <BoardInfo>{comment.commentRegdate.slice(0, 10)}</BoardInfo>
                  </BoardInfoRow>
                  <StyledTextField
                    name="boardComment"
                    variant="outlined"
                    multiline
                    size="medium"
                    InputProps={{
                      readOnly: true,
                    }}
                    value={comment.commentContent || ""}
                  ></StyledTextField>
                  {isLoginUserTheWriter && (
                    <CommentButtonZone>
                      <CommentButton
                        type="button"
                        variant="outlined"
                        size="small"
                        onClick={() => handleEditComment(comment)}
                      >
                        수정
                      </CommentButton>
                      <CommentButton
                        type="button"
                        variant="outlined"
                        size="small"
                        onClick={handleDeleteClick(comment.commentId)}
                      >
                        삭제
                      </CommentButton>
                    </CommentButtonZone>
                  )}
                  {!isLoginUserTheWriter && userRole.isLeader && (
                    <CommentButtonZone>
                      <CommentButton
                        type="button"
                        variant="outlined"
                        size="small"
                        onClick={handleDeleteClick(comment.commentId)}
                      >
                        삭제
                      </CommentButton>
                    </CommentButtonZone>
                  )}
                </div>
              );
            })}
            <CommentModal
              isOpen={isEditModalOpen}
              onClose={handleModalClose}
              comment={currentEditingComment}
              moimId={moimId}
              boardId={boardId}
            />
          </CommentList>
          <PagingZone>
            <ListPagination
              count={totalPages}
              page={currentPage}
              onChange={onPageChange}
            ></ListPagination>
          </PagingZone>
        </>
      )}
    </CommentContainer>
  );
};

export default MoimComment;
