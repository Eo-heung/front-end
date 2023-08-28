import { FormControl, FormControlLabel, InputLabel, MenuItem, Paper, Select, TextField, Radio, RadioGroup, Grid } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import LinearProgress from '@mui/material/LinearProgress';
import { margin } from '@mui/system';
import { async } from 'q';

const StyledButton = styled.button`
width: 300px;
height: 50px;
border: none;
border-radius: 5px;
background-color: #FFFFFF;
cursor: pointer;
border: 1px solid rgba(252, 190, 113, 0.85);
transition: background-color 0.3s ease;
color: #707070;

&.active {
    background-color: rgba(252, 190, 113, 0.85);
    color: black;
    font-weight: bold;
  }

  &:hover {
    background-color: rgba(252, 190, 113, 0.85);
    color: black;
  }
`;

const Payment = () => {
    const [coin, setCoin] = useState('');
    const [customCount, setCustomCount] = useState('');
    const [selectedItem, setSelectedItem] = useState({ count: '', price: '' }); // 선택된 항목의 곶감수와 가격을 저장하기 위한 상태
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userTel, setUserTel] = useState('');
    const [userAddr1, setUserAddr1] = useState('');
    const [userAddr2, setUserAddr2] = useState('');
    const [userAddr3, setUserAddr3] = useState('');
    const [totalGotGam, setTotalGotGam] = useState('');
    const [addGotGam, setAddGotGam] = useState('')

    useEffect(() => {

        const jquery = document.createElement("script");
        jquery.src = "https://code.jquery.com/jquery-1.12.4.min.js";
        const iamport = document.createElement("script");
        iamport.src = "https://cdn.iamport.kr/js/iamport.payment-1.1.7.js";
        document.head.appendChild(jquery);
        document.head.appendChild(iamport);
        fetchUserInfo();
        totalGam();
        return () => {
            document.head.removeChild(jquery);
            document.head.removeChild(iamport);
        }


    }, []);

    useEffect(() => {
        setAddGotGam(Number(totalGotGam) + Number(selectedItem.count));
    }, [selectedItem]);

    const totalGam = async () => {
        axios.post(
            "http://localhost:9000/totalGotGam",
            {},
            {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                }
            })
            .then(res => {
                setTotalGotGam(res.data.item);
                console.log(res.data.item);
            }).catch(error => { console.error(error) });
    }

    const fetchUserInfo = async () => {
        try {
            const response = await axios.post('http://localhost:9000/mypage/myinfo',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                    }
                });

            setUserName(response.data.item.userName);
            setUserEmail(response.data.item.userEmail);
            setUserTel(response.data.item.userTel);
            setUserAddr1(response.data.item.userAddr1);
            setUserAddr2(response.data.item.userAddr2);
            setUserAddr3(response.data.item.userAddr3);
        } catch (error) {
            console.error("유저 정보를 가져오는 데 실패했습니다:", error);
        }
    };

    const handleCoinChange = (e) => {

        // 각 value에 따른 count와 price를 정의
        const options = {
            "1": { count: "1", price: "100" },
            "2": { count: "5", price: "500" },
            "3": { count: "10", price: "1000" },
            "4": { count: "20", price: "2000" },
            "5": { count: "30", price: "3000" },
            "6": { count: "40", price: "4000" },
        };
        const value = e.target.value;
        const chosenOption = options[value] || { count: '', price: '' };
        setSelectedItem(chosenOption);
        setCoin(value);
        setCustomCount('');

        if (value !== "11") {
            setSelectedItem(options[value] || { count: '', price: '' });
        }

    };

    const handleCustomCountChange = (e) => {
        const countValue = e.target.value;
        if (!isNaN(countValue)) {
            setCustomCount(countValue);
            setSelectedItem({ count: countValue, price: String(Number(countValue) * 100) });
            setCoin('');
        } else {
            alert("숫자 형식으로 입력하세요");
        }
    };

    const handleCustomCountBlur = () => {
        const updatedPrice = coin !== "11" && coin !== '' ? selectedItem.price : String(Number(customCount) * 100);
        const updatedSelectedItem = {
            count: customCount,
            price: String(Number(updatedPrice))
        };
        setSelectedItem(updatedSelectedItem);
    };

    const onClickPayment = () => {

        const { IMP } = window;
        IMP.init('imp46524082');

        const data = {
            pg: 'kcp.T0000',
            pay_method: 'card',
            merchant_uid: `mid_${new Date().getTime()}`,
            name: "곶감 " + selectedItem.count + "개", // "곶감 10개" 사는지 이름
            amount: selectedItem.price, // 현금? 얼마인지 금액을 넣어야함.
            custom_data: {
                name: '부가정보',
                desc: '세부 부가정보'
            },
            buyer_name: userName, // 구매하는 사람 이름
            buyer_tel: userTel, // 구매하는 사람 전화번호
            buyer_email: userEmail, // 구매하는 사람 이메일
            buyer_addr: userAddr1 + ' ' + userAddr2 + ' ' + userAddr3, // 구매하는 사람 주소
        };
        IMP.request_pay(data, callback);
    }

    const callback = async (response) => {
        const { success, error_msg, imp_uid, merchant_uid, pay_method, paid_amount, status } = response;

        if (success) {
            const data = await axios.post(`http://localhost:9000/verifyIamport/${imp_uid}`, {})
            console.log(data.data.response.amount);
            if (data.data.response.amount === paid_amount) {
                // 유저아이디, imp_uid, merchant_uid, paid_amount
                const result = axios.post('http://localhost:9000/addPayment', {
                    imp_uid: imp_uid,
                    merchant_uid: merchant_uid,
                    value: paid_amount
                },
                    {
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
                        }
                    })
                alert('결제 성공');
            }
            else {
                alert('결제 실패');
            }
        } else {
            alert(`결제 실패: ${error_msg}`);
        }

    }


    const [value, setValue] = React.useState('');

    const [hoverIndex, setHoverIndex] = useState(null);


    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}> {/* 이 부분을 추가하여 두 개의 박스가 옆에 나열되도록 함 */}
            <Paper style={{
                width: '45%',
                marginTop: '6.5%',
                marginLeft: '270px',
                height: '590px',
                // Paper의 오른쪽 마진 추가
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',  // 그림자 효과 수정
                position: 'relative'  // 추가된 코드

            }}>
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px'  // 현재 곶감 수의 위치 조정
                }}>
                    <Grid>{[
                        ["현재 곶감 수 : ", `${totalGotGam}`, "개"]
                    ]}</Grid>
                </div>
                <hr style={{ marginTop: '60px' }}></hr>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0px' }}>
                    <FormControl component="fieldset" style={{ width: '70%' }}>
                        <RadioGroup row value={value} onChange={handleCoinChange}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    {[
                                        ["1", "1개(100원)"],
                                        ["2", "5개(500원)"],
                                        ["3", "10개(1000원)"],
                                    ].map(([val, label], index) => (
                                        <div
                                            key={index}
                                            style={{ padding: '5px 0', marginTop: '10px' }}
                                            onMouseEnter={() => setHoverIndex(index)}
                                            onMouseLeave={() => setHoverIndex(null)}
                                            onClick={() => handleCoinChange({ target: { value: val } })}
                                        >
                                            <div style={{
                                                border: '1px solid',
                                                borderRadius: '5px',
                                                height: '50px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: (hoverIndex === index || coin === val) ? 'rgba(252, 190, 113, 0.85)' : 'transparent'
                                            }}>
                                                <FormControlLabel
                                                    value={val}
                                                    control={<Radio checked={coin === val} />}
                                                    label={label}
                                                    style={{ width: '100%', margin: 0 }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </Grid>

                                <Grid item xs={6}>
                                    {[
                                        ["4", "20개(2000원)"],
                                        ["5", "30개(3000원)"],
                                        ["6", "40개(4000원)"],
                                    ].map(([val, label], index) => (
                                        <div
                                            key={index}
                                            style={{ padding: '5px 0', marginTop: '10px' }}
                                            onMouseEnter={() => setHoverIndex(index + 5)}
                                            onMouseLeave={() => setHoverIndex(null)}
                                            onClick={() => handleCoinChange({ target: { value: val } })}
                                        >
                                            <div style={{
                                                border: '1px solid',
                                                borderRadius: '5px',
                                                height: '50px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: (hoverIndex === (index + 5) || coin === val) ? 'rgba(252, 190, 113, 0.85)' : 'transparent'
                                            }}>
                                                <FormControlLabel
                                                    value={val}
                                                    control={<Radio checked={coin === val} />}
                                                    label={label}
                                                    style={{ width: '100%', margin: 0 }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </Grid>
                            </Grid>
                        </RadioGroup>
                    </FormControl>
                    <TextField
                        value={customCount}
                        onChange={handleCustomCountChange}
                        onBlur={handleCustomCountBlur}
                        placeholder="직접입력하기 (원하는 곶감 수 입력)"
                        onClick={(e) => e.stopPropagation()}
                        sx={{ flexDirection: 'column', textAlign: 'center', width: '70%', marginTop: '20px' }} />
                </div >
                <hr></hr>
                <div style={{ height: '0px', textAlign: 'center' }}>
                    <Grid style={{ alignItems: 'center' }}>
                        {[`구매 후 총 곶감 수 : ${addGotGam}개`]}
                    </Grid>
                </div>
                <hr style={{ marginTop: '35px' }}></hr>
                <div style={{ height: '0px', textAlign: 'center' }}>
                    <Grid>
                        {[
                            ["총 결제 금액 : ", `${selectedItem.price} 원`]
                        ]}
                    </Grid>
                </div>
                <hr style={{ marginTop: '35px' }}></hr>
                <div style={{ textAlign: 'center' }}>
                    <StyledButton onClick={onClickPayment} style={{ marginTop: '10px', height: '50px', width: '200px' }}>
                        결제하기
                    </StyledButton>
                </div>
            </Paper>
            <box style={{
                width: '20%',
                marginTop: '6.5%',
                marginLeft: '70px',
                height: '590px',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
                position: 'relative'
            }}>
                <div
                    style={{ textAlign: 'center', marginTop: '20px', cursor: 'pointer' }}
                >
                    약관 내용
                </div>
                <hr style={{ marginTop: '20px' }}></hr>
                <br></br>
                <div style={{ fontFamily: "font-medium", color: 'gray', marginLeft: '30px', marginRight: '30px' }}>
                    1. 구매 후 7일 경과 시 자동환불이 불가능합니다.
                    <br></br>
                    <br></br>
                    2. 구매 후 곶감 사용 시 자동환불이 불가능합니다.
                    <br></br>
                    <br></br>
                    3. 잔여 곶감을 환불받고싶으시면  <a style={{ cursor: 'pointer' }}>junghyuna04@gmail.com</a>로 문의해주세요.
                    <br></br>
                    <br></br>
                    4. 잔여 곶감을 환불받을 시 수수료 10%가 요구되며 10000원 이하의 금액을 환불받을 시에는 수수료1000원이 고정 요구됩니다.
                </div>
            </box >
        </div >
    );

};

export default Payment; 