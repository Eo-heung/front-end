import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Password from './components/Password';


function App() {
  return (
    <Routes>
      <Route path='/login' element={<Login></Login>}></Route>
      <Route path='/findpassword' element={<Password></Password>}></Route>
    </Routes>
  );
}

export default App;
