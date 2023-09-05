import React, { useState, useEffect, useCallback } from "react";
import { styled } from "@mui/system";
import { useNavigate, useParams } from "react-router-dom";
import { CardContent, Typography, Button } from "@mui/material";
import axios from "axios";
import TopButton from "../utils/TopButton.js";
import {
  ListMoimContainer,
  ListMoimCategoryContainer,
  ListMoimSearchContainer,
  ListMoimTextField,
  ListMoimSelect,
  ListMoimMenuItem,
  ListMoimLink,
  ListMoimLoadingText,
  ListMoimCard,
  ListMoimCardInfo,
  ListMoimMoimInfoRow,
  ListMoimScrollDiv,
  ListMoimSearchButton,
  ListMoimButton,
} from "../utils/StyledListMoim.js";
import { SPRING_API_URL } from "../../config";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/ko";

dayjs.extend(utc);
dayjs.locale("ko");

const ListInfoRow = styled("div")`
  display: flex;
  justify-content: flex-start;
  gap: 10px;
`;

const AlertZone = styled("div")`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  right: 0;
  width: 25%;
  height: 33%;
  z-index: 10;
`;

const AlertContent = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 70%;
  border: 2px solid #fcbe71;
  border-radius: 8px;
  color: grey;
  font-size: 1.3rem;
`;

const HideButton = styled(Button)`
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

