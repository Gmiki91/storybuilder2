import './PageCard.css'
import { Page } from "../models/Page"
type Props = {
  page:Page;
  pending:boolean;
  onRateLevel : ()=>void;
  onRateText : (rate:number)=>void;
}
export const PageCard:React.FC<Props> = ({ page,pending,onRateLevel,onRateText }) => {
  const getColor = () => {
    switch (page.level) {
      case 'A': return '#8fffba';
      case 'A+':return '#5fd48c';
      case 'B': return '#fffc80';
      case 'B+': return '#ffba3b';
      case 'C': return '#ff8080';
      case 'N': return '#d6d6d6';
    }
  }
  const backgroundColor = getColor();
  const positiveBtn = pending ? 'Accept' : 'Great';
  const negativeBtn = pending ? 'Decline' : 'Awful';

  return <>
    <div className="card">
      <div className="card-level" style={{ backgroundColor: backgroundColor }} onClick={onRateLevel}>
        {page.level}</div>
      <h2 className="card-text">{page.text}</h2>
      <div className="card-rate">
        <button onClick={()=>onRateText(1)}>{positiveBtn}</button>
        <button onClick={()=>onRateText(-1)}>{negativeBtn}</button>
      </div>
    </div>
  </>
}