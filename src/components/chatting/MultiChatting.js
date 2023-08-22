import React, { useState, useCallback } from "react";
import "../../css/partials/MultiChatting.css";
import axios from "axios";
import OpenViduSession from "openvidu-react";

const MultiChatting = () => {
  const OPENVIDU_SERVER_URL = "https://eoheung.store:6443";
  const OPENVIDU_SERVER_SECRET = "MY_SECRET";

  const [mySessionId, setMySessionId] = useState("SessionA");
  const [myUserName, setMyUserName] = useState(
    "OpenVidu_User_" + Math.floor(Math.random() * 100)
  );
  const [token, setToken] = useState();
  const [session, setSession] = useState();

  const handlerJoinSessionEvent = useCallback(() => {
    console.log("Join session");
  }, []);

  const handlerLeaveSessionEvent = useCallback(() => {
    console.log("Leave session");
    setSession(undefined);
  }, []);

  const handlerErrorEvent = useCallback(() => {
    console.log("Error in session");
  }, []);

  const joinSession = useCallback(
    (event) => {
      if (mySessionId && myUserName) {
        getToken().then((token) => {
          setToken(token);
          setSession(true);
        });
        event.preventDefault();
      }
    },
    [mySessionId, myUserName]
  );

  const handleChangeSessionId = useCallback((e) => {
    setMySessionId(e.target.value);
  }, []);

  const handleChangeUserName = useCallback((e) => {
    setMyUserName(e.target.value);
  }, []);

  const getToken = useCallback(() => {
    return createSession(mySessionId)
      .then((sessionId) => createToken(sessionId))
      .catch((Err) => console.error(Err));
  }, [mySessionId]);

  const createSession = useCallback((sessionId) => {
    return new Promise((resolve, reject) => {
      var data = JSON.stringify({ customSessionId: sessionId });
      axios
        .post(OPENVIDU_SERVER_URL + "/openvidu/api/sessions", data, {
          headers: {
            Authorization:
              "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("CREATE SESION", response);
          resolve(response.data.id);
        })
        .catch((response) => {
          var error = Object.assign({}, response);
          if (error.response && error.response.status === 409) {
            resolve(sessionId);
          } else {
            console.log(error);
            console.warn(
              "No connection to OpenVidu Server. This may be a certificate error at " +
                OPENVIDU_SERVER_URL
            );
            if (
              window.confirm(
                'No connection to OpenVidu Server. This may be a certificate error at "' +
                  OPENVIDU_SERVER_URL +
                  '"\n\nClick OK to navigate and accept it. ' +
                  'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                  OPENVIDU_SERVER_URL +
                  '"'
              )
            ) {
              window.location.assign(
                OPENVIDU_SERVER_URL + "/accept-certificate"
              );
            }
          }
        });
    });
  }, []);

  const createToken = useCallback((sessionId) => {
    return new Promise((resolve, reject) => {
      var data = JSON.stringify({});
      axios
        .post(
          OPENVIDU_SERVER_URL +
            "/openvidu/api/sessions/" +
            sessionId +
            "/connection",
          data,
          {
            headers: {
              Authorization:
                "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log("TOKEN", response);
          resolve(response.data.token);
        })
        .catch((error) => reject(error));
    });
  }, []);

  return (
    <div>
      {session === undefined ? (
        <div id="join">
          <div id="join-dialog">
            <h1> Join a video session </h1>
            <form onSubmit={joinSession}>
              <p>
                <label>Participant: </label>
                <input
                  type="text"
                  id="userName"
                  value={myUserName}
                  onChange={handleChangeUserName}
                  required
                />
              </p>
              <p>
                <label> Session: </label>
                <input
                  type="text"
                  id="sessionId"
                  value={mySessionId}
                  onChange={handleChangeSessionId}
                  required
                />
              </p>
              <p>
                <input name="commit" type="submit" value="JOIN" />
              </p>
            </form>
          </div>
        </div>
      ) : (
        <div id="session">
          <OpenViduSession
            id="opv-session"
            sessionName={mySessionId}
            user={myUserName}
            token={token}
            joinSession={handlerJoinSessionEvent}
            leaveSession={handlerLeaveSessionEvent}
            error={handlerErrorEvent}
          />
        </div>
      )}
    </div>
  );
};

export default MultiChatting;
