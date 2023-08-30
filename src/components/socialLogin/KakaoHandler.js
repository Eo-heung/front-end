import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { SPRING_API_URL, REDIRECT_URL } from "../../config";

const KakaoHandler = () => {
  const [cookies, setCookie] = useCookies(["userNickname", "userId"]);
  const loginSuccessHandler = (data) => {
    console.log("Received data:", data);
    if (data.userName) {
      setCookie("userNickname", data.userName, { path: "/" });
    }
    if (data.userId) {
      setCookie("userId", data.userId, { path: "/" });
    }
  };
  const navi = useNavigate();
  const grant_type = "authorization_code";
  const client_id = "d85c142dc0c92939902ad3248688e8ad";
  const REDIRECT_URL2 = `${REDIRECT_URL}/auth`;
  const [code, setCode] = useState(
    new URL(window.location.href).searchParams.get("code")
  );
  useEffect(() => {
    console.log(code);
    axios
      .post(
        `https://kauth.kakao.com/oauth/token`,
        {
          grant_type: `${grant_type}`,
          client_id: `${client_id}`,
          redirect_uri: `${REDIRECT_URL2}`,
          code: `${code}`,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        }
      )
      .then((res) => {
        console.log(res);
        const { data } = res;
        const { access_token } = data;
        if (access_token) {
          console.log(`Bearer${access_token}`);
          axios
            .post(
              `https://kapi.kakao.com/v2/user/me`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${access_token}`,
                  "Content-Type":
                    "application/x-www-form-urlencoded;charset=utf-8",
                },
              }
            )

            .then((res) => {
              console.log("데이터 성공 :");
              console.log(res);
              const currentDate = new Date();
              const currentYear = currentDate.getFullYear();
              const Age = res.data.kakao_account.age_range.split("~").map(Number)[0];

              axios
                .post(`${SPRING_API_URL}/kakaoLogin`, {
                  userId: res.data.kakao_account.email,
                  userBirth:
                    currentYear -
                    res.data.kakao_account.age_range.split("~").map(Number)[0] +
                    res.data.kakao_account.birthday,
                  userName: res.data.kakao_account.profile.nickname,
                  userGender: res.data.kakao_account.gender === "male" ? 1 : 0,
                  userEmail: res.data.kakao_account.email,
                })
                .then((res) => {
                  if (Age > 19) {
                    alert(`${res.data.item.userName}님 환영합니다.`);
                    localStorage.setItem("REFRESH_TOKEN", res.data.item.token);
                    sessionStorage.setItem("ACCESS_TOKEN", res.data.item.token);
                    sessionStorage.setItem("userId", res.data.item.userId);
                    loginSuccessHandler(res.data.item);
                    navi("/");
                  }
                  else {
                    axios.post(`${SPRING_API_URL}/removeId`, {},
                      {
                        headers: {
                          Authorization: `Bearer ${res.data.item.token
                            }`,
                        },
                      })
                    alert(`만 60세 미만은 이용할 수 없습니다!!!!`);
                    navi("/login");
                  }
                });
            });
        } else {
          console.log("없어!");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, [code]);

  return <></>;
};

export default KakaoHandler;
