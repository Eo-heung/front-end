import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Layout from './components/partials/Layout';
import MainContent from './components/partials/MainContent';
import ViewMoim from './components/moims/ViewMoim';
import CreateMoim from './components/moims/CreateMoim';
import Password from './components/Password';
import SuccessPage from './components/SuccessPage';
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
          <Route path='/login' element={<Login></Login>}></Route>
          <Route path='/findpassword' element={<Password></Password>}></Route>
          <Route path='/success' element={<SuccessPage></SuccessPage>} />
        </Routes>
      </CookiesProvider>
    </>
  );
};

export default App;
