import React, { useState } from 'react';
import Password1 from './password/Password1';
import Password2 from './password/Password2';
import Password3 from './password/Password3';
import Password4 from './password/Password4';

const Password = () => {
    const [pageIndex, setPageIndex] = useState(0);
    const [userTel, setUserTel] = useState('');
    const [userPw, setUserPw] = useState('');

    const handleClick = () => {
        if (pageIndex < 10) {
            setPageIndex(pageIndex + 1);
        }
    };

    const renderPage = () => {
        switch (pageIndex) {
            case 0:
                return <Password1 handleClick={handleClick} />;
            case 1:
                return <Password2 handleClick={handleClick} setUserTel={setUserTel} />;
            case 2:
                return <Password3 handleClick={handleClick} />;
            case 3:
                return <Password4 handleClick={handleClick} setUserPw={setUserPw} />;
            default:
                return <Password1 />;
        }
    };

    return (
        <div> {renderPage()}</div>
    )
}

export default Password