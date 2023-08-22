import { CookiesProvider } from "react-cookie";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Password from "./components/Password";
import SignUp from './components/SignUp';
import CreateMoim from "./components/moims/CreateMoim";
import ListMoim from "./components/moims/ListMoim";
import ViewMoim from "./components/moims/ViewMoim";
import Mypage from './components/mypage/Mypage';
import WebSocket from "./components/mypage/WebSocket";
import Layout from "./components/partials/Layout";
import MainContent from "./components/partials/MainContent";
import BasicBoard from "./components/utils/BasicBoard";
import Payment from "./components/Payment";


function App() {
  return (
    <>
      <CookiesProvider>
        <Routes>
          <Route path="/" element={<Layout></Layout>}>
            <Route index element={<MainContent></MainContent>}></Route>
            <Route path='/mypage' element={<Mypage></Mypage>}></Route>
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
            <Route path="/list-moim" element={<ListMoim></ListMoim>}></Route>
            <Route path="/payment" element={<Payment></Payment>} ></Route>
          </Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/oauth" element={<Login></Login>}></Route>
          <Route path='/signup' element={<SignUp></SignUp>}></Route>
          <Route path="/findpassword" element={<Password></Password>}></Route>
          <Route path="/socket" element={<WebSocket></WebSocket>}></Route>
        </Routes>
      </CookiesProvider>
    </>
  );
}

export default App;
