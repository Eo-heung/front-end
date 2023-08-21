import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Layout from "./components/partials/Layout";
import MainContent from "./components/partials/MainContent";
import ViewMoim from "./components/moims/ViewMoim";
import CreateMoim from "./components/moims/CreateMoim";
import Password from "./components/Password";
import SuccessPage from "./components/SuccessPage";
import { CookiesProvider } from "react-cookie";
import ListMoim from "./components/moims/ListMoim";
import BasicBoard from "./components/utils/BasicBoard";
import Mypage from './components/mypage/Mypage';
import ModifyMoim from "./components/moims/ModifyMoim";
import ApplyMoim from "./components/moims/ApplyMoim";
import AcceptMoim from "./components/moims/AcceptMoim";
import ListAcceptMoim from "./components/moims/ListAcceptMoim";


function App() {
  return (
    <>
      <CookiesProvider>
        <Routes>
          <Route path="/" element={<Layout></Layout>}>
            <Route index element={<MainContent></MainContent>}></Route>
            <Route path='/mypage' element={<Mypage></Mypage>}></Route>
            <Route path="/basicboard" element={<BasicBoard></BasicBoard>}></Route>
            <Route path="/create-moim" element={<CreateMoim></CreateMoim>}></Route>
            <Route path="/view-moim/:moimId" element={<ViewMoim></ViewMoim>}></Route>
            <Route path="/list-moim" element={<ListMoim></ListMoim>}></Route>
            <Route path="/modify-moim/:moimId" element={<ModifyMoim></ModifyMoim>}></Route>
            <Route path="/apply-moim/:moimId" element={<ApplyMoim></ApplyMoim>}></Route>
            <Route path="/accept-moim/:moimRegId" element={<AcceptMoim></AcceptMoim>}></Route>
            <Route path="/list-accept-moim/:moimId" element={<ListAcceptMoim></ListAcceptMoim>}></Route>
          </Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/findpassword" element={<Password></Password>}></Route>
          <Route path="/success" element={<SuccessPage></SuccessPage>} />
        </Routes>
      </CookiesProvider>
    </>
  );
}

export default App;
