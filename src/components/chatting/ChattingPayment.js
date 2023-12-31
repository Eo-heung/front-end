import {
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { SPRING_API_URL, NODE_API_URL, REDIRECT_URL } from "../../config";

const StyledButton = styled.button`
  width: 300px;
  height: 50px;
  border: none;
  border-radius: 5px;
  background-color: #ffffff;
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
  const [coin, setCoin] = useState("");
  const [selectedItem, setSelectedItem] = useState({ count: "", price: "" }); // 선택된 항목의 곶감수와 가격을 저장하기 위한 상태
  const [customCount, setCustomCount] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userTel, setUserTel] = useState("");
  const [userAddr1, setUserAddr1] = useState("");
  const [userAddr2, setUserAddr2] = useState("");
  const [userAddr3, setUserAddr3] = useState("");

  useEffect(() => {
    const jquery = document.createElement("script");
    jquery.src = "https://code.jquery.com/jquery-1.12.4.min.js";
    const iamport = document.createElement("script");
    iamport.src = "https://cdn.iamport.kr/js/iamport.payment-1.1.7.js";
    document.head.appendChild(jquery);
    document.head.appendChild(iamport);
    fetchUserInfo();
    return () => {
      document.head.removeChild(jquery);
      document.head.removeChild(iamport);
    };
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.post(
        `${SPRING_API_URL}/mypage/myinfo`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
          },
        }
      );

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
      1: { count: "1", price: "1000" },
      2: { count: "2", price: "2000" },
      3: { count: "3", price: "3000" },
      4: { count: "4", price: "4000" },
      5: { count: "5", price: "5000" },
      6: { count: "10", price: "10000" },
      7: { count: "20", price: "20000" },
      8: { count: "30", price: "30000" },
      9: { count: "40", price: "40000" },
      10: { count: "50", price: "50000" },
    };
    const value = e.target.value;
    const chosenOption = options[value] || { count: "", price: "" };
    setSelectedItem(chosenOption);
    setCoin(value);
    setCustomCount("");

    if (value !== "11") {
      setSelectedItem(options[value] || { count: "", price: "" });
    }
  };

  const handleCustomCountChange = (e) => {
    const countValue = e.target.value;
    if (!isNaN(countValue)) {
      setCustomCount(countValue);
      setSelectedItem({
        count: countValue,
        price: String(Number(countValue) * 1000),
      });
      setCoin("");
    } else {
      alert("숫자 형식으로 입력하세요");
    }
  };

  const handleCustomCountBlur = () => {
    const updatedPrice =
      coin !== "11" && coin !== ""
        ? selectedItem.price
        : String(Number(customCount) * 1000);
    const updatedSelectedItem = {
      count: customCount,
      price: String(Number(updatedPrice)),
    };
    setSelectedItem(updatedSelectedItem);
  };

  const onClickPayment = () => {
    const { IMP } = window;
    IMP.init("imp46524082");

    const data = {
      pg: "kcp.T0000",
      pay_method: "card",
      merchant_uid: `mid_${new Date().getTime()}`,
      name: "곶감 " + selectedItem.count + "개", // "곶감 10개" 사는지 이름
      amount: selectedItem.price, // 현금? 얼마인지 금액을 넣어야함.
      custom_data: {
        name: "부가정보",
        desc: "세부 부가정보",
      },
      buyer_name: userName, // 구매하는 사람 이름
      buyer_tel: userTel, // 구매하는 사람 전화번호
      buyer_email: userEmail, // 구매하는 사람 이메일
      buyer_addr: userAddr1 + " " + userAddr2 + " " + userAddr3, // 구매하는 사람 주소
    };
    IMP.request_pay(data, callback);
  };

  const callback = async (response) => {
    const {
      success,
      error_msg,
      imp_uid,
      merchant_uid,
      pay_method,
      paid_amount,
      status,
    } = response;

    if (success) {
      const data = await axios.post(
        `${SPRING_API_URL}/verifyIamport/${imp_uid}`,
        {}
      );
      console.log(data.data.response.amount);
      if (data.data.response.amount === paid_amount) {
        // 유저아이디, imp_uid, merchant_uid, paid_amount
        const result = axios.post(
          `${SPRING_API_URL}/addPayment`,
          {
            imp_uid: imp_uid,
            merchant_uid: merchant_uid,
            value: paid_amount,
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
            },
          }
        );
        alert("결제 성공");
      } else {
        alert("결제 실패");
      }
    } else {
      alert(`결제 실패: ${error_msg}`);
    }
  };

  return (
    <Paper style={{ width: "50%", marginLeft: "400px", height: "500px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          marginTop: "5px",
        }}
      >
        <FormControl style={{ marginTop: "50px", width: "70%" }}>
          <InputLabel>곶감 선택하기</InputLabel>
          <Select
            value={coin}
            label="곶감"
            onChange={handleCoinChange}
            sx={{ marginBottom: "16px" }}
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
          sx={{
            flexDirection: "column",
            textAlign: "center",
            marginBottom: "16px",
            width: "70%",
          }}
        />
      </div>
      <div style={{ marginTop: "0px", textAlign: "center" }}>
        <StyledButton onClick={onClickPayment} style={{ marginTop: "120px" }}>
          결제하기
        </StyledButton>
      </div>
    </Paper>
  );
};

export default Payment;
