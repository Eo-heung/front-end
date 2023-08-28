import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { StyledForm, WriteZone, StyledBox, PageTitle, StyledButton, CounterTypography, CounterBox, StyledTextField, StyledLink, ImageAttaZone, ButtonZone } from '../utils/StyledCreate';
import { Button, Box, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { useNavigate } from 'react-router';

const CreateBoard = ({ moimId, boardType, onSuccess, boardId, onModifySuccess }) => {
    const navi = useNavigate();
    const [cookie] = useCookies("userNickname");

    const boardFileInputRef = useRef(null);

    const [boardInputs, setBoardInputs] = useState({
        userNickname: cookie.userNickname || "",
        boardTitle: "",
        boardContent: "",
        freePics: []
    });

    const handleInputChange = useCallback((e) => {
        setBoardInputs(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }, []);

    const triggerFileInput = () => {
        if (boardFileInputRef.current) {
            boardFileInputRef.current.click();
        } else {
            console.error("File input not found");
            console.log(boardFileInputRef.current);
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setBoardInputs(prev => ({
            ...prev,
            freePics: prev.freePics.concat(files)
        }));
    };

    const handleImageRemove = (indexToRemove) => {
        setBoardInputs(prev => ({
            ...prev,
            freePics: prev.freePics.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleImageReplace = (index, newFile) => {
        setBoardInputs(prev => {
            const newFreePics = [...prev.freePics];
            newFreePics[index] = newFile;
            return { ...prev, freePics: newFreePics };
        });
    };

    const handleImageUploadAgain = (index) => {
        if (boardFileInputRef.current) {
            const fileInput = boardFileInputRef.current;
            fileInput.onchange = (e) => {
                const newFile = e.target.files[0];

                if (newFile) {
                    handleImageReplace(index, newFile);
                }
            };

            fileInput.click();
        }
    };

    useEffect(() => {
        const fetchBoardData = async () => {
            try {
                let response;

                if (boardType === "FREE") {
                    response = await axios.post(`http://localhost:9000/board/${moimId}/free-board/${boardId}`, {}, {
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                        }
                    });
                } else {
                    response = await axios.post(`http://localhost:9000/board/${moimId}/notice-board/${boardId}`, {}, {
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                        }
                    });
                }

                const { boardTitle, boardContent } = response.data;

                setBoardInputs(prev => ({
                    ...prev,
                    userNickname: response.data.userNickname,
                    boardTitle: response.data.boardTitle,
                    boardContent: response.data.boardContent
                }));
            } catch (err) {
                console.error("Error fetching board data", err);
            }
        };

        if (boardId) {
            fetchBoardData();
        }
    }, [boardId, moimId, boardType]);

    const handleSubmit = async () => {
        const { boardTitle, boardContent, freePics } = boardInputs;
        const formData = new FormData();

        formData.append("boardTitle", boardTitle);
        formData.append("boardContent", boardContent);
        formData.append("boardType", boardType);

        if (freePics) {
            freePics.forEach((pic, index) => {
                formData.append(`freePic-${index}`, pic);
            });
        }

        try {
            if (boardId) {
                const response = await axios.post(`http://localhost:9000/${moimId}/modify-board/${boardId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.status === 200) {
                    console.log("modify success!")
                    onModifySuccess();
                }
            } else {
                const response = await axios.post(`http://localhost:9000/${moimId}/create-board`, formData, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.status === 200) {
                    console.log("submit success!");
                    onSuccess();
                }
            }
        } catch (err) {
            console.log("Error occurred create board", err);
        }
    };

    const handleCancel = () => {
        navi(-1);
    };

    return (
        <StyledBox>
            <StyledForm onSubmit={handleSubmit}>
                <WriteZone>
                    <PageTitle>새로운 글을 작성해요.</PageTitle>
                    <Box border={0} my={0} display="flex" alignItems="center">
                        <h5 fontWeight="bold" style={{ width: '110px' }}>작성자</h5>
                        <Typography variant="body1" color={grey[600]}>{boardInputs.userNickname}</Typography>
                    </Box>
                    <h5 fontWeight="bold">제목</h5>
                    <StyledTextField
                        name="boardTitle"
                        value={boardInputs.boardTitle}
                        onChange={handleInputChange}
                        variant="outlined"
                        placeholder="제목을 입력해주세요."
                    />
                    <h5 fontWeight="bold">내용</h5>
                    <StyledTextField
                        name="boardContent"
                        value={boardInputs.boardContent}
                        onChange={handleInputChange}
                        variant="outlined"
                        placeholder="내용을 입력해주세요."
                        multiline rows={4}
                    />
                    <h5 fontWeight="bold" style={{ marginTop: "1.2rem" }}>
                        첨부 사진
                    </h5>
                    {
                        boardInputs.freePics.length > 0
                            ?
                            boardInputs.freePics.map((freePic, index) => (
                                <div key={index} style={{ position: 'relative', display: 'inline-block', marginRight: '10px' }}>
                                    <img
                                        id={`previewImage-${index}`}
                                        src={URL.createObjectURL(freePic)}
                                        alt={`게시글 사진 ${index}`}
                                        style={{ maxWidth: "300px", maxHeight: "300px", objectFit: "cover", cursor: "pointer" }}
                                        onClick={() => handleImageUploadAgain(index)}
                                    />
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "0",
                                            right: "0",
                                            backgroundColor: "white",
                                            color: "red",
                                            cursor: "pointer",
                                            padding: "5px 5px",
                                            borderRadius: "50%"
                                        }}
                                        onClick={() => handleImageRemove(index)}
                                    >
                                        X
                                    </div>
                                    <input ref={boardFileInputRef} type="file" accept="image/*" hidden></input>
                                </div>
                            ))
                            :
                            <ImageAttaZone>
                                <Button onClick={triggerFileInput} style={{ color: grey[600], padding: "11% 42.1%" }}>
                                    <AddPhotoAlternateOutlinedIcon
                                        fontSize="large"
                                        style={{
                                            marginBottom: "0.2rem",
                                            color: grey[600],
                                            '&:hover': {
                                                color: "#FCBE71"
                                            }
                                        }}
                                    />
                                    사진 첨부
                                    <input ref={boardFileInputRef} type="file" accept="image/*" multiple hidden onChange={handleImageUpload}></input>
                                </Button>
                            </ImageAttaZone>
                    }
                </WriteZone>
                <ButtonZone>
                    <StyledButton type="submit" variant="contained" size="large">등록</StyledButton>
                    <StyledButton type="button" variant="contained" size="large" onClick={handleCancel}>취소</StyledButton>
                </ButtonZone>
            </StyledForm>
        </StyledBox>
    );
};

export default CreateBoard;