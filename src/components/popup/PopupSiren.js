import React, { useState, useEffect } from "react";
import "../../css/partials/Popup.css";
import { TextField, Box } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import singo from "../../public/신고2.png";
const Popup = ({ isOpen, onClose, handleSubmitSiren, children }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [reportType, setReportType] = useState("1");
  const [reportContent, setReportContent] = useState("");
  const [selectedImages, setSelectedImages] = useState([]); // 파일구조
  const [imagePreviews, setImagePreviews] = useState([]); // base64

  useEffect(() => {
    setReportType("1");
    setReportContent("");
    setSelectedImages([]);
    setImagePreviews([]);
  }, [onClose]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
  };

  const handleContentChange = (event) => {
    setReportContent(event.target.value);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;
    setPosition({ x: position.x + dx, y: position.y + dy });
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (selectedImages.length + files.length > 3) {
      alert("최대 3개의 이미지만 첨부할 수 있습니다.");
      e.target.value = ""; // 선택된 파일을 초기화합니다.
      return;
    }

    const updatedFiles = [...selectedImages, ...files];
    setSelectedImages(updatedFiles);

    // 선택된 이미지를 미리보기로 보여주기
    const updatedPreviews = [...imagePreviews];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatedPreviews.push(reader.result);
        setImagePreviews([...updatedPreviews]);
      };
      reader.readAsDataURL(file);
    });
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
  const handleImageDelete = (idx) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(idx, 1);
    setSelectedImages(updatedImages);

    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(idx, 1);
    setImagePreviews(updatedPreviews);
  };
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
            minHeight: "500px", // 팝업 세로 길이를 조절
          }}
          onMouseDown={handleMouseDown}
        >
          {children}
          <img
            src={singo}
            alt="singo"
            style={{
              position: "absolute",
              right: "10px",
              top: "10px",
              width: "40%",
              height: "40%",
              zIndex: 1, // 이미지가 다른 요소들 위에 표시되도록 z-index 추가
            }}
          />
          <div class="select-container" style={{ marginTop: "20%" }}>
            {/* 이미지 아래로 select-container를 이동시키기 위해 marginTop 추가 */}
            <select
              class="styled-select"
              value={reportType}
              onChange={handleReportTypeChange}
            >
              <option value="1">욕설</option>
              <option value="2">비하</option>
              <option value="3">음란</option>
              <option value="4">사기</option>
              <option value="5">기타</option>
            </select>
          </div>
          <Box sx={{ mt: 2 }}>
            <TextField
              id="reportContent"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              style={{ marginBottom: "10px", marginTop: "20px" }}
              // 이미지와 겹치지 않게 위로 여백 추가
              label="신고 내용"
              value={reportContent}
              onChange={handleContentChange}
            />
            <input
              type="file"
              onChange={handleImageChange}
              style={{ marginBottom: "10px" }}
              multiple
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              {imagePreviews.map((preview, idx) => (
                <div key={idx} style={{ position: "relative" }}>
                  <img
                    src={preview}
                    alt={`Selected Preview ${idx}`}
                    style={{
                      width: "30%",
                      maxHeight: "20%",
                      marginTop: "10px",
                      marginLeft: idx > 0 ? "5%" : "0%",
                      objectFit: "contain",
                      border: "1px solid #ccc",
                    }}
                  />
                  <button
                    style={{
                      position: "absolute",
                      top: 1,
                      right: 1,
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => handleImageDelete(idx)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </Box>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end", // 이 부분을 추가하여 버튼들을 오른쪽으로 정렬
            }}
          >
            <button
              onClick={() => {
                handleSubmitSiren(
                  reportType,
                  reportContent,
                  selectedImages,
                  imagePreviews
                );
                onClose();
              }}
              style={{ marginRight: "10px" }}
            >
              신고하기
            </button>
            <button onClick={onClose}>취소</button>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Popup;
