import axios from 'axios';
import React, { useState } from 'react';
import Join from './join/Join';
import JoinBirth from './join/JoinBirth';
import JoinComplete from './join/JoinComplete';
import JoinFavorite from './join/JoinFavorite';
import JoinLocal1 from './join/JoinLocal1';
import JoinLocal2 from './join/JoinLocal2';
import JoinLocal3 from './join/JoinLocal3';
import JoinName from './join/JoinName';
import JoinPW from './join/JoinPW';
import JoinPhoneNum1 from './join/JoinPhoneNum1';
import JoinPhoneNum2 from './join/JoinPhoneNum2';

const SignUp = () => {

    const [pageIndex, setPageIndex] = useState(0);
    const [userTel, setUserTel] = useState(0);
    const [userPw, setUserPw] = useState('');
    const [userName, setUserName] = useState('');
    const [userBirth, setUserBirth] = useState('');
    const [userAddr1, setUserAddr1] = useState('');
    const [userAddr2, setUserAddr2] = useState('');
    const [userAddr3, setUserAddr3] = useState('');

    const user = {
        userId: userTel,
        userPw: userPw,
        userName: userName,
        userTel: userTel,
        userBirth: userBirth,
        userAddr1: userAddr1,
        userAddr2: userAddr2,
        userAddr3: userAddr3
    };

    const handleClick = () => {
        if (pageIndex < 10) {
            setPageIndex(pageIndex + 1);
        }
    };

    const doubleClick = () => {
        setPageIndex(pageIndex + 2);
    }

    const backClick = () => {
        setPageIndex(pageIndex + -1);
    }

    const join = async () => {
        try {
            const response = await axios.post('http://localhost:9000/join', user);

            console.log(response)
        } catch (error) {
        }
    };

    const renderPage = () => {
        switch (pageIndex) {
            case 0:
                return <Join handleClick={handleClick} />;
            case 1:
                return <JoinPhoneNum1 handleClick={handleClick} setUserTel={setUserTel} />;
            case 2:
                return <JoinPhoneNum2 handleClick={handleClick} backClick={backClick} />;
            case 3:
                return <JoinPW handleClick={handleClick} setUserPw={setUserPw} backClick={backClick} />;
            case 4:
                return <JoinName handleClick={handleClick} setUserName={setUserName} backClick={backClick} />;
            case 5:
                return <JoinBirth handleClick={handleClick} setUserBirth={setUserBirth} backClick={backClick} />;
            case 6:
                return <JoinLocal1 handleClick={handleClick} doubleClick={doubleClick} setUserAddr1={setUserAddr1} setUserAddr2={setUserAddr2} setUserAddr3={setUserAddr3} backClick={backClick} />;
            case 7:
                return <JoinLocal2 handleClick={handleClick} setUserAddr1={setUserAddr1} setUserAddr2={setUserAddr2} setUserAddr3={setUserAddr3} backClick={backClick} />;
            case 8:
                return <JoinLocal3 handleClick={handleClick} backClick={backClick} userAddr1={userAddr1} userAddr2={userAddr2} userAddr3={userAddr3} />;
            case 9:
                return <JoinFavorite handleClick={handleClick} backClick={backClick} />;
            case 10:
                return <JoinComplete handleClick={handleClick} join={join} backClick={backClick} />;
            default:
                return <Join />;
        }
    };

    return (
        <div> {renderPage()}</div>
    )
}

export default SignUp