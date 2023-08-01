import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Password3 from './components/Password3';
import Password4 from './components/Password4';


function App() {
  return (
    <Routes>
      <Route path="/password3" element={<Password3></Password3>}></Route>
      <Route path="/password4" element={<Password4></Password4>}></Route>
      <Route path='/login' element={<Login></Login>}></Route>
    </Routes>
  );
}

export default App;
