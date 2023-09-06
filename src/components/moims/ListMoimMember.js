import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { styled } from "@mui/system";
import {
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import axios from "axios";
import TopButton from "../utils/TopButton.js";
import { debounce } from 'lodash';
import { SPRING_API_URL } from "../../config";

const StyledContainer = styled("div")`
  position: fixed;
  top: 160px;
  right: 0;
  left: 350px;
  padding: 1rem 1.5rem;
  height: 140px;
  width: 100%;
  z-index: 1001;
  background-color: #fff;
  &.fixed {
    position: fixed;
    padding: 1rem 1.5rem;
    width: 100%;
    z-index: 100;
  }
  @media (max-width: 992px) {
    left: 0;
  }
`;

const SearchContainer = styled("div")`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SearchButton = styled(Button)`
  background-color: #fcbe71;
  color: #fff;
  &:hover {
    background-color: #fcbe71;
    color: #fff;
  }
`;

const StyledCardMedia = styled(CardMedia)`
  height: 160px;
  width: 160px;
  @media (max-width: 992px) {
    display: none;
  }
`;

const PageTitle = styled("h3")`
  margin-bottom: 1.5rem;
`;

const StyledScrollDiv = styled("div")`
  margin-top: 180px;
  margin-left: 1rem;
  width: 90%;
`;

const LoadingText = styled("div")`
  text-align: center;
  padding: 20px 0;
  font-size: 2.5rem;
  color: grey;
`;

const NoApplicantText = styled("div")`
  text-align: center;
  padding: 20px 0;
  font-size: 2.5rem;
  color: grey;
`;

const StyledCard = styled(Card)`
  display: flex;
  gap: 0.5rem;
  padding: 1.5rem;
  width: 100%;
  background-color: #fff;
  color: #000;
`;

const StyledCardContent = styled(CardContent)`
  width: 400px;
`;

const ApplicantInfoBox = styled(Box)`
  display: flex;
  alignitems: center;
  margin: 0.5rem;
`;

const ApplicantTitle = styled("h5")`
  width: 110px;
`;

const ApplicantInfo = styled(Typography)`
  color: ${grey[600]};
`;

const ListMoimMember = () => {
  const navi = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);

  const { moimId } = useParams();
  const [moimData, setMoimData] = useState("");

  const [userRole, setUserRole] = useState({
    isMember: false,
    isLeader: false,
  });

  const [applicantList, setApplicantList] = useState([]);
  const [scrollActive, setScrollActive] = useState(false);
  const [orderBy, setOrderBy] = useState("descending");

  const scrollHandler = useCallback(
    debounce(() => {
      if (window.scrollY > 100) {
        setScrollActive(true);
      } else {
        setScrollActive(false);
      }

      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 100 && !isLastPage) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    }, 500),
    [isLastPage]
  );

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

    return () => {
      setUserRole({ isMember: false, isLeader: false });
    };
  }, [moimId]);

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchMoimData = async () => {
    try {
      const response = await axios.get(
        `${SPRING_API_URL}/moim/view-moim/${moimId}`
      );
      const data = response.data.item.moimDTO;

      if (isMounted.current) {
        setIsLastPage(data.lastPage);
        setMoimData({
          moimTitle: data.moimTitle,
          userId: data.userId,
          moimId: data.moimId,
        });
      }
    } catch (e) {
      console.error("Error fetching moim data", e);
    }
  };

  const fetchMemberList = async (moimId) => {
    try {
      setIsLoading(true);

      const response = await axios.get(
        `${SPRING_API_URL}/moimReg/member-list/${moimId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
          },
          params: {
            currentPage: currentPage - 1,
          },
        }
      );

      console.log("가입자 목록", response.data);

      if (response.data) {
        setIsLastPage(response.data.lastPage);
        setApplicantList((prevList) => [...prevList, ...response.data.item.content]);
      }
    } catch (e) {
      console.error("Error fetching applicant list data", e);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentPage === 1) {
      fetchMoimData();
    }
    fetchMemberList(moimId);
    window.addEventListener("scroll", scrollHandler);

    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [moimId, currentPage, orderBy]);

  return (
    <>
      <StyledContainer
        style={{
          marginTop: "10px",
        }}
        className={scrollActive ? "fixed" : ""}
      >
        <PageTitle
          style={{ marginLeft: "15px", marginTop: "10px" }}
        >{`'${moimData.moimTitle}' 가입자 목록`}</PageTitle>
        <SearchContainer>
          {userRole.isLeader && (
            <SearchButton
              variant="contained"
              onClick={() => navi(`/${moimId}/moim-board/accept-moim`)}
            >
              신청자 목록
            </SearchButton>
          )}
        </SearchContainer>
      </StyledContainer>
      <StyledScrollDiv>
        {applicantList && applicantList.length > 0
          ? applicantList.map((applicant) => {
            if (
              applicant.regStatus === "APPROVED" ||
              applicant.regStatus === "LEADER"
            ) {
              return (
                <div>
                  <StyledCard variant="outlined">
                    <StyledCardMedia
                      component="img"
                      image={
                        applicant.moimProfileBase64 &&
                        `data:image/jpeg;base64,${applicant.moimProfileBase64}`
                      }
                      alt="모임 프로필 사진"
                    />
                    <StyledCardContent>
                      <ApplicantInfoBox border={0} my={0}>
                        <ApplicantTitle>가입자</ApplicantTitle>
                        <ApplicantInfo variant="body1">
                          {applicant.applicantUserNickname}
                        </ApplicantInfo>
                      </ApplicantInfoBox>
                      <ApplicantInfoBox border={0} my={2}>
                        <ApplicantTitle>가입일</ApplicantTitle>
                        <ApplicantInfo variant="body1">
                          {applicant.subscribeDate.slice(0, 10)}
                        </ApplicantInfo>
                      </ApplicantInfoBox>
                      <ApplicantInfoBox border={0} my={2}>
                        <ApplicantTitle>등급</ApplicantTitle>
                        <ApplicantInfo variant="body1">
                          {applicant.regStatus === "LEADER"
                            ? "모임장"
                            : "모임원"}
                        </ApplicantInfo>
                      </ApplicantInfoBox>
                    </StyledCardContent>
                  </StyledCard>
                </div>
              );
            }
            return null;
          })
          : !isLoading && (
            <NoApplicantText>아직은 가입자가 없어요.</NoApplicantText>
          )}
        {isLoading && <LoadingText>새로운 목록을 불러오고 있어요.</LoadingText>}
        {isLastPage && !isLoading && (
          <LoadingText>가입자 목록의 마지막 페이지예요.</LoadingText>
        )}
      </StyledScrollDiv>
      <TopButton />
    </>
  );
};

export default ListMoimMember;
