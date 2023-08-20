import { Client } from '@stomp/stompjs';
import React, { useEffect } from 'react';
import SockJS from 'sockjs-client';

const WebSocket = () => {
    let stompClient;

    const userId = sessionStorage.getItem("userId");

    useEffect(() => {
        // WebSocket 연결 설정
        const socket = new SockJS('http://localhost:9000/websocket-endpoint');
        stompClient = new Client({
            webSocketFactory: () => socket
        });

        stompClient.onConnect = (frame) => {
            console.log('Connected:', frame);

            // id=1인 사용자에게 알림을 받기 위한 구독
            stompClient.subscribe(`/topic/notifications/${userId}`, (notification) => {
                alert(notification.body);
            });
        };

        stompClient.activate();

        return () => {
            if (stompClient) {
                stompClient.deactivate();
            }
        };
    }, []);

    const sendNotification = () => {
        if (stompClient && stompClient.connected) {
            stompClient.publish({
                destination: '/app/sendNotification/11',
                body: 'id=2인 사람이 알림을 보냈습니다!'
            });
        }
    };

    return (
        <div className="App">
            <button onClick={sendNotification}>알림 보내기</button>
        </div>
    );
}

export default WebSocket