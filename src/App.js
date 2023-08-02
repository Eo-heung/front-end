import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Password1 from './components/Password1';
import Password2 from './components/Password2';
import Password3 from './components/Password3';
import Password4 from './components/Password4';
import Layout from './components/partials/Layout';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout></Layout>}></Route>
      <Route path='/password1' element={<Password1></Password1>}></Route>
      <Route path="/password2" element={<Password2></Password2>}></Route>
      <Route path="/password3" element={<Password3></Password3>}></Route>
      <Route path="/password4" element={<Password4></Password4>}></Route>
      <Route path='/login' element={<Login></Login>}></Route>

    </Routes>
  );
}

export default App;
