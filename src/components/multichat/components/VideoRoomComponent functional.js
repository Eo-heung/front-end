import axios from "axios";
import { OpenVidu } from "openvidu-browser";
import React, { Component } from "react";
import ChatComponent from "./chat/ChatComponent";
import DialogExtensionComponent from "./dialog-extension/DialogExtension";
import StreamComponent from "./stream/StreamComponent";
import "./VideoRoomComponent.css";
import { useState, useEffect, useRef } from "react";

import OpenViduLayout from "../layout/openvidu-layout";
import UserModel from "../models/user-model";
import ToolbarComponent from "./toolbar/ToolbarComponent";

var localUser = new UserModel();
const APPLICATION_SERVER_URL =
  process.env.NODE_ENV === "production" ? "" : "https://demos.openvidu.io/";

function VideoRoomComponent(props) {
  const hasBeenUpdated = useRef(false);
  const layout = useRef(new OpenViduLayout());

  const sessionName = props.sessionName ? props.sessionName : "SessionA";
  const userName = props.user
    ? props.user
    : "OpenVidu_User" + Math.floor(Math.random() * 100);

  const remotes = useRef([]);
  const localUserAccessAllowed = useRef(false);
  const [session, setSession] = useState(undefined);
  const [myUserName, setMyUserName] = useState("");
  const [localUser, setLocalUser] = useState(undefined);
  const [currentVideoDevice, setCurrentVideoDevice] = useState(undefined);
  const OV = useRef(new OpenVidu()).current; // 여기서 OV 객체를 생성하고 useRef를 사용하여 저장합니다.
  const [subscribers, setSubscribers] = useState([]);
  const [showExtensionDialog, setShowExtensionDialog] = useState(false);
  const [chatDisplay, setChatDisplay] = useState("none");
  const [messageReceived, setMessageReceived] = useState(false);
  const [mySessionId, setMySessionId] = useState(""); // Assuming a default value for mySessionId

  const updateSubscribers = () => {
    setSubscribers(remotes.current);
  };

  const [state, setState] = useState({
    mySessionId: sessionName,
    myUserName: userName,
    session: undefined,
    localUser: undefined,
    subscribers: [],
    chatDisplay: "none",
    currentVideoDevice: undefined,
  });

  useEffect(() => {
    const openViduLayoutOptions = {
      maxRatio: 3 / 2,
      minRatio: 9 / 16,
      fixedRatio: false,
      bigClass: "OV_big",
      bigPercentage: 0.8,
      bigFixedRatio: false,
      bigMaxRatio: 3 / 2,
      bigMinRatio: 9 / 16,
      bigFirst: true,
      animate: true,
    };
    useEffect(() => {
      if (localUser) {
        sendSignalUserChanged({
          isAudioActive: localUser.isAudioActive(),
          isVideoActive: localUser.isVideoActive(),
          nickname: localUser.getNickname(),
          isScreenShareActive: localUser.isScreenShareActive(),
        });
        updateLayout(); // Assuming this is another function you'll use
      }
    }, [subscribers]);

    layout.current.initLayoutContainer(
      document.getElementById("layout"),
      openViduLayoutOptions
    );
    window.addEventListener("beforeunload", onbeforeunload);
    window.addEventListener("resize", updateLayout);
    window.addEventListener("resize", checkSize);
    joinSession();

    // Cleanup function (componentWillUnmount에 해당하는 로직)
    return () => {
      window.removeEventListener("beforeunload", onbeforeunload);
      window.removeEventListener("resize", updateLayout);
      window.removeEventListener("resize", checkSize);
      leaveSession();
    };
  }, []);

  const handleStreamDestroyed = (event) => {
    // Remove the stream from 'subscribers' array
    deleteSubscriber(event.stream);
    setTimeout(() => {
      checkSomeoneShareScreen();
    }, 20);
    event.preventDefault();
    updateLayout();
  };

  if (session) {
    session.on("streamDestroyed", handleStreamDestroyed);
  }

  // Cleanup
  return () => {
    if (session) {
      session.off("streamDestroyed", handleStreamDestroyed);
    }
  };
}

const onbeforeunload = (event) => {
  leaveSession();
};

const joinSession = () => {
  const OV = new OpenVidu();
  setSession(OV.initSession(), () => {
    // 이부분에 추가 로직이 필요하면 useEffect 내부에서 처리합니다.
    subscribeToStreamCreated();
    connectToSession();
  });
};

async function connectToSession() {
  if (props.token !== undefined) {
    console.log("token received: ", props.token);
    connect(props.token);
  } else {
    try {
      var token = await getToken();
      console.log(token);
      connect(token);
    } catch (error) {
      console.error(
        "There was an error getting the token:",
        error.code,
        error.message
      );
      if (props.error) {
        props.error({
          error: error.error,
          message: error.message,
          code: error.code,
          status: error.status,
        });
      }
      alert("There was an error getting the token:", error.message);
    }
  }
}

