import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import "../css/partials/TextChatting.css";

function Chatting() {
  const [roomName, setRoomName] = useState("");
  const [roomHidden, setRoomHidden] = useState(true);
  const [messages, setMessages] = useState([]);
  const [nickname, setNickname] = useState("");
  const chatContainerRef = useRef(null);
  const socket = useRef();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    console.log("useEffect 실행");
    socket.current = io("http://172.30.1.6:5000");

    const handleMessage = (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: message, type: "received" },
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

    // 클린업 함수에서 리스너를 제거합니다.
    return () => {
      socket.current.off("new_message", handleMessage);
      socket.current.off("welcome", handleWelcome);
      socket.current.off("bye", handleBye);
    };
  }, []);

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
        { content: `${nickname}: ${message}`, type: "sent" },
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

  return (
    <div className="sb-nav-fixed mainpage">
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
                            {message.content}
                          </li>
                        ))}
                      </ul>
                      {/* <div style={{ height: "70px" }} /> */}
                    </div>
                    <form id="msg" onSubmit={handleMessageSubmit}>
                      <input
                        type="text"
                        name="message"
                        placeholder="Type your message"
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
  );
}

export default Chatting;
