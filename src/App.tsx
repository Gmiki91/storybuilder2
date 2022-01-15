import 'App.css';
import { Routes, Route, NavLink, BrowserRouter } from "react-router-dom";
import Home from 'containers/Home';
import Stats from 'containers/Stats';
import StoryPage from 'containers/StoryPage';
import {AuthContext} from 'context/AuthContext'
import Login from 'authentication/Login';
import Signup from 'authentication/Signup';
import { useState } from 'react';

const App = () => {
  const tokens = localStorage.getItem("tokens");
  const existingTokens = tokens ? 'JSON.parse(tokens)':'';
  const [authTokens, setAuthTokens] = useState(existingTokens);
  
  const setTokens = (data:React.SetStateAction<string>) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data);
  }

  return (
    <div className="App">
      <AuthContext.Provider value={{authTokens, setAuthTokens:setTokens}}>
      <BrowserRouter>
        <NavLink to='/'>Home</NavLink>
        <NavLink to='/stats'>Stats</NavLink>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/:storyId' element={<StoryPage />} />
          <Route path='/stats' element={<Stats />} />
        </Routes>
      </BrowserRouter>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
