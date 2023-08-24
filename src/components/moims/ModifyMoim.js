import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { TextField, Box, Button, FormControl, FormLabel, Select, MenuItem, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/system';
import axios from 'axios';
import BasicBoard from '../utils/BasicBoard';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';

const StyledForm = styled('form')`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 100%;
`;

const StyledBox = styled(Box)`
    display: flex;
    flex-direction: column; alignItems="flex-start"
    margin-top: 1rem;
    width: 100%;
`;

const PageTitle = styled('h3')`
    margin-bottom: 1.5rem;
`;

const StyledButton = styled(Button)`
    margin-top: 10px;
    background-color: #FCBE71;
    &:hover {
        background-color: #FCBE71;
    }
`;

const CounterTypography = styled(Typography)`
  color: #CED7D4;
  align-self: flex-end;
`;

const CounterBox = styled(Box)`
    width: 100%;
    max-width: 700px;
`;

const StyledTextField = styled(TextField)`
    width: 100%;
    max-width: 700px;
    & .MuiOutlinedInput-root {
        &:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline {
            border-color: #FCBE71;
        }
        &.Mui-focused .MuiInputLabel-root {
            color: #FCBE71;
        }
    }
    @media (max-width: 992px) {
        width: 100%;
    }
`;

const StyledFormControl = styled(FormControl)`
    width: 150px;

    .MuiOutlinedInput-root {
        &:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline {
            border-color: #FCBE71;
        }
        &.Mui-focused .MuiInputLabel-root {
            color: #FCBE71;
        }
    }
`;

const StyledMenuItem = styled(MenuItem)`
    &:hover {
        background-color: #FCBE71;
        color: white;
    }
`;

const StyledLink = styled(Link)`
    margin: 1rem auto;
    text-decoration: none;
`;

const ImageAttaZone = styled('div')`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 700px;
    height: 200px;
    border: 1px solid grey;
`;

const ModifyMoim = () => {
    const navi = useNavigate();

    const categories = ['인문학/책', '운동', '요리/맛집', '공예/만들기', '원예', '동네친구', '음악/악기', '반려동물', '여행'];
    const [moimTitleLength, setMoimTitleLength] = useState(0);
    const [inputs, setInputs] = useState({
        moimCategory: "",
        userId: sessionStorage.getItem("userId"),
        moimNickname: "",
        moimAddr: "",
        moimTitle: "",
        maxMoimUser: "",
        moimContent: ""
    });

    const { moimId } = useParams();
    const [moimPic, setMoimPic] = useState(null);
    const [filePic, setFilePic] = useState(null);

    const handleTitleChange = (e) => {
        if (e.target.value.length <= 24) {
            setMoimTitleLength(e.target.value.length);
            handleInputChange(e);
        }
    };

    const handleInputChange = useCallback((e) => {
        setInputs(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }, []);

    const moimFileInputRef = useRef(null);

    const triggerFileInput = () => {
        if (moimFileInputRef.current) {
            moimFileInputRef.current.click();
        } else {
            console.error("File input not found");
            console.log(moimFileInputRef.current);
        }
    };

    function base64ToBlob(base64) {
        const byteString = atob(base64.split(',')[1]);
        const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ab], { type: mimeString });
    }

    function blobToFile(blob, filename) {
        return new File([blob], filename, { type: blob.type });
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        console.log(file);
        setMoimPic(file);

        const reader = new FileReader();

        reader.onloadend = () => {
            const previewImageElem = document.getElementById('previewImage');
            if (previewImageElem) {
                previewImageElem.src = reader.result;
            } else {
                console.error("Image preview element not found");
            }
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const isValidNumber = (input) => {
        const regex = /^[0-9]+$/;
        return regex.test(input);
    }

    // let imageUrl;

    // if (typeof moimPic === 'string') {
    //     imageUrl = moimPic;
    // } else if (moimPic instanceof Blob) {
    //     imageUrl = URL.createObjectURL(moimPic);
    // } else {
    //     imageUrl = "";
    // }

    useEffect(() => {
        const fetchMoimData = async () => {
            try {
                const response = await axios.get(`http://localhost:9000/moim/view-moim/${moimId}`);
                const data = response.data.item.moimDTO;

                setInputs({
                    moimCategory: data.moimCategory,
                    userId: sessionStorage.getItem("userId"),
                    moimNickname: data.moimNickname,
                    moimAddr: data.moimAddr,
                    moimTitle: data.moimTitle,
                    maxMoimUser: data.maxMoimUser.toString(),
                    moimContent: data.moimContent
                });

                setMoimPic(`data:image/jpeg;base64,${response.data.item.moimPic}`);

                return response.data.item;

            } catch (error) {
                console.error("모임 데이터를 불러오는 중 오류가 발생했습니다.", error);
            }
        };

        fetchMoimData();
    }, [moimId]);

    useEffect(() => {
        console.log(moimPic)
        if (moimPic instanceof File) {
            setFilePic(moimPic);
        }
        else if (moimPic !== null) {
            const base64String = moimPic;
            const blob = base64ToBlob(base64String);
            const file = blobToFile(blob, "testFile.jpg");
            setFilePic(file);
            console.log(file);
        }

    }, [moimPic])

    const handleOnClick = ((e) => {
        e.preventDefault();

        if (!inputs.moimAddr) {
            alert("모임 지역을 입력해주세요.");
            document.getElementsByName("moimAddr")[0].focus();
            return;
        }

        if (!inputs.moimTitle) {
            alert("모임명을 입력해주세요.");
            document.getElementsByName("moimTitle")[0].focus();
            return;
        }

        if (!inputs.maxMoimUser) {
            alert("모임 인원 수를 입력해주세요.");
            document.getElementsByName("maxMoimUser")[0].focus();
            return;
        }

        if (!inputs.moimContent) {
            alert("모임 소개글을 입력해주세요.");
            document.getElementsByName("moimTitle")[0].focus();
            return;
        }

        if (!isValidNumber(inputs.maxMoimUser)) {
            alert("모임 인원에는 숫자만 적어주세요.");
            document.getElementsByName("maxMoimUser")[0].focus();
            return;
        }

        if (parseInt(inputs.maxMoimUser) > 50) {
            alert("최대 50명까지 모집할 수 있어요. 인원 수를 확인해주세요.");
            document.getElementsByName("maxMoimUser")[0].focus();
            return;
        }

        const modifyMoimAxios = () => {
            axios.post(`http://localhost:9000/moim/modify-moim/${moimId}`, inputs)
                .then(resultTemp => {
                    console.log(resultTemp);

                    const formData = new FormData();
                    console.log(moimPic);
                    formData.append("moimPic", filePic);
                    console.log(formData);

                    return axios.post(`http://localhost:9000/moim/modify-moim-pic/${moimId}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                })
                .then(result => {
                    console.log(result.data);

                    if (result.data.item) {
                        alert("수정이 완료되었습니다.");
                        navi('/list-moim');
                    }
                })
                .catch(e => {
                    console.log(e);
                });
        }

        modifyMoimAxios();

    });

    return (
        <BasicBoard>
            {console.log("render")}
            <StyledForm id="createForm" onSubmit={handleOnClick}>
                <StyledBox>
                    <PageTitle>모임 모집글을 수정해요.</PageTitle>
                    <StyledFormControl variant="outlined">
                        <FormLabel component="legend"></FormLabel>
                        <Select
                            name="moimCategory"
                            value={inputs.moimCategory}
                            onChange={handleInputChange}
                            displayEmpty
                            style={{ marginBottom: "1rem" }}
                        >
                            <MenuItem disabled value="">
                                <em>모임 주제</em>
                            </MenuItem>
                            {categories.map((category) => (
                                <StyledMenuItem key={category} value={category}>{category}</StyledMenuItem>
                            ))}
                        </Select>
                    </StyledFormControl>
                    <Box border={0} my={0} display="flex" alignItems="center">
                        <h5 fontWeight="bold" style={{ width: '110px' }}>모임장</h5>
                        <Typography variant="body1" color={grey[600]}>{inputs.moimNickname}</Typography>
                    </Box>
                    <h5 fontWeight="bold" style={{ width: '110px', marginTop: "1.2rem" }}>모임 지역</h5>
                    <StyledTextField name="moimAddr" onChange={handleInputChange} variant="outlined" value={inputs.moimAddr} />
                    <h5 fontWeight="bold" style={{ marginTop: "1.2rem" }}>모임명</h5>
                    <CounterBox>
                        <StyledTextField
                            name="moimTitle"
                            onChange={handleTitleChange}
                            variant="outlined"
                            value={inputs.moimTitle}
                        />
                        <CounterTypography align="right">{moimTitleLength}/24자</CounterTypography>
                    </CounterBox>
                    <h5 fontWeight="bold">모집 인원</h5>
                    <StyledTextField name="maxMoimUser" onChange={handleInputChange} variant="outlined" value={inputs.maxMoimUser} />
                    <h5 fontWeight="bold" style={{ marginTop: "1.2rem" }}>모임 소개</h5>
                    <StyledTextField name="moimContent" onChange={handleInputChange} variant="outlined" multiline rows={4} value={inputs.moimContent} />
                    <h5 fontWeight="bold"
                        style={{ marginTop: "1.2rem" }}
                    >
                        모임 대표사진
                    </h5>
                    {
                        moimPic
                            ?
                            <div>
                                <img
                                    id="previewImage"
                                    src={moimPic}
                                    alt="대표 사진"
                                    style={{ maxWidth: "300px", maxHeight: "300px", objectFit: "cover", display: "block", cursor: "pointer" }}
                                    onClick={triggerFileInput}
                                />
                                <input ref={moimFileInputRef} id="MoimImageUpload" type="file" accept="image/*" hidden onChange={handleImageUpload}></input>
                            </div>
                            : <ImageAttaZone>
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
                                    <input ref={moimFileInputRef} id="MoimImageUpload" type="file" accept="image/*" hidden onChange={handleImageUpload}></input>
                                </Button>
                            </ImageAttaZone>
                    }
                </StyledBox>
                <StyledButton type="submit" variant="contained" size="large">수정 완료</StyledButton>
            </StyledForm>
            <StyledLink to="/list-moim">목록으로 돌아가기</StyledLink>
        </BasicBoard>
    );
};

export default ModifyMoim;