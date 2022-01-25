type Props = {
    color:string,
    currentCriteria:string,
    criteriaChanged: (value: string) => void,
}

export const SortBy: React.FC<Props> = ({ color,currentCriteria, criteriaChanged }) =>{
    const style = {color};
    return<>
    <label>Sort by</label>
    <div style={style} onClick={() => criteriaChanged('title')}>Title</div>
    <div onClick={() => criteriaChanged('rating')}>Rating</div>
    <div onClick={() => criteriaChanged('updatedAt')}>Updated at</div>
</>
}