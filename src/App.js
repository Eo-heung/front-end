import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Password from './components/Password';
import SignUp from './components/SignUp';
import SuccessPage from './components/SuccessPage';
import Layout from './components/partials/Layout';
import MainContent from './components/partials/MainContent';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout></Layout>}>
        <Route index element={<MainContent></MainContent>}></Route>
      </Route>
      <Route path='/signup' element={<SignUp></SignUp>}></Route>
      <Route path='/login' element={<Login></Login>}></Route>
      <Route path='/findpassword' element={<Password></Password>}></Route>
      <Route path='/success' element={<SuccessPage></SuccessPage>} />
    </Routes>
  );
};

export default App;
