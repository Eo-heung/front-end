import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button"; // MUI 버튼 컴포넌트 임포트
import "../css/partials/CameraChatting.css";
import CameraChatting from "../components/CameraChatting";
import NoCamera from "../css/partials/카메라 예외.png";

const StartCamera = () => {
  const myFaceRef = useRef(null);
  const myStreamRef = useRef(null);
  const cameraSelectRef = useRef(null);
  const micSelectRef = useRef(null);

  const [myStreamState, setMyStreamState] = useState(null);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [isStartedChatting, setIsStartedChatting] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);

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
      setHasCamera(false); // 에러가 발생하면 카메라가 없다고 가정
      console.log(e);
    }
  };
  const getCameras = async () => {
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const cameraList = deviceList.filter(
        (device) => device.kind === "videoinput"
      );
      const micList = deviceList.filter(
        (device) => device.kind === "audioinput"
      );

      // 카메라 유무 확인 후 상태 업데이트
      setHasCamera(cameraList.length > 0);

      // 기존 카메라 옵션들 삭제
      if (cameraSelectRef.current) {
        while (cameraSelectRef.current.firstChild) {
          cameraSelectRef.current.removeChild(
            cameraSelectRef.current.firstChild
          );
        }
      }

      // 기존 마이크 옵션들 삭제
      if (micSelectRef.current) {
        while (micSelectRef.current.firstChild) {
          micSelectRef.current.removeChild(micSelectRef.current.firstChild);
        }
      }

      // 카메라 옵션 추가
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

      // 마이크 옵션 추가
      if (myStreamRef.current) {
        const currentMic = myStreamRef.current.getAudioTracks()[0];
        micList.forEach((mic) => {
          const option = document.createElement("option");
          option.value = mic.deviceId;
          option.innerText = mic.label;
          if (currentMic && currentMic.label === mic.label) {
            option.selected = true;
          }
          if (micSelectRef.current) {
            micSelectRef.current.appendChild(option);
          }
        });
      }
    } catch (e) {
      console.log(e);
      setHasCamera(false); // 에러가 발생하면 카메라가 없다고 가정
    }
  };

  const handleCameraChange = async (e) => {
    const cameraValue = e.target.value;
    setSelectedCamera(cameraValue);

    const newStream = await getMedia(cameraValue);
    setMyStreamState(newStream);
  };

  const handleMicChange = async (e) => {
    const micValue = e.target.value;
    // 카메라와 마이크를 동시에 설정하려면 여기에 로직을 추가해야 합니다.
    // 예를 들면, getMedia 함수를 수정하여 두 개의 deviceId를 받아 처리할 수 있습니다.
    // 현재 로직은 카메라나 마이크 중 하나만 변경될 때 해당 장치만 업데이트하는 것을 기반으로 합니다.
    const newStream = await getMedia(null, micValue);
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
                    {hasCamera ? (
                      <div>
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
                            className="start-select"
                          >
                            {/* getCameras 함수에서 <option> 추가될 것임 */}
                          </select>
                          <select
                            ref={micSelectRef}
                            onChange={handleMicChange}
                            className="start-select"
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
                      </div>
                    ) : (
                      <img src={NoCamera} alt="카메라를 준비해주세요" />
                    )}
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
