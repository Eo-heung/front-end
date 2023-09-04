import { CookiesProvider } from "react-cookie";
import { Route, Routes } from "react-router-dom";
import "./IndexStyle.css";
import Login from "./components/Login";
import Password from "./components/Password";
import SignUp from "./components/SignUp";
import Payment from "./components/charge/Payment";
import StartCamera from "./components/chatting/StartCamera";
import TextChatting from "./components/chatting/TextChatting";
import AcceptMoim from "./components/moims/AcceptMoim";
import ApplyMoim from "./components/moims/ApplyMoim";
import CreateMoim from "./components/moims/CreateMoim";
import ListAcceptMoim from "./components/moims/ListAcceptMoim";
import ListMoim from "./components/moims/ListMoim";
import ModifyMoim from "./components/moims/ModifyMoim";
import ViewMoim from "./components/moims/ViewMoim";
import Mypage from "./components/mypage/Mypage";
import Layout from "./components/partials/Layout";
import MainContent from "./components/partials/MainContent";
import KakaoHandler from "./components/socialLogin/KakaoHandler";
import NaverHandler from "./components/socialLogin/NaverHandler";
import BasicBoard from "./components/utils/BasicBoard";
import ButtonWithNewWindow from "./components/multichat/components/ButtonWithNewWindow";
import MultiChatting from "./components/multichat/components/VideoRoomComponent";
import ChattingPayment from "./components/chatting/ChattingPayment";
import ChattingWithFriend from "./components/chatting/ChattingWithFriend";
import MoimController from "./components/moims/MoimController";
import MoimBoard from "./components/moims/MoimBoard";
import FreeBoardList from "./components/moims/FreeBoardList";
import FreeBoard from "./components/moims/FreeBoard";
import MoimNoticeList from "./components/moims/MoimNoticeList";
import MoimNotice from "./components/moims/MoimNotice";
import CreateBoard from "./components/moims/CreateBoard";
import PictureLib from "./components/moims/PictureLib";
import MoimAppList from "./components/moims/MoimAppList";
import MoimUsers from "./components/moims/MoimUsers";
import Mymoim from "./components/moims/Mymoim";
import MyBoardList from "./components/moims/MyBoardList";
import MyCommentList from "./components/moims/MyCommentList";
import MyMoimInfo from "./components/moims/MyMoimInfo";
import CreateAppointment from "./components/appointment/CreateAppointment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ViewAppointment from "./components/appointment/ViewAppointment";
import ListMoimMember from "./components/moims/ListMoimMember";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/ko';

dayjs.extend(utc);
dayjs.locale('ko');

