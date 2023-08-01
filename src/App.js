import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Password3 from './components/Password3';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Password3></Password3>}></Route>
      <Route path='/login' element={<Login></Login>}></Route>
    </Routes>
  );
}

export default App;
