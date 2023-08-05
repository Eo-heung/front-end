import React, { useCallback, useState } from 'react';
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

    const handleClick = () => {
        if (pageIndex < 10) {
            setPageIndex(pageIndex + 1);
        }
        console.log(userTel);
    };

    const changeUserPw = useCallback((e) => {
        setUserPw(() => e.target.value);
    }, []);

    const renderPage = () => {
        switch (pageIndex) {
            case 0:
                return <Join handleClick={handleClick} />;
            case 1:
                return <JoinPhoneNum1 handleClick={handleClick} setUserTel={setUserTel} />;
            case 2:
                return <JoinPhoneNum2 handleClick={handleClick} />;
            case 3:
                return <JoinPW handleClick={handleClick} changeUserPw={changeUserPw} />;
            case 4:
                return <JoinName handleClick={handleClick} />;
            case 5:
                return <JoinBirth handleClick={handleClick} />;
            case 6:
                return <JoinLocal1 handleClick={handleClick} />;
            case 7:
                return <JoinLocal2 handleClick={handleClick} />;
            case 8:
                return <JoinLocal3 handleClick={handleClick} />;
            case 9:
                return <JoinFavorite handleClick={handleClick} />;
            case 10:
                return <JoinComplete handleClick={handleClick} />;
            default:
                return <Join />;
        }
    };

    return (
        <div> {renderPage()}</div>
    )
}

export default SignUp