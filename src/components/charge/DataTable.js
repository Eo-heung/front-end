import React, { useState } from 'react';
import { Paper, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { styled } from 'styled-components';

const handleLinkClick = (e) => {
    const userResponse = window.confirm("결제를 진행하시겠습니까?");
    if (!userResponse) {
        // Prevent the navigation if user cancels the action
        e.preventDefault();
    }
}

const StyledButton = styled.button`
  background-color: #f7f7f7;
  color: black;
  border: none;
  width: 300px;
  height: 50px;
  cursor: pointer;
  transition: 0.3s;
  border-radius: 5px;

  &:hover {
    background-color: #ff9238;
    color: white;
  }
`;

const DataTable = () => {
    const [coin, setCoin] = useState('');  // 곶감 수
    const [selectedItem, setSelectedItem] = useState({ count: '', price: '' }); // 선택된 항목의 곶감수와 가격을 저장하기 위한 상태
    const [customCount, setCustomCount] = useState('');

    const handleCoinChange = (e) => {
        const value = e.target.value;
        setCoin(value);

        // 각 value에 따른 count와 price를 정의
        const options = {
            "1": { count: "1", price: "1000" },
            "2": { count: "2", price: "2000" },
            "3": { count: "3", price: "3000" },
            "4": { count: "4", price: "4000" },
            "5": { count: "5", price: "5000" },
            "6": { count: "10", price: "10000" },
            "7": { count: "20", price: "20000" },
            "8": { count: "30", price: "30000" },
            "9": { count: "40", price: "40000" },
            "10": { count: "50", price: "50000" },
        };

        if (value !== "11") {
            setSelectedItem(options[value] || { count: '', price: '' });
            setCustomCount('');
            console.log('Selected Item:', options[value]);  // 선택된 값을 콘솔에 출력
        }
    };


    const handleCustomCountChange = (e) => {
        const countValue = e.target.value;
        if (!isNaN(countValue)) {
            setCustomCount(countValue);
            setCoin('');
        } else {
            alert("숫자 형식으로 입력하세요");
        }
    };

    const handleCustomCountBlur = () => {
        const updatedPrice = coin !== "11" && coin !== '' ? selectedItem.price : String(Number(customCount) * 1000);
        const updatedSelectedItem = {
            count: customCount,
            price: String(Number(updatedPrice))
        };
        setSelectedItem(updatedSelectedItem);
        console.log('Selected Item:', updatedSelectedItem);
    };

    return (
        <Paper style={{ overflowX: 'auto', width: '1000px', marginLeft: '500px', height: '700px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', marginBottom: '10px' }}>
                <FormControl fullWidth>
                    <InputLabel>곶감 선택하기</InputLabel>
                    <Select
                        value={coin}
                        label='곶감'
                        onChange={handleCoinChange}
                        sx={{ marginBottom: '16px' }}
                    >
                        <MenuItem value="1">1(1000원)</MenuItem>
                        <MenuItem value="2">2(2000원)</MenuItem>
                        <MenuItem value="3">3(3000원)</MenuItem>
                        <MenuItem value="4">4(4000원)</MenuItem>
                        <MenuItem value="5">5(5000원)</MenuItem>
                        <MenuItem value="6">10(10000원)</MenuItem>
                        <MenuItem value="7">20(20000원)</MenuItem>
                        <MenuItem value="8">30(30000원)</MenuItem>
                        <MenuItem value="9">40(40000원)</MenuItem>
                        <MenuItem value="10">50(50000원)</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    value={customCount}
                    onChange={handleCustomCountChange}
                    onBlur={handleCustomCountBlur}
                    placeholder="직접입력하기 (원하는 곶감 수 입력)"
                    onClick={(e) => e.stopPropagation()}
                    sx={{ marginTop: '50px', marginBottom: '16px', width: '950px' }} // 50px 간격을 줍니다.
                />
            </div>
            <div style={{ marginTop: '20px', textAlign: 'center', marginTop: '50px', marginBottom: '50px' }}>
                {/* 버튼 스타일을 StyledButton으로 변경합니다. */}
                {/* <StyledButton onClick={handleSubmit} style={{ marginTop: '300px' }} >
                    곶감 선택완료
                </StyledButton>
                <br></br> */}
                <StyledButton onClick={handleLinkClick} style={{ marginTop: '300px' }} >
                    결제하기
                </StyledButton>
            </div>

        </Paper>
    );
};

export default DataTable; 