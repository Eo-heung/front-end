import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Password1 from './components/Password1';
import Password2 from './components/Password2';


function App() {
  return (
    <Routes>
      <Route path='/password1' element={<Password1></Password1>}></Route>
      <Route path="/password2" element={<Password2></Password2>}></Route>
      <Route path='/login' element={<Login></Login>}></Route>

    </Routes>
  );
}

export default App;
