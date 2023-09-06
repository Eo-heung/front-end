import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import basicProfile from "../../public/basic_profile.png";
import MoimProfileArea from "./MoimProfileArea";
import MoimMemberList from "./MoimMemberList";
import { SPRING_API_URL, REDIRECT_URL } from "../../config";
import axios from "axios";

const Nav = ({ getFriendList, friends }) => {
  //DB에서 Orderby로 끌어오기
  const getCookie = (userNicknamename) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${userNicknamename}=`);
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
  };
  const getProfileImage = async () => {
    try {
      const response = await axios.post(`${SPRING_API_URL}/mypage/getprofileimage`, {}, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
        },
      });
      setImageFile(`data:image/jpeg;base64,${response.data.item}`);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const [imageFile, setImageFile] = useState(null);
  const userNickname = decodeURIComponent(getCookie("userNickname") || "");
  const [appoint, setAppoint] = useState(null);
  const exAppo = [
    { startTime: new Date("2023-09-06T10:00:00"), content: "[운동] 아침러닝" },
    {
      startTime: new Date("2023-09-06T12:30:00"),
      content: "[운동] 오프라인 만남",
    },
    { startTime: new Date("2023-09-06T23:00:00"), content: "[운동] 화상채팅" },
  ];

  const location = useLocation();

  const match = /\/(\d+)\/(moim-board|create-board)/.exec(location.pathname);
  const moimId = match ? match[1] : null;

  useEffect(() => {
    // 현재 시간 이후의 약속을 필터링
    const futureAppointments = exAppo.filter(
      (appointment) => appointment.startTime > new Date()
    );

    // 현재 시간과 가장 가까운 약속을 찾음
    const closest = futureAppointments.reduce(
      (prev, curr) => (prev.startTime < curr.startTime ? prev : curr),
      futureAppointments[0]
    );
    getProfileImage();
    setAppoint(closest);
    getFriendList();
  }, []);
  // style={{ width: '45%' }}
  function List(props) {
    const friend = props.friend;

    // 글자 수가 10자 초과일 때 '...'을 추가하는 로직
    const displayName =
      friend.user_name.length > 10
        ? friend.user_name.substring(0, 10) + "..."
        : friend.user_name;

    return (
      <>
        <tr key={friend.user_name}>
          <td style={{ width: "90px", paddingLeft: "5px" }}>
            <img
              style={{
                border: "2px solid white",
                boxShadow: `0 0 5px 2px ${friend.online ? "#05FF00" : "#B6B6B6"
                  }`,
              }}
              src={
                (friend.profile &&
                  `data:image/jpeg;base64,${friend.profile}`) ||
                basicProfile
              }
              alt="프로필 사진"
            />
          </td>
          <td style={{ width: "170px" }}>{displayName}</td>
        </tr>
      </>
    );
  }

  return (
    <div className="sb-nav-fixed">
      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <nav className="sb-sidenav accordion sb-sidenav-light">
            {/* 프로필 영역 */}
            {moimId ? (
              <MoimProfileArea moimId={moimId}></MoimProfileArea>
            ) : (
              <div className="sb-sidenav-profile">
                <div
                  className="sidenav-profile-mypic"
                  style={{ marginTop: "5px", marginBottom: "5px" }}
                >
                  <img
                    alt="프로필 이미지"
                    className="sidenav-profile-img"
                    src={imageFile || basicProfile}
                  ></img>
                </div>
                <div className="sidenav-profile-appoint">
                  <span style={{ fontSize: "1.2rem" }}>{userNickname}</span>
                  <span style={{ fontSize: "1rem" }}> 님</span>
                  <br />
                  <div
                    style={{
                      fontSize: "1.1rem",
                      marginTop: "6px",
                      marginBottom: "10px",
                      color: "gray",
                    }}
                  >
                    오늘도 어흥!
                  </div>
                </div>
                <div className="sidenav-profile-appointList">
                  <div className="sidenav-profile-appointListItem">
                    {appoint ? (
                      <tr>
                        <td>
                          {appoint.startTime.toLocaleTimeString("ko-KR", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {appoint.content}
                        </td>
                      </tr>
                    ) : (
                      <li>약속이 없어요!</li>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 친구영역 */}
            {moimId ? (
              <MoimMemberList moimId={moimId}></MoimMemberList>
            ) : (
              <div className="sb-sidenav-friend">
                <div className="sb-sidenav-friend-title">
                  <h5>접속한 친구목록</h5>
                </div>
                <div className="sb-sidenav-fri-container">
                  <table className="sb-sidenav-fri">
                    {friends.length > 0 ? (
                      friends.map((a, i) => <List friend={a} key={i} />)
                    ) : (
                      <tr>
                        <td style={{ width: "260px", textAlign: "center" }}>
                          활동중인 친구가 없습니다.
                        </td>
                      </tr>
                    )}
                  </table>
                </div>
              </div>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Nav;
