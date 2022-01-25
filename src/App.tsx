import 'App.css';
import { useState } from 'react';
import { Routes, Route, NavLink, BrowserRouter } from "react-router-dom";

import Home from 'containers/Home';
import Settings from 'containers/Settings';
import StoryPage from 'containers/StoryPage';
import { NewStory } from 'components/NewStory';

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
          <NavLink to='/'>Stories</NavLink>
          {authToken !== '' && <NavLink to='/new'>New Story</NavLink>}
          {authToken !== ''
            ? <>
            <NavLink to='/settings'>Profile</NavLink>
            <NavLink to='/logout'>Logout</NavLink>
            </> 
            : <>
              <NavLink to='/signup'>Sign up</NavLink>
              <NavLink to='/login'>Login</NavLink>
            </>}
          <Routes>
            <Route path='/' element={<Home />} />
            {authToken !== '' && <Route path='/new' element={<NewStory />} />}
            <Route path='/login' element={<Login />} />
            <Route path='/logout' element={<Logout />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/:storyId' element={<StoryPage />} />
            <Route path='/forgotPassword' element={<ForgotPassword />} />
            <Route path='/resetPassword/:token' element={<ResetPassword />} />

          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
