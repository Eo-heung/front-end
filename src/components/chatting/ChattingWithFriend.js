import React, { useEffect, useRef, useState } from "react";
import ChattingFriendList from "./ChattingFriendList";
import TextChatting from "./TextChatting";
import axios from "axios";
import { SPRING_API_URL, NODE_API_URL } from "../../config";

const ChattingWithFriend = () => {
  const [friendId, setFriendId] = useState(null);
  const [friendNickname, setFriendNickname] = useState(null);

  return (
    <>
      <div class="sb-nav-fixed">
        <div id="layoutSidenav">
          <div id="layoutSidenav_content" style={{}}>
            <div style={{ display: "flex" }}>
              <div
                style={{
                  flex: 3,
                }}
              >
                <ChattingFriendList
                  setFriendId={setFriendId}
                  setFriendNickname={setFriendNickname}
                />
              </div>
              <div
                style={{
                  flex: 7,
                }}
              >
                <TextChatting
                  friendId={friendId}
                  friendNickname={friendNickname}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChattingWithFriend;
