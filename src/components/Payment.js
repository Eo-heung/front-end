import { Button } from '@mui/material';
import axios from 'axios';
import React, { useEffect } from 'react';

const Payment = () => {

    useEffect(() => {
        const jquery = document.createElement("script");
        jquery.src = "https://code.jquery.com/jquery-1.12.4.min.js";
        const iamport = document.createElement("script");
        iamport.src = "https://cdn.iamport.kr/js/iamport.payment-1.1.7.js";
        document.head.appendChild(jquery);
        document.head.appendChild(iamport);
        return () => {
            document.head.removeChild(jquery);
            document.head.removeChild(iamport);
        }
    }, []);

    //로그인 한 사람이 결제를 하러 올테니깐 그 로그인 한 사람의 정보를 끌어와서 대입시키기.
    // 테스트로 결제할 때, 카카오페이, 네이버페이, 토스페이, L페이 금지. -> 얘는 환불 기능 구현해야 가능함. 카드로만 결제하기.

    const onClickPayment = () => {

        const { IMP } = window;
        IMP.init('imp46524082');

        const data = {
            pg: 'kcp.T0000',
            pay_method: 'card',
            merchant_uid: `mid_${new Date().getTime()}`,
            name: '결제 테스트',                        // "곶감 10개" 사는지 이름
            amount: 1000,                              // 현금? 얼마인지 금액을 넣어야함.
            custom_data: {
                name: '부가정보',
                desc: '세부 부가정보'
            },
            buyer_name: '홍길동',                      // 구매하는 사람 이름
            buyer_tel: '01012345678',                   // 구매하는 사람 전화번호
            buyer_email: '14279625@gmail.com',          // 구매하는 사람 이메일
            buyer_addr: '구천면로 000-00',              // 구매하는 사람 주소. addr1 + addr2 + addr3
        };

        IMP.request_pay(data, callback);
    }

    const callback = async (response) => {
        const { success, error_msg, imp_uid, merchant_uid, pay_method, paid_amount, status } = response;

        console.log(response);

        if (success) {
            const data = await axios.post(`http://localhost:9000/verifyIamport/${imp_uid}`, {})
            console.log(data.data.response.amount);
            if (data.data.response.amount === paid_amount) {
                // 유저아이디, imp_uid, merchant_uid, paid_amount
                const result = axios.post('http://localhost:9000/addPayment', {
                    imp_uid: imp_uid,
                    merchant_uid: merchant_uid,
                    value: paid_amount
                },
                    {
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
                        }
                    })
                console.log(result);
                alert('결제 성공');
            }
            else {
                alert('결제 실패');
            }
        } else {
            alert(`결제 실패: ${error_msg}`);
        }

    }

    return (
        <>
            <Button variant='contained' onClick={onClickPayment} sx={{ marginLeft: '600px', marginTop: '400px' }}>결제하기</Button>
        </>
    );
}
export default Payment;