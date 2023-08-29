import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import CameraChatting from "../chatting/CameraChatting";
import NoCamera from "../../css/partials/카메라 예외.png";

const StartCamera = () => {
  const myFaceRef = useRef(null);
  const myStreamRef = useRef(null);
  const cameraSelectRef = useRef(null);
  const micSelectRef = useRef(null);

  const [isStartedChatting, setIsStartedChatting] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const [selectedCameraId, setSelectedCameraId] = useState(null);
  const [selectedMicId, setSelectedMicId] = useState(null);

  useEffect(() => {
    initCall();
    // 클린업 함수
    return () => {
      // 스트림의 각 트랙(track)을 멈춰서 브라우저의 카메라 및 마이크 접근을 종료합니다.
      if (myStreamRef.current) {
        myStreamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
      myStreamRef.current = null;
    };
  }, []);

  useEffect(() => {
    getMedia(selectedCameraId, selectedMicId);
    // 클린업 함수
    return () => {
      if (myStreamRef.current) {
        myStreamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [selectedCameraId, selectedMicId]);

  const initCall = async () => {
    await getMedia();
  };

  const getMedia = async (cameraId = null, micId = null) => {
    // 이전 스트림 종료
    if (myStreamRef.current) {
      myStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
    }
    const initialConstrains = {
      audio: true,
      video: { facingMode: "user" },
    };
    let constraints = {
      // audio: true,
      audio: micId ? { deviceId: { exact: micId } } : true,
      video: cameraId
        ? { deviceId: { exact: cameraId } }
        : { facingMode: "user" },
    };

    // console.log(micId);

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      myStreamRef.current = stream;

      if (myFaceRef.current) {
        myFaceRef.current.srcObject = stream;
        await getCameras();
      }
    } catch (e) {
      setHasCamera(false);
      console.log(e);
    }
  };

  const getCameras = async () => {
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      // console.log(deviceList);
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
          if (selectedCameraId === camera.deviceId) {
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
        // console.log(currentMic);
        // setSelectedMicId(currentMic.label);
        micList.forEach((mic) => {
          const option = document.createElement("option");
          // console.log(mic);
          option.value = mic.deviceId;
          option.innerText = mic.label;
          if (currentMic.label === mic.label) {
            option.selected = true;
            setSelectedMicId(mic.deviceId);
            // console.log(`selectedMicId : ${selectedMicId}`);
            // console.log(`mic.deviceId : ${mic.deviceId}`);
          }
          if (micSelectRef.current) {
            micSelectRef.current.appendChild(option);
          }
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleCameraChange = async (e) => {
    const cameraValue = e.target.value;
    setSelectedCameraId(cameraValue);
  };

  const handleMicChange = async (e) => {
    // await getMedia()
    const micValue = e.target.value;
    // console.log(micValue);
    setSelectedMicId(micValue);
  };

  const handleStartChatting = () => {
    setIsStartedChatting(true);
  };
  return (
    <div>
      <div class="sb-nav-fixed">
        <div id="layoutSidenav">
          <div id="layoutSidenav_content">
            <div
              className="start-video"
              style={{
                marginTop: "1vh",
              }}
            >
              <div className="start-screen">
                {isStartedChatting === false ? (
                  <div>
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
                      <img
                        src={NoCamera}
                        alt="카메라를 준비해주세요"
                        style={{ width: "70vw", height: "100vh" }}
                      />
                    )}
                  </div>
                ) : (
                  <CameraChatting
                    selectedCamera={selectedCameraId}
                    selectedMic={selectedMicId}
                  />
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
