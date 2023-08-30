import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SPRING_API_URL, REDIRECT_URL } from "../../config";




const NaverHandler = () => {
    const navi = useNavigate();
    const state = 'false';
    const grant_type = "authorization_code";
    const client_id = 'fK9M_7tC_kI7hRd4QXQG';
    const client_secret = 'cqMyh0TQMc';
    const [code, setCode] = useState(new URL(window.location.href).searchParams.get("code"));
    useEffect(() => {
        if (code) {
            console.log(code);

            // 데이터를 백엔드에 전송
            axios.post(`${SPRING_API_URL}/NaverToken`, {
                state: state,
                client_id: client_id,
                client_secret: client_secret,
                code: code
            })
                .then((res) => {
                    alert(`${res.data.item.userName}님 환영합니다.`);
                    localStorage.setItem("REFRESH_TOKEN", res.data.item.token);
                    sessionStorage.setItem("ACCESS_TOKEN", res.data.item.token);
                    sessionStorage.setItem("userId", res.data.item.userId);
                    navi("/");
                })
                .catch(error => {
                    // 오류 처리
                    console.error("There was an error sending the data:", error);
                });
        }
    }, [code]);


    return (
        <></>
    )
}

export default NaverHandler