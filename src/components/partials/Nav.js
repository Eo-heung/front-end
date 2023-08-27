import React, { useEffect, useState } from "react";

const Nav = ({ getFriendList, friends }) => {
  //DB에서 Orderby로 끌어오기
  const [appoint, setAppoint] = useState(null);
  const exAppo = [
    { startTime: new Date("2023-08-06T10:00:00"), content: "아침 회의" },
    { startTime: new Date("2023-08-07T12:30:00"), content: "점심 약속" },
    { startTime: new Date("2023-08-07T23:00:00"), content: "오후 회의" },
  ];

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

    setAppoint(closest);
    getFriendList();
  }, []);
  // style={{ width: '45%' }}
  function List(props) {
    const friend = props.friend;
    return (
      <>
        <tr key={friend.user_name}>
          <td style={{ width: "90px", paddingLeft: "5px" }}>
            <img
              style={{
                border: "2px solid white",
                boxShadow: `0 0 5px 2px ${
                  friend.online ? "#05FF00" : "#B6B6B6"
                }`,
              }}
              src={`data:image/jpeg;base64,${friend.profile}`}
              alt="프로필 사진"
            />
          </td>
          <td style={{ width: "100px" }}>{friend.user_name}</td>
          <td style={{ width: "70px" }}>
            {friend.online ? "온라인" : "오프라인"}
          </td>
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
            <div className="sb-sidenav-profile">
              <div className="sidenav-profile-mypic" style={{ height: "60%" }}>
                <img
                  className="sidenav-profile-img"
                  src="https://cdnimg.melon.co.kr/cm2/artistcrop/images/002/61/143/261143_20210325180240_500.jpg?61e575e8653e5920470a38d1482d7312/melon/resize/416/quality/80/optimize"
                ></img>
              </div>
              <div
                className="sidenav-profile-appoint"
                style={{ height: "20%" }}
              >
                <h4>000님,</h4>
                <h4>아농하세요!</h4>
              </div>
              <div
                className="sidenav-profile-appointList"
                style={{ height: "15%" }}
              >
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
                      <td style={{ textAlign: "center" }}>{appoint.content}</td>
                    </tr>
                  ) : (
                    <li>약속이 없어요!</li>
                  )}
                </div>
              </div>
            </div>

            {/* 친구영역 */}
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
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Nav;
