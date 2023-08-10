import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "../css/partials/CameraChatting.css";

// import "../css/partials/Style.css";

const CameraChatting = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isStartedHidden, setIsStartedHidden] = useState(false);
  const [myStreamState, setMyStreamState] = useState(null);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("연결되지 않음");

  const roomNameRef = useRef(null);
  const myPeerConnection = useRef(null); // useRef는 연결 객체가 변경될 때마다 컴포넌트를 리렌더링하지 않도록 하기 위해 사용됩니다.
  const myDataChannel = useRef(null);
  const myStreamRef = useRef(null);
  const myFaceRef = useRef(null);
  const cameraSelectRef = useRef(null);
  const peerFaceRef = useRef(null);
  const iceCandidateQueue = useRef([]);

  const socket = useRef();

  useEffect(() => {
    socket.current = io("http://192.168.0.64:5000");
    initCall();

    // 연결됐을 때
    socket.current.on("connect", () => {
      setConnectionStatus("연결됨");
    });

    // 연결이 끊어졌을 때
    socket.current.on("disconnect", () => {
      setConnectionStatus("연결 끊김");
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

    socket.current.on("user-disconnected", (id) => {
      console.log("User disconnected:", id);
      setConnectionStatus("한명 나감");
      // 이제 여기에서 필요한 UI 변경을 처리하면 됩니다.
    });

    // 클린업 (component unmount 또는 dependencies 변경 시 실행됨)
    return () => {
      socket.current.off("welcome");
      socket.current.off("offer");
      socket.current.off("answer");
      socket.current.off("ice");
      socket.current.disconnect();
    };
  }, []); // 빈 배열은 이 효과가 컴포넌트 마운트 시 한 번만 실행되게 함

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

  const processIceCandidateQueue = () => {
    console.log(iceCandidateQueue);
    while (iceCandidateQueue.current.length) {
      const iceCandidate = iceCandidateQueue.current.shift();
      myPeerConnection.current.addIceCandidate(iceCandidate);
    }
  };

  const handleTrack = (event) => {
    console.log("track");
    const stream = event.streams[0];
    peerFaceRef.current.srcObject = stream;
  };

  const getCameras = async () => {
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const cameraList = deviceList.filter(
        (device) => device.kind === "videoinput"
      );

      if (myStreamRef.current) {
        const currentCamera = myStreamRef.current.getVideoTracks()[0];
        cameraList.forEach((camera) => {
          const option = document.createElement("option");
          option.value = camera.deviceId;
          option.innerText = camera.label;
          if (currentCamera && currentCamera.label === camera.label) {
            option.selected = true;
          }
          if (cameraSelectRef.current) {
            cameraSelectRef.current.appendChild(option);
          }
        });
      }
      // console.log(deviceList);
      // console.log(cameraList);
    } catch (e) {
      console.log(e);
    }
  };

  const getMedia = async (deviceId) => {
    const initialConstrains = {
      audio: true,
      video: { facingMode: "user" },
    };
    const cameraConstraints = {
      audio: true,
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

      await getCameras();
    } catch (e) {
      console.log(e);
    }
  };

  const initCall = async () => {
    await getMedia();
    makeConnection();
  };

  const handleStartRandomChat = () => {
    socket.current.emit("request_random_chat");
    if (socket.current.disconnected) {
      socket.current.connect();
      makeConnection();
    }
    setIsStartedHidden(!isStartedHidden);
  };

  const handleStopRandomChat = () => {
    socket.current.emit("stop_random_chat");
    socket.current.disconnect();
    setIsStartedHidden(!isStartedHidden);
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

  const handleCameraChange = async (e) => {
    const cameraValue = e.target.value;
    setSelectedCamera(cameraValue);

    const newStream = await getMedia(cameraValue);
    setMyStreamState(newStream);

    if (myPeerConnection) {
      console.log(myPeerConnection.getSenders());
      const videoTrack = newStream.getVideoTracks()[0];
      const videoSender = myPeerConnection
        .getSenders()
        .find((sender) => sender.track.kind === "video");

      videoSender.replaceTrack(videoTrack);
    }
  };

  return (
    <div>
      <div class="sb-nav-fixed mainpage">
        <div id="layoutSidenav">
          <div id="layoutSidenav_content">
            <div id="call">
              <div id="myStreamState">
                <h1>Socket.io 연결 상태: {connectionStatus}</h1>
                <video
                  ref={myFaceRef}
                  muted
                  autoPlay
                  playsInline
                  width="400"
                  height="400"
                />
                <button onClick={() => handleMuteClick()}>
                  {isMuted ? "UnMute" : "Mute"}
                </button>
                <button onClick={() => handleCameraOnOff()}>
                  {isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
                </button>
                <button
                  onClick={() => handleStartRandomChat()}
                  hidden={isStartedHidden}
                >
                  시작
                </button>
                <button
                  onClick={() => handleStopRandomChat()}
                  hidden={!isStartedHidden}
                >
                  종료
                </button>

                {connectionStatus == "매칭됨" ? (
                  <video
                    ref={peerFaceRef}
                    autoPlay
                    playsInline
                    width="400"
                    height="400"
                  />
                ) : (
                  <div>상대 찾는중 어흥!</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <select
                      ref={cameraSelectRef}
                      onChange={() => handleCameraChange()}
                    /> */}
    </div>
  );
};

export default CameraChatting;
