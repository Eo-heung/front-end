// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';


// const GoogleHandelr = () => {
//     const navi = useNavigate();
//     const [code, setCode] = useState(new URL(window.location.href).searchParams.get("code"));
//     const REST_API_KEY = '288953923003-3jl39jsis929cjl1ajjtg78vc22ke1h4.apps.googleusercontent.com';
//     const REDIRECT_URI = "http://localhost:1234/oauth";
//     const SECRET_KEY = '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';
//     const grant_type = 'authorization_code';
//     useEffect(() => {
//         console.log(code);
//         const response = axios.post(`https://oauth2.googleapis.com/token`,
//             {
//                 grant_type: `${grant_type}`,
//                 client_id: `${REST_API_KEY}`,
//                 redirect_uri: `${REDIRECT_URI}`,
//                 client_secret: `${SECRET_KEY}`,
//                 code: `${code}`,
//             },
//             {
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
//                 },
//             })
//             .then((res) => {
//                 console.log(res);
//                 const { data } = res;
//                 const { access_token } = data;
//                 if (access_token) {
//                     console.log(`Bearer${access_token}`);
//                     axios.get("https://www.googleapis.com/oauth2/v2/userinfo",
//                         {
//                             headers: {
//                                 Authorization: `Bearer ${access_token}`,

//                             }
//                         }
//                     )
//                         .then((res) => {
//                             console.log("데이터 성공 :")
//                             console.log(res);
//                         })
//                         .then((res) => {
//                             console.log("데이터 성공 :")
//                             console.log(res);
//                             axios.post('http://localhost:9000/kakaoLogin', {
//                                 userId: res.data.email,
//                                 userBirth: res.data.birthday,
//                                 userNickname: res.data.name
//                             })
//                                 .then((res) => {
//                                     alert(`${res.data.item.userName}님 환영합니다.`);
//                                     localStorage.setItem("REFRESH_TOKEN", res.data.item.token);
//                                     sessionStorage.setItem("ACCESS_TOKEN", res.data.item.token);
//                                     sessionStorage.setItem("userId", res.data.item.userId);
//                                     navi("/");
//                                 })
//                         });
//                 }
//                 else {
//                     console.log("없어!");
//                 }

//             })
//             .catch(e => {
//                 console.log(e);
//             });
//     }, [code]);


//     return (
//         <></>
//     )
// }

// export default GoogleHandelr;