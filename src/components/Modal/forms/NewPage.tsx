import './Form.css';
import { levels } from '../../../models/LanguageLevel';

type Props = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

export const NewPage: React.FC<Props> = ({ onSubmit, onClose }) => {
  return (
    <form className="form-box" onSubmit={onSubmit}>

      <textarea id="text" placeholder="..." />
      <div className="drop-down">
        <label htmlFor="level">Proficiency </label>
        <select id='level'>
          {levels.map(level => <option key={level.code} value={level.code}>{level.code}  ({level.text})</option>)}
        </select>
      </div>
      
      <div className='button-container'>
        <button onClick={onClose}>Cancel</button>
        <button type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};