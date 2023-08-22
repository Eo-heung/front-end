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

    const onClickPayment = () => {

        const { IMP } = window;
        IMP.init('imp46524082');

        const data = {
            pg: 'kcp.T0000',
            pay_method: 'card',
            merchant_uid: `mid_${new Date().getTime()}`,
            name: '결제 테스트',
            amount: 1000,
            custom_data: {
                name: '부가정보',
                desc: '세부 부가정보'
            },
            buyer_name: '홍길동',
            buyer_tel: '01012345678',
            buyer_email: '14279625@gmail.com',
            buyer_addr: '구천면로 000-00',
            buyer_postalcode: '01234'
        };

        IMP.request_pay(data, callback);
    }

    const callback = (response) => {
        const { success, error_msg, imp_uid, merchant_uid, pay_method, paid_amount, status } = response;

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

        console.log(response);
        console.log(result);

        if (success) {
            alert('결제 성공');
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