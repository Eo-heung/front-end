import { Route, Routes } from 'react-router';
import SignUp from './components/SignUp';
import Join from './components/join/Join';
import JoinBirth from './components/join/JoinBirth';
import JoinComplete from './components/join/JoinComplete';
import JoinFavorite from './components/join/JoinFavorite';
import JoinLocal1 from './components/join/JoinLocal1';
import JoinLocal2 from './components/join/JoinLocal2';
import JoinLocal3 from './components/join/JoinLocal3';
import JoinName from './components/join/JoinName';
import JoinPW from './components/join/JoinPW';
import JoinPhoneNum1 from './components/join/JoinPhoneNum1';
import JoinPhoneNum2 from './components/join/JoinPhoneNum2';

function App() {
  return (
    <Routes>
      <Route path='/signup' element={<SignUp></SignUp>}></Route>
      <Route path='/join' element={<Join></Join>}></Route>
      <Route path='/join1' element={<JoinPhoneNum1></JoinPhoneNum1>}></Route>
      <Route path='/join2' element={<JoinPhoneNum2></JoinPhoneNum2>}></Route>
      <Route path='/join3' element={<JoinPW></JoinPW>}></Route>
      <Route path='/join4' element={<JoinName></JoinName>}></Route>
      <Route path='/join5' element={<JoinBirth></JoinBirth>}></Route>
      <Route path='/join6' element={<JoinLocal1></JoinLocal1>}></Route>
      <Route path='/join7' element={<JoinLocal2></JoinLocal2>}></Route>
      <Route path='/join8' element={<JoinLocal3></JoinLocal3>}></Route>
      <Route path='/join9' element={<JoinFavorite></JoinFavorite>}></Route>
      <Route path='/join10' element={<JoinComplete></JoinComplete>}></Route>
    </Routes>
  );
}

export default App;
