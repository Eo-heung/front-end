import React from 'react';
import MyBoardList from './MyBoardList';
import MyCommentList from './MyCommentList';

const MyMoimInfo = ({ setActivetab }) => {
    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <MyBoardList isInfoPage={true} />
            <MyCommentList isinfoPage={true} />
        </div>
    );
};

export default MyMoimInfo;