import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { styled } from '@mui/system';
import { Box, Typography, Button } from '@mui/material';
import { grey } from '@mui/material/colors';
import axios from 'axios';
import BasicBoard from '../utils/BasicBoard';
import { SPRING_API_URL } from '../../config';

const StyledForm = styled('form')`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 100%;
`;

const StyledBox = styled(Box)`
    display: flex;
    flex-direction: column;
    alignItems: flex-start;
    margin-top: 1.5rem;
    width: 100%;
`;

const PageTitle = styled('h3')`
    margin-bottom: 1.5rem;
`;

const ApplicantInfoBox = styled(Box)`
    display: flex;
    alignItems: center;
    margin: 0.5rem;
`;

const ApplicantTitle = styled('h5')`
    width: 110px;
`;

const ApplicantInfo = styled(Typography)`
    color: ${grey[600]};
`;

const ButtonRow = styled('div')`
    display: flex;
    justify-content: center;
    margin: 10px auto;
    gap: 30px;
`;

const StyledButton = styled(Button)`
    margin: 20px 10px 0 10px;
    background-color: #FCBE71;
    &:hover {
        background-color: #FCBE71;
    }
`;

const CancelLink = styled(Link)`
    text-decoration: none;
    color: #fff;
    &:hover {
        color: #fff;
    }
`;

const StyledLink = styled(Link)`
    margin: 1rem auto;
    text-decoration: none;
`;

const ApplyMoim = () => {
    const navi = useNavigate();

    const { moimId } = useParams();
    const [cookies] = useCookies(['userNickname', 'userAddr3']);

    const [moimData, setMoimData] = useState({
        moimTitle: ""
    });
    const [userData, setUserData] = useState({
        applicantUserNickname: "",
        applicantUserAddr: ""
    });
    const [profilePic, setProfilePic] = useState(null);
    const [filePic, setFilePic] = useState(null);

    useEffect(() => {
        const fetchMoimData = async () => {
            try {
                const response = await axios.get(`${SPRING_API_URL}/moim/view-moim/${moimId}`);
                const data = response.data.item.moimDTO;

                setMoimData({
                    moimTitle: data.moimTitle
                });

                return response.data.item;

            } catch (e) {
                console.error("Error fetching moim data", e);
            }
        };

        fetchMoimData();
    }, [moimId]);

    useEffect(() => {
        if (cookies.userNickname && cookies.userAddr3) {
            setUserData({
                applicantUserNickname: cookies.userNickname,
                applicantUserAddr: cookies.userAddr3
            });
        }
    }, [cookies]);

    useEffect(() => {
        const fetchProfileImage = async () => {
            try {
                const response = await axios.post(`${SPRING_API_URL}/mypage/getprofileimage`, {}, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                    }
                });

                setProfilePic(`data:image/jpg;base64,${response.data.item}`);

                console.log(profilePic);

                return profilePic;
            } catch (e) {
                console.error("Error fetching profile image", e);
            }
        };

        fetchProfileImage();
    }, []);

    const profileFileInputRef = useRef(null);

    const triggerFileInput = () => {
        if (profileFileInputRef.current) {
            profileFileInputRef.current.click();
        } else {
            console.error("File input not found");
            console.log(profileFileInputRef.current);
        }
    };

    function base64ToBlob(base64) {
        const byteString = atob(base64.split(',')[1]);
        const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ab], { type: mimeString });
    }

    function blobToFile(blob, filename) {
        return new File([blob], filename, { type: blob.type });
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setProfilePic(file);

        const reader = new FileReader();

        reader.onloadend = () => {
            const previewImageElem = document.getElementById('previewImage');
            if (previewImageElem) {
                previewImageElem.src = reader.result;
            } else {
                console.error("Image preview element not found");
            }
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        console.log(profilePic)
        if (profilePic instanceof File) {
            setFilePic(profilePic);
        } else if (profilePic) {
            const base64String = profilePic;
            const blob = base64ToBlob(base64String);
            const file = blobToFile(blob, "defaultProfile.jpg");
            setFilePic(file);
            console.log(file);
        }

    }, [profilePic])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("applicantUserNickname", userData.userNickname);
        formData.append("applicantUserAddr", userData.userAddr3);

        if (!filePic) {
            try {
                const defaultImageRes = await axios.get('https://i.postimg.cc/h41MrLb5/170px-Ojamajo-Tap-svg.png', {
                    responseType: 'blob'
                });

                const defaultImageFile = new File([defaultImageRes.data], 'default-image.png', { type: 'image/png' });
                formData.append("moimProfile", defaultImageFile);
            } catch (err) {
                console.error("Failed to download default image", err);
            }
        } else {
            formData.append("moimProfile", filePic);
        }

        try {
            const response = await axios.post(`${SPRING_API_URL}/moimReg/apply-moim/${moimId}`, formData, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log(response.data);

            if (response.data.item) {
                alert("신청이 완료되었습니다.");
                navi("/moim-controller/list-moim");
            }
        } catch (e) {
            console.error("Error sending data", e);
        }
    };

    return (
        <BasicBoard>
            <StyledForm id="applyForm" onSubmit={handleSubmit}>
                <StyledBox>
                    <PageTitle>{`${moimData.moimTitle} 모임에 가입해요.`}</PageTitle>
                    <div>
                        <img
                            id="previewImage"
                            src={profilePic}
                            alt="프로필 사진"
                            style={{ width: '200px', height: '200px', borderRadius: '50%', objectFit: 'cover', border: '0.5px solid #adb5bd', cursor: 'pointer', marginBottom: '1rem' }}
                            onClick={triggerFileInput}
                        ></img>
                        <input ref={profileFileInputRef} id="MoimImageUpload" type="file" accept="image/*" hidden onChange={handleImageUpload}></input>
                    </div>
                    <ApplicantInfoBox border={0} my={0}>
                        <ApplicantTitle>신청자</ApplicantTitle>
                        <ApplicantInfo variant="body1">{userData.applicantUserNickname}</ApplicantInfo>
                    </ApplicantInfoBox>
                    <ApplicantInfoBox border={0} my={2}>
                        <ApplicantTitle>지역</ApplicantTitle>
                        <ApplicantInfo variant="body1">{userData.applicantUserAddr}</ApplicantInfo>
                    </ApplicantInfoBox>
                    <ButtonRow>
                        <StyledButton type="submit" variant="contained" size="large">가입</StyledButton>
                        <StyledButton variant="contained" size="large"><CancelLink to={`/view-moim/${moimId}`}>취소</CancelLink></StyledButton>
                    </ButtonRow>
                </StyledBox>
            </StyledForm>
            <StyledLink to="/moim-controller/list-moim">목록으로 돌아가기</StyledLink>
        </BasicBoard>
    );
};

export default ApplyMoim;