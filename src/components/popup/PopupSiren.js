import React, { useState } from "react";
import "../../css/partials/Popup.css";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Box,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const Popup = ({ isOpen, onClose, children }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [reportType, setReportType] = useState("욕설");
  const [reportContent, setReportContent] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };
  const handleTypeChange = (event) => {
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

  // 이미지 파일 선택시 핸들러
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(
      0,
      3 - selectedImages.length
    ); // 3개를 초과하지 않게 자르기

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

  return (
    <ThemeProvider theme={theme}>
      <div
        className="popup-overlay"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div
          className="popup-content"
          style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
          onMouseDown={handleMouseDown}
        >
          {children}
          <Box
            onClick={() => document.getElementById("reportContent").focus()} // Box 클릭 시 TextField 활성화
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              maxWidth: "400px",
              margin: "0 auto",
              padding: "20px",
              zIndex: 100000,
            }}
          >
            <FormControl fullWidth variant="outlined">
              {" "}
              {/* FormControl 클릭 시 Select 오픈 */}
              <InputLabel>신고 유형</InputLabel>
              <Select
                id="reportType"
                label="신고 유형"
                value={reportType}
                onChange={handleTypeChange}
                sx={{
                  zIndex: 100000,
                }}
              >
                <MenuItem value={"욕설"}>욕설</MenuItem>
                <MenuItem value={"type1"}>비하</MenuItem>
                <MenuItem value={"type2"}>음란</MenuItem>
                <MenuItem value={"type3"}>사기</MenuItem>
              </Select>
            </FormControl>

            <TextField
              id="reportContent"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              label="신고 내용"
              value={reportContent}
              onChange={handleContentChange}
              sx={{
                zIndex: 100000,
              }}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              multiple // 여러 파일 선택 허용
            />
            {imagePreviews.map((preview, idx) => (
              <img
                key={idx}
                src={preview}
                alt={`Selected Preview ${idx}`}
                style={{
                  width: "30%",
                  maxHeight: "200px",
                  marginTop: "10px",
                  marginLeft: idx > 0 ? "5%" : "0%",
                  objectFit: "contain",
                  border: "1px solid #ccc",
                }}
              />
            ))}
          </Box>
          <div>
            <button onClick={onClose}>신고하기</button>
            <button onClick={onClose}>닫기</button>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Popup;
