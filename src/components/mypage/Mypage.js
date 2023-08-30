import styled from "@emotion/styled";
import { Box, Button, Container, Divider, FormControl, FormControlLabel, Grid, Link, MenuItem, Paper, Radio, RadioGroup, Select, Tab, Table, TableBody, TableCell, TableHead, TableRow, Tabs, TextField, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import React, { createRef, useEffect, useRef, useState } from "react";
import DaumPostcode from "react-daum-postcode";
import basicProfile from "../../public/basic_profile.png";

const TabButton = styled.button`
  width: 17%;
  max-width: 250px;
  height: 5%;
  padding: 10px 20px;
  margin-right: 10px;
  border: none;
  border-radius: 5px;
  background-color: #ffffff;
  cursor: pointer;
  border: 1px solid #fcbe71;
  transition: background-color 0.3s ease;
  color: #707070;

  &.active {
    background-color: #fcbe71;
    color: black;
    font-weight: bold;
  }

  &:hover {
    background-color: rgba(252, 190, 113, 0.85);
    color: black;
  }
`;

const StyledContainer = styled(Container)`
  marginleft: 400px;
  maxwidth: 80%;
`;

const BoxContent = styled.div`
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
`;

const UserInfoSection = styled.div`
    margin: 20px 0;
    padding: 20px;3
    border: 1px solid #e0e0e0;
    border-radius: 8px;
`;

const Mypage = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userGender, setUserGender] = useState(null);
  const [userBirth, setUserBirth] = useState("");
  const [userTel, setUserTel] = useState("");
  const [userAddr1, setUserAddr1] = useState("");
  const [userAddr2, setUserAddr2] = useState("");
  const [userAddr3, setUserAddr3] = useState("");
  const [userRegdate, setUserRegdate] = useState(null);
  const [userRecommend, setUserRecommend] = useState("");
  const [userHobby1, setUserHobby1] = useState("");
  const [userHobby2, setUserHobby2] = useState("");
  const [userHobby3, setUserHobby3] = useState("");
  const [userStatusMessage, setUserStatusMessage] = useState("");
  const [data, setData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(0);
  const [value1, setValue1] = useState(0);
  const [interests, setInterests] = useState([]);
  const [musicGenres, setMusicGenres] = useState([]);
  const [foodTypes, setFoodTypes] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [checkPw, setCheckPw] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [requestFriends, setRequestFriends] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [paymentList, setPaymentList] = useState([]);
  const [userStatus, setUserStatus] = useState(false);
  const phoneInputRef = createRef();
  const verificationCodeRef = createRef();
  const serverCodeRef = useRef(null);
  const passwordRef = createRef();
  const checkPasswordRef = createRef();

  const openModal = () => { setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); };
  const openPasswordModal = () => { setPasswordModalOpen(true); };
  const closePasswordModal = () => { setPasswordModalOpen(false); };
  const [open, setOpen] = useState(false);
  const handleOpen = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };
  const handleChange = (event, newValue) => { setValue(newValue); };
  const handleChange1 = (event, newValue1) => { setValue1(newValue1); };
  const [filter, setFilter] = useState({ status: "전체", category: "전체" });

  useEffect(() => {
    axios.post("http://localhost:9000/hobby/gethobby")
      .then((res) => res.data)
      .then((data) => {
        const interests = [];
        const musicGenres = [];
        const foodTypes = [];

        data.items.forEach((item) => {
          const code = item.hobbyCode; // hobbycode 값에 따라
          const value = item.hobbyName; // 해당 취미의 실제 값

          if (Math.floor(code / 100) === 1) { interests.push({ code, value }); }
          else if (Math.floor(code / 100) === 2) { musicGenres.push({ code, value }); }
          else if (Math.floor(code / 100) === 3) { foodTypes.push({ code, value }); }
        });

        // 상태 설정
        setInterests(interests);
        setMusicGenres(musicGenres);
        setFoodTypes(foodTypes);
      });
  }, []);

  const filteredData = data.filter((row) => {
    if (filter.status !== "전체" && row.isEnd !== filter.status) return false;
    if (filter.category !== "전체" && row.moimCategory !== filter.category) return false;
    return true;
  });

  const complete = (data) => {
    setUserAddr1(() => data.sido);
    setUserAddr2(() => data.sigungu);
    setUserAddr3(() => data.bname);
  };

  const checkPhone = async (tel) => {
    try {
      const response = await axios.post("http://localhost:9000/checkphone", tel);
      return response.data.item;
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const changePhone = async () => {
    try {
      const userinfo = {
        userTel: userTel,
        userEmail: userEmail,
        userGender: userGender,
      };
      await axios.post("http://localhost:9000/mypage/changephone", userinfo, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
        },
      });
      setIsEditing(false);
      fetchUserInfo();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const checkPassword = async (userPw) => {
    try {
      const response = await axios.post("http://localhost:9000/mypage/checkpassword", { userPw: userPw }, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
        },
      });
      return response.data.item;
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const changePassword = async (userPw) => {
    try {
      const userinfo = { userPw: userPw, };
      await axios.post("http://localhost:9000/mypage/changepassword", userinfo, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
        },
      });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const getProfileImage = async () => {
    try {
      const response = await axios.post("http://localhost:9000/mypage/getprofileimage", {}, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
        },
      });
      setImageFile(`data:image/jpeg;base64,${response.data.item}`);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  function handleImageUpload(event) {
    const reader = new FileReader();
    const file = event.target.files[0];
    setImageFile(file);

    reader.onloadend = () => {
      document.getElementById("previewImage").src = reader.result;
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  const changeProfileImage = async () => {
    const formData = new FormData();
    formData.append("fileData", imageFile);

    try {
      await axios.post("http://localhost:9000/mypage/changeprofileimage", formData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      getProfileImage();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  function PasswordChangeModal({ isOpen, closeModal }) {
    return (
      <div style={{ display: isOpen ? "flex" : "none", justifyContent: "center", alignItems: "center", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 9999, }}
        onClick={() => {
          setCheckPw(() => false);
          closeModal();
        }}>
        <div style={{ width: "450px", height: "300px", backgroundColor: "white", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderRadius: "10px", }}
          onClick={(e) => e.stopPropagation()}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", }}>
              {checkPw || (
                <TextField
                  label="현재 비밀번호를 입력해주세요." variant="outlined" type="password" inputRef={passwordRef} style={{ flex: 1, marginRight: "10px" }} />
              )}
              {checkPw || (
                <Button variant="inherit" sx={{ backgroundColor: "#dee2e6", color: "black", height: "56px", }}
                  onClick={async () => {
                    const result = await checkPassword(passwordRef.current.value);

                    if (result === "validPassword") { setCheckPw(() => true); }
                    if (result === "invalidPassword") {
                      setCheckPw(() => false);
                      alert("비밀번호가 일치하지 않습니다.");
                    }
                  }}                >
                  확인하기
                </Button>)}
            </div>
            {checkPw && (<TextField label="변경할 비밀번호를 입력해주세요." variant="outlined" fullWidth type="password" inputRef={passwordRef} />)}
            {checkPw && (<TextField label="다시 입력해주세요." variant="outlined" fullWidth type="password" inputRef={checkPasswordRef} />)}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", }}>
            <Button variant="inherit"
              onClick={() => { closeModal(); setCheckPw(() => false); }}>
              취소하기
            </Button>
            {checkPw && (
              <Button variant="contained" color="primary"
                onClick={() => {
                  if (passwordRef.current.value === checkPasswordRef.current.value) {
                    // 여기에 맞으면 실행할 함수를 호출합니다.
                    changePassword(passwordRef.current.value);
                    alert("비밀번호가 변경되었습니다.");
                    setCheckPw(() => false);
                    setIsEditing(!isEditing);
                    closeModal();
                  } else {
                    alert("비밀번호가 일치하지 않습니다. 다시 입력해주세요.");
                  }
                }}
              >
                변경하기
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  function Modal({ isOpen, closeModal }) {
    if (!isOpen) {
      return null;
    }

    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 9999, }} onClick={closeModal}>
        <div style={{ width: "450px", height: "300px", backgroundColor: "white", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderRadius: "10px", }} onClick={(e) => e.stopPropagation()}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", }}>
              <TextField label="변경할 전화번호를 입력해주세요." variant="outlined" inputRef={phoneInputRef} inputProps={{ maxLength: 11 }} style={{ flex: 1, marginRight: "10px" }} />
              <Button variant="inherit" sx={{ backgroundColor: "#dee2e6", color: "black", height: "56px", }}
                onClick={async () => {
                  if (phoneInputRef.current.value.length === 11) {
                    phoneInputRef.current.disabled = true;
                    const num = await checkPhone(phoneInputRef.current.value);
                    alert("인증번호가 발송되었습니다.");
                    serverCodeRef.current = num; // 여기에서 서버로부터 받은 인증번호를 상태에 저장합니다.
                  } else {
                    alert("전화번호를 형식에 맞추어 입력해주세요.");
                  }
                }}>
                인증하기
              </Button>
            </div>
            <TextField label="인증번호를 입력해주세요." variant="outlined" fullWidth inputRef={verificationCodeRef} inputProps={{ maxLength: 6 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", }}>
            <Button variant="inherit" onClick={closeModal}>
              취소하기
            </Button>
            <Button variant="contained" color="primary"
              onClick={() => {
                if (verificationCodeRef.current.value === serverCodeRef.current) {
                  setUserTel(phoneInputRef.current.value);
                  alert("전화번호가 변경되었습니다.");
                  closeModal();
                } else {
                  alert("인증번호가 일치하지 않습니다. 다시 입력해주세요.");
                }
              }}
            >
              변경하기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div role="tabpanel" hidden={value !== index} {...other}>
        {value === index && (
          <Box>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function TabPanel1(props) {
    const { children, value, index, ...other } = props;

    return (
      <div role="tabpanel" hidden={value !== index} {...other}>
        {value === index && (
          <Box>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  const fetchUserInfo = async () => {
    try {
      const response = await axios.post("http://localhost:9000/mypage/myinfo", {}, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
        },
      });
      setUserName(response.data.item.userName);
      setUserEmail(response.data.item.userEmail);
      setUserGender(response.data.item.userGender);
      setUserBirth(response.data.item.userBirth);
      setUserHobby1(response.data.item.userHobby1);
      setUserHobby2(response.data.item.userHobby2);
      setUserHobby3(response.data.item.userHobby3);
      setUserTel(response.data.item.userTel);
      setUserAddr1(response.data.item.userAddr1);
      setUserAddr2(response.data.item.userAddr2);
      setUserAddr3(response.data.item.userAddr3);
      setUserRegdate(response.data.item.userRegdate);
      setUserRecommend(response.data.item.userRecommend);
      setUserStatusMessage(response.data.item.userStatusMessage);
      setUserStatus(response.data.item.online);
    } catch (error) {
      console.error("유저 정보를 가져오는 데 실패했습니다:", error);
    }
  };

  useEffect(() => {
    fetchUserInfo(); // useEffect 내에서 함수 호출
    getProfileImage(); // getProfileImage
    getFriendList();
    getRequestFriendList();
    getPaymentList();
  }, []);

  useEffect(() => {
    axios.post("http://localhost:9000/mypage/mymoim", {}, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
      },
    }).then((res) => {
      setData(() => res.data.items);
    });
  }, []);

  function getHobbyNameByCode(hobbyCode, interests, musicGenres, foodTypes) {
    const allHobbies = [...interests, ...musicGenres, ...foodTypes];
    const hobbyItem = allHobbies.find((item) => item.code === hobbyCode);
    return hobbyItem ? hobbyItem.value : "";
  }

  const editInfo = () => {
    axios.post("http://localhost:9000/mypage/editinfo", {
      userName: userName,
      userAddr1: userAddr1,
      userAddr2: userAddr2,
      userAddr3: userAddr3,
      userHobby1: userHobby1,
      userHobby2: userHobby2,
      userHobby3: userHobby3,
      userRecommend: userRecommend,
      userStatusMessage: userStatusMessage,
    }, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
      },
    }).then((res) => {
      setIsEditing(false);
      fetchUserInfo();
    });
  };

  // 친구 관리하기

  const getFriendList = async () => {
    axios.post("http://localhost:9000/friend/friendList", {}, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
      },
    }).then((res) => {
      setFriends(res.data.items);
    }).catch((error) => {
      console.error(error);
    });
  };

  const getRequestFriendList = async () => {
    axios.post("http://localhost:9000/friend/requestFriendList", {}, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
      },
    }).then((res) => {
      setRequestFriends(res.data.items);
    }).catch((error) => {
      console.error(error);
    });
  };

  const getPaymentList = async () => {
    axios.post("http://localhost:9000/paymentList", {}, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
      },
    }).then((res) => {
      setPaymentList(res.data.items);
    }).catch((error) => {
      console.error(error);
    });
  };

  const acceptRequestFriend = async (id, requestValue) => {
    axios.post(`http://localhost:9000/friend/requestFriend/${id}`, {
      id: requestValue,
    }).then((res) => {
      getRequestFriendList();
      getFriendList();
    }).catch((error) => {
      console.error(error);
    });
  };

  const deleteFriend = async (id) => {
    const userConfirmed = window.confirm("정말로 이 친구를 삭제하시겠습니까?");

    if (!userConfirmed) {
      return;
    }
    axios.post(`http://localhost:9000/friend/deleteFriend/${id}`, {
    }).then((res) => {
      getRequestFriendList();
      getFriendList();
    }).catch((error) => {
      console.error(error);
    });
  };

  const cancelPayment = async (id) => {
    const userConfirmed = window.confirm("정말로 이 결제를 취소하시겠습니까?");
    if (!userConfirmed) {
      return;
    } else {
      axios.post(`http://localhost:9000/cancelPayment/${id}`, {
      }).then((res) => {
        alert(res.data.item.msg);
      }).catch((error) => {
        console.error(error);
        alert(
          `${error.response.data.item.msg} \n\n[취소사유] : ${error.response.data.errorMessage}`
        );
      });
    }
  };

  return (
    <div class="sb-nav-fixed">
      <div id="layoutSidenav">
        <div style={{ marginTop: "12vh", position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0, flexGrow: 1, }}>
          <div>
            <div className="tabs" style={{ marginLeft: "424px", marginTop: "10px" }}>
              <TabButton
                className={activeTab === "tab1" ? "active" : ""}
                onClick={() => { setActiveTab("tab1"); setIsEditing(false); }}>
                프로필
              </TabButton>
              <TabButton
                className={activeTab === "tab2" ? "active" : ""}
                onClick={() => { setActiveTab("tab2"); setIsEditing(false); }}>
                내 정보
              </TabButton>
              <TabButton className={activeTab === "tab3" ? "active" : ""} onClick={() => { setActiveTab("tab3"); setIsEditing(false); }}              >
                활동 내역
              </TabButton>
              <TabButton
                className={activeTab === "tab4" ? "active" : ""}
                onClick={() => { setActiveTab("tab4"); setIsEditing(false); }} >
                친구 관리
              </TabButton>
            </div>
            <div className="tab-content">
              {activeTab === "tab1" && (
                <StyledContainer sx={{ marginLeft: "400px", width: "67%" }}>
                  <Paper elevation={3}>
                    <UserInfoSection>
                      <Grid container spacing={3} direction="column">
                        {/* 중앙 타이틀 */}
                        <Grid item xs={12}>
                          <Typography variant="h1" fontSize="18pt" sx={{ fontWeight: "bold", marginBottom: "5px", marginLeft: "20px", marginTop: "8px", }}>
                            프로필
                          </Typography>
                        </Grid>
                        {/* 내용 박스들 */}
                        <Grid container direction="row">
                          <Grid item xs={8} style={{ padding: "24px 24px 24px 50px" }}>
                            {[
                              ["닉네임", userName || ""],
                              ["내 지역", `${userAddr1 || "지역을 입력해주세요."} ${userAddr2 || ""} ${userAddr3 || ""}`],
                              ["관심사", userHobby1 || ""],
                              ["좋아하는 음악 장르", userHobby2 || ""],
                              ["좋아하는 음식 종류", userHobby3 || ""],
                              ["그 외 관심사", userRecommend || ""],
                              ["상태메세지", userStatusMessage || ""],
                            ].map(([label, value]) => (
                              <>
                                <Grid container spacing={2} alignItems="center">
                                  <Grid item xs={4}>
                                    <div variant="h6" fontSize="12pt" sx={{ fontWeight: "bold", width: "150px", }}>
                                      {label}
                                    </div>
                                  </Grid>
                                  <Grid item xs={8}>
                                    {isEditing ? (
                                      ["관심사", "좋아하는 음악 장르", "좋아하는 음식 종류",].includes(label)
                                        ? (
                                          <select value={value}
                                            onChange={(e) => {
                                              // 상태 업데이트 로직
                                              if (label === "관심사") { setUserHobby1(e.target.value); }
                                              if (label === "좋아하는 음악 장르") { setUserHobby2(e.target.value); }
                                              if (label === "좋아하는 음식 종류") { setUserHobby3(e.target.value); }
                                            }}
                                            style={{ width: "100%", fontSize: "16px", }}>
                                            {label === "관심사" &&
                                              interests.map((opt) => (
                                                <option key={opt.code} value={opt.code}>
                                                  {opt.value}
                                                </option>))}
                                            {label === "좋아하는 음악 장르" &&
                                              musicGenres.map((opt) => (
                                                <option key={opt.code} value={opt.code}>
                                                  {opt.value}
                                                </option>
                                              ))}
                                            {label === "좋아하는 음식 종류" &&
                                              foodTypes.map((opt) => (
                                                <option key={opt.code} value={opt.code}>
                                                  {opt.value}
                                                </option>
                                              ))}
                                          </select>
                                        ) : (
                                          <>
                                            <input
                                              type="text"
                                              value={value}
                                              onChange={(e) => {
                                                if (label === "닉네임") { setUserName(e.target.value); }
                                                if (label === "내 지역") { handleOpen(); }
                                                if (label === "그 외 관심사") { setUserRecommend(e.target.value); }
                                                if (label === "상태메세지") { setUserStatusMessage(e.target.value); }
                                              }}
                                              style={{ width: "100%", fontSize: "16px", }}
                                            />
                                            <Dialog open={open} onClose={handleClose} style={{ marginTop: "120px" }}>
                                              <DialogTitle>주소 검색</DialogTitle>
                                              <DialogContent>
                                                <DaumPostcode
                                                  autoClose
                                                  style={{ width: "400px", height: "480px", }} // 높이와 너비는 원하는 대로 조절
                                                  onComplete={(data) => { complete(data); handleClose(); }} />
                                              </DialogContent>
                                            </Dialog>
                                          </>
                                        )
                                    ) : (
                                      <div sx={{ width: "650px" }}>
                                        {["관심사", "좋아하는 음악 장르", "좋아하는 음식 종류",].includes(label)
                                          ? getHobbyNameByCode(value, interests, musicGenres, foodTypes)
                                          : value}
                                      </div>
                                    )}
                                  </Grid>
                                </Grid>
                                <Divider sx={{ margin: "8px 0" }} />
                              </>
                            ))}
                          </Grid>
                          {/* 프로필 사진 박스 추가 */}
                          <Grid item xs={4} style={{ padding: "0px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", }}>
                            <Typography variant="h6" fontSize="14pt" sx={{ fontWeight: "bold", marginBottom: "20px", marginTop: "15px", }}>
                              프로필 사진
                            </Typography>
                            <img
                              id="previewImage"
                              src={imageFile || basicProfile}
                              alt="프로필 사진"
                              style={{ width: "200px", height: "200px", borderRadius: "50%", objectFit: "cover", border: "0.5px solid #adb5bd", }}
                            />
                            {isEditing && (
                              <Button variant="contained" component="label" sx={{ display: "block", marginTop: "20px", }}                              >
                                <div>사진 변경하기</div>
                                <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                              </Button>
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                    </UserInfoSection>
                  </Paper>
                  <Button
                    sx={{
                      backgroundColor: isEditing ? "#03c75a" : "#E55C25",
                      color: "white",
                      float: "right",
                      "&:hover": {
                        backgroundColor: isEditing
                          ? "rgba(3, 199, 90, 0.85)"
                          : "rgba(229, 92, 37, 0.85)",
                      },
                    }}
                    onClick={() => {
                      if (isEditing) {
                        editInfo(); changeProfileImage();
                      }
                      setIsEditing(!isEditing);
                    }}>
                    <div>
                      {isEditing ? "저장하기" : "수정하기"}
                    </div>
                  </Button>

                  {isEditing ? (
                    <Button
                      sx={{ backgroundColor: "#adb5bd", color: "white", marginRight: "12px", float: "right", "&:hover": { backgroundColor: "rgba(173, 181, 189, 0.85) ", }, }}
                      onClick={() => {
                        setIsEditing(!isEditing);
                        fetchUserInfo();
                        getProfileImage();
                      }}>
                      <div>취소하기</div>
                    </Button>
                  ) : (<></>)}
                </StyledContainer>
              )}
              {activeTab === "tab2" && (
                <StyledContainer sx={{ marginLeft: "400px", width: "67%" }}>
                  <Paper elevation={3}>
                    <UserInfoSection>
                      <Grid container spacing={3} direction="column">
                        {/* 중앙 타이틀 */}
                        <Grid item xs={12}>
                          <Typography variant="h1" fontSize="18pt" sx={{ fontWeight: "bold", marginBottom: "5px", marginLeft: "20px", marginTop: "8px", }}>
                            내 정보
                          </Typography>
                        </Grid>
                        {/* 내용 박스들 */}
                        <Grid item xs={6} style={{ padding: "24px 500px 24px 50px" }}>
                          {[
                            ["휴대폰 번호", userTel || ""],
                            ["비밀번호", ""],
                            ["생일", userBirth || ""],
                            ["성별", userGender || "성별을 입력해주세요."],
                            ["이메일", userEmail || ""],
                            ["가입일", userRegdate || ""],
                          ].map(([label, value]) => (
                            <>
                              <Grid container spacing={2} alignItems="center">
                                <Grid item xs={3}>
                                  <div variant="h6" fontSize="12pt" sx={{ fontWeight: "bold", width: "150px" }}>
                                    {label}
                                  </div>
                                </Grid>
                                <Grid item xs={8}>
                                  {isEditing &&
                                    !["생일", "가입일"].includes(label) ? (
                                    label === "휴대폰 번호" ? (
                                      <div>
                                        <Typography variant="body2" fontSize="12pt" sx={{ width: "200px", display: "inline", }}>
                                          <span>{value.replace(/^(\d{3})(\d{4})(\d{4})$/, "$1 - $2 - $3")}</span>
                                        </Typography>
                                        <button type="button" style={{ backgroundColor: "#dee2e6", height: "22px", marginLeft: "20px", border: "none", borderRadius: "5px", fontSize: "14px", }} onClick={openModal}>
                                          번호 변경하기
                                        </button>
                                      </div>
                                    ) : label === "비밀번호" ? (
                                      <button type="button" style={{ backgroundColor: "#dee2e6", height: "22px", border: "none", borderRadius: "5px", fontSize: "14px", }} onClick={openPasswordModal}>
                                        비밀번호 변경하기
                                      </button>
                                    ) : label === "성별" ? (
                                      <div>
                                        <FormControl component="fieldset">
                                          <RadioGroup aria-label="gender" value={userGender} onChange={(e) => setUserGender(e.target.value)} sx={{ display: "inline" }}>
                                            <FormControlLabel value={1} control={<Radio />} label={<div>남자</div>} />
                                            <FormControlLabel value={0} control={<Radio />} label={<div>여자</div>} />
                                          </RadioGroup>
                                        </FormControl>
                                      </div>
                                    ) : (
                                      <input type="text" value={value} onChange={(e) => setUserEmail(() => e.target.value)} style={{ width: "100%", fontSize: "16px", }} />
                                    )
                                  ) : (
                                    <div sx={{ width: "650px" }}>
                                      {label === "휴대폰 번호"
                                        ? value.replace(/^(\d{3})(\d{4})(\d{4})$/, "$1 - $2 - $3")
                                        : label === "생일"
                                          ? `${value.slice(4, 6)}월 ${value.slice(6, 8)}일`
                                          : label === "가입일"
                                            ? value.slice(0, 10).replace(/-/g, "년 ").replace(/-/g, "월 ") + "일"
                                            : label === "성별"
                                              ? userGender === 1 ? "남자"
                                                : userGender === 0 ? "여자"
                                                  : ""
                                              : value}
                                    </div>)}
                                </Grid>
                              </Grid>
                              <Divider sx={{ margin: "8px 0", width: "900px" }} />
                            </>
                          ))}
                        </Grid>
                      </Grid>
                    </UserInfoSection>
                  </Paper>
                  <Link sx={{ marginTop: "-12px" }}>회원탈퇴하기</Link>
                  <Button
                    sx={{
                      backgroundColor: isEditing ? "#03c75a" : "#E55C25",
                      color: "white",
                      marginRight: "12px",
                      float: "right",
                      "&:hover": {
                        backgroundColor: isEditing
                          ? "rgba(3, 199, 90, 0.85)"
                          : "rgba(229, 92, 37, 0.85)",
                      },
                    }}
                    onClick={() => { if (isEditing) { changePhone(userTel, userEmail); } setIsEditing(!isEditing); }}>
                    <div>
                      {isEditing ? "저장하기" : "수정하기"}
                    </div>
                  </Button>
                  {isEditing ? (
                    <Button sx={{ backgroundColor: "#adb5bd", color: "white", marginRight: "12px", float: "right", "&:hover": { backgroundColor: "rgba(173, 181, 189, 0.85) ", }, }} onClick={() => { fetchUserInfo(); setIsEditing(!isEditing); }}>
                      <div>취소하기</div>
                    </Button>
                  ) : (
                    <></>
                  )}
                  <Modal isOpen={isModalOpen} closeModal={closeModal} />
                  <PasswordChangeModal isOpen={isPasswordModalOpen} closeModal={closePasswordModal} />
                </StyledContainer>
              )}
              {activeTab === "tab3" && (
                <StyledContainer sx={{ marginLeft: "400px", width: "67%" }}>
                  <Paper elevation={3}>
                    <UserInfoSection>
                      <Grid item xs={12}>
                        <Typography variant="h1" fontSize="18pt" sx={{ fontWeight: "bold", marginBottom: "5px", marginLeft: "20px", marginTop: "8px", }}>
                          활동내역
                        </Typography>
                      </Grid>
                      <Tabs value={value} onChange={handleChange} sx={{ marginLeft: "20px" }}>
                        <Tab label={<div>소모임</div>} />
                        <Tab label={<div>게시글 및 댓글관리</div>} />
                        <Tab label={<div>결제 및 포인트</div>} />
                      </Tabs>
                      <TabPanel value={value} index={0}>
                        {/* 내용1 (예: 필터 및 테이블) */}
                        <div>
                          <Select value={filter.status} onChange={(e) => setFilter((prev) => ({ ...prev, status: e.target.value, }))} sx={{ width: "120px", height: "40px", margin: "20px 12px 0px 20px", fontSize: "16px", }}>
                            <MenuItem value="전체" sx={{ fontSize: "14px" }}><span>진행여부</span></MenuItem>
                            <MenuItem value="진행중" sx={{ fontSize: "14px" }}><span>진행중</span></MenuItem>
                            <MenuItem value="종료" sx={{ fontSize: "14px" }}><span>종료</span></MenuItem>
                          </Select>
                          <Select value={filter.category} onChange={(e) => setFilter((prev) => ({ ...prev, category: e.target.value, }))} sx={{ width: "160px", height: "40px" }}>
                            {/* 카테고리 목록을 동적으로 생성하는 부분 (예시: '스포츠', '음악' 등) */}
                            <MenuItem value="전체"><span>카테고리 전체</span></MenuItem>
                            <MenuItem value="인문학/책"><span>인문학/책</span></MenuItem>
                            <MenuItem value="운동"><span>운동</span></MenuItem>
                            <MenuItem value="요리/맛집"><span>요리/맛집</span></MenuItem>
                            <MenuItem value="공예/만들기"><span>공예/만들기</span></MenuItem>
                            <MenuItem value="원예"><span>원예</span></MenuItem>
                            <MenuItem value="동네친구"><span>동네친구</span></MenuItem>
                            <MenuItem value="음악/악기"><span>음악/악기</span></MenuItem>
                            <MenuItem value="반려동물"><span>반려동물</span></MenuItem>
                            <MenuItem value="여행"><span>여행</span></MenuItem>
                            <MenuItem value="기타"><span>기타</span></MenuItem>
                          </Select>
                          <Table sx={{ margin: "0px auto", width: "95%" }}>
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ fontWeight: "bold" }}><span>카테고리</span></TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}><span>모임명</span></TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}><span>인원수</span></TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}><span>회비</span></TableCell>
                                <TableCell sx={{ fontWeight: "bold", paddingLeft: "48px", }}><span>가입일</span></TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}><span>상태</span></TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {filteredData.map((row) => (
                                <TableRow key={row.moimId}>
                                  <TableCell><span>{row.moimCategory}</span></TableCell>
                                  <TableCell sx={{ marginRight: "50px" }}><span>{row.moimTitle}</span></TableCell>
                                  <TableCell><span>{row.maxMoimUser}</span></TableCell>
                                  <TableCell><span>{row.cost}</span></TableCell>
                                  <TableCell><span>{row.moimRegdate.slice(0, 10).replace(/-/g, "년 ").replace(/-/g, "월 ") + "일"}</span></TableCell>
                                  <TableCell><span>{row.isEnd}</span></TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TabPanel>
                      <TabPanel value={value} index={1}>
                        {/* 내용2 */}
                      </TabPanel>
                      <TabPanel value={value} index={2}>
                        <Grid container spacing={3} sx={{ marginTop: "5px" }}>
                          <Grid item xs={12}>
                            {paymentList &&
                              paymentList.map((payment, index) => (
                                <Grid item xs={12} key={index} sx={{ marginBottom: "12px" }}>
                                  <BoxContent sx={{ padding: "16px", boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)", }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px", }}>
                                      <div style={{ display: "flex", alignItems: "center", }}>
                                        <Typography variant="h6">
                                          <span>{(payment.payDate && `${new Date(payment.payDate).getFullYear()}년 ${(new Date(payment.payDate).getMonth() + 1).toString().padStart(2, "0")}월 ${new Date(payment.payDate).getDate().toString().padStart(2, "0")}일(${new Date(payment.payDate).getHours().toString().padStart(2, "0")}:${new Date(payment.payDate).getMinutes().toString().padStart(2, "0")}:${new Date(payment.payDate).getSeconds().toString().padStart(2, "0")})`) || "날짜 확인 불가"}</span>
                                        </Typography>
                                      </div>
                                      <Button variant="text" onClick={() => cancelPayment(payment.imp_uid)} sx={{ color: "red" }}>
                                        <span>결제 취소</span>
                                      </Button>
                                    </div>
                                    <Typography variant="body2" sx={{ marginBottom: "6px" }}>
                                      <span>금액 : {payment.value + " 원" || "금액 없음"}</span>
                                    </Typography>
                                    <Typography variant="body2">
                                      <span>곶감 : {payment.gotGam || "0"} 개</span>
                                    </Typography>
                                  </BoxContent>
                                </Grid>))}
                          </Grid>
                        </Grid>
                      </TabPanel>
                    </UserInfoSection>
                  </Paper>
                </StyledContainer>
              )}
              {activeTab === "tab4" && (
                <StyledContainer sx={{ marginLeft: "400px", width: "67%" }}>
                  <Paper elevation={3}>
                    <UserInfoSection>
                      <Grid item xs={12}>
                        <Typography variant="h1" fontSize="18pt" sx={{ fontWeight: "bold", marginBottom: "5px", marginLeft: "20px", marginTop: "8px", }}>
                          친구 관리
                        </Typography>
                      </Grid>
                      <Tabs value={value1} onChange={handleChange1} sx={{ marginLeft: "20px" }}>
                        <Tab label={<div>내 친구</div>} />
                        <Tab label={<div style={{ position: 'relative' }}>{requestFriends.length > 0 && <span style={{ position: 'absolute', top: -10, right: -12, background: 'red', borderRadius: '50%', width: '10px', height: '10px' }}></span>}친구 요청</div>} />
                      </Tabs>
                      <TabPanel1 value={value1} index={0}>
                        <Grid container spacing={3} sx={{ marginTop: "5px" }}>
                          <Grid item xs={12}>
                            {friends.map((friend, index) => (
                              <Grid item xs={12} key={index} sx={{ marginBottom: "12px" }}>
                                <BoxContent
                                  sx={{ padding: "16px", boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)", }}>
                                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px", }}>
                                    <div style={{ display: "flex", alignItems: "center", }}>
                                      <div style={{ position: "relative" }}>
                                        <img
                                          src={friend.profile ? `data:image/jpeg;base64,${friend.profile}` : basicProfile}
                                          alt="프로필 사진"
                                          style={{
                                            width: "50px",
                                            height: "50px",
                                            borderRadius: "25px",
                                            marginRight: "8px",
                                            border: "2px solid white",
                                            boxShadow: `0 0 5px 2px ${friend.online ? "#05FF00" : "#B6B6B6"}`,
                                          }} />
                                      </div>
                                      <Typography variant="h6">
                                        <div style={{ marginBottom: "8px", marginLeft: '8px' }}>{friend.user_name || "이름 없음"}</div>
                                      </Typography>
                                    </div>
                                    <Button sx={{ color: "red" }} onClick={() => deleteFriend(friend.id)}>
                                      <div>삭제하기</div>
                                    </Button>
                                  </div>
                                  <Typography variant="body2" sx={{ marginBottom: "6px" }}>
                                    <div>지역 : {friend.user_addr3 || "지역 없음"}</div>
                                  </Typography>
                                  <Typography variant="body2">
                                    <div>상태메세지 : {friend.user_status_message || "상태 메세지 없음"}</div>
                                  </Typography>
                                </BoxContent>
                              </Grid>
                            ))}
                          </Grid>
                        </Grid>
                      </TabPanel1>
                      <TabPanel1 value={value1} index={1}>
                        <Grid container spacing={3} sx={{ marginTop: "5px" }}>
                          <Grid item xs={12}>
                            {requestFriends.map((friend, index) => (
                              <Grid item xs={12} key={index} sx={{ marginBottom: "12px" }}>
                                <BoxContent sx={{ padding: "16px", boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)", }}>
                                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px", }}>
                                    <div style={{ display: "flex", alignItems: "center", }}>
                                      <img
                                        src={
                                          friend.profile
                                            ? `data:image/jpeg;base64,${friend.profile}`
                                            : "https://cdnimg.melon.co.kr/cm2/artistcrop/images/002/61/143/261143_20210325180240_500.jpg?61e575e8653e5920470a38d1482d7312/melon/resize/416/quality/80/optimize"}
                                        alt="프로필 사진"
                                        style={{ width: "50px", height: "50px", borderRadius: "25px", marginRight: "8px", }} />
                                      <Typography variant="h6">
                                        <span style={{ marginLeft: '8px' }}>{friend.user_name || "이름 없음"}</span>
                                      </Typography>
                                    </div>
                                    <div>
                                      <Button variant="contained" color="primary" onClick={() => acceptRequestFriend(friend.id, 1)} sx={{ marginRight: "5px" }} >
                                        <span>수락하기</span>
                                      </Button>
                                      <Button variant="contained" color="secondary" onClick={() => acceptRequestFriend(friend.id, 0)}>
                                        <span>거절하기</span>
                                      </Button>
                                    </div>
                                  </div>
                                  <Typography variant="body2" sx={{ marginBottom: "6px" }}>
                                    <span>지역 : {friend.user_addr3 || "지역 없음"}</span>
                                  </Typography>
                                  <Typography variant="body2">
                                    <span>상태메세지 : {friend.user_status_message || "상태 메세지 없음"}</span>
                                  </Typography>
                                </BoxContent>
                              </Grid>))}
                          </Grid>
                        </Grid>
                      </TabPanel1>
                    </UserInfoSection>
                  </Paper>
                </StyledContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mypage;