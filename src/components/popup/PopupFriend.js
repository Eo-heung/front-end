import React, { useState } from "react";
import "../../css/partials/Popup.css";
import friend from "../../public/친구3.png";
import { TextField, Box } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
const Popup = ({
  isOpen,
  onClose,
  handleMakefriend,
  children,
  opponentUserId,
  token,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;
    setPosition({ x: position.x + dx, y: position.y + dy });
    setStartPos({ x: e.clientX, y: e.clientY });
  };
  const theme = createTheme({
    palette: {
      primary: {
        main: "#1976d2", // 이것은 기본 MUI blue입니다.
      },
      secondary: {
        main: "#dc004e", // 이것은 예시로 임의의 pink 색상입니다.
      },
    },
    typography: {
      fontFamily: "Roboto, Arial, sans-serif",
      h1: {
        fontSize: "2rem",
        fontWeight: 500,
      },
      h2: {
        fontSize: "1.5rem",
        fontWeight: 500,
      },
      h3: {
        fontSize: "1.25rem",
        fontWeight: 500,
      },
      // 기타 필요한 타이포그래피 설정들을 여기에 추가할 수 있습니다.
    },
    // 필요한 경우 기타 테마 설정을 여기에 추가하십시오.
  });

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!isOpen) return null;

  return (
    <ThemeProvider theme={theme}>
      <div
        className="popup-overlay custom-popup"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div
          className="popup-content"
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            width: "25vw",
            height: "35vh",
          }}
          onMouseDown={handleMouseDown}
        >
          {children}
          <img
            src={friend}
            alt="friend"
            style={{
              position: "absolute",
              right: "1vw",
              top: "-3vh",
              width: "10vw",
              height: "20vh", // 세로 길이를 조금 늘렸습니다.
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: "absolute", // position을 absolute로 설정합니다.
              bottom: "2vh", // 하단으로부터 5vh 떨어진 곳에 위치합니다.
              right: "1vw",
              width: "90%", // div가 전체 너비를 차지하도록 설정합니다.
              textAlign: "right", // 버튼을 중앙에 배치합니다.
            }}
          >
            <button
              onClick={() => {
                handleMakefriend();
                onClose();
              }}
              style={{
                marginRight: "10px",
              }}
            >
              친구하기
            </button>
            <button onClick={onClose}>닫기</button>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Popup;
