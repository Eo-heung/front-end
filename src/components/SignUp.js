import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
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
    const navi = useNavigate();

    const [pageIndex, setPageIndex] = useState(0);
    const [userTel, setUserTel] = useState(0);
    const [userPw, setUserPw] = useState('');
    const [userName, setUserName] = useState('');
    const [userBirth, setUserBirth] = useState('');
    const [userAddr1, setUserAddr1] = useState('');
    const [userAddr2, setUserAddr2] = useState('');
    const [userAddr3, setUserAddr3] = useState('');
    const [userHobby1, setUserHobby1] = useState('');
    const [userHobby2, setUserHobby2] = useState('');
    const [userHobby3, setUserHobby3] = useState('');
    const [checkNum, setCheckNum] = useState('');

    const user = {
        userId: userTel,
        userPw: userPw,
        userName: userName,
        userTel: userTel,
        userBirth: userBirth,
        userAddr1: userAddr1,
        userAddr2: userAddr2,
        userAddr3: userAddr3,
        userHobby1: userHobby1,
        userHobby2: userHobby2,
        userHobby3: userHobby3
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
            navi('/login');

        } catch (error) {
        }
    };

    const renderPage = () => {
        switch (pageIndex) {
            case 0:
                return <Join handleClick={handleClick} />;
            case 1:
                return <JoinPhoneNum1 handleClick={handleClick} setUserTel={setUserTel} setCheckNum={setCheckNum} />;
            case 2:
                return <JoinPhoneNum2 handleClick={handleClick} backClick={backClick} checkNum={checkNum} />;
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
                return <JoinFavorite handleClick={handleClick} setUserHobby1={setUserHobby1} setUserHobby2={setUserHobby2} setUserHobby3={setUserHobby3} backClick={backClick} />;
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