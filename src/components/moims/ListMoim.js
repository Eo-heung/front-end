import React, { useState, useEffect } from "react";
import { CardContent, Typography, Button } from "@mui/material";
import axios from "axios";
import TopButton from "../utils/TopButton.js";
import {
  ListMoimContainer,
  ListMoimSearchContainer,
  ListMoimCategoryContainer,
  ListMoimTextField,
  ListMoimSelect,
  ListMoimMenuItem,
  ListMoimSearchButton,
  ListMoimPageTitle,
  ListMoimLink,
  ListMoimButton,
  ListMoimScrollDiv,
  ListMoimLoadingText,
  ListMoimCard,
  ListMoimCardMedia,
  ListMoimCardInfo,
  ListMoimMoimInfoRow,
  ListMoimEllipsisText,
  ListMoimStyledLink,
  ListMoimAd,
  ListMoimAdContent,
} from "../utils/StyledListMoim.js";
import { SPRING_API_URL } from "../../config";
import _debounce from "lodash/debounce";

const ListMoim = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [category, setCategory] = useState("전체");
  const [scrollActive, setScrollActive] = useState(false);
  const [orderBy, setOrderBy] = useState("descending");

  const [hoveredButton, setHoveredButton] = useState(null);

  const DEBOUNCE_DELAY = 500;
  const debouncedScrollHandler = _debounce(() => {
    if (window.scrollY > 100) {
      setScrollActive(true);
    } else {
      setScrollActive(false);
    }

    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 100) {
      if (!isLastPage) {
        setPage((prevPage) => prevPage + 1);
      }
      window.scrollTo({ scrollTop });
      return;
    }
  }, DEBOUNCE_DELAY);

  const renderCategoryButton = (label) => (
    <Button
      size="medium"
      variant={
        category === label || hoveredButton === label ? "contained" : "outlined"
      }
      style={{
        backgroundColor:
          category === label || hoveredButton === label ? "#FCBE71" : "#fff",
        borderColor: "#FCBE71",
        color: category === label || hoveredButton === label ? "#fff" : "#000",
        fontWeight: category === label ? "bold" : "normal",
      }}
      onClick={() => setCategory(label)}
      onMouseEnter={() => setHoveredButton(label)}
      onMouseLeave={() => setHoveredButton(null)}
    >
      {label}
    </Button>
  );

  useEffect(() => {
    fetchData();
    window.addEventListener("scroll", debouncedScrollHandler);
    return () => {
      window.removeEventListener("scroll", debouncedScrollHandler);
    };
  }, [page, orderBy]);

  useEffect(() => {
    fetchData();
  }, [category]);

  const fetchData = () => {
    setIsLoading(true);

    const apiEndPoint =
      orderBy === "ascending"
        ? `${SPRING_API_URL}/moim/list-moim/asc`
        : `${SPRING_API_URL}/moim/list-moim/desc`;

    axios
      .post(
        apiEndPoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
          },
          params: {
            page: page - 1,
            category: category,
            searchKeyword: searchKeyword,
            searchType: searchType,
            orderBy: orderBy,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        const moims = Object.values(response.data.items);

        setIsLastPage(response.data.lastPage);
        setData(moims);
      })
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Error fetching data: ", error);
        setIsLoading(false);
      });
  };

  const handleOrderBy = () => {
    setPage(1);
    setData([]);
    setOrderBy(orderBy === "ascending" ? "descending" : "ascending");
    fetchData();
  };

  const handleSearch = () => {
    setPage(1);
    setData([]);
    fetchData();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const [isHidden, setIsHidden] = useState(false);

  const handleAdClick = () => {
    setIsHidden(true);
  };

  return (
    <>
      <ListMoimContainer className={scrollActive ? "fixed" : ""}>
        {/* <ListMoimPageTitle>새로운 모임 목록</ListMoimPageTitle> */}
        <ListMoimCategoryContainer
          style={{
            marginTop: "5px",
          }}
        >
          {renderCategoryButton("전체")}
          {renderCategoryButton("인문학/책")}
          {renderCategoryButton("운동")}
          {renderCategoryButton("요리/맛집")}
          {renderCategoryButton("공예/만들기")}
          {renderCategoryButton("원예")}
          {renderCategoryButton("동네친구")}
          {renderCategoryButton("음악/악기")}
          {renderCategoryButton("반려동물")}
          {renderCategoryButton("여행")}
          {renderCategoryButton("문화/여가")}
        </ListMoimCategoryContainer>
        <ListMoimSearchContainer>
          <ListMoimTextField
            variant="outlined"
            placeholder="검색어를 입력하세요."
            style={{
              marginLeft: "25px",
              marginRight: "10px",
            }}
            InputProps={{
              style: {
                width: "250px",
                height: "50px",
              },
            }}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <ListMoimSelect
            value={searchType}
            displayEmpty
            style={{ height: "50px" }}
            size="large"
            onChange={(e) => setSearchType(e.target.value)}
          >
            <ListMoimMenuItem value="all">전체</ListMoimMenuItem>
            <ListMoimMenuItem value="title">제목</ListMoimMenuItem>
            <ListMoimMenuItem value="content">내용</ListMoimMenuItem>
            <ListMoimMenuItem value="nickname">작성자</ListMoimMenuItem>
          </ListMoimSelect>
          <ListMoimSearchButton
            variant="contained"
            size="large"
            onClick={handleSearch}
            style={{ height: "50px", marginLeft: "10px" }}
          >
            검색
          </ListMoimSearchButton>
          <ListMoimSearchButton
            variant="contained"
            size="large"
            onClick={handleOrderBy}
            style={{ height: "50px", marginLeft: "10px" }}
          >
            {orderBy === "descending" ? "등록순" : "최신순"}
          </ListMoimSearchButton>
          <ListMoimButton
            component={ListMoimStyledLink}
            style={{ height: "50px", marginLeft: "20px" }}
            to="/create-moim"
            variant="text"
            size="large"
          >
            새로운 모임 만들기
          </ListMoimButton>
        </ListMoimSearchContainer>
      </ListMoimContainer>
      <ListMoimScrollDiv>
        {/* <ListMoimAd isHidden={isHidden} onClick={handleAdClick}>
                    <ListMoimAdContent>
                        같은 관심사를 가진 또래들과 어흥 해보세요!
                    </ListMoimAdContent>
                </ListMoimAd> */}
        {data &&
          data.map((moim) => (
            <ListMoimLink to={`/view-moim/${moim.moimId}`} key={moim.moimId}>
              <ListMoimCard variant="outlined">
                <ListMoimCardMedia
                  component="img"
                  image={
                    (moim.moimPic &&
                      `data:image/jpeg;base64,${moim.moimPic}`) ||
                    "https://cdnimg.melon.co.kr/cm2/artistcrop/images/002/61/143/261143_20210325180240_500.jpg?61e575e8653e5920470a38d1482d7312/melon/resize/416/quality/80/optimize"
                  }
                  alt="moim image"
                />
                <ListMoimCardInfo>
                  <CardContent>
                    <Typography variant="body1">{moim.moimCategory}</Typography>
                    <Typography gutterBottom variant="h4">
                      {moim.moimTitle}
                    </Typography>
                    <ListMoimMoimInfoRow>
                      <Typography variant="body1">{moim.moimAddr}</Typography>
                      <Typography variant="body1">
                        {moim.currentMoimUser || "1"}/{moim.maxMoimUser}
                      </Typography>
                    </ListMoimMoimInfoRow>
                    <ListMoimEllipsisText variant="body1">
                      {moim.moimContent}
                    </ListMoimEllipsisText>
                  </CardContent>
                </ListMoimCardInfo>
              </ListMoimCard>
            </ListMoimLink>
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

export default ListMoim;