const connect = (token) => {
  session
    .connect(token, { clientData: myUserName })
    .then(() => {
      connectWebCam();
    })
    .catch((error) => {
      if (props.error) {
        props.error({
          error: error.error,
          message: error.message,
          code: error.code,
          status: error.status,
        });
      }
      alert("There was an error connecting to the session:", error.message);
      console.log(
        "There was an error connecting to the session:",
        error.code,
        error.message
      );
    });
};

const connectWebCam = async () => {
  await OV.current.getUserMedia({
    audioSource: undefined,
    videoSource: undefined,
  });
  const devices = await OV.current.getDevices();
  const videoDevices = devices.filter((device) => device.kind === "videoinput");

  const publisher = OV.current.initPublisher(undefined, {
    audioSource: undefined,
    videoSource: videoDevices[0].deviceId,
    publishAudio: localUser.isAudioActive(),
    publishVideo: localUser.isVideoActive(),
    resolution: "640x480",
    frameRate: 30,
    insertMode: "APPEND",
  });

  if (session.capabilities.publish) {
    publisher.on("accessAllowed", () => {
      session.publish(publisher).then(() => {
        updateSubscribers(); // Assuming this is another hook or function
        localUserAccessAllowed.current = true;
        if (props.joinSession) {
          props.joinSession();
        }
      });
    });
  }
  // Assuming localUser is an object with these setter methods
  localUser.setNickname(myUserName);
  localUser.setConnectionId(session.connection.connectionId);
  localUser.setScreenShareActive(false);
  localUser.setStreamManager(publisher);

  subscribeToUserChanged();
  subscribeToStreamDestroyed();
  sendSignalUserChanged({
    isScreenShareActive: localUser.isScreenShareActive(),
  });

  setCurrentVideoDevice(videoDevices[0]);
  setLocalUser(localUser);

  localUser.getStreamManager().on("streamPlaying", () => {
    updateLayout(); // Assuming this is another hook or function
    publisher.videos[0].video.parentElement.classList.remove("custom-class");
  });
};

const leaveSession = useCallback(() => {
  if (session) {
    session.disconnect();
  }

  OV.current = null;
  setSession(null);
  setSubscribers([]);
  setMyUserName("OpenVidu_User" + Math.floor(Math.random() * 100));
  setLocalUser(null);

  if (props.leaveSession) {
    props.leaveSession();
  }
}, [session, props]);

const camStatusChanged = useCallback(() => {
  localUser.setVideoActive(!localUser.isVideoActive());
  localUser.getStreamManager().publishVideo(localUser.isVideoActive());
  sendSignalUserChanged({ isVideoActive: localUser.isVideoActive() });
  setLocalUser({ localUser: localUser });
}, [localUser]);

const micStatusChanged = useCallback(() => {
  localUser.setAudioActive(!localUser.isAudioActive());
  localUser.getStreamManager().publishAudio(localUser.isAudioActive());
  sendSignalUserChanged({ isAudioActive: localUser.isAudioActive() });
  setLocalUser({ localUser: localUser });
}, [localUser]);

const nicknameChanged = useCallback(
  (nickname) => {
    localUser.setNickname(nickname);
    setLocalUser({ ...localUser });
    sendSignalUserChanged({
      nickname: localUser.getNickname(),
    });
  },
  [localUser]
);

const deleteSubscriber = useCallback((stream) => {
  setSubscribers((prevSubscribers) => {
    const userStream = prevSubscribers.find(
      (user) => user.getStreamManager().stream === stream
    );

    if (userStream) {
      return prevSubscribers.filter((user) => user !== userStream);
    }

    return prevSubscribers;
  });
}, []);

const subscribeToStreamCreated = () => {
  useEffect(() => {
    if (session) {
      // session 상태가 있다면
      const handleStreamCreated = (event) => {
        const subscriber = session.subscribe(event.stream, undefined);
        subscriber.on("streamPlaying", (e) => {
          checkSomeoneShareScreen(); // 이 함수도 함수형 컴포넌트 스타일로 바꿔야 합니다.
          subscriber.videos[0].video.parentElement.classList.remove(
            "custom-class"
          );
        });
        const newUser = new UserModel();
        newUser.setStreamManager(subscriber);
        newUser.setConnectionId(event.stream.connection.connectionId);
        newUser.setType("remote");
        const nickname = event.stream.connection.data.split("%")[0];
        newUser.setNickname(JSON.parse(nickname).clientData);
        setRemotes((prevRemotes) => [...prevRemotes, newUser]); // remotes 상태를 업데이트합니다.
        if (localUserAccessAllowed) {
          updateSubscribers(); // 이 함수도 함수형 컴포넌트 스타일로 바꿔야 합니다.
        }
      };

      session.on("streamCreated", handleStreamCreated);

      return () => {
        // cleanup: 이벤트 리스너를 제거합니다.
        session.off("streamCreated", handleStreamCreated);
      };
    }
  }, [session, localUserAccessAllowed]);
};

