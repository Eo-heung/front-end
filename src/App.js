import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Password1 from './components/Password1';
import Password2 from './components/Password2';
import Password3 from './components/Password3';
import Password4 from './components/Password4';
import Join from './components/Join';
import JoinBirth from './components/JoinBirth';
import JoinLocal1 from './components/JoinLocal1';
import JoinLocal2 from './components/JoinLocal2';
import JoinLocal3 from './components/JoinLocal3';
import JoinName from './components/JoinName';
import JoinPhoneNum1 from './components/JoinPhoneNum1';
import JoinPhoneNum2 from './components/JoinPhoneNum2';
import JoinPW from './components/JoinPW';
import JoinComplete from './components/JoinComplete';
import JoinFavorite from './components/JoinFavorite';


function App() {
  return (
    <Routes>
      <Route path='/password1' element={<Password1></Password1>}></Route>
      <Route path="/password2" element={<Password2></Password2>}></Route>
      <Route path="/password3" element={<Password3></Password3>}></Route>
      <Route path="/password4" element={<Password4></Password4>}></Route>
      <Route path='/login' element={<Login></Login>}></Route>
      <Route path='/Join' element={<Join></Join>}></Route>
      <Route path='/JoinBirth' element={<JoinBirth></JoinBirth>}></Route>
      <Route path='/JoinLocal1' element={<JoinLocal1></JoinLocal1>}></Route>
      <Route path='/JoinLocal2' element={<JoinLocal2></JoinLocal2>}></Route>
      <Route path='/JoinLocal3' element={<JoinLocal3></JoinLocal3>}></Route>
      <Route path='/JoinName' element={<JoinName></JoinName>}></Route>
      <Route path='/JoinPhoneNum1' element={<JoinPhoneNum1></JoinPhoneNum1>}></Route>
      <Route path='/JoinPhoneNum2' element={<JoinPhoneNum2></JoinPhoneNum2>}></Route>
      <Route path='/JoinPW' element={<JoinPW></JoinPW>}></Route>
      <Route path='/JoinComplete' element={<JoinComplete></JoinComplete>}></Route>
      <Route path='/JoinFavorite' element={<JoinFavorite></JoinFavorite>}></Route>

    </Routes>
  );
}

export default App;
