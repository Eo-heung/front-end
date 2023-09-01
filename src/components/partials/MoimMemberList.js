import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SPRING_API_URL } from '../../config';
import QuitModal from '../../components/utils/QuitModal';
import DeleteMoimModal from '../utils/DeleteMoimModal';

const MoimMemberList = ({ moimId }) => {
    const [moimData, setMoimData] = useState({
        moimTitle: ""
    });
    const [moimRegId, setMoimRegId] = useState(null);
    const [userRole, setUserRole] = useState({ isMember: false, isLeader: false });

    const [isQuitModalOpen, setIsQuitModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

    const fetchMyApplyData = async () => {
        try {
            const response = await axios.post(`${SPRING_API_URL}/moimReg/get-my-apply/${moimId}`, {}, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                }
            });
            const data = response.data;

            setMoimRegId(data.moimRegId);

            console.log("data.moimRegId", data.moimRegId);

            return response.data;
        } catch (err) {
            console.error("Error fetching moim apply data", err);
        }
    };

    const verifyUserRole = async () => {
        try {
            const response = await axios.post(`${SPRING_API_URL}/board/${moimId}/verify-role`, {}, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                }
            });

            setUserRole(response.data.item);
        } catch (err) {
            console.error("Error verifying user role", err);
        }
    };

    useEffect(() => {
        fetchMoimData();
        fetchMyApplyData();
        verifyUserRole();
    }, [moimId]);

    const handleModalOpen = () => {
        setIsQuitModalOpen(true);
    };

    const handleModalClose = () => {
        setIsQuitModalOpen(false);
    };

    const handleDeleteModalOpen = () => {
        setIsDeleteModalOpen(true);
    };

    const handleDeleteModalClose = () => {
        setIsDeleteModalOpen(false);
    };

    return (
        <>
            <div className="sb-sidenav-friend">
                <div className="sb-sidenav-friend-title">
                    <h5>접속한 친구목록</h5>
                </div>
                <div className="sb-sidenav-fri-container">
                    <table className="sb-sidenav-fri">
                        <tr>
                            <td style={{ width: "260px", textAlign: "center" }}>
                                활동중인 친구가 없습니다.
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div style={{ textAlign: "end", paddingRight: "4%", cursor: "pointer" }}>
                {userRole.isLeader ? (
                    <>
                        <div style={{ color: "grey" }} onClick={handleDeleteModalOpen}>모임 삭제</div>
                        <DeleteMoimModal
                            isOpen={isDeleteModalOpen}
                            onClose={handleDeleteModalClose}
                            moimId={moimId}
                            moimTitle={moimData.moimTitle}
                        />
                    </>
                ) : (
                    <>
                        <div style={{ color: "grey" }} onClick={handleModalOpen}>모임 탈퇴</div>
                        <QuitModal
                            isOpen={isQuitModalOpen}
                            onClose={handleModalClose}
                            moimRegId={moimRegId}
                            moimTitle={moimData.moimTitle}
                        />
                    </>
                )}
            </div>
        </>
    );
};

export default MoimMemberList;