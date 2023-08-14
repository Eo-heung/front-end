import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";
import DesktopAccessDisabledIcon from "@mui/icons-material/DesktopAccessDisabled";
import Button from "@mui/material/Button";
import EoheungImg from "../css/partials/랜덤.png";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import SpeakerNotesOffIcon from "@mui/icons-material/SpeakerNotesOff";

const CameraChatting = ({ selectedCamera, selectedMic }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("연결되지 않음");
  const [textChatVisible, setTextChatVisible] = useState(false); // 텍스트 채팅 표시 여부 상태
  const [isStartChatting, setIsStartChatting] = useState(false);
  const roomNameRef = useRef(null);
  const myPeerConnection = useRef(null); // useRef는 연결 객체가 변경될 때마다 컴포넌트를 리렌더링하지 않도록 하기 위해 사용됩니다.
  const myDataChannel = useRef(null);
  const myStreamRef = useRef(null);
  const myFaceRef = useRef(null);
  const peerFaceRef = useRef(null);
  const iceCandidateQueue = useRef([]);
  const [roomName, setRoomName] = useState("");
  const [roomHidden, setRoomHidden] = useState(true);
  const [messages, setMessages] = useState([]);
  const [nickname, setNickname] = useState("");
  const chatContainerRef = useRef(null);

  const socket = useRef();

  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);

  useEffect(() => {
    console.log(selectedCamera);
    console.log(`selectedMic : ${selectedMic}`);

    socket.current = io("http://localhost:5000");
    startChatting();

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

    //화상채팅
    // 연결됐을 때
    socket.current.on("connect", () => {
      console.log("connect");
    });

    // 연결이 끊어졌을 때
    socket.current.on("disconnect", () => {
      setConnectionStatus("연결 끊음");
      socket.current.disconnect();
      setIsStartChatting(false);
    });

    // 연결 에러 발생 시
    socket.current.on("connect_error", () => {
      setConnectionStatus("연결 에러");
    });

    socket.current.on("matched", async (roomName) => {
      console.log(`Matched with user in room ${roomName}`);
      setConnectionStatus("매칭됨");
      roomNameRef.current = roomName;
    });

    socket.current.on("welcome", async () => {
      console.log("welcome");
      // myDataChannel.current =
      //   myPeerConnection.current.createDataChannel("chat");
      // myDataChannel.current.addEventListener("message", (event) => {
      //   console.log(event.data);
      // });
      // console.log("made data channel");
      const offer = await myPeerConnection.current.createOffer();
      // console.log(`offer : ${offer}`);
      myPeerConnection.current.setLocalDescription(offer);
      console.log("sent the offer");
      socket.current.emit("offer", offer, roomNameRef.current);
    });

    socket.current.on("offer", async (offer) => {
      // myPeerConnection.current.addEventListener("datachannel", (event) => {
      //   myDataChannel.current = event.channel;
      //   myDataChannel.current.addEventListener("message", (event) => {
      //     console.log(event);
      //   });
      // });
      console.log("received the offer");
      await myPeerConnection.current.setRemoteDescription(offer);

      const answer = await myPeerConnection.current.createAnswer();
      await myPeerConnection.current.setLocalDescription(answer);
      socket.current.emit("answer", answer, roomNameRef.current);
      console.log("sent the answer");
    });

    socket.current.on("answer", async (answer) => {
      console.log("received the answer");
      myPeerConnection.current.setRemoteDescription(answer);
    });

    socket.current.on("ice", (ice) => {
      console.log(`received candidate `);
      myPeerConnection.current.addIceCandidate(ice);
    });

    socket.current.on("user_disconnected", (id) => {
      console.log("User disconnected:", id);
      setConnectionStatus("한명 나감");
      socket.current.disconnect();
      // 이제 여기에서 필요한 UI 변경을 처리하면 됩니다.
      setIsStartChatting(false);
    });

    // 클린업 (component unmount 또는 dependencies 변경 시 실행됨)
    return () => {
      socket.current.off("welcome");
      socket.current.off("offer");
      socket.current.off("answer");
      socket.current.off("ice");
      socket.current.disconnect();
      socket.current.off("new_message", handleMessage);
      socket.current.off("welcome", handleWelcome);
      socket.current.off("bye", handleBye);
    };
  }, []); // 빈 배열은 이 효과가 컴포넌트 마운트 시 한 번만 실행되게 함

  const startChatting = async () => {
    await initCall();
    handleStartRandomChat();
  };

  const initCall = async () => {
    await getMedia();
    makeConnection();
  };

  const getMedia = async (deviceId) => {
    console.log(`getMedia : ${deviceId}`);
    const initialConstrains = {
      audio: true,
      video: { facingMode: "user" },
    };
    const cameraConstraints = {
      video: { deviceId: { exact: deviceId } },
    };
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        deviceId ? cameraConstraints : initialConstrains
      );

      myStreamRef.current = stream;

      if (myFaceRef.current) {
        myFaceRef.current.srcObject = stream;
      }
      console.log("Stream obtained: ", myStreamRef.current);
    } catch (e) {
      console.log(e);
    }
  };

  const makeConnection = () => {
    myPeerConnection.current = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "stun:stun3.l.google.com:19302",
            "stun:stun4.l.google.com:19302",
          ],
        },
      ],
    });
    myPeerConnection.current.addEventListener("icecandidate", handleIce);
    myPeerConnection.current.addEventListener("track", handleTrack);
    myStreamRef.current
      .getTracks()
      .forEach((track) =>
        myPeerConnection.current.addTrack(track, myStreamRef.current)
      );
  };

  const handleIce = (data) => {
    console.log("sent candidate");
    socket.current.emit("ice", data.candidate, roomNameRef.current);
  };

  const handleTrack = (event) => {
    console.log("track");
    const stream = event.streams[0];
    peerFaceRef.current.srcObject = stream;
  };

  const handleStartRandomChat = async () => {
    socket.current.emit("request_random_chat");
    setConnectionStatus("상대 찾는 중 ...");
    setIsStartChatting(!isStartChatting);
    if (socket.current.disconnected) {
      await socket.current.connect();
      await makeConnection();
    } else {
      await makeConnection();
    }
  };

  const handleStopRandomChat = () => {
    socket.current.emit("stop_random_chat");
    setConnectionStatus("정지");
    setIsStartChatting(!isStartChatting);
  };

  const handleMuteClick = () => {
    if (!myStreamRef.current) return;

    const audioTracks = myStreamRef.current.getAudioTracks();
    audioTracks.forEach((track) => (track.enabled = !track.enabled));
    setIsMuted((prevIsMuted) => !prevIsMuted);
  };

  const handleCameraOnOff = () => {
    if (!myStreamRef.current) return;

    const videoTracks = myStreamRef.current.getVideoTracks();
    videoTracks.forEach((track) => (track.enabled = !track.enabled));

    setIsCameraOff((prevIsCameraOff) => !prevIsCameraOff);
  };

  //메세지
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
    <div>
      <div id="call">
        <div id="myStreamState">
          <h1>Socket.io 연결 상태: {connectionStatus}</h1>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {/* 상대방 비디오 혹은 대기 이미지 */}
            {connectionStatus === "매칭됨" ? (
              <video
                ref={peerFaceRef}
                className="video-style3"
                autoPlay
                playsInline
              />
            ) : (
              <img src={EoheungImg} alt="상대 찾는중" className="chat-image" />
            )}

            <video
              ref={myFaceRef}
              className="video-style2"
              muted
              autoPlay
              playsInline
            />
          </div>
          <div className="button-container">
            <button
              className="start-button"
              onClick={handleStartRandomChat}
              disabled={isStartChatting}
              style={{
                backgroundColor: isStartChatting ? "grey" : "#fcbe71",
                color: isStartChatting ? "#495057" : "white",
                boxShadow: isStartChatting
                  ? "0 2px 4px rgba(0, 0, 0, 0.1)"
                  : undefined,
                transform: isStartChatting ? "translateY(2px)" : undefined,
              }}
            >
              시작
            </button>
            <button
              className="end-button"
              onClick={handleStopRandomChat}
              disabled={!isStartChatting}
              style={{
                backgroundColor: !isStartChatting ? "grey" : "#de9392",
                color: !isStartChatting ? "#495057" : "white",
                boxShadow: !isStartChatting
                  ? "0 2px 4px rgba(0, 0, 0, 0.1)"
                  : undefined,
                transform: !isStartChatting ? "translateY(2px)" : undefined,
              }}
            >
              정지
            </button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleMuteClick}
            >
              {isMuted ? <MicOffIcon /> : <MicIcon />}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCameraOnOff}
            >
              {isCameraOff ? (
                <DesktopAccessDisabledIcon />
              ) : (
                <DesktopWindowsIcon />
              )}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCameraOnOff}
            >
              {isCameraOff ? "곧 감" : "너에게"}
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={() => setTextChatVisible(!textChatVisible)}
            >
              {!textChatVisible ? (
                <SpeakerNotesIcon />
              ) : (
                <SpeakerNotesOffIcon />
              )}
            </Button>

            {textChatVisible && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraChatting;
