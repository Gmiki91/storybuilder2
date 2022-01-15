import './Form.css';
import { levels } from '../../../models/LanguageLevel';
type Props = {
    level: string;
    onSubmit: (rate: string) => void;
    onClose: () => void;
}
export const RateLevel: React.FC<Props> = ({ level, onSubmit, onClose }) => {
    const levelObj = levels.find(l => l.code === level);

    return levelObj ? <div className='form-box'>
        <label>This text is level {levelObj.code} ({levelObj.text}). Do you agree? </label>
        <div style={{ display:'flex', flexDirection:'column', alignItems: 'center', justifyContent:'start'}}>
            <button onClick={() => onSubmit(levelObj.code)}>Agree</button>
            <button onClick={onClose}>¯\_(ツ)_/¯</button>
            <label>No way, it's level...</label>
            {levels.map(level => <button key={level.code} onClick={() => onSubmit(level.code)}>{level.code}  ({level.text})</button>)}

        </div>
    </div> : <div>Something went wrong</div>
}