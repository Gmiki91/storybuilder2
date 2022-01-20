import 'App.css';
import { useState } from 'react';
import { Routes, Route, NavLink, BrowserRouter } from "react-router-dom";

import Home from 'containers/Home';
import Stats from 'containers/Stats';
import StoryPage from 'containers/StoryPage';

import Login from 'authentication/Login';
import Logout  from 'authentication/Logout';
import Signup from 'authentication/Signup';
import ForgotPassword from 'authentication/ForgotPassword';
import ResetPassword from 'authentication/ResetPassword';

import { AuthContext } from 'context/AuthContext'

const App = () => {
  const token = localStorage.getItem("token");
  const existingToken = token ? token : '';
  const [authToken, setAuthToken] = useState(existingToken);

  const setToken = (data: React.SetStateAction<string>) => {
    localStorage.setItem("token", data.toString());
    setAuthToken(data);
  }

  return (
    <div className="App">
      <AuthContext.Provider value={{ authToken, setAuthToken: setToken }}>
        <BrowserRouter>
          <NavLink to='/'>Home</NavLink>
          <NavLink to='/stats'>Stats</NavLink>
          {authToken !== ''
            ? <NavLink to='/logout'>Logout</NavLink>
            : <>
              <NavLink to='/login'>Login</NavLink>
              <NavLink to='/signup'>Sign up</NavLink>
            </>}
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/logout' element={<Logout />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/:storyId/:status' element={<StoryPage />} />
            <Route path='/stats' element={<Stats />} />
            <Route path='/forgotPassword' element={<ForgotPassword />} />
            <Route path='/resetPassword/:token' element={<ResetPassword />} />

          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
