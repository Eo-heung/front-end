import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router';
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
