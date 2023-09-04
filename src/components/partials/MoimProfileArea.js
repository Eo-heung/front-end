import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { styled } from '@mui/system';
import { SPRING_API_URL } from '../../config';
import { Link } from 'react-router-dom';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import ProfileModal from '../utils/ProfileModal';

const InfoZone = styled('div')`
    display: flex;
    align-items: center;
    width: 90%;
    margin-left: 30%;
`;

const MyPicContainer = styled('div')`
    padding-top: 10px;
    padding-bottom: 20px;
    position: relative;
`;

const MyPicEditButton = styled('div')`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    bottom: 3%;
    right: 17%;
    width: 22%;
    height: 31%;
    background-color: #fff;
    border-radius: 100%; 
    cursor: pointer;
`;

const MyInfoLink = styled(Link)`
    margin-top: 1rem;
    text-decoration: none;
    color: grey;
    cursor: pointer;
    &:hover {
        border-color: #FCBE71;
        background-color: #FCBE71;
        color: grey;
    }
`;

const MoimProfileArea = ({ moimId }) => {
    const [moimData, setMoimData] = useState({
        moimTitle: ""
    });
    const [moimProfile, setMoimProfile] = useState(null);
    const singleFileInputRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedImagePreview, setSelectedImagePreview] = useState(null);

    const [appoint, setAppoint] = useState(null);

    const fetchMoimData = async () => {
        try {
            const response = await axios.get(`${SPRING_API_URL}/moim/view-moim/${moimId}`);
            const data = response.data.item.moimDTO;

            setMoimData({
                moimTitle: data.moimTitle
            });

            return response.data.item;

        } catch (err) {
            console.error("Error fetching moim data", err);
        }
    };

    const fetchMoimProfile = async () => {
        try {
            const response = await axios.get(`${SPRING_API_URL}/moimReg/view-moim-profile/${moimId}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                }
            });
            const data = response.data.item.applicantDetails;
            setMoimProfile(data.moimProfileBase64);
        } catch (err) {
            console.error("Error fetching moim profile data", err);
        }
    };

    useEffect(() => {
        fetchMoimData();
        fetchMoimProfile();
    }, [moimId]);

    const handleProfileChange = (e) => {
        if (e.target.files[0]) {
            const reader = new FileReader();

            reader.onloadend = function () {
                setSelectedImagePreview(reader.result);
                setIsOpen(true);
            }

            reader.readAsDataURL(e.target.files[0]);
        }
    };

    function base64ToBlob(base64) {
        // base64가 File 객체인 경우 바로 반환
        if (typeof base64 === 'object' && base64 instanceof File) {
            return base64;
        }

        // base64 문자열 형식 확인
        const matches = base64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);

        if (!matches || matches.length !== 3) {
            console.error('Provided string is not a valid base64 format');
            return null;
        }

        const byteString = atob(matches[2]);
        const mimeString = matches[1] || 'application/octet-stream'; // mimeString이 없으면 기본값 설정

        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ab], { type: mimeString });
    };

    function blobToFile(blob, filename) {
        const type = blob && blob.type ? blob.type : 'application/octet-stream'; // blob.type이 유효하지 않은 경우 기본값 설정
        return new File([blob], filename, { type });
    };

    const handleConfirm = async () => {
        if (!selectedImagePreview) return;

        const blob = base64ToBlob(selectedImagePreview);
        const file = blobToFile(blob, "profileImage.png");

        const formData = new FormData();
        formData.append("moimProfile", file);

        try {
            const response = await axios.post(`${SPRING_API_URL}/moimReg/modify-moim-profile/${moimId}`, formData, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
                    "Content-Type": "multipart/form-data"
                }
            }
            );

            setIsOpen(false);
            setSelectedImagePreview(null);
            fetchMoimProfile();
        } catch (err) {
            console.error("Error uploading updatedProfile", err);
        }
    };

    return (
        <div className="sb-sidenav-profile">
            <MyPicContainer>
                {moimProfile &&
                    <img
                        key={moimProfile}
                        alt="모임 프로필 이미지"
                        className="sidenav-profile-img"
                        src={`data:image/png;base64,${moimProfile}`}
                    ></img>
                }
                <MyPicEditButton
                    title="클릭하면 모임 프로필 사진을 수정할 수 있어요."
                    onClick={() => singleFileInputRef.current.click()}
                >
                    <ChangeCircleOutlinedIcon
                        fontSize="large"
                        style={{
                            marginBottom: "0.2rem",
                            color: "#FCBE71"
                        }}
                    />
                    <input
                        type="file"
                        accept="image/*" hidden
                        ref={singleFileInputRef}
                        style={{ display: "none" }}
                        onChange={handleProfileChange}
                    />
                </MyPicEditButton>
                <ProfileModal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    onConfirm={handleConfirm}
                    profileImage={selectedImagePreview}
                    moimTitle={moimData.moimTitle}
                />
            </MyPicContainer>
            <div className="sidenav-profile-appoint">
                <span style={{ fontSize: "1.2rem" }}>"{moimData.moimTitle}"</span>
                <br />
                <div
                    style={{
                        fontSize: "1.1rem",
                        marginTop: "6px",
                        paddingLeft: "3px",
                        color: "gray",
                    }}
                >
                    모임에 어서오세요!
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
                            <td style={{ textAlign: "center" }}>{appoint.content}</td>
                        </tr>
                    ) : (
                        <li>약속이 있어요!</li>
                    )}
                    <InfoZone>
                        <MyInfoLink to={`${moimId}/moim-board/my-moim-info`}>내 글 관리</MyInfoLink>
                    </InfoZone>
                </div>
            </div>
        </div>
    );
};

export default MoimProfileArea;