import React from 'react';
import { Outlet } from 'react-router-dom';

const Main = () => {
    return (
        <div className="main-top-space">
            <Outlet />
        </div>
    );
};

export default Main;