import { levels } from '../../models/LanguageLevel';
import data from '../../assets/languages.json';
import './Form.css'

export type FilterTypes = {
    from: string,
    languages: string[],
    levels: string[],
    openEnded: string;
}

type Props = {
    onApply: () => void;
    onCloseForm: () => void;
    filters: FilterTypes;
    changeFilter: (change: FilterTypes) => void;
}

export const Filter: React.FC<Props> = ({ filters, changeFilter, onApply, onCloseForm }) => {

    const handleChange = (filter: 'levels' | 'languages', value: string) => {
        const originalValues = [...filters[filter]];
        if (!originalValues.includes(value)) {
            originalValues.push(value);
            const updatedFilters = { ...filters };
            updatedFilters[filter] = originalValues;
            changeFilter(updatedFilters);
        }
    }
    const handleRemoveFilter = (filter: 'languages' | 'levels', value: string) => {
        const arr = [...filters[filter]];
        const index = arr.findIndex(e => e === value);
        arr.splice(index, 1);
        const updatedFilters = { ...filters };
        updatedFilters[filter] = arr;
        changeFilter(updatedFilters);
    }

    return <>
        <div className="form-box" >
            <label>Selected languages:</label>
            {filters.languages.map(lang => <div key={lang} onClick={() => handleRemoveFilter('languages', lang)}>{lang}</div>)}
            <select onChange={(e) => { handleChange('languages', e.target.selectedOptions[0].value) }} id='languages' >
                <option />
                {data.map(lang => <option key={lang.code} value={lang.name}>{lang.name}</option>)}
            </select>

            <label>Selected levels:</label>
            {filters.levels.map(lvl => <div key={lvl} onClick={() => handleRemoveFilter('levels', lvl)}>{lvl}</div>)}
            <select onChange={(e) => { handleChange('levels', e.target.selectedOptions[0].value) }} id='level'>
                <option />
                {levels.map(level => <option key={level.code} value={level.code}>{level.code} - {level.text}</option>)}
            </select>

            <div >
                <label>Open for new submissions:</label>
                <div className='options'>
                    <div><input name="openEnded" type="radio" value="true" onChange={() => changeFilter({ ...filters, openEnded: 'true' })} /> Yes</div>
                    <div><input name="openEnded" type="radio" value="false" onChange={() => changeFilter({ ...filters, openEnded: 'false' })} /> No</div>
                    <div><input name="openEnded" type="radio" value="both" onChange={() => changeFilter({ ...filters, openEnded: 'both' })} defaultChecked /> Both</div>
                </div>
            </div>

            <div >
                <label>Stories:</label>
                <div className='options'>
                    <div><input name="from" type="radio" value="own" onChange={() => changeFilter({ ...filters, from: 'own' })} />Own</div>
                    <div><input name="from" type="radio" value="favorite" onChange={() => changeFilter({ ...filters, from: 'favorite' })} />Favorites</div>
                    <div><input name="from" type="radio" value="all" onChange={() => changeFilter({ ...filters, from: 'all' })} defaultChecked />All</div>
                </div>
            </div>

            <div className='button-container'>
                <button onClick={onCloseForm}>Cancel</button>
                <button onClick={onApply}>Apply</button>
            </div>
        </div>
    </>
}