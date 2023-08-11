import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Password from './components/Password';
import SuccessPage from './components/SuccessPage';
import KakaoHandler from './components/socialLogin/KakaoHandler';


function App() {
  return (
    <Routes>
      <Route path='/login' element={<Login></Login>}></Route>
      <Route path='/auth' element={<KakaoHandler></KakaoHandler>}></Route>
      <Route path='/findpassword' element={<Password></Password>}></Route>
      <Route path='/success' element={<SuccessPage></SuccessPage>} />
    </Routes>
  );
}

export default App;