useEffect(() => {
  const handleUserChanged = (event) => {
    setSubscribers((prevSubscribers) => {
      const updatedUsers = [...prevSubscribers];
      updatedUsers.forEach((user) => {
        if (user.getConnectionId() === event.from.connectionId) {
          const data = JSON.parse(event.data);
          console.log("EVENTO REMOTE: ", event.data);
          if (data.isAudioActive !== undefined) {
            user.setAudioActive(data.isAudioActive);
          }
          if (data.isVideoActive !== undefined) {
            user.setVideoActive(data.isVideoActive);
          }
          if (data.nickname !== undefined) {
            user.setNickname(data.nickname);
          }
          if (data.isScreenShareActive !== undefined) {
            user.setScreenShareActive(data.isScreenShareActive);
          }
        }
      });
      return updatedUsers;
    });

    checkSomeoneShareScreen(); // Assuming checkSomeoneShareScreen is already converted to functional style
  };

  if (session) {
    session.on("signal:userChanged", handleUserChanged);
  }

  // Cleanup
  return () => {
    if (session) {
      session.off("signal:userChanged", handleUserChanged);
    }
  };
}, [session]);

const updateLayout = () => {
  setTimeout(() => {
    layout.updateLayout(); // Assuming "layout" is available in this context
  }, 20);
};

const sendSignalUserChanged = (data) => {
  const signalOptions = {
    data: JSON.stringify(data),
    type: "userChanged",
  };

  if (session) {
    session.signal(signalOptions);
  }
};

