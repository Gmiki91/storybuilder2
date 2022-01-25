import './modal/forms/Form.css';
import data from '../assets/languages.json';
import { levels } from '../models/LanguageLevel';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LOCAL_HOST } from 'constants/constants';

const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

export const NewStory = () => {
  const navigate = useNavigate();

  const handleNewStory = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const story = {
        title: form.titel.value,
        description: form.description.value,
        language: form.language.value,
        level: form.level.value,
    }
    axios.post(`${LOCAL_HOST}/stories/`, story, { headers })
    .then(()=>navigate('/'))
    .catch(error=>console.log(error))
}

  return (
    <form className="form-box" onSubmit={handleNewStory}>

      <input id="titel" placeholder="Story title" />
      <textarea id="description" placeholder="Write a short synopsis to the story" />

      <div className="drop-down">
        <label htmlFor="language">Language </label>
        <select id='language'>
          {data.map(lang => <option key={lang.code} value={lang.name}>{lang.name}</option>)}
        </select>
      </div>

      <div className="drop-down">
        <label htmlFor="level">Proficiency </label>
        <select id='level'>
          {levels.map(level => <option key={level.code} value={level.code}>{level.code} - {level.text}</option>)}
        </select>
      </div>
      
      <div className='button-container'>
        <button onClick={()=>navigate('/')}>Cancel</button>
        <button type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};