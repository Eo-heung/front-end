import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Layout from "./components/partials/Layout";
import MainContent from "./components/partials/MainContent";
import ViewMoim from "./components/moims/ViewMoim";
import CreateMoim from "./components/moims/CreateMoim";
import Password from "./components/Password";
import SignUp from './components/SignUp';
import SuccessPage from "./components/SuccessPage";
import { CookiesProvider } from "react-cookie";
import ListMoim from "./components/moims/ListMoim";
import BasicBoard from "./components/utils/BasicBoard";
import "./IndexStyle.css";
import StartCamera from "./components/StartCamera";
import TextChatting from "./components/TextChatting";

function App() {
  return (
    <>
      <CookiesProvider>
        <Routes>
          <Route path="/" element={<Layout></Layout>}>
            <Route index element={<MainContent></MainContent>}></Route>
            <Route
              path="/chatting"
              element={<StartCamera></StartCamera>}
            ></Route>
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

            <Route path="/list-moim" element={<ListMoim></ListMoim>}></Route>
          </Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path='/signup' element={<SignUp></SignUp>}></Route>
          <Route path="/findpassword" element={<Password></Password>}></Route>
          <Route path="/success" element={<SuccessPage></SuccessPage>} />
        </Routes>
      </CookiesProvider>
    </>
  );
}

export default App;
