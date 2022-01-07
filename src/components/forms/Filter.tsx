import { useState } from 'react';
import { levels } from '../../models/LanguageLevel';
import data from '../../assets/languages.json';
import './Form.css'

type Props = {
    onSubmit: (event: React.FormEvent<HTMLFormElement>, lvls:string[], langs:string[]) => void;
    onCloseForm: () => void;
}
export const Filter: React.FC<Props> = ({ onSubmit, onCloseForm }) => {
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [selectedLevels, setSelectedLevels] = useState<string[]>([]);

    const handleSelectLanguages = (option: HTMLCollectionOf<HTMLOptionElement>) => {
        const value = option[0].value;
        if (!selectedLanguages.includes(value))
            setSelectedLanguages(prevState => ([...prevState, option[0].value]));
    }

    const handleSelectLevels = (option: HTMLCollectionOf<HTMLOptionElement>) => {
        const value = option[0].value;
        if (!selectedLevels.includes(value)) setSelectedLevels(prevState => ([...prevState, option[0].value]));
    }

    const handleRemoveLanguage = (lang: string) => {
        const arr = [...selectedLanguages];
        const index = arr.findIndex(e => e === lang);
        arr.splice(index, 1);
        setSelectedLanguages([...arr]);
    }

    const handleRemoveLevels = (lvl: string) => {
        const arr = [...selectedLevels];
        const index = arr.findIndex(e => e === lvl);
        arr.splice(index, 1);
        setSelectedLevels([...arr]);
    }

    const onSubmitForm = (event:React.FormEvent<HTMLFormElement>)=>{
        onSubmit(event, selectedLevels, selectedLanguages);
    }

    return <>
        <form className="form-box" onSubmit={onSubmitForm}>
            <label>Selected languages:</label>
            {selectedLanguages.map(lang => <div key={lang} onClick={() => handleRemoveLanguage(lang)}>{lang}</div>)}
            <select onChange={(e) => { handleSelectLanguages(e.target.selectedOptions) }} id='languages' >
                <option />
                {data.map(lang => <option key={lang.code} value={lang.name}>{lang.name}</option>)}
            </select>

            <label>Selected levels:</label>
            {selectedLevels.map(lvl => <div key={lvl} onClick={() => handleRemoveLevels(lvl)}>{lvl}</div>)}
            <select onChange={(e) => { handleSelectLevels(e.target.selectedOptions) }} id='level'>
            <option />
                {levels.map(level => <option key={level.code} value={level.code}>{level.code} - {level.text}</option>)}
            </select>

            <div >
                <label>Open for new submissions:</label>
                <div className='options'>
                    <div><input name="openEnded" type="radio" value="true" /> Yes</div>
                    <div><input name="openEnded" type="radio" value="false" /> No</div>
                    <div><input name="openEnded" type="radio" value="both" defaultChecked /> Both</div>
                </div>
            </div>

            <div >
                <label>Stories:</label>
                <div className='options'>
                    <div><input name="from" type="radio" value="own" />Own</div>
                    <div><input name="from" type="radio" value="favorite" />Favorites</div>
                    <div><input name="from" type="radio" value="all" defaultChecked />All</div>
                </div>
            </div>
            <div className='button-container'>
                <button onClick={onCloseForm}>Cancel</button>
                <button type="submit">Submit</button>
            </div>
        </form>
    </>
}