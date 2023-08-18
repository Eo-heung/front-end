import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
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
    margin-top: 1rem;
    width: 100%;
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

const CreateMoim = () => {
    const navi = useNavigate();

    const categories = ['인문학/책', '운동', '요리/맛집', '공예/만들기', '원예', '동네친구', '음악/악기', '반려동물', '여행'];

    const [moimTitleLength, setMoimTitleLength] = useState(0);
    const [inputs, setInputs] = useState({
        moimCategory: "",
        userId: sessionStorage.getItem("userId"),
        moimLeaderNickname: "",
        moimAddr: "",
        moimTitle: "",
        maxMoimUser: "",
        moimContent: ""
    });

    const [moimPic, setMoimPic] = useState(null);
    const [cookies] = useCookies(['userNickname', 'userAddr3']);
    const [userData, setUserData] = useState({
        userNickname: '',
        userAddr3: ''
    });

    useEffect(() => {
        if (cookies.userNickname && cookies.userAddr3) {
            setUserData({
                userNickname: cookies.userNickname,
                userAddr3: cookies.userAddr3
            });
        }

        console.log(userData);
    }, [cookies]);

    useEffect(() => {
        setInputs(prev => ({
            ...prev,
            moimrNickname: userData.userNickname,
            moimAddr: userData.userAddr3
        }));
    }, [userData]);

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

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setMoimPic(file);
    };

    const isValidNumber = (input) => {
        const regex = /^[0-9]+$/;
        return regex.test(input);
    }

    const createMoim = useCallback((e) => {
        e.preventDefault();

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

        const createMoimAxios = async () => {
            const userData = {
                moimCategory: inputs.moimCategory,
                userId: sessionStorage.getItem("userId"),
                moimNickname: cookies.userNickname,
                moimAddr: cookies.userAddr3,
                moimTitle: inputs.moimTitle,
                maxMoimUser: inputs.maxMoimUser,
                moimContent: inputs.moimContent,
            };

            try {
                const response = await axios.post('http://localhost:9000/moim/create-moim', userData, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                    }
                });

                console.log(response.data);

                const formData = new FormData();

                if (!moimPic) {
                    try {
                        const defaultImageRes = await axios.get('https://i.postimg.cc/h41MrLb5/170px-Ojamajo-Tap-svg.png', {
                            responseType: 'blob'
                        });

                        const defaultImageFile = new File([defaultImageRes.data], 'default-image.png', { type: 'image/png' });
                        formData.append("moimPic", defaultImageFile);
                        formData.append("moimId", response.data.item.moimId);
                    } catch (err) {
                        console.error("Failed to download default image:", err);
                    }
                } else {
                    formData.append("moimPic", moimPic);
                    formData.append("moimId", response.data.item.moimId);
                }

                console.log(formData);

                const result = await axios.post('http://localhost:9000/moim/create-moim-pic', formData, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
                        'Content-Type': 'multipart/form-data',
                    }
                });

                console.log(result.data);

                if (result.data.item) {
                    alert("등록이 완료되었습니다.");
                    navi('/list-moim');
                }
            } catch (e) {
                console.log(e);
            }
        }

        createMoimAxios();
    }, [inputs, moimPic]);


    return (
        <BasicBoard>
            <StyledForm id="createForm" onSubmit={createMoim}>
                <StyledBox display="flex" flexDirection="column" alignItems="flex-start">
                    <h4 style={{ marginBottom: "1rem" }}>새로운 모임을 만들어요.</h4>
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
                        <Typography variant="body1" color={grey[600]}>{userData.userNickname}</Typography>
                    </Box>
                    <Box border={0} my={2} display="flex" alignItems="center">
                        <h5 fontWeight="bold" style={{ width: '110px' }}>모임 지역</h5>
                        <Typography variant="body1" color={grey[600]}>{userData.userAddr3}</Typography>
                    </Box>
                    <h5 fontWeight="bold">모임명</h5>
                    <CounterBox>
                        <StyledTextField
                            name="moimTitle"
                            onChange={handleTitleChange}
                            variant="outlined"
                            placeholder="모임명은 짧을수록 기억하기 쉬워요."
                            value={inputs.moimTitle}
                        />
                        <CounterTypography align="right">{moimTitleLength}/24자</CounterTypography>
                    </CounterBox>
                    <h5 fontWeight="bold">모집 인원</h5>
                    <StyledTextField name="maxMoimUser" placeholder="최대 50명까지 모집할 수 있어요." onChange={handleInputChange} variant="outlined" />
                    <h5 fontWeight="bold" style={{ marginTop: "1.2rem" }}>모임 소개</h5>
                    <StyledTextField name="moimContent" placeholder="주제 중심으로 모임을 소개해주세요. 모임 설정에서 언제든지 바꿀 수 있어요." onChange={handleInputChange} variant="outlined" multiline rows={4} />
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
                                    src={URL.createObjectURL(moimPic)}
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
                <StyledButton type="submit" variant="contained" size="large">모임 등록</StyledButton>
            </StyledForm>
            <StyledLink to="/list-moim">목록으로 돌아가기</StyledLink>
        </BasicBoard>
    );
};

export default CreateMoim;