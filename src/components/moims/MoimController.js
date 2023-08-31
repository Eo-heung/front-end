import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import BasicBoard from '../utils/BasicBoard';
import TabButton from '../utils/TabButton';
import { TabContainer, TabContent } from '../utils/StyledTab';

const MoimController = () => {
    const navi = useNavigate();
    const location = useLocation();

    const [activeTab, setActiveTab] = useState("");
    const [hoveredButton, setHoveredButton] = useState(null);

    const tabPaths = {
        "내 모임": "",
        "새 모임 찾기": "list-moim"
    };

    console.log("location.pathname  ", location.pathname);

    useEffect(() => {
        const matchedLabel = Object.keys(tabPaths).find(label => {
            if (tabPaths[label] === "") {
                return `/moim-controller` === location.pathname;
            }
            return `/moim-controller/${tabPaths[label]}` === location.pathname;
        });

        console.log("tabPaths  ", tabPaths);
        console.log("before  ", matchedLabel);
        setActiveTab(matchedLabel || "내 모임");
        console.log("after  ", matchedLabel);
    }, [location.pathname]);

    const handleTabClick = (label) => {
        navi(`/moim-controller/${tabPaths[label]}`);
    };

    return (
        <BasicBoard>
            <TabContainer>
                <TabButton
                    label="내 모임"
                    activeTab={activeTab}
                    hoveredButton={hoveredButton}
                    onTabClick={handleTabClick}
                    onMouseEnter={setHoveredButton}
                    onMouseLeave={() => setHoveredButton(null)}
                />
                <TabButton
                    label="새 모임 찾기"
                    activeTab={activeTab}
                    hoveredButton={hoveredButton}
                    onTabClick={handleTabClick}
                    onMouseEnter={setHoveredButton}
                    onMouseLeave={() => setHoveredButton(null)}
                />
            </TabContainer>
            <TabContent>
                <Outlet />
            </TabContent>
        </BasicBoard>
    );
};

export default MoimController;