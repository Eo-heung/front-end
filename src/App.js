import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Password from './components/Password';
import KakaoHandler from './components/socialLogin/KakaoHandler';
// import GoogleHandelr from './components/socialLogin/GoogleHandler';


function App() {
  return (
    <Routes>
      <Route path='/login' element={<Login></Login>}></Route>
      <Route path='/auth' element={<KakaoHandler></KakaoHandler>}></Route>
      {/* <Route path='/oauth' element={<GoogleHandelr></GoogleHandelr>}></Route> */}
      <Route path='/findpassword' element={<Password></Password>}></Route>
    </Routes>
  );
}

export default App;
