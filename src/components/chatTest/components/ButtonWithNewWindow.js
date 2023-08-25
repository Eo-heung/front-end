import React, { useRef, useCallback } from "react";

const ButtonWithNewWindow = () => {
  const newWindowRef = useRef(null);
  const userNickname = decodeURIComponent(getCookie("userNickname") || "");

  function getCookie(userNicknamename) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${userNicknamename}=`);
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
  }

  const handleClick = useCallback(() => {
    newWindowRef.current = window.open(
      "http://localhost:3000/multichatting",
      "_blank",
      "width=800,height=600"
    );

    newWindowRef.current.onload = () => {
      const data = { nickname: userNickname };
      newWindowRef.current.postMessage(data, "*");
    };
  }, []);

  return <button onClick={handleClick}>새 창에서 열기</button>;
};

export default ButtonWithNewWindow;
