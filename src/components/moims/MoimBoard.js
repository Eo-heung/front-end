import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { styled } from '@mui/system';
import BasicBoard from '../utils/BasicBoard';
import TabButton from '../utils/TabButton';
import { TabContainer, TabContent } from '../utils/StyledTab';
import FreeBoardList from './FreeBoardList';
import MoimNoticeList from './MoimNoticeList';
import PictureLib from './PictureLib';
import MoimSchedule from './MoimSchedule';
import MoimUsers from './MoimUsers';

const ListContainer = styled('div')`
    display: flex;
    flex-direction: column;
    height: 100%;
    > * {
        flex: 1;
    }
`;

const MoimBoard = ({ moimId }) => {
    const [activeTab, setActiveTab] = useState("");
    const [activeContent, setActiveContent] = useState("default");
    const [hoveredButton, setHoveredButton] = useState(null);
    const [clickCount, setClickCount] = useState({ "자유 게시판": 0, "사진첩": 0, "일정": 0, "멤버": 0 });

    const [moimData, setMoimData] = useState("");

    useEffect(() => {
        const fetchMoimData = async () => {
            try {
                const response = await axios.get(`http://localhost:9000/moim/view-moim/${moimId}`);
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
        if ("내 모임" && !activeTab) {
            setActiveTab("내 모임");
        }
    }, []);

    const handleTabClick = (label) => {
        if (label === moimData.moimTitle) {
            setActiveTab("");
            setActiveContent("default");
            setClickCount(prev => ({ ...prev, [moimData.moimTitle]: prev[moimData.moimTitle] + 1 }));
            return;
        } else if (label === "자유 게시판") {
            setActiveContent("free");
        } else {
            setActiveContent("default");
        }
        setActiveTab(label);
        setClickCount(prev => ({ ...prev, [label]: prev[label] + 1 }));
    };

    const handleContentChange = (content) => {
        setActiveContent(content);
    };

    const handleFreeClick = () => {
        setActiveContent("free");
        setActiveTab("");
    };

    const handleNoticeClick = () => {
        setActiveContent("notice");
        setActiveTab("");
    };

    const tabLabels = [moimData.moimTitle || "내 모임", "자유 게시판", "사진첩", "일정", "멤버"];

    return (
        <BasicBoard>
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
                    />
                ))}
            </TabContainer>
            <TabContent>
                {/* {((activeContent === "default" && !activeTab) || activeTab === moimData.moimTitle) && ( */}
                {((activeContent === "default" && !activeTab) || activeTab === "내 모임") && (
                    <ListContainer>
                        <FreeBoardList
                            key="free-board-list"
                            isMainPage={true}
                            onFreeListClick={handleFreeClick}
                        />
                        <MoimNoticeList
                            key="moim-notice-list"
                            isMainPage={true}
                            onNoticeListClick={handleNoticeClick}
                        />
                    </ListContainer>
                )}
                {activeContent === "free" && <FreeBoardList key={`free-full-board-list-${clickCount["자유 게시판"]}`} isMainPage={false} />}
                {activeContent === "notice" && <MoimNoticeList key="moim-full-notice-list" isMainPage={false} />}
                {activeTab === "사진첩" && <PictureLib key={`picture-lib-${clickCount["사진첩"]}`} />}
                {activeTab === "일정" && <MoimSchedule key={`moim-schedule-${clickCount["일정"]}`} />}
                {activeTab === "멤버" && <MoimUsers key={`moim-users-${clickCount["멤버"]}`} />}
            </TabContent>
        </BasicBoard>
    );
};

export default MoimBoard;