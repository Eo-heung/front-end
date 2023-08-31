import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { styled } from '@mui/system';
import basicProfile from "../../public/basic_profile.png";
import { SPRING_API_URL } from '../../config';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const InfoZone = styled('div')`
    display: flex;
    align-items: center;
    width: 90%;
    margin-left: 50px;
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
    const getCookie = (userNicknamename) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${userNicknamename}=`);
        if (parts.length === 2) {
            return parts.pop().split(";").shift();
        }
    };

    const userNickname = decodeURIComponent(getCookie("userNickname") || "");
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
            <div className="sidenav-profile-mypic">
                <img
                    alt="모임 프로필 이미지"
                    className="sidenav-profile-img"
                    style={{
                        maxWidth: "100%",
                        height: "auto",
                    }}
                    src={basicProfile}
                ></img>
            </div>
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
                        <MyInfoLink to={`${moimId}/moim-board/my-moim-info`}>내 정보 관리</MyInfoLink>
                    </InfoZone>
                </div>
            </div>
        </div>
    );
};

export default MoimProfileArea;