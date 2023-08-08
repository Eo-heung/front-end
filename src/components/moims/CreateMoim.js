import React, { useCallback, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const CreateMoim = () => {
    const navi = useNavigate();

    const [inputs, setInputs] = useState({
        moimCategory: "",
        moimCreater: sessionStorage.getItem("userId"),
        moimLocation: "",
        moimName: "",
        moimContent: "",
        moimCnt: ""
    });

    const handleInputChange = useCallback((e) => {
        setInputs(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }, []);

    const createMoim = useCallback((e) => {
        e.preventDefault();

        const createMoimAxios = async () => {
            try {
                const response = await axios.post('http://localhost:9000/moim/create-moim', inputs, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                    }
                });
                console.log(response);
                if (response.data && response.data.item.msg) {
                    alert(response.data.item.msg);
                    navi('/');
                }
            } catch (e) {
                console.log(e);
            }
        }

        createMoimAxios();
    }, [inputs]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h3>새로운 모임 만들기</h3>
            <form id="createForm" onSubmit={createMoim}>
                <table style={{ borderCollapse: 'collapse', border: '1px solid black' }}>
                    <tr>
                        <td style={{ background: 'skyblue', width: '70px' }}>
                            모임 주제
                        </td>
                        <td style={{ textAlign: "left" }}>
                            <label><input type="radio" name="moimCategory" value="인문학/책" checked={inputs.moimCategory === "인문학/책"} onChange={handleInputChange} /> 인문학/책</label>
                            <label><input type="radio" name="moimCategory" value="운동" checked={inputs.moimCategory === "운동"} onChange={handleInputChange} /> 운동</label>
                            <label><input type="radio" name="moimCategory" value="요리/맛집" checked={inputs.moimCategory === "요리/맛집"} onChange={handleInputChange} /> 요리/맛집</label>
                            <label><input type="radio" name="moimCategory" value="공예/만들기" checked={inputs.moimCategory === "공예/만들기"} onChange={handleInputChange} /> 공예/만들기</label>
                            <label><input type="radio" name="moimCategory" value="원예" checked={inputs.moimCategory === "원예"} onChange={handleInputChange} /> 원예</label>
                            <label><input type="radio" name="moimCategory" value="동네친구" checked={inputs.moimCategory === "동네친구"} onChange={handleInputChange} /> 동네친구</label>
                            <label><input type="radio" name="moimCategory" value="음악/악기" checked={inputs.moimCategory === "음악/악기"} onChange={handleInputChange} /> 음악/악기</label>
                            <label><input type="radio" name="moimCategory" value="반려동물" checked={inputs.moimCategory === "반려동물"} onChange={handleInputChange} /> 반려동물</label>
                            <label><input type="radio" name="moimCategory" value="여행" checked={inputs.moimCategory === "여행"} onChange={handleInputChange} /> 여행</label>
                        </td>
                    </tr>

                    <tr>
                        <td style={{ background: 'skyblue' }}>
                            모임장
                        </td>
                        <td style={{ textAlign: "left" }}>
                            <input type="text" name="moimCreater" readonly value={sessionStorage.getItem("userId")}></input>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ background: 'skyblue' }}>
                            모임위치
                        </td>
                        <td style={{ textAlign: "left" }}>
                            <input type="text" name="moimLocation"></input>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ background: 'skyblue' }}>
                            모임명
                        </td>
                        <td style={{ textAlign: "left" }}>
                            <input type="text" name="moimName"></input>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ background: 'skyblue', width: '70px' }}>
                            모임소개
                        </td>
                        <td style={{ textAlign: "left" }}>
                            <textarea name="moimContent" cols="40" rows="10"></textarea>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ background: 'skyblue' }}>
                            모임인원
                        </td>
                        <td style={{ textAlign: "left" }}>
                            <input type="text" name="moimCnt"></input>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style={{ textAlign: "center" }}>
                            <button type="submit" id="btnCreate">모임 등록</button>
                        </td>
                    </tr>
                </table>
            </form>
            <hr />
            <Link to="/">모임 목록</Link>
        </div>
    );
};

export default CreateMoim;