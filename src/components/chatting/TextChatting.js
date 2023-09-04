import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { Grid, Typography, Container, Paper } from "@mui/material";
import { NODE_API_URL } from "../../config";
import ChattingHyoLang from "../../public/chatting.png";
import "../../css/partials/TextChatting.css";

function TextChatting({ friendId, friendNickname }) {
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [myUserId, setMyUserId] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);

  const socket = useRef();
  const chatContainerRef = useRef(null);
  const userId = decodeURIComponent(getCookie("userId") || "");

  function getCookie(userId) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${userId}=`);
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
  }

  useEffect(() => {
    setMyUserId(getCookie("userId"));
    socket.current = io(`${NODE_API_URL}`);

    const handleMessage = (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: message, type: "received", timestamp: new Date() },
      ]);
    };

    socket.current.on("new_message", handleMessage);

    const handleTyping = (nickname) => {
      setTypingUsers((prevTypingUsers) => {
        if (!prevTypingUsers.includes(nickname)) {
          return [...prevTypingUsers, nickname];
        }
        return prevTypingUsers;
      });

      // 일정 시간 후에 "입력 중" 상태 제거
      setTimeout(() => {
        setTypingUsers((prevTypingUsers) => {
          return prevTypingUsers.filter((user) => user !== nickname);
        });
      }, 3000);
    };
    socket.current.on("typing", handleTyping);
    return () => {
      socket.current.off("new_message", handleMessage);
      socket.current.off("typing", handleTyping);
    };
  }, []);

  useEffect(() => {
    setMessages([]);
  }, [friendId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer !== null)
      chatContainer.scrollTop = chatContainer.scrollHeight;
  };

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    const message = e.target.message.value;
    if (message.length == 0) return;
    socket.current.emit("new_message", message, roomName, () => {
      setMessages([
        ...messages,
        {
          content: `${message}`,
          sender: myUserId,
          timestamp: new Date(),
        },
      ]);
    });
    e.target.message.value = "";
  };

  // const handleNicknameSubmit = (e) => {
  //   e.preventDefault();
  //   const nickname = e.target.nickname.value;
  //   socket.current.emit("nickname", nickname);
  //   setMyNickname(nickname);
  // };

  // const handleRoomSubmit = (e) => {
  //   e.preventDefault();
  //   const roomName = e.target.roomName.value;
  //   socket.current.emit("enter_room", roomName, () => {
  //     setRoomHidden(false);
  //     setRoomName(roomName);
  //   });
  // };

  const handleMessageInput = () => {
    socket.current.emit("typing", roomName);
  };

  return (
    <Paper className="text" elevation={3}>
      <div style={{ width: "100%", height: "100%" }}>
        {friendId === null ? (
          <div style={{ width: "100%", height: "100%" }}>
            <img
              src={ChattingHyoLang}
              style={{
                width: "100%",
                height: "100%",
              }}
            ></img>
          </div>
        ) : (
          <div id="room">
            <h3>{friendNickname}</h3>
            <div
              id="chat-containers"
              ref={chatContainerRef}
              style={{
                position: "relative",
              }}
            >
              <ul>
                {messages.map((message, index) => (
                  <li
                    key={index}
                    className={`chat-message ${
                      message.sender === userId ? "sent" : "received"
                    } `}
                  >
                    {message.content}{" "}
                    <span className="message-time">
                      {message.timestamp && !isNaN(new Date(message.timestamp))
                        ? new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </li>
                ))}
              </ul>
              <div
                id="typing-indicator"
                style={{
                  width: "100%",
                }}
              >
                {typingUsers.length > 0 && (
                  <span>{typingUsers.join(", ")}님이 입력하고 있습니다.</span>
                )}
              </div>
            </div>
            <form id="msg" onSubmit={handleMessageSubmit}>
              <input
                type="text"
                name="message"
                placeholder="Type your message"
                onKeyDown={handleMessageInput}
              />
              <button type="submit">Send</button>
            </form>
          </div>
        )}
      </div>
    </Paper>
  );
}

export default TextChatting;
