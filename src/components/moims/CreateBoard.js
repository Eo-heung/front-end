import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { StyledForm, WriteZone, StyledBox, PageTitle, StyledButton, CounterTypography, CounterBox, StyledTextField, StyledLink, ImageAttaZone, ButtonZone } from '../utils/StyledCreate';
import { Button, Box, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import BasicBoard from '../utils/BasicBoard';
import { SPRING_API_URL } from '../../config';

const CreateBoard = () => {
    const navi = useNavigate();
    const [cookie] = useCookies("userNickname");

    const { moimId, boardId } = useParams();
    const location = useLocation();
    const boardType = location.state?.boardType;

    console.log("boardType", boardType);

    const multipleFileInputRef = useRef(null);
    const singleFileInputRef = useRef(null);
    const [imageUpdateCount, setImageUpdateCount] = useState(0);

    const [boardInputs, setBoardInputs] = useState({
        userName: cookie.userNickname || "",
        boardTitle: "",
        boardContent: "",
        freePics: []
    });
    const [boardPics, setBoardPics] = useState([]);

    const handleInputChange = useCallback((e) => {
        setBoardInputs(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }, []);

    const triggerFileInput = () => {
        if (multipleFileInputRef.current) {
            multipleFileInputRef.current.click();
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setBoardInputs(prev => ({
            ...prev,
            freePics: prev.freePics.concat(files)
        }));
    };

    const handleSingleImageUpload = (e) => {
        const newFile = e.target.files[0];
        const index = e.target.dataset.index;

        if (newFile && typeof index !== 'undefined') {
            handleImageReplace(Number(index), newFile);
        }
    };

    const handleImageRemove = (indexToRemove) => {
        const mergedPics = [...boardPics, ...boardInputs.freePics];

        if (indexToRemove < boardPics.length) {
            const newBoardPics = mergedPics.filter((_, index) => index !== indexToRemove);
            setBoardPics(newBoardPics);
        } else {
            const indexInFreePics = indexToRemove - boardPics.length;
            setBoardInputs(prev => ({
                ...prev,
                freePics: prev.freePics.filter((_, index) => index !== indexInFreePics)
            }));
        }
    };

    const handleImageReplace = (index, newFile) => {
        const mergedPics = [...boardPics, ...boardInputs.freePics];

        if (index < boardPics.length) {
            const newBoardPics = [...mergedPics];
            newBoardPics[index] = newFile;
            setBoardPics(newBoardPics);
        } else {
            const indexInFreePics = index - boardPics.length;
            setBoardInputs(prev => {
                const newFreePics = [...prev.freePics];
                newFreePics[indexInFreePics] = newFile;
                return { ...prev, freePics: newFreePics };
            });
        }

        setImageUpdateCount(prev => prev + 1);
    };

    const handleImageUploadAgain = (index) => {
        if (singleFileInputRef.current) {
            singleFileInputRef.current.dataset.index = index;
            singleFileInputRef.current.click();
        }
    };

    const renderPreviewImage = (pic, index, isFreePic = false) => {
        let imgSrc;

        if (isFreePic) {
            imgSrc = URL.createObjectURL(pic);
        } else if (typeof pic === 'object' && pic instanceof File) {
            imgSrc = URL.createObjectURL(pic);
        } else {
            imgSrc = `data:image/jpeg;base64,${pic}`;
        }

        return (
            <div key={index} style={{ position: 'relative', display: 'inline-block', marginRight: '10px' }}>
                <img
                    src={imgSrc}
                    alt={`게시글 사진 ${index}`}
                    style={{ maxWidth: "300px", maxHeight: "300px", objectFit: "cover", cursor: "pointer" }}
                    onClick={() => handleImageUploadAgain(isFreePic ? index + boardPics.length : index)}
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
                    onClick={(e) => {
                        e.stopPropagation();
                        handleImageRemove(isFreePic ? index + boardPics.length : index);
                    }}
                >
                    X
                </div>
            </div>
        );
    };

    useEffect(() => {
        const fetchBoardData = async () => {
            try {
                const response = await axios.post(`${SPRING_API_URL}/board/${moimId}/view-board/${boardId}`, {}, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                    }
                });

                const { userName, boardTitle, boardContent } = response.data.item.boardDTO;
                setBoardInputs(prev => ({
                    ...prev,
                    userName,
                    boardTitle,
                    boardContent,
                    boardType
                }));

                const fetchBoardPics = response.data.item.boardPics;
                setBoardPics(fetchBoardPics);
            } catch (err) {
                console.error("Error fetching board data", err);
            }
        };

        if (boardId) {
            fetchBoardData();
        }
    }, [boardId, moimId, boardType]);

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                const response = await axios.post(`${SPRING_API_URL}/board/${moimId}/modify-board/${boardId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.status === 200 || response.status === 201) {
                    console.log("modify success!")
                    handleModifySuccess();
                } else {
                    console.log("modify failed");
                }
            } else {
                console.log("33333");
                const response = await axios.post(`http://localhost:9000/board/${moimId}/create-board`, formData, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.status === 200 || response.status === 201) {
                    console.log("submit success!");
                    handleSuccess();
                }
            }
        } catch (err) {
            console.log("Error occurred create board", err);
        }
    };

    const handleCancel = () => {
        navi(-1);
    };

    const handleSuccess = () => {
        alert("성공적으로 게시글을 등록했어요.");

        switch (boardType) {
            case 'FREE':
                navi(`/${moimId}/moim-board?label=자유 게시판`);
                break;
            case 'NOTICE':
                navi(`/${moimId}/moim-board?label=공지 게시판`);
                break;
            default:
                console.error("Unknown boardType", boardType);
                break;
        }
    };

    const handleModifySuccess = () => {
        alert("성공적으로 게시글을 수정했어요.");

        switch (boardType) {
            case 'FREE':
                navi(`/${moimId}/moim-board?label=자유 게시판`);
                break;
            case 'NOTICE':
                navi(`/${moimId}/moim-board?label=공지 게시판`);
                break;
            default:
                console.error("Unknown boardType", boardType);
                break;
        }
    };

    return (
        <BasicBoard>
            <StyledBox>
                <StyledForm onSubmit={handleSubmit}>
                    <WriteZone>
                        <PageTitle>
                            {boardId ? "게시글 수정하기" : "새로운 글을 작성해요."}
                        </PageTitle>
                        <Box border={0} my={0} display="flex" alignItems="center">
                            <h5 fontWeight="bold" style={{ width: '110px' }}>작성자</h5>
                            <Typography variant="body1" color={grey[600]}>{boardInputs.userName}</Typography>
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
                        <div styled={{ width: "700px" }}>
                            {(boardId && boardPics.length > 0) || boardInputs.freePics.length > 0 ? (
                                <>
                                    <input ref={singleFileInputRef} type="file" accept="image/*" hidden onChange={handleSingleImageUpload} />
                                    {boardPics.map((pic, index) => renderPreviewImage(pic, index))}
                                    {boardInputs.freePics.map((freePic, index) => renderPreviewImage(freePic, index, true))}
                                </>
                            ) : (
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
                                        <input ref={multipleFileInputRef} type="file" accept="image/*" multiple hidden onChange={handleImageUpload}></input>
                                    </Button>
                                </ImageAttaZone>
                            )}
                        </div>
                    </WriteZone>
                    <ButtonZone>
                        {boardId ?
                            <StyledButton type="submit" variant="contained" size="large">수정</StyledButton>
                            :
                            <StyledButton type="submit" variant="contained" size="large">등록</StyledButton>
                        }
                        <StyledButton type="button" variant="contained" size="large" onClick={handleCancel}>취소</StyledButton>
                    </ButtonZone>
                </StyledForm>
            </StyledBox>
        </BasicBoard>
    );
};

export default CreateBoard;