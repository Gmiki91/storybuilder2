type OptionObj = {
    text: string,
    value: string,
}
type Props = {
    options: OptionObj[],
    selectChanged:(event:React.ChangeEvent<HTMLSelectElement>)=>void,
}

export const SortBy: React.FC<Props> = ({ options, selectChanged }) => <>
    <label>Sort by</label>
        <select onChange={selectChanged}>
            {options.map(option => <option key={option.value} value={option.value}>{option.text}</option>)}
        </select>
    </>
