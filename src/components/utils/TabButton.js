import React from 'react';
import { Button } from '@mui/material';

const TabButton = ({ moimId, label, activeTab, hoveredButton, onTabClick, onMouseEnter, onMouseLeave, style = {} }) => {
    return (
        <Button
            size="large"
            variant={activeTab === label || hoveredButton === label ? 'contained' : 'outlined'}
            style={{
                backgroundColor: (activeTab === label || hoveredButton === label) ? '#FCBE71' : '#fff',
                borderColor: '#FCBE71',
                color: (activeTab === label || hoveredButton === label) ? '#fff' : '#000',
                fontWeight: activeTab === label ? 'bold' : 'normal',
                width: "12%",
                marginRight: "1.5rem",
                textDecoration: "none",
                ...style
            }}
            onClick={() => onTabClick(label)}
            onMouseEnter={() => onMouseEnter(label)}
            onMouseLeave={() => onMouseLeave()}
        >
            {label}
        </Button>
    );
};

export default TabButton;