const MoimAppList = () => {
  const navi = useNavigate();
  const { moimId } = useParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);
  const [scrollActive, setScrollActive] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const [state, setState] = useState({
    data: [],
    keyword: "",
    searchType: "all",
    appType: "all",
    orderBy: "descending",
    hoveredButton: null,
  });

  const [hideCompleted, setHideCompleted] = useState(false);

  const now = dayjs();

  function getCurrentStatus(appStart, appEnd, now) {
    if (now.isBefore(appStart)) return "모집중";
    if (now.isAfter(appEnd)) return "종료";
    return "진행중";
  }

  const scrollHandler = useCallback(() => {
    if (window.scrollY > 100) {
      setScrollActive(true);
    } else {
      setScrollActive(false);
    }

    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 100 && !initialLoad) {
      if (!isLastPage && !isLoading) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    }
  }, [isLastPage, isLoading]);

  const renderAppTypeButton = (label) => (
    <Button
      size="medium"
      variant={
        state.appType === label || state.hoveredButton === label
          ? "contained"
          : "outlined"
      }
      style={{
        backgroundColor:
          state.appType === label || state.hoveredButton === label
            ? "#FCBE71"
            : "#fff",
        borderColor: "#FCBE71",
        color:
          state.appType === label || state.hoveredButton === label
            ? "#fff"
            : "#000",
        fontWeight: state.appType === label ? "bold" : "normal",
      }}
      onClick={() => setState((prev) => ({ ...prev, appType: label }))}
      onMouseEnter={() =>
        setState((prev) => ({ ...prev, hoveredButton: label }))
      }
      onMouseLeave={() =>
        setState((prev) => ({ ...prev, hoveredButton: null }))
      }
    >
      {label}
    </Button>
  );

  const fetchData = (page, appType) => {
    setIsLoading(true);

    axios
      .get(`${SPRING_API_URL}/appointment/${moimId}/list`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
        },
        params: {
          currentPage: currentPage - 1,
          appType: state.appType,
          keyword: state.keyword,
          searchType: state.searchType,
          orderBy: state.orderBy,
        },
      })
      .then((response) => {
        console.log("fetchData", response.data);
        const apps = Object.values(response.data.item.content);
        const newData = apps.filter(
          (app) => !state.data.some((d) => d.appBoardId === app.appBoardId)
        );
        setIsLastPage(response.data.lastPage);
        setState((prev) => ({
          ...prev,
          data: [...prev.data, ...newData],
        }));
      })
      .then(() => {
        setIsLoading(false);
        setInitialLoad(false);
      })
      .catch((error) => {
        console.log("Error fetching data: ", error);
      });
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);
    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [scrollHandler]);

  useEffect(() => {
    fetchData(currentPage, state.appType);
  }, [currentPage, state.appType]);

  const handleOrderBy = () => {
    setCurrentPage(1);
    setState((prev) => ({
      ...prev,
      data: [],
      orderBy: prev.orderBy === "ascending" ? "descending" : "ascending",
    }));
    fetchData();
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setState((prev) => ({
      ...prev,
      data: [],
    }));
    fetchData();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleHideCompletedToggle = () => {
    setHideCompleted((prev) => !prev);
  };

  function AppItem({ app, moimId }) {
    const appStart = dayjs.utc(app.appStart).local();
    const appEnd = dayjs.utc(app.appEnd).local();
    const currentStatus = getCurrentStatus(appStart, appEnd, now);

    if (hideCompleted && currentStatus === "종료") {
      return null;
    }

    return (
      <div
        onClick={() => navi(`/${moimId}/moim-board/moim-app/${app.appBoardId}`)}
      >
        <ListMoimCard variant="outlined">
          <AlertZone>
            <AlertContent>{currentStatus}</AlertContent>
          </AlertZone>
          <ListMoimCardInfo>
            <CardContent>
              <Typography variant="body1">{app.appType}</Typography>
              <Typography gutterBottom variant="h4">
                {app.appTitle}
              </Typography>
              <ListMoimMoimInfoRow>
                <h6>인원</h6>
                <Typography variant="body1">
                  {app.appFixedUser || "1"}/{app.maxAppUser}
                </Typography>
                {app.appType === "OFFLINE" && (
                  <>
                    <h6>장소</h6>
                    <Typography variant="body1">{app.appLocation}</Typography>
                  </>
                )}
              </ListMoimMoimInfoRow>
              <ListInfoRow>
                <h6>시작</h6>
                <Typography variant="body1">
                  {appStart.format("MM.DD. a")}
                </Typography>
                <h6>종료</h6>
                <Typography variant="body1">
                  {appEnd.format("MM.DD. a")}
                </Typography>
              </ListInfoRow>
            </CardContent>
          </ListMoimCardInfo>
        </ListMoimCard>
      </div>
    );
  }

  return (
    <>
      <ListMoimContainer className={scrollActive ? "fixed" : ""}>
        <ListMoimCategoryContainer
          style={{ marginLeft: "20px", marginTop: "10px" }}
        >
          {renderAppTypeButton("all")}
          {renderAppTypeButton("ONLINE")}
          {renderAppTypeButton("OFFLINE")}
        </ListMoimCategoryContainer>
        <ListMoimSearchContainer>
          <ListMoimTextField
            variant="outlined"
            placeholder="검색어를 입력하세요."
            style={{
              marginLeft: "1.2rem",
              width: "250px",
              height: "30px",
              marginRight: "10px",
            }}
            onChange={(e) =>
              setState((prev) => ({ ...prev, keyword: e.target.value }))
            }
            onKeyDown={handleKeyDown}
          />
          <ListMoimSelect
            value={state.searchType}
            displayEmpty
            size="large"
            style={{
              width: "120px",
              height: "56px",
              marginRight: "10px",
            }}
            onChange={(e) =>
              setState((prev) => ({ ...prev, searchType: e.target.value }))
            }
          >
            <ListMoimMenuItem value="all">전체</ListMoimMenuItem>
            <ListMoimMenuItem value="title">제목</ListMoimMenuItem>
            <ListMoimMenuItem value="content">내용</ListMoimMenuItem>
          </ListMoimSelect>
          <ListMoimSearchButton
            variant="contained"
            size="large"
            onClick={handleSearch}
            style={{
              width: "100px",
              marginRight: "10px",
            }}
          >
            검색
          </ListMoimSearchButton>
          <ListMoimSearchButton
            variant="contained"
            size="large"
            style={{
              width: "100px",
              marginRight: "10px",
            }}
            onClick={handleOrderBy}
          >
            {state.orderBy === "descending" ? "등록순" : "최신순"}
          </ListMoimSearchButton>
          <ListMoimSearchButton
            type="button"
            variant="contained"
            size="small"
            onClick={handleHideCompletedToggle}
          >
            {hideCompleted ? "종료된 만남 보이기" : "종료된 만남 숨기기"}
          </ListMoimSearchButton>
          <ListMoimSearchButton
            variant="text"
            size="normal"
            style={{
              width: "150px",
              marginRight: "10px",
              backgroundColor: "white",
              color: "black",
            }}
            onClick={() => navi(`/${moimId}/create-appoint`)}
          >
            만남 모집 글쓰기
          </ListMoimSearchButton>
        </ListMoimSearchContainer>
      </ListMoimContainer>
      <ListMoimScrollDiv>
        {state.data &&
          state.data.map((app) => (
            <AppItem key={app.appBoardId} app={app} moimId={moimId} />
          ))}
        {isLoading && (
          <ListMoimLoadingText>
            새로운 목록을 불러오고 있어요.
          </ListMoimLoadingText>
        )}
        {isLastPage && !isLoading && (
          <ListMoimLoadingText>
            모임 목록의 마지막 페이지예요.
          </ListMoimLoadingText>
        )}
      </ListMoimScrollDiv>
      <TopButton />
    </>
  );
};

export default MoimAppList;
