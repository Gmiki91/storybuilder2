import { levels } from '../../models/LanguageLevel';
import data from '../../assets/languages.json';

type Props = {
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    onCloseForm:()=>void;
}
export const Filter: React.FC<Props> = ({ onSubmit,onCloseForm }) => {
    return <>
        <form onSubmit={onSubmit}>
            <label htmlFor='from-select'>From:</label>
            <select defaultValue='all' id='from'>
                <option value='all'>All</option>
                <option value='own' >Own</option>
                <option value='favorites' >Favorites</option>
            </select>
            <label htmlFor='language'>Language:</label>
            <select id='language' >
                {data.map(lang => <option key={lang.code} value={lang.code}>{lang.code}</option>)}
            </select>
            <label htmlFor='level'>Level:</label>
            <select id='level'>
                {levels.map(level => <option key={level.code} value={level.code}>{level.code}</option>)}
            </select>
            <label>OpenEnded:</label>
            <label>Yes</label>
            <input name="open" type="radio" value="true"/>
            <label>No</label>
            <input name="open" type="radio" value="false"/>
            
            <button type="submit">
                Submit
            </button>
        </form>
        <button onClick={onCloseForm}>Cancel</button>
    </>
}