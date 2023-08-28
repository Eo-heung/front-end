import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Layout from "./components/partials/Layout";
import MainContent from "./components/partials/MainContent";
import ViewMoim from "./components/moims/ViewMoim";
import CreateMoim from "./components/moims/CreateMoim";
import Password from "./components/Password";
import SignUp from "./components/SignUp";
import KakaoHandler from "./components/socialLogin/KakaoHandler";
import NaverHandelr from "./components/socialLogin/NaverHandler";
import { CookiesProvider } from "react-cookie";
import ListMoim from "./components/moims/ListMoim";
import BasicBoard from "./components/utils/BasicBoard";
import "./IndexStyle.css";
// import StartCamera from "./components/StartCamera";
// import TextChatting from "./components/TextChatting";
import Mypage from './components/mypage/Mypage';
import ModifyMoim from "./components/moims/ModifyMoim";
import ApplyMoim from "./components/moims/ApplyMoim";
import AcceptMoim from "./components/moims/AcceptMoim";
import ListAcceptMoim from "./components/moims/ListAcceptMoim";
import MultiChatting from "./components/chatTest/components/VideoRoomComponent";
import MoimController from "./components/moims/MoimController";
import MoimBoard from "./components/moims/MoimBoard";
// import MultiChatting from "./components/chatting/MultiChatting";

function App() {
  return (
    <>
      <CookiesProvider>
        <Routes>
          <Route path="/" element={<Layout></Layout>}>
            <Route index element={<MainContent></MainContent>}></Route>
            {/* <Route
              path="/chatting"
              element={<StartCamera></StartCamera>}
            ></Route> */}
            <Route path='/mypage' element={<Mypage></Mypage>}></Route>
            <Route path="/basicboard" element={<BasicBoard></BasicBoard>}></Route>
            <Route path="/create-moim" element={<CreateMoim></CreateMoim>}></Route>
            <Route path="/view-moim/:moimId" element={<ViewMoim></ViewMoim>}></Route>
            {/* <Route path="/chatting" element={<StartCamera></StartCamera>} /> */}
            {/* <Route
              path="/textchatting"
              element={<TextChatting></TextChatting>}
            />
            <Route
              path="/multichatting"
              element={<MultiChatting></MultiChatting>}
            ></Route> */}
            <Route path="/modify-moim/:moimId" element={<ModifyMoim></ModifyMoim>}></Route>
            <Route path="/apply-moim/:moimId" element={<ApplyMoim></ApplyMoim>}></Route>
            <Route path="/accept-moim/:moimId/:moimRegId" element={<AcceptMoim></AcceptMoim>}></Route>
            <Route path="/list-accept-moim/:moimId" element={<ListAcceptMoim></ListAcceptMoim>}></Route>
            <Route path="/moim-controller" element={<MoimController></MoimController>}></Route>
            <Route path="/moim-board/" element={<MoimBoard></MoimBoard>}></Route>
          </Route>
          <Route path="/auth" element={<KakaoHandler></KakaoHandler>}></Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/oauth" element={<NaverHandelr></NaverHandelr>}></Route>
          <Route path="/findpassword" element={<Password></Password>}></Route>
          <Route path="/signup" element={<SignUp></SignUp>}></Route>
          {/* <Route path='/oauth' element={<GoogleHandelr></GoogleHandelr>}></Route> */}
        </Routes>
      </CookiesProvider>
    </>
  );
}

export default App;