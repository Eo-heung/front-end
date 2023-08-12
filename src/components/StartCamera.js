import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button"; // MUI 버튼 컴포넌트 임포트
import "../css/partials/CameraChatting.css";
import CameraChatting from "../components/CameraChatting";

const StartCamera = () => {
  const myFaceRef = useRef(null);
  const myStreamRef = useRef(null);
  const cameraSelectRef = useRef(null);

  const [myStreamState, setMyStreamState] = useState(null);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [isStartedChatting, setIsStartedChatting] = useState(false);

  useEffect(() => {
    initCall();
  }, []);

  const initCall = async () => {
    await getMedia();
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

  const handleCameraChange = async (e) => {
    const cameraValue = e.target.value;
    setSelectedCamera(cameraValue);

    const newStream = await getMedia(cameraValue);
    setMyStreamState(newStream);
  };

  const handleStartChatting = () => {
    setIsStartedChatting(true);
  };
  return (
    <div>
      <div class="sb-nav-fixed mainpage">
        <div id="layoutSidenav">
          <div id="layoutSidenav_content">
            <div className="start-video">
              <div className="start-screen">
                {isStartedChatting === false ? (
                  <>
                    <video
                      ref={myFaceRef}
                      className="video-style"
                      muted
                      autoPlay
                      playsInline
                    />
                    <div className="button-container">
                      <select
                        ref={cameraSelectRef}
                        onChange={handleCameraChange}
                      >
                        {/* getCameras 함수에서 <option> 추가될 것임 */}
                      </select>
                      <Button
                        className="start-button"
                        onClick={handleStartChatting}
                      >
                        채팅시작
                      </Button>
                    </div>
                  </>
                ) : (
                  <CameraChatting />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartCamera;
