import React, { useCallback, useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Box, Button, FormControl, FormLabel, Select, MenuItem, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/system';
import { useCookies } from 'react-cookie';

const StyledBox = styled(Box)`
    margin-top: 2rem;
`;

const StyledForm = styled('form')`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-left: 280px;

    @media (max-width: 992px) {
        margin-left: 0;
    }
`;

const StyledButton = styled(Button)`
    margin-top: 10px;
    background-color: #FFB471;
    box-shadow: none;
    &:hover {
        background-color: #FFB471;
        box-shadow: none;
    }
`;

const StyledTypography = styled(Typography)`
  margin-bottom: 5px;
`;

const CounterTypography = styled(Typography)`
  color: #CED7D4;
  align-self: flex-end;
`;

const StyledTextField = styled(TextField)`
    width: 700px;
    & .MuiOutlinedInput-root {
        &:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline {
            border-color: #FFB471;
        }
        &.Mui-focused .MuiInputLabel-root {
            color: #FFB471;
        }
    }
`;

const StyledFormControl = styled(FormControl)`
    width: 150px;

    .MuiOutlinedInput-root {
        &:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline {
            border-color: #FFB471;
        }
        &.Mui-focused .MuiInputLabel-root {
            color: #FFB471;
        }
    }
`;

const StyledMenuItem = styled(MenuItem)`
    &:hover {
        background-color: #FFB471;
        color: white;
    }
`;


const CreateMoim = () => {
    const navi = useNavigate();

    const categories = ['인문학/책', '운동', '요리/맛집', '공예/만들기', '원예', '동네친구', '음악/악기', '반려동물', '여행'];

    const [moimTitleLength, setMoimTitleLength] = useState(0);
    const [inputs, setInputs] = useState({
        moimCategory: "",
        userId: sessionStorage.getItem("userId"),
        moimTitle: "",
        maxMoimUser: "",
        moimContent: ""
    });

    const [cookies] = useCookies(['userName', 'userAddr3']);
    const [userData, setUserData] = useState({
        userName: '',
        userAddr3: ''
    });

    useEffect(() => {
        if (cookies.userName && cookies.userAddr3) {
            setUserData({
                userName: cookies.userName,
                userAddr3: cookies.userAddr3
            });
        }

        console.log(userData);
    }, [cookies.userName, cookies.userAddr3]);

    const handleTitleChange = (e) => {
        if (e.target.value.length <= 24) {
            setMoimTitleLength(e.target.value.length);
            handleInputChange(e);
        }
    };

    const handleInputChange = useCallback((e) => {
        setInputs(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }, []);

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
            try {
                const response = await axios.post('http://localhost:9000/moim/create-moim', inputs, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                    }
                });
                console.log(response);
                if (response.data && response.data.item.msg) {
                    alert(response.data.item.msg);
                    navi('/');
                }
            } catch (e) {
                console.log(e);
            }
        }

        createMoimAxios();
    }, [inputs]);


    return (
        <>
            <StyledForm id="createForm" onSubmit={createMoim}>
                <StyledBox display="flex" flexDirection="column" alignItems="flex-start" width="700px">
                    <Typography variant="h4" style={{ marginBottom: "1rem" }}>새로운 모임을 만들어요.</Typography>
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
                        <Typography variant="h7" fontWeight="bold" style={{ width: '110px' }}>모임장</Typography>
                        <Typography variant="body1" color={grey[600]}>{userData.userName}</Typography>
                    </Box>
                    <Box border={0} my={2} display="flex" alignItems="center">
                        <Typography variant="h7" fontWeight="bold" style={{ width: '110px' }}>모임지역</Typography>
                        <Typography variant="body1" color={grey[600]}>{userData.userAddr3}</Typography>
                    </Box>
                    <StyledTypography variant="h7" fontWeight="bold">모임명</StyledTypography>
                    <StyledTextField
                        name="moimTitle"
                        onChange={handleTitleChange}
                        variant="outlined"
                        placeholder="모임명은 짧을수록 기억하기 쉬워요."
                        value={inputs.moimTitle}
                    />
                    <CounterTypography align="right">{moimTitleLength}/24자</CounterTypography>
                    <StyledTypography variant="h7" fontWeight="bold">모집인원</StyledTypography>
                    <StyledTextField name="maxMoimUser" placeholder="최대 50명까지 모집할 수 있어요." onChange={handleInputChange} variant="outlined" />
                    <StyledTypography variant="h7" fontWeight="bold" style={{ marginTop: "1rem" }}>모임소개</StyledTypography>
                    <StyledTextField name="moimContent" placeholder="주제 중심으로 모임을 소개해주세요. 모임 설정에서 언제든지 바꿀 수 있어요." onChange={handleInputChange} variant="outlined" multiline rows={4} />
                </StyledBox>
                <StyledButton type="submit" variant="contained" color="primary">모임 등록</StyledButton>
            </StyledForm>
            <Link to="/">모임 목록</Link>
        </>
    );
};

export default CreateMoim;