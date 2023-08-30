import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { styled } from '@mui/system';
import { useParams, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import BasicBoard from '../utils/BasicBoard';
import TabButton from '../utils/TabButton';
import { TabContainer, TabContent } from '../utils/StyledTab';
import FreeBoardList from './FreeBoardList';
import MoimNoticeList from './MoimNoticeList';
import PictureLib from './PictureLib';
import MoimSchedule from './MoimSchedule';
import MoimUsers from './MoimUsers';
import FreeBoard from './FreeBoard';
import MoimNotice from './MoimNotice';
import { SPRING_API_URL } from '../../config';
import { Modal, Box, Typography } from '@mui/material';
import { StyledButton } from '../utils/StyledCreate';

const ListContainer = styled('div')`
    display: flex;
    flex-direction: column;
    height: 100%;
    > * {
        flex: 1;
    }
`;

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
    const [moimData, setMoimData] = useState("");

    const [boardType, setBoardType] = useState("");
    const [boardId, setBoardId] = useState(null);

    const [activeTab, setActiveTab] = useState(moimData.moimTitle || "");
    const [hoveredButton, setHoveredButton] = useState(null);
    const [clickCount, setClickCount] = useState({ "자유 게시판": 0, "사진첩": 0, "일정": 0, "멤버": 0, "공지 게시판": 0, "게시글": 0 });

    const tabLabels = [moimData.moimTitle || "내 모임", "자유 게시판", "사진첩", "일정", "멤버", "공지 게시판", "게시글"];

    const [searchParams] = useSearchParams();
    const labelFromUrl = searchParams.get("label");
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

    useEffect(() => {
        if (moimData.moimTitle && !activeTab) {
            setActiveTab(moimData.moimTitle);
        }

        if (moimData.moimTitle && !(moimData.moimTitle in clickCount)) {
            setClickCount(prev => ({
                ...prev,
                [moimData.moimTitle]: 0,
            }));
        }
    }, [moimData.moimTitle, activeTab, clickCount]);

    useEffect(() => {
        if (labelFromUrl && tabLabels.includes(labelFromUrl)) {
            setActiveTab(labelFromUrl);
        }
        console.log("labelFromUrl", labelFromUrl);
    }, [labelFromUrl, location.key]);

    const handleTabClick = (label) => {
        if (label === moimData.moimTitle) {
            setActiveTab("");
            setClickCount(prev => ({ ...prev, [moimData.moimTitle]: prev[moimData.moimTitle] + 1 }));
            return;
        }
        setActiveTab(label);
        setClickCount(prev => ({ ...prev, [label]: prev[label] + 1 }));
        window.scrollTo(0, 0);
    };

    return (
        <BasicBoard>
            {userRole.isMember || userRole.isLeader ? (
                <>
                    <TabContainer>
                        {tabLabels.map(label => (
                            <TabButton
                                key={label}
                                label={label}
                                activeTab={activeTab}
                                hoveredButton={hoveredButton}
                                onTabClick={handleTabClick}
                                onMouseEnter={() => setHoveredButton(label)}
                                onMouseLeave={() => setHoveredButton(null)}
                                style={(label === "공지 게시판" || label === "게시글") ? { display: "none" } : {}}
                            />
                        ))}
                    </TabContainer>
                    <TabContent>
                        {!activeTab || activeTab === moimData.moimTitle ? (
                            <ListContainer>
                                <FreeBoardList
                                    key="free-board-list"
                                    isMainPage={true}
                                    moimId={moimId}
                                    setActiveTab={setActiveTab}
                                    setBoardType={setBoardType}
                                    setBoardId={setBoardId}
                                />
                                <MoimNoticeList
                                    key="moim-notice-list"
                                    isMainPage={true}
                                    moimId={moimId}
                                    setActiveTab={setActiveTab}
                                    setBoardType={setBoardType}
                                    setBoardId={setBoardId}
                                />
                            </ListContainer>
                        ) : null}
                        {activeTab === "자유 게시판" && <FreeBoardList
                            moimId={moimId}
                            setActiveTab={setActiveTab}
                            setBoardType={setBoardType}
                            setBoardId={setBoardId}
                            key={`free-full-board-list-${clickCount["자유 게시판"]}`}
                            isMainPage={false} />}
                        {activeTab === "사진첩" && <PictureLib moimId={moimId} key={`picture-lib-${clickCount["사진첩"]}`} />}
                        {activeTab === "일정" && <MoimSchedule moimId={moimId} key={`moim-schedule-${clickCount["일정"]}`} />}
                        {activeTab === "멤버" && <MoimUsers moimId={moimId} key={`moim-users-${clickCount["멤버"]}`} />}
                        {activeTab === "공지 게시판" && <MoimNoticeList
                            moimId={moimId}
                            setActiveTab={setActiveTab}
                            setBoardType={setBoardType}
                            setBoardId={setBoardId}
                            key={`moim-notice-board-list-${clickCount["공지 게시판"]}`}
                            isMainPage={false} />}
                        {activeTab === "게시글" && (
                            boardType === "FREE" ?
                                <FreeBoard type={boardType} moimId={moimId} boardId={boardId} key={`free-board-${clickCount["게시글"]}`} />
                                :
                                <MoimNotice type={boardType} moimId={moimId} boardId={boardId} key={`notice-board-${clickCount["게시글"]}`} />
                        )}
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