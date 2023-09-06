import React, { useState, useCallback, useEffect, useRef } from 'react';
import { styled } from '@mui/system';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { StyledForm, WriteZone, StyledBox, PageTitle, StyledButton, StyledTextField, ButtonZone } from '../utils/StyledCreate';
import { Box, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import BasicBoard from '../utils/BasicBoard';
import { SPRING_API_URL } from '../../config';
import { ListMoimMenuItem, ListMoimSelect } from '../utils/StyledListMoim';
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/ko';

dayjs.extend(utc);
dayjs.locale('ko');

const InfoZone = styled('div')`
    display: flex;
    align-items: flex-start;
    width: 100%;
    gap: 3%;
`;

const Title = styled("h5")`
    width: 110px;
`;

const CreateAppointment = () => {
    const navi = useNavigate();
    const { moimId } = useParams();

    const [cookie] = useCookies("userNickname");
    const [moimData, setMoimData] = useState({
        moimTitle: ""
    });
    const [appInputs, setAppInputs] = useState({
        userName: cookie.userNickname || "",
        appTitle: "",
        appContent: "",
        appLocation: "",
        maxAppUser: ""
    });
    const [appType, setAppType] = useState("ONLINE");
    const [appStart, setAppStart] = useState(() => dayjs());
    const [appEnd, setAppEnd] = useState(() => dayjs());

    const appLocationRef = useRef("");
    const appTitleRef = useRef("");
    const appContentRef = useRef("");
    const maxAppUserRef = useRef("");

    useEffect(() => {
        const fetchMoimData = async () => {
            try {
                const response = await axios.get(`${SPRING_API_URL}/moim/view-moim/${moimId}`);
                const data = response.data.item.moimDTO;

                setMoimData({
                    moimTitle: data.moimTitle
                });

                return response.data.item;

            } catch (e) {
                console.error("Error fetching moim data", e);
            }
        };

        fetchMoimData();
    }, [moimId]);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setAppInputs(prev => ({
            ...prev,
            [name]: value,
        }));

        switch (name) {
            case "appLocation":
                appLocationRef.current = value;
                break;
            case "appTitle":
                appTitleRef.current = value;
                break;
            case "appContent":
                appContentRef.current = value;
                break;
            case "maxAppUser":
                maxAppUserRef.current = value;
                break;
            default:
                break;
        }
    }, []);

    const validateInputs = () => {
        if (appType === "OFFLINE" && !appInputs.appLocation.trim()) {
            alert("만남 지역을 입력해주세요.");
            return false;
        }
        if (!appInputs.appTitle.trim()) {
            alert("제목을 입력해주세요.");
            return false;
        }
        if (!appInputs.appContent.trim()) {
            alert("내용을 입력해주세요.");
            return false;
        }
        if (!appInputs.maxAppUser || isNaN(appInputs.maxAppUser) || Number(appInputs.maxAppUser) > 50) {
            alert("올바른 모임 인원을 입력해주세요.");
            return false;
        }
        if (appStart.isAfter(appEnd) ||
            (appStart.isSame(appEnd, 'day') && appStart.isAfter(appEnd, 'minute'))) {
            alert("시작일시와 종료일시를 올바르게 설정해주세요.");
            return false;
        }
        return true;
    };

    const validateMaxAppUser = (e) => {
        const inputValue = e.target.value;
        if (isNaN(inputValue)) {
            alert("모임 인원에는 숫자만 적어주세요.");
            setAppInputs(prev => ({
                ...prev,
                maxAppUser: ""
            }));
            return;
        }

        const inputNumber = Number(inputValue);
        if (inputNumber > 50) {
            alert("최대 50명까지 모집할 수 있어요. 인원 수를 확인해주세요.");
            setAppInputs(prev => ({
                ...prev,
                maxAppUser: ""
            }));
        }
    }

    const createApp = useCallback((e) => {
        e.preventDefault();

        if (!validateInputs()) {
            return;
        }

        const createAppAxios = async () => {
            const appData = {
                userName: appInputs.userName,
                appTitle: appInputs.appTitle,
                appContent: appInputs.appContent,
                appLocation: appInputs.appLocation,
                appStart: appStart.toISOString(),
                appEnd: appEnd.toISOString(),
                maxAppUser: appInputs.maxAppUser,
                appType: appType
            }

            try {
                const response = await axios.post(`${SPRING_API_URL}/appointment/${moimId}/create-app`, appData, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                    }
                });

                if (response.data.item.msg === "okValue") {
                    alert("약속을 만들었어요.");
                    navi(`/${moimId}/moim-board/moim-app-list`);
                } else {
                    alert(response.data.item.msg);
                }
            } catch (err) {
                alert("오류가 발생했어요. 다시 한 번 시도해주세요.");
                console.error("Error creating appointment:", err);
            }
        };

        createAppAxios();
    }, [appInputs, appType]);

    const handleCancel = () => {
        navi(-1);
    };

    return (
        <BasicBoard>
            <StyledBox>
                <StyledForm onSubmit={createApp}>
                    <WriteZone>
                        <PageTitle>
                            "{moimData.moimTitle}" 모임에서 친구들을 만나요.
                        </PageTitle>
                        <Box border={0} my={0} display="flex" alignItems="center">
                            <Title>작성자</Title>
                            <Typography variant="body1" color={grey[600]}>{appInputs.userName}</Typography>
                        </Box>
                        <InfoZone>
                            <Title>만남 방식</Title>
                            <ListMoimSelect
                                value={appType}
                                displayEmpty
                                size="small"
                                onChange={(e) => setAppType(e.target.value)}>
                                <ListMoimMenuItem value="ONLINE">온라인</ListMoimMenuItem>
                                <ListMoimMenuItem value="OFFLINE">오프라인</ListMoimMenuItem>
                            </ListMoimSelect>
                            {appType === "OFFLINE" &&
                                <StyledTextField
                                    name="appLocation"
                                    value={appInputs.appLocation}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    placeholder="만나실 지역을 입력해주세요."
                                />
                            }
                        </InfoZone>
                        <InfoZone>
                            <Title>만남 인원</Title>
                            <StyledTextField
                                name="maxAppUser"
                                value={appInputs.maxAppUser}
                                onChange={handleInputChange}
                                onBlur={validateMaxAppUser}
                                variant="outlined"
                                placeholder="최대 50명까지 참여할 수 있어요."
                            />
                        </InfoZone>
                        <InfoZone>
                            <Title>만남 일정</Title>
                            <MobileDateTimePicker
                                label={"시작일시"}
                                inputFormat="yyyy-MM-dd hh:mm"
                                mask="____-__-__ __:__"
                                value={appStart}
                                onChange={(newValue) => {
                                    if (newValue.isBefore(dayjs())) {
                                        alert("지나간 날이나 시간에는 약속을 만들 수 없어요.");
                                        return;
                                    }
                                    setAppStart(newValue);
                                    if (appEnd.isBefore(newValue)) {
                                        setAppEnd(newValue);
                                    }
                                }}
                                minDate={dayjs()}
                            />
                            <MobileDateTimePicker
                                label={"종료일시"}
                                inputFormat="yyyy-MM-DD HH:mm"
                                mask="____-__-__ __:__"
                                value={appEnd}
                                onChange={(newValue) => {
                                    if (newValue.isBefore(appStart)) {
                                        alert("끝나는 날은 시작한 날보다 뒤에 있어야 해요.");
                                        setAppEnd(appStart.add(10, 'minute'));
                                        return;
                                    }
                                    setAppEnd(newValue);
                                }}
                                minDate={appStart}
                            />
                        </InfoZone>
                        <Title>제목</Title>
                        <StyledTextField
                            name="appTitle"
                            value={appInputs.appTitle}
                            onChange={handleInputChange}
                            variant="outlined"
                            placeholder="제목을 입력해주세요."
                            multiline minRows={1}
                        />
                        <Title>내용</Title>
                        <StyledTextField
                            name="appContent"
                            value={appInputs.appContent}
                            onChange={handleInputChange}
                            variant="outlined"
                            placeholder="목적, 주제, 나누고 싶은 이야기 등을 입력해주세요. 주제가 뚜렷하고 내용이 구체적이면 다른 모임원이 참여하기 쉬워져요."
                            multiline minRows={4}
                        />
                    </WriteZone>
                    <ButtonZone>
                        <StyledButton type="submit" variant="contained" size="large">등록</StyledButton>
                        <StyledButton type="button" variant="contained" size="large" onClick={handleCancel}>취소</StyledButton>
                    </ButtonZone>
                </StyledForm>
            </StyledBox>
        </BasicBoard>
    );
};

export default CreateAppointment;