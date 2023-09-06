import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  StyledBasicContainer,
  StyledPaper,
  StyledContainer,
  Styled,
  StyledHead,
  StyledRow,
  StyledCell,
  StyledHeaderCell,
  StyledMainHeaderCell,
  StyledText,
  StyledFooter,
} from "../utils/StyledTable";
import {
  ListMoimSearchContainer,
  ListMoimTextField,
  ListMoimSelect,
  ListMoimMenuItem,
  ListMoimSearchButton,
} from "../utils/StyledListMoim";
import { SPRING_API_URL } from "../../config";
import ListPagination from "../utils/Pagination";

const FreeBoardList = ({ setActiveTab }) => {
  const navi = useNavigate();
  const location = useLocation();

  const { moimId } = useParams();

  const [boards, setBoards] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [keyword, setKeyword] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [orderBy, setOrderBy] = useState("descending");

  const [isMainPage, setIsMainPage] = useState(
    location.pathname.split("/").pop() === "" ||
    location.pathname.split("/").pop() === "moim-board"
  );

  useEffect(() => {
    setIsMainPage(
      location.pathname.split("/").pop() === "" ||
      location.pathname.split("/").pop() === "moim-board"
    );
  }, [location.pathname]);

  const fetchFreeBoards = async (currentPage) => {
    console.log("Fetching boards for page: ", currentPage);
    try {
      const response = await axios.post(
        `${SPRING_API_URL}/board/${moimId}/free-board`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
          },
          params: {
            currentPage: currentPage - 1,
            keyword: keyword,
            searchType: searchType,
            orderBy: orderBy,
          },
        }
      );

      setBoards(response.data.item.content);
      setTotalPages(response.data.paginationInfo.totalPages);
      console.log("boards", response.data);
    } catch (err) {
      console.error("Error fetching free boards", err);
    }
  };

  useEffect(() => {
    if (!moimId || moimId == "undefined") {
      console.error("moimId is not defined.");
      return;
    }

    fetchFreeBoards(currentPage);

    return () => {
      setBoards([]);
      setTotalPages(0);
      setCurrentPage(1);
      setKeyword("");
      setSearchType("all");
      setOrderBy("descending");
      setIsMainPage(false);
    };
  }, [moimId, currentPage, keyword, searchType, orderBy]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchFreeBoards();
    console.log("검색", boards);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const onPageChange = (e, page) => {
    console.log("Page changed to: ", page);
    setCurrentPage(page);
  };

  return (
    <StyledBasicContainer>
      <StyledPaper>
        <StyledContainer>
          <Styled>
            <StyledHead>
              {isMainPage ? (
                <StyledRow>
                  <StyledMainHeaderCell>
                    <StyledText
                      onClick={() => navi(`/${moimId}/moim-board/free-board`)}
                    >
                      자유 게시판
                    </StyledText>
                    <StyledText
                      style={{ fontSize: "0.8rem", marginLeft: "30px" }}
                      onClick={() => navi(`/${moimId}/moim-board/free-board`)}
                    >
                      더보기
                    </StyledText>
                  </StyledMainHeaderCell>
                  <StyledMainHeaderCell>
                    <StyledText
                      style={{ fontSize: "1rem" }}
                      onClick={() =>
                        navi(`/${moimId}/create-board`, {
                          state: { boardType: "FREE" },
                        })
                      }
                    >
                      글쓰기
                    </StyledText>
                  </StyledMainHeaderCell>
                </StyledRow>
              ) : (
                <StyledRow>
                  <StyledHeaderCell
                    style={{ width: "650px", fontSize: "1.2rem" }}
                  >
                    자유글 제목
                  </StyledHeaderCell>
                  <StyledHeaderCell style={{ width: "180px" }}>
                    작성자
                  </StyledHeaderCell>
                  <StyledHeaderCell style={{ width: "170px" }}>
                    작성일
                  </StyledHeaderCell>
                </StyledRow>
              )}
            </StyledHead>
            {isMainPage ? (
              <tbody>
                {Array.isArray(boards) &&
                  boards
                    .slice(0, isMainPage ? 5 : boards.length)
                    .map((board) => (
                      <StyledRow key={board.boardId}>
                        <StyledCell
                          style={{ width: "650px", cursor: "pointer" }}
                          onClick={() => {
                            navi(`/${moimId}/moim-board/free-board/${board.boardId}`);
                          }}
                        >
                          {board.boardTitle}
                          {board && board.commentCnt > 0 && (
                            <>
                              <span style={{ marginLeft: "2%", color: "grey" }}>
                                [{board.commentCnt}]
                              </span>
                            </>
                          )}
                        </StyledCell>
                        <StyledCell style={{ width: "180px" }}>
                          {board.userName}
                        </StyledCell>
                        <StyledCell style={{ width: "170px" }}>
                          {board.boardRegdate.slice(0, 10)}
                        </StyledCell>
                      </StyledRow>
                    ))}
              </tbody>
            ) : (
              <tbody>
                {Array.isArray(boards) &&
                  boards
                    .slice(0, isMainPage ? 5 : boards.length)
                    .map((board) => (
                      <StyledRow key={board.boardId}>
                        <StyledCell
                          style={{ width: "650px", cursor: "pointer" }}
                          onClick={() => {
                            navi(`/${moimId}/moim-board/free-board/${board.boardId}`);
                          }}
                        >
                          {board.boardTitle}
                          {board && board.commentCnt > 0 && (
                            <>
                              <span style={{ marginLeft: "2%", color: "grey" }}>
                                [{board.commentCnt}]
                              </span>
                            </>
                          )}
                        </StyledCell>
                        <StyledCell style={{ width: "180px" }}>
                          {board.userName}
                        </StyledCell>
                        <StyledCell style={{ width: "170px" }}>
                          {board.boardRegdate.slice(0, 10)}
                        </StyledCell>
                      </StyledRow>
                    ))}
              </tbody>
            )}
          </Styled>
          {!isMainPage ? (
            <StyledFooter>
              <ListPagination
                count={totalPages}
                page={currentPage}
                onChange={onPageChange}
              ></ListPagination>
              <ListMoimSearchContainer>
                <ListMoimTextField
                  style={{ marginLeft: "3rem", width: "250px", height: "50px" }}
                  size="small"
                  variant="outlined"
                  placeholder="검색어를 입력하세요."
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <ListMoimSelect
                  value={searchType}
                  displayEmpty
                  size="small"
                  style={{ marginLeft: "10px", width: "150px", height: "40px" }}
                  onChange={(e) => setSearchType(e.target.value)}
                >
                  <ListMoimMenuItem value="all">전체</ListMoimMenuItem>
                  <ListMoimMenuItem value="title">제목</ListMoimMenuItem>
                  <ListMoimMenuItem value="content">내용</ListMoimMenuItem>
                  <ListMoimMenuItem value="nickname">작성자</ListMoimMenuItem>
                </ListMoimSelect>
                <ListMoimSearchButton
                  variant="contained"
                  size="normal"
                  style={{ marginLeft: "10px", width: "50px", height: "40px" }}
                  onClick={handleSearch}
                >
                  검색
                </ListMoimSearchButton>
                <ListMoimSearchButton
                  variant="contained"
                  size="normal"
                  style={{ marginLeft: "10px", width: "80px", height: "40px" }}
                  onClick={() =>
                    navi(`/${moimId}/create-board`, {
                      state: { boardType: "FREE" },
                    })
                  }
                >
                  글쓰기
                </ListMoimSearchButton>
              </ListMoimSearchContainer>
            </StyledFooter>
          ) : null}
        </StyledContainer>
      </StyledPaper>
    </StyledBasicContainer>
  );
};

export default FreeBoardList;
