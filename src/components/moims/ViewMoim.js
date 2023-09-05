import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Typography, Button } from "@mui/material";
import { grey } from "@mui/material/colors";
import { styled } from "@mui/system";
import axios from "axios";
import BasicBoard from "../utils/BasicBoard.js";
import { useCookies } from "react-cookie";
import { SPRING_API_URL } from "../../config";

const StyledTypography = styled(Typography)`
  margin-bottom: 10px;
  color: ${grey[600]};
`;

const MoimInfoRow = styled("div")`
  display: flex;
  justify-content: flex-start;
  gap: 30px;
`;

const StyledLink = styled(Link)`
  margin: 1rem auto;
  text-decoration: none;
`;

const ButtonRow = styled("div")`
  display: flex;
  justify-content: center;
  margin: 10px auto;
  gap: 30px;
`;

const StyledButton = styled(Button)`
  margin: 20px 10px 0 10px;
  background-color: #fcbe71;
  &:hover {
    background-color: #fcbe71;
  }
`;

const ApplyLink = styled(Link)`
  text-decoration: none;
  color: #fff;
  &:hover {
    color: #fff;
  }
`;

const StyledMoimContent = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding: 1rem;
  width: 100%;
  max-width: 700px;
  height: 200px;
  border: 1px solid grey;
`;

const ViewMoim = () => {
  const navi = useNavigate();

  const [moimDetail, setMoimDetail] = useState("");
  const { moimId } = useParams();
  const [id, setId] = useState(null);
  const [moimPic, setMoimPic] = useState(null);
  const [cookie] = useCookies("userId");
  const [status, setStatus] = useState({
    status: "",
    moimRegId: "",
  });

  const isCurrentUserTheHost =
    moimDetail && moimDetail.userId === cookie.userId;
  const isWaiting = status.status === "WAITING";
  const isApproved = status.status === "APPROVED";

  useEffect(() => {
    setId(moimId);
  }, []);

  useEffect(() => {
    const getMoimDetail = async () => {
      try {
        const response = await axios.get(
          `${SPRING_API_URL}/moim/view-moim/${moimId}`
        );

        console.log("response.data", response.data);

        if (response.data) {
          setMoimDetail(response.data.item.moimDTO);
          setMoimPic(`data:image/jpeg;base64,${response.data.item.moimPic}`);
          console.log(moimDetail);
        }
      } catch (error) {
        console.error("Failed to fetch moim detail:", error);
      }
    };

    getMoimDetail();
  }, [id]);

  const deleteMoim = async () => {
    try {
      const response = await axios.delete(
        `${SPRING_API_URL}/moim/delete-moim/${moimId}`
      );

      if (response.status === 200) {
        alert("모집글이 삭제되었습니다.");
        window.location.href = "/moim-controller/list-moim";
      }
    } catch (error) {
      console.error("Failed to delete moim:", error);
      alert("모집글 삭제에 실패하였습니다.");
    }
  };

  const handleDeleteClick = () => {
    const isConfirmed = window.confirm(
      `${moimDetail.moimTitle} 모집글을 정말로 삭제하시겠습니까?`
    );

    if (isConfirmed) {
      deleteMoim();
    }
  };

  useEffect(() => {
    const getUserMoimStatus = async () => {
      try {
        const response = await axios.get(
          `${SPRING_API_URL}/moimReg/check-registration-state/${moimId}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
            },
          }
        );
        setStatus(response.data);
        console.log(response.data);
      } catch (e) {
        console.error("Error fetching user moim status", e);
      }
    };

    getUserMoimStatus();
  }, [moimId]);

  const cancelMoimApplication = async () => {
    try {
      const response = await axios.post(
        `${SPRING_API_URL}/moimReg/${status.moimRegId}/applicant-state?nowStatus=CANCELED`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
          },
        }
      );

      if (response.data.statusCode === 200) {
        alert("가입 신청을 취소했어요.");
        navi("/moim-controller/list-moim");
      }
    } catch (e) {
      console.error("Error Canceling moim application", e);
      alert("신청을 취소하지 못했어요.");
    }
  };

  console.log(isCurrentUserTheHost, isWaiting);

  return (
    <BasicBoard style={{ marginLeft: "50px" }}>
      <h5>{moimDetail.moimCategory}</h5>
      <h1 style={{ marginTop: "0.5rem", marginBottom: "1rem" }}>
        {moimDetail.moimTitle}
      </h1>
      <MoimInfoRow style={{ marginTop: "1rem", marginBottom: "1rem" }}>
        <h5>모임장</h5>
        <StyledTypography variant="body1">
          {moimDetail.moimNickname}
        </StyledTypography>
      </MoimInfoRow>
      <MoimInfoRow style={{ marginBottom: "1rem" }}>
        <StyledTypography variant="body1">
          {moimDetail.moimAddr}
        </StyledTypography>
        <StyledTypography variant="body1">
          {moimDetail.currentMoimUser || "1"}/{moimDetail.maxMoimUser}
        </StyledTypography>
      </MoimInfoRow>
      <StyledMoimContent>
        <StyledTypography variant="body1">
          {moimDetail.moimContent}
        </StyledTypography>
      </StyledMoimContent>
      <img
        src={moimPic}
        style={{ maxWidth: "700px", maxHeight: "400px" }}
      ></img>
      {!isCurrentUserTheHost && isApproved ? null : !isCurrentUserTheHost ? (
        isWaiting ? (
          <ButtonRow>
            <StyledButton
              variant="contained"
              size="large"
              onClick={cancelMoimApplication}
            >
              신청 취소
            </StyledButton>
          </ButtonRow>
        ) : (
          <ButtonRow>
            <StyledButton variant="contained" size="large">
              <ApplyLink to={`/apply-moim/${moimId}`}>신청</ApplyLink>
            </StyledButton>
          </ButtonRow>
        )
      ) : (
        <ButtonRow>
          <StyledButton variant="contained" size="large">
            <ApplyLink to={`/modify-moim/${moimId}`}>수정</ApplyLink>
          </StyledButton>
          <StyledButton
            variant="contained"
            size="large"
            onClick={handleDeleteClick}
          >
            삭제
          </StyledButton>
        </ButtonRow>
      )}
      <div style={{ marginTop: "20px" }}>
        <StyledLink
          style={{ marginLeft: "35vh" }}
          to="/moim-controller/list-moim"
        >
          목록으로 돌아가기
        </StyledLink>
      </div>
    </BasicBoard>
  );
};

export default ViewMoim;
