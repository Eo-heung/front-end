import React, { useEffect, useRef, useState } from "react";
import { Grid, Typography, Container, Paper } from "@mui/material";
import styled from "@emotion/styled";
import basicProfile from "../../public/basic_profile.png";
import axios from "axios";
import { SPRING_API_URL, NODE_API_URL } from "../../config";

const StyledContainer = styled(Container)`
  width: "100%";
`;

const BoxContent = styled.div`
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
`;

const ChattingFriendList = ({ setFriendId, setFriendNickname }) => {
  useEffect(() => {
    getFriendList();
  }, []);

  const handleSetFriendId = (friendId, friendNickname) => {
    setFriendId(friendId);
    setFriendNickname(friendNickname);
  };

  const [friends, setFriends] = useState([]);

  const getFriendList = async () => {
    axios
      .post(
        `${SPRING_API_URL}/friend/friendList`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
          },
        }
      )
      .then((res) => {
        setFriends(res.data.items);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <StyledContainer
        style={{
          height: "100%",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            paddingLeft: "10px",
            paddingRight: "10px",
            paddingBottom: "5px",
            height: "100%",
          }}
        >
          <Typography
            variant="h1"
            fontSize="18pt"
            sx={{
              fontWeight: "bold",
              marginBottom: "15px",
              marginLeft: "20px",
              paddingTop: "15px",
            }}
          >
            친구 목록
          </Typography>

          {friends.map((friend, index) => (
            <Grid
              item
              xs={12}
              key={index}
              onClick={() =>
                handleSetFriendId(friend.friendsId, friend.user_name)
              }
              sx={{
                marginBottom: "12px",
                paddingLeft: "10px",
                paddingRight: "10px",
              }}
            >
              <BoxContent
                sx={{
                  boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ position: "relative" }}>
                      <img
                        src={
                          friend.profile
                            ? `data:image/jpeg;base64,${friend.profile}`
                            : basicProfile
                        }
                        alt="프로필 사진"
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "25px",
                          marginRight: "8px",
                          border: "2px solid white",
                          boxShadow: `0 0 5px 2px ${
                            friend.online ? "#05FF00" : "#B6B6B6"
                          }`,
                        }}
                      />
                    </div>
                    <Typography variant="h6">
                      <div
                        style={{
                          marginBottom: "8px",
                          marginLeft: "8px",
                        }}
                      >
                        {friend.user_name || "이름 없음"}
                      </div>
                    </Typography>
                  </div>
                </div>
                <Typography variant="body2" sx={{ marginBottom: "6px" }}>
                  <div>지역 : {friend.user_addr3 || "지역 없음"}</div>
                </Typography>
                <Typography variant="body2">
                  <div>
                    상태메세지 :{" "}
                    {friend.user_status_message || "상태 메세지 없음"}
                  </div>
                </Typography>
              </BoxContent>
            </Grid>
          ))}
        </Paper>
      </StyledContainer>
    </>
  );
};

export default ChattingFriendList;
