import React, { useState } from 'react';
import BasicBoard from '../utils/BasicBoard';
import Mymoim from './Mymoim';
import ListMoim from './ListMoim';
import TabButton from '../utils/TabButton';
import { TabContainer, TabContent } from '../utils/StyledTab';

const MoimController = () => {
    const [activeTab, setActiveTab] = useState("내 모임");
    const [hoveredButton, setHoveredButton] = useState(null);
    const [clickCount, setClickCount] = useState({ "내 모임": 0, "새로운 모임 찾기": 0 });

    const handleTabClick = (label) => {
        setActiveTab(label);
        setClickCount(prev => ({ ...prev, [label]: prev[label] + 1 }));
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
                    label="새로운 모임 찾기"
                    activeTab={activeTab}
                    hoveredButton={hoveredButton}
                    onTabClick={handleTabClick}
                    onMouseEnter={setHoveredButton}
                    onMouseLeave={() => setHoveredButton(null)}
                />
            </TabContainer>
            <TabContent>
                {activeTab === "내 모임" ?
                    <Mymoim key={`my-moim-${clickCount["내 모임"]}`} />
                    :
                    <ListMoim key={`list-moim-${clickCount["새로운 모임 찾기"]}`} />}
            </TabContent>
        </BasicBoard>
    );
};

export default MoimController;