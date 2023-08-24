import { Stomp } from '@stomp/stompjs';
import { useEffect } from 'react';
import SockJS from 'sockjs-client';

const OnlineStatus = () => {
    let stompClient;

    useEffect(() => {
        const userId = sessionStorage.getItem('userId');

        const socket = new SockJS('http://localhost:9000/websocket-endpoint');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, (frame) => {
            // 온라인 상태임을 알릴 로직 (예: 서버에 메시지 전송)
            stompClient.send(`/app/online-status/${userId}`, {}, JSON.stringify({ status: 'online' }));

            stompClient.subscribe('/topic/online-status', (message) => {
                // 필요한 경우 메시지 수신 로직
            });
        });

        window.addEventListener('beforeunload', () => {
            // 페이지나 브라우저 창을 닫을 때 실행될 로직
            stompClient.send(`/app/online-status/${userId}`, {}, JSON.stringify({ status: 'offline' }));
        });

        return () => {
            // 오프라인 상태임을 알릴 로직 (예: 서버에 메시지 전송 전 연결 해제)
            stompClient.disconnect();
        };
    }, []);

    return null; // 화면에는 아무 것도 렌더링되지 않음
};

export default OnlineStatus;