const toggleFullscreen = () => {
  const fs = document.getElementById("container");

  if (
    !document.fullscreenElement &&
    !document.mozFullScreenElement &&
    !document.webkitFullscreenElement &&
    !document.msFullscreenElement
  ) {
    if (fs.requestFullscreen) {
      fs.requestFullscreen();
    } else if (fs.msRequestFullscreen) {
      fs.msRequestFullscreen();
    } else if (fs.mozRequestFullScreen) {
      fs.mozRequestFullScreen();
    } else if (fs.webkitRequestFullscreen) {
      fs.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
};

const switchCamera = async () => {
  try {
    const devices = await OV.getDevices();
    const videoDevices = devices.filter(
      (device) => device.kind === "videoinput"
    );

    if (videoDevices && videoDevices.length > 1) {
      const newVideoDevice = videoDevices.filter(
        (device) => device.deviceId !== currentVideoDevice.deviceId
      );

      if (newVideoDevice.length > 0) {
        const newPublisher = OV.initPublisher(undefined, {
          audioSource: undefined,
          videoSource: newVideoDevice[0].deviceId,
          publishAudio: localUser.isAudioActive(),
          publishVideo: localUser.isVideoActive(),
          mirror: true,
        });

        if (session) {
          await session.unpublish(localUser.getStreamManager());
          await session.publish(newPublisher);
          localUser.setStreamManager(newPublisher);
          setCurrentVideoDevice(newVideoDevice[0]);
          setLocalUser((prevLocalUser) => ({
            ...prevLocalUser,
            streamManager: newPublisher,
          }));
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
};

const screenShare = () => {
  const videoSource =
    navigator.userAgent.indexOf("Firefox") !== -1 ? "window" : "screen";
  const publisher = OV.current.initPublisher(
    undefined,
    {
      videoSource: videoSource,
      publishAudio: localUser.isAudioActive(),
      publishVideo: localUser.isVideoActive(),
      mirror: false,
    },
    (error) => {
      if (error && error.name === "SCREEN_EXTENSION_NOT_INSTALLED") {
        setShowExtensionDialog(true);
      } else if (error && error.name === "SCREEN_SHARING_NOT_SUPPORTED") {
        alert("Your browser does not support screen sharing");
      } else if (error && error.name === "SCREEN_EXTENSION_DISABLED") {
        alert("You need to enable screen sharing extension");
      } else if (error && error.name === "SCREEN_CAPTURE_DENIED") {
        alert("You need to choose a window or application to share");
      }
    }
  );

  publisher.once("accessAllowed", () => {
    session.unpublish(localUser.getStreamManager());
    const updatedLocalUser = { ...localUser, streamManager: publisher };
    setLocalUser(updatedLocalUser);
    session.publish(updatedLocalUser.getStreamManager()).then(() => {
      setLocalUser((prevUser) => ({
        ...prevUser,
        screenShareActive: true,
      }));
      sendSignalUserChanged({
        isScreenShareActive: updatedLocalUser.isScreenShareActive(),
      });
    });
  });

  publisher.on("streamPlaying", () => {
    updateLayout();
    publisher.videos[0].video.parentElement.classList.remove("custom-class");
  });
};

const closeDialogExtension = () => {
  setShowExtensionDialog(false);
};

const stopScreenShare = () => {
  session.unpublish(localUser.getStreamManager());
  connectWebCam(); // Assuming you've already defined the connectWebCam function
};

const checkSomeoneShareScreen = () => {
  let isScreenShared =
    subscribers.some((user) => user.isScreenShareActive()) ||
    localUser.isScreenShareActive();
  const openviduLayoutOptions = {
    maxRatio: 3 / 2,
    minRatio: 9 / 16,
    fixedRatio: isScreenShared,
    bigClass: "OV_big",
    bigPercentage: 0.8,
    bigFixedRatio: false,
    bigMaxRatio: 3 / 2,
    bigMinRatio: 9 / 16,
    bigFirst: true,
    animate: true,
  };

  layout.setLayoutOptions(openviduLayoutOptions);
  updateLayout(); // Assuming you've already refactored the updateLayout function
};

const toggleChat = (property) => {
  let display = property;

  if (display === undefined) {
    display = chatDisplay === "none" ? "block" : "none";
  }

  if (display === "block") {
    setChatDisplay(display);
    setMessageReceived(false);
  } else {
    console.log("chat", display);
    setChatDisplay(display);
  }

  updateLayout(); // Assuming you've already refactored the updateLayout function
};

const checkNotification = (event) => {
  setMessageReceived(chatDisplay === "none");
};

const checkSize = () => {
  const layoutElement = document.getElementById("layout");

  if (layoutElement.offsetWidth <= 700 && !hasBeenUpdated.current) {
    toggleChat("none");
    hasBeenUpdated.current = true;
  }

  if (layoutElement.offsetWidth > 700 && hasBeenUpdated.current) {
    hasBeenUpdated.current = false;
  }
};

const getToken = async () => {
  const sessionId = await createSession(mySessionId);
  return await createToken(sessionId);
};

const createSession = async (sessionId) => {
  const response = await axios.post(
    APPLICATION_SERVER_URL + "api/sessions",
    { customSessionId: sessionId },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data; // The sessionId
};
const createToken = async (sessionId) => {
  const response = await axios.post(
    APPLICATION_SERVER_URL + "api/sessions/" + sessionId + "/connections",
    {},
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data; // The token
};

return (
  <div className="container" id="container">
    <ToolbarComponent
      sessionId={mySessionId}
      user={localUser}
      showNotification={messageReceived}
      camStatusChanged={camStatusChanged}
      micStatusChanged={micStatusChanged}
      screenShare={screenShare}
      stopScreenShare={stopScreenShare}
      toggleFullscreen={toggleFullscreen}
      switchCamera={switchCamera}
      leaveSession={leaveSession}
      toggleChat={toggleChat}
    />

    <DialogExtensionComponent
      showDialog={showExtensionDialog}
      cancelClicked={closeDialogExtension}
    />

    <div id="layout" className="bounds">
      {localUser && localUser.getStreamManager() && (
        <div className="OT_root OT_publisher custom-class" id="localUser">
          <StreamComponent user={localUser} handleNickname={nicknameChanged} />
        </div>
      )}
      {subscribers.map((sub, i) => (
        <div
          key={i}
          className="OT_root OT_publisher custom-class"
          id="remoteUsers"
        >
          <StreamComponent
            user={sub}
            streamId={sub.streamManager.stream.streamId}
          />
        </div>
      ))}
      {localUser && localUser.getStreamManager() && (
        <div
          className="OT_root OT_publisher custom-class"
          style={{ display: chatDisplay }}
        >
          <ChatComponent
            user={localUser}
            chatDisplay={chatDisplay}
            close={toggleChat}
            messageReceived={checkNotification}
          />
        </div>
      )}
    </div>
  </div>
);
/**
 * --------------------------------------------
 * GETTING A TOKEN FROM YOUR APPLICATION SERVER
 * --------------------------------------------
 * The methods below request the creation of a Session and a Token to
 * your application server. This keeps your OpenVidu deployment secure.
 *
 * In this sample code, there is no user control at all. Anybody could
 * access your application server endpoints! In a real production
 * environment, your application server must identify the user to allow
 * access to the endpoints.
 *
 * Visit https://docs.openvidu.io/en/stable/application-server to learn
 * more about the integration of OpenVidu in your application server.
 */

export default VideoRoomComponent;
