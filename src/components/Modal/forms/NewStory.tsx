import './Form.css';
import data from '../../../assets/languages.json';
import { levels } from '../../../models/LanguageLevel';

type Props = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCloseForm: () => void;
}

export const NewStory: React.FC<Props> = ({ onSubmit, onCloseForm }) => {
  return (
    <form className="form-box" onSubmit={onSubmit}>

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
        <button onClick={onCloseForm}>Cancel</button>
        <button type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};