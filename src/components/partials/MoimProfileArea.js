import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { styled } from '@mui/system';
import basicProfile from "../../public/basic_profile.png";
import { SPRING_API_URL } from '../../config';
import { Link } from 'react-router-dom';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import { grey } from '@mui/material/colors';

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

    const [appoint, setAppoint] = useState(null);

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

    return (
        <div className="sb-sidenav-profile">
            <MyPicContainer>
                <img
                    alt="모임 프로필 이미지"
                    className="sidenav-profile-img"
                    style={{
                        maxWidth: "100%",
                        height: "auto"
                    }}
                    src={basicProfile}
                ></img>
                <MyPicEditButton title="모임 프로필 사진을 수정할 수 있어요.">
                    <ChangeCircleOutlinedIcon
                        fontSize="large"
                        style={{
                            marginBottom: "0.2rem",
                            color: grey[600]
                        }}
                    />
                </MyPicEditButton>
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