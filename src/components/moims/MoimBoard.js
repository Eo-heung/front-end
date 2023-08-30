import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { styled } from '@mui/system';
import { useParams, useLocation, useNavigate, Outlet } from 'react-router-dom';
import BasicBoard from '../utils/BasicBoard';
import TabButton from '../utils/TabButton';
import { TabContainer, TabContent } from '../utils/StyledTab';
import { SPRING_API_URL } from '../../config';
import { Modal, Box, Typography } from '@mui/material';
import { StyledButton } from '../utils/StyledCreate';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const MoimBoard = () => {
    const navi = useNavigate();

    const { moimId } = useParams();

    const [activeTab, setActiveTab] = useState("");
    const [hoveredButton, setHoveredButton] = useState(null);

    const tabLabels = ["메인", "자유 게시판", "사진첩", "일정", "멤버", "공지 게시판", "자유 게시글", "공지 게시글"];

    const location = useLocation();

    const [userRole, setUserRole] = useState({ isMember: false, isLeader: false });
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const verifyUserRole = async () => {
            try {
                const response = await axios.post(`${SPRING_API_URL}/board/${moimId}/verify-role`, {}, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                    }
                });

                setUserRole(response.data.item);

                if (!response.data.item.isMember && !response.data.item.isLeader) {
                    setOpen(true);
                }
            } catch (err) {
                console.error("Error verifying user role", err);
            }
        };

        verifyUserRole();
    }, [moimId]);

    const handleJoinClick = () => {
        navi(`/apply-moim/${moimId}`);
    };

    const tabPaths = {
        "메인": "",
        "자유 게시판": "free-board",
        "사진첩": "picture-lib",
        "일정": "moim-schedule",
        "멤버": "moim-users",
        "공지 게시판": "notice-board",
        "자유 게시글": "free-board/:boardId",
        "공지 게시글": "notice-board/:boardId"
    };

    useEffect(() => {
        const currentPath = location.pathname.split("/").slice(-2).join('/'); // 마지막 두 세그먼트를 가져옵니다.
        const matchedLabel = Object.keys(tabPaths).find(label => {
            if (tabPaths[label].includes(":boardId")) { // 동적 경로인 경우
                const regex = new RegExp(tabPaths[label].replace(":boardId", "\\d+")); // :boardId를 숫자로 바꿔서 매칭합니다.
                return regex.test(currentPath);
            }
            return tabPaths[label] === currentPath;
        });

        setActiveTab(matchedLabel || "메인");
    }, [location.pathname]);

    const handleTabClick = (label) => {
        navi(`/${moimId}/moim-board/${tabPaths[label]}`);
    };

    return (
        <BasicBoard>
            {userRole.isMember || userRole.isLeader ? (
                <>
                    <TabContainer>
                        {tabLabels.map(label => (
                            <TabButton
                                key={label}
                                moimId={moimId}
                                label={label}
                                activeTab={activeTab}
                                hoveredButton={hoveredButton}
                                onTabClick={() => handleTabClick(label)}
                                onMouseEnter={() => setHoveredButton(label)}
                                onMouseLeave={() => setHoveredButton(null)}
                                style={(label === "공지 게시판" || label === "자유 게시글" || label === "공지 게시글") ? { display: "none" } : {}}
                            />
                        ))}
                    </TabContainer>
                    <TabContent>
                        <Outlet />
                    </TabContent>
                </>
            ) : (
                <>
                    <Modal
                        open={open}
                        onClose={() => setOpen(false)}
                        aria-labelledby="modal-moim-title"
                        aria-describedby="modal-moim-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-moim-title" variant="h6" component="h2">
                                확인해주세요.
                            </Typography>
                            <Typography id="modal-moim-description" sx={{ mt: 2 }}>
                                가입한 모임원만 볼 수 있어요. 가입 신청하시겠어요?
                            </Typography>
                            <StyledButton type="button" variant="contained" size="large" onClick={handleJoinClick}>신청 화면으로</StyledButton>
                        </Box>
                    </Modal>
                </>
            )}
        </BasicBoard>
    );
};

export default MoimBoard;