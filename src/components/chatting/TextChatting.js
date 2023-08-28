import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import "../../css/partials/TextChatting.css";
import Link from "react-router-dom";

function TextChatting() {
  const [roomName, setRoomName] = useState("");
  const [roomHidden, setRoomHidden] = useState(true);
  const [messages, setMessages] = useState([]);
  const [nickname, setNickname] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);

  const chatContainerRef = useRef(null);
  const socket = useRef();

  useEffect(() => {
    socket.current = io("http://localhost:4000");

    const handleMessage = (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: message, type: "received", timestamp: new Date() },
      ]);
    };
    const handleWelcome = (user, newCount) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: `${user} 님이 들어오셨습니다.`, type: "received" },
      ]);
    };

    const handleBye = (left, newCount) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: `${left}님께서 채팅방을 떠나셨습니다.`, type: "received" },
      ]);
    };
    socket.current.on("new_message", handleMessage);
    socket.current.on("welcome", handleWelcome);
    socket.current.on("bye", handleBye);

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
    // 클린업 함수에서 리스너를 제거합니다.
    return () => {
      socket.current.off("new_message", handleMessage);
      socket.current.off("welcome", handleWelcome);
      socket.current.off("bye", handleBye);
      socket.current.off("typing", handleTyping);
    };
  }, []);

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
    socket.current.emit("new_message", message, roomName, () => {
      setMessages([
        ...messages,
        {
          content: `${message}`,
          type: "sent",
          timestamp: new Date(),
        },
      ]);
    });
    e.target.message.value = "";
  };

  const handleNicknameSubmit = (e) => {
    e.preventDefault();
    const nickname = e.target.nickname.value;
    socket.current.emit("nickname", nickname);
    setNickname(nickname);
  };

  const handleRoomSubmit = (e) => {
    e.preventDefault();
    const roomName = e.target.roomName.value;
    socket.current.emit("enter_room", roomName, () => {
      setRoomHidden(false);
      setRoomName(roomName);
    });
  };

  const handleMessageInput = () => {
    socket.current.emit("typing", roomName);
  };

  const handleMessageDate = (message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { content: message, type: "received", timestamp: new Date() },
    ]);
  };

  return (
    <div className="sb-nav-fixed mainpage">
      <div className="text">
        <div id="layoutSidenav">
          <div id="layoutSidenav_content">
            <main>
              <div className="container-fluid px-4">
                <div>
                  {roomHidden ? (
                    <form onSubmit={handleRoomSubmit}>
                      <input
                        type="text"
                        name="roomName"
                        placeholder="Enter room name"
                      />
                      <button type="submit">Join Room</button>
                    </form>
                  ) : (
                    <div id="room">
                      <h3>Room {roomName}</h3>
                      <form id="name" onSubmit={handleNicknameSubmit}>
                        <input
                          type="text"
                          name="nickname"
                          placeholder="Enter your nickname"
                        />
                        <button type="submit">Set Nickname</button>
                      </form>
                      <div id="chat-container" ref={chatContainerRef}>
                        <ul>
                          {messages.map((message, index) => (
                            <li
                              key={index}
                              className={`chat-message ${message.type}`}
                            >
                              {message.content}{" "}
                              <span className="message-time">
                                {message.timestamp &&
                                !isNaN(new Date(message.timestamp))
                                  ? new Date(
                                      message.timestamp
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : ""}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <div id="typing-indicator">
                          {typingUsers.length > 0 && (
                            <span>
                              {typingUsers.join(", ")}님이 입력하고 있습니다.
                            </span>
                          )}
                        </div>
                        {/* <div style={{ height: "70px" }} /> */}
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
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TextChatting;
