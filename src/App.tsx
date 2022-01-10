import './App.css';
import { Routes, Route, NavLink, BrowserRouter } from "react-router-dom";
import Home from './containers/Home';
import Stats from './containers/Stats';
import StoryPage from './containers/StoryPage';

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <NavLink to='/'>Home</NavLink>
        <NavLink to='/stats'>Stats</NavLink>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/:storyId' element={<StoryPage />} />
          <Route path='/stats' element={<Stats />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
