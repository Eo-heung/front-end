import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { BoardContainer, BoardInfo, BoardContent } from '../utils/StyledBoard';
import { ButtonZone, StyledButton } from '../utils/StyledCreate';
import { Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/system';
import { useCookies } from 'react-cookie';
import { SPRING_API_URL } from '../../config';
import dayjs from "dayjs";
import 'dayjs/locale/ko';

dayjs.locale('ko');

const AlertZone = styled('div')`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    right: 0;
    width: 25%;
    height: 33%;
    z-index: 10;
`;

const AlertContent = styled('div')`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 70%;
    height: 70%;
    border: 2px solid #FCBE71;
    border-radius: 8px;
    color: grey;
    font-size: 1.3rem;
`;

const AppInfoRow = styled('div')`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    gap: 30px;
`;

const StyledTypography = styled(Typography)`
    color: ${grey[600]};
`;

const ViewAppointment = () => {
    const navi = useNavigate();
    const { moimId, appBoardId } = useParams();

    const [appBoardDetail, setAppBoardDetail] = useState({});
    const [appMembers, setAppMembers] = useState([]);

    const [cookie] = useCookies("userId");
    const isCurrentUserTheHost = appBoardDetail && appBoardDetail.user === cookie.userId;
    const [userRole, setUserRole] = useState({ isMember: false, isLeader: false });
    const [isUserApplied, setIsUserApplied] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);

    const now = dayjs();
    const appStart = dayjs(appBoardDetail.appStart);
    const appEnd = dayjs(appBoardDetail.appEnd);
    const currentStatus = getCurrentStatus(appStart, appEnd, now);

    function getCurrentStatus(appStart, appEnd, now) {
        if (now.isBefore(appStart)) return "모집중";
        if (now.isAfter(appEnd)) return "종료";
        return "진행중";
    }

    const verifyUserRole = async () => {
        try {
            const response = await axios.post(`${SPRING_API_URL}/board/${moimId}/verify-role`, {}, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                }
            });

            setUserRole(response.data.item);
        } catch (err) {
            console.error("Error verifying user role", err);
        }
    };

    const fetchAppMembers = async () => {
        try {
            const response = await axios.get(`${SPRING_API_URL}/appointment/${moimId}/member-list/${appBoardId}?test=memeber`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                },
                params: {
                    currentPage: currentPage - 1
                }
            });

            if (response.status === 200) {
                console.log("신청자 목록 ", response.data.item.content);
                setAppMembers(response.data.item.content);
                const isApplied = response.data.item.content.some(member => member.appFixedUser === cookie.userId);
                setIsUserApplied(isApplied);
            }
        } catch (error) {
            console.error("Error fetching app members:", error);
        }
    };

    const getAppBoardDetail = async () => {
        try {
            const response = await axios.get(`${SPRING_API_URL}/appointment/${moimId}/list/${appBoardId}?test=detail`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                }
            });

            console.log("response.data", response.data);

            if (response.data) {
                setAppBoardDetail(response.data.item.appBoardDetail);
            }
        } catch (error) {
            console.error("Failed to fetch moim detail:", error);
        }
    };

    useEffect(() => {
        verifyUserRole();
        getAppBoardDetail();
        fetchAppMembers();
    }, [moimId]);

    const handleApplyApp = async () => {
        try {
            const response = await axios.post(`${SPRING_API_URL}/appointment/${moimId}/list/${appBoardId}/apply`, {}, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                }
            });

            if (response.data && response.data.statusCode === 201) {
                alert("신청이 성공적으로 완료되었어요.");
                navi(`/${moimId}/moim-board/moim-app-list`);
            } else {
                throw new Error(response.data.errorMessage || "신청 중 오류가 발생했어요.");
            }

        } catch (err) {
            console.error("Error sending apply data:", err);
            alert("신청 중 오류가 발생했어요. 다시 시도해주세요.");
        }
    };

    const deleteApp = async () => {
        try {
            const response = await axios.delete(`${SPRING_API_URL}/appointment/${moimId}/list/${appBoardId}/delete`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                }
            });

            if (response.status === 200) {
                alert("만남 모집글을 삭제했어요.");
                navi(`/${moimId}/moim-board/moim-app-list`);
            }
        } catch (error) {
            console.error("Failed to delete moim:", error);
            alert("만남 모집글을 삭제하는 데 실패했어요. 다시 한 번 시도해주세요.");
        }
    };

    const handleDeleteClick = () => {
        const isConfirmed = window.confirm("만남 모집글을 정말로 삭제하시겠어요?");

        if (isConfirmed) {
            deleteApp();
        }
    };

    console.log("IsUserApplied", isUserApplied);

    return (
        <BoardContainer style={{ width: "83%" }}>
            <AlertZone>
                <AlertContent>
                    {currentStatus}
                </AlertContent>
            </AlertZone>
            <h1 style={{ marginTop: "0.5rem", marginBottom: "1rem" }}>{appBoardDetail && appBoardDetail.appTitle}</h1>
            <AppInfoRow>
                <BoardInfo>{appBoardDetail && appBoardDetail.userName}</BoardInfo>
            </AppInfoRow>
            <AppInfoRow>
                <StyledTypography variant="body1">{appBoardDetail && appBoardDetail.appFixedUser || "1"}/{appBoardDetail && appBoardDetail.maxAppUser}</StyledTypography>
                {appBoardDetail && appBoardDetail.appType === "ONLINE" ? (
                    <StyledTypography variant="body1">온라인</StyledTypography>
                ) : (
                    <StyledTypography variant="body1">{appBoardDetail && appBoardDetail.appLocation}</StyledTypography>
                )}
            </AppInfoRow>
            <AppInfoRow>
                <StyledTypography variant="body1">
                    {appBoardDetail && appBoardDetail.appStart && dayjs(appBoardDetail.appStart).format("YY.MM.DD. a hh:mm ~ ")}
                    {appBoardDetail && appBoardDetail.appEnd && dayjs(appBoardDetail.appEnd).format("YY.MM.DD. a hh:mm")}
                </StyledTypography>
            </AppInfoRow>
            <BoardContent variant="body1">{appBoardDetail && appBoardDetail.appContent}</BoardContent>
            <ButtonZone>
                {isCurrentUserTheHost ? (
                    <StyledButton variant="contained" size="large" onClick={handleDeleteClick}>삭제</StyledButton>
                ) : (
                    <>
                        {!isUserApplied && (
                            <StyledButton variant="contained" size="large" onClick={handleApplyApp}>신청</StyledButton>
                        )}
                        {userRole.isLeader && (
                            <StyledButton variant="contained" size="large" onClick={handleDeleteClick}>삭제</StyledButton>
                        )}
                    </>
                )}
            </ButtonZone>
            <h5 style={{ cursor: "pointer" }} onClick={() => navi(-1)}>목록으로 돌아가기</h5>
        </BoardContainer>
    );
};

export default ViewAppointment;