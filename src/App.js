import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Layout from './components/partials/Layout';
import MainContent from './components/partials/MainContent';
import ViewMoim from './components/moims/ViewMoim';
import CreateMoim from './components/moims/CreateMoim';
import Password from './components/Password';
import KakaoHandler from './components/socialLogin/KakaoHandler';
// import GoogleHandelr from './components/socialLogin/GoogleHandler';
import { CookiesProvider } from 'react-cookie';

function App() {
  return (
    <>
      <CookiesProvider>
        <Routes>
          <Route path="/" element={<Layout></Layout>}>
            <Route index element={<MainContent></MainContent>}></Route>
            <Route path='/create-moim' element={<CreateMoim></CreateMoim>}></Route>
            <Route path='/view-moim' element={<ViewMoim></ViewMoim>}></Route>
          </Route>
          <Route path='/auth' element={<KakaoHandler></KakaoHandler>}></Route>
          <Route path='/login' element={<Login></Login>}></Route>
          <Route path='/findpassword' element={<Password></Password>}></Route>
          {/* <Route path='/oauth' element={<GoogleHandelr></GoogleHandelr>}></Route> */}
        </Routes>

      </CookiesProvider>
    </>

  );
};

export default App;
