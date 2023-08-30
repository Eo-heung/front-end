import React, { useRef, useCallback } from "react";
import { SPRING_API_URL, NODE_API_URL, REDIRECT_URL } from "../../../config";

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
      `${NODE_API_URL}/multichatting`,
      "_blank",
      "width=800,height=600"
    );

    newWindowRef.current.onload = () => {
      const data = { nickname: userNickname };
      newWindowRef.current.postMessage(data, "*");
    };
  }, []);

  return (
    <div class="sb-nav-fixed mainpage">
      <div id="layoutSidenav">
        <div id="layoutSidenav_content">
          <div>
            <button onClick={handleClick}>새 창에서 열기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonWithNewWindow;