function App() {
  return (
    <>
      <CookiesProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Routes>
            <Route path="/" element={<Layout></Layout>}>
              <Route
                path="/talk"
                element={<ChattingWithFriend></ChattingWithFriend>}
              ></Route>
              <Route path="/charge" element={<Payment></Payment>}></Route>
              <Route index element={<MainContent></MainContent>}></Route>
              <Route
                path="/chatting"
                element={<StartCamera></StartCamera>}
              ></Route>
              <Route path="/mypage" element={<Mypage></Mypage>}></Route>
              <Route
                path="/basicboard"
                element={<BasicBoard></BasicBoard>}
              ></Route>
              <Route
                path="/create-moim"
                element={<CreateMoim></CreateMoim>}
              ></Route>
              <Route
                path="/view-moim/:moimId"
                element={<ViewMoim></ViewMoim>}
              ></Route>
              <Route path="/chatting" element={<StartCamera></StartCamera>} />
              <Route
                path="/textchatting"
                element={<TextChatting></TextChatting>}
              />
              <Route
                path="/multichattingstart"
                element={<ButtonWithNewWindow></ButtonWithNewWindow>}
              />
              <Route
                path="/modify-moim/:moimId"
                element={<ModifyMoim></ModifyMoim>}
              ></Route>
              <Route
                path="/apply-moim/:moimId"
                element={<ApplyMoim></ApplyMoim>}
              ></Route>
              <Route
                path="/my-moim-list"
                element={<Mymoim></Mymoim>}
              ></Route>
              <Route path="/moim-controller" element={<MoimController></MoimController>}>
                <Route index element={<Mymoim></Mymoim>}></Route>
                <Route path="list-moim" element={<ListMoim></ListMoim>}></Route>
              </Route>
              <Route path="/:moimId/moim-board" element={<MoimBoard></MoimBoard>}>
                <Route index element={
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <FreeBoardList isMainPage={true} />
                    <MoimNoticeList isMainPage={true} />
                  </div>
                } />
                <Route path="free-board" element={<FreeBoardList />} />
                <Route path="free-board/:boardId" element={<FreeBoard type="FREE" />} />
                <Route path="notice-board" element={<MoimNoticeList />} />
                <Route path="notice-board/:boardId" element={<MoimNotice type="NOTICE" />} />
                <Route path="picture-lib" element={<PictureLib></PictureLib>} />
                <Route path="moim-app/:appBoardId" element={<ViewAppointment></ViewAppointment>} />
                <Route path="moim-app-list" element={<MoimAppList></MoimAppList>} />
                <Route path="moim-users" element={<MoimUsers></MoimUsers>} />
                <Route path="my-moim-info" element={<MyMoimInfo></MyMoimInfo>}></Route>
                <Route path="my-boards" element={<MyBoardList></MyBoardList>}></Route>
                <Route path="my-comments" element={<MyCommentList></MyCommentList>}></Route>
                <Route path="accept-moim" element={<ListAcceptMoim></ListAcceptMoim>}></Route>
                <Route path="accept-moim/:moimRegId" element={<AcceptMoim></AcceptMoim>}></Route>
                <Route path="moim-member" element={<ListMoimMember></ListMoimMember>}></Route>
              </Route>
              <Route
                path="/:moimId/create-board"
                element={<CreateBoard></CreateBoard>}
              ></Route>
              <Route
                path="/:moimId/create-board/:boardId"
                element={<CreateBoard></CreateBoard>}>
              </Route>
              <Route path="/:moimId/create-appoint"
                element={<CreateAppointment></CreateAppointment>}>
              </Route>
            </Route>
            <Route
              path="/textchatting"
              element={<TextChatting></TextChatting>}
            />
            <Route
              path="/multichattingstart"
              element={<ButtonWithNewWindow></ButtonWithNewWindow>}
            />

            <Route path="/list-moim" element={<ListMoim></ListMoim>}></Route>
            <Route
              path="/modify-moim/:moimId"
              element={<ModifyMoim></ModifyMoim>}
            ></Route>
            <Route
              path="/apply-moim/:moimId"
              element={<ApplyMoim></ApplyMoim>}
            ></Route>
            <Route
              path="/accept-moim/:moimId/:moimRegId"
              element={<AcceptMoim></AcceptMoim>}
            ></Route>
            <Route
              path="/list-accept-moim/:moimId"
              element={<ListAcceptMoim></ListAcceptMoim>}
            ></Route>
            <Route
              path="/multichatting"
              element={<MultiChatting></MultiChatting>}
            ></Route>

            <Route path="/auth" element={<KakaoHandler></KakaoHandler>}></Route>
            <Route path="/login" element={<Login></Login>}></Route>
            <Route path="/oauth" element={<NaverHandler></NaverHandler>}></Route>
            <Route path="/signup" element={<SignUp></SignUp>}></Route>
            <Route path="/findpassword" element={<Password></Password>}></Route>

            <Route
              path="/chattingcharge"
              element={<ChattingPayment></ChattingPayment>}
            ></Route>
          </Routes>
        </LocalizationProvider>
      </CookiesProvider>
    </>
  );
}

export default App;
