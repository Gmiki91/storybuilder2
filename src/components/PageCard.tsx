import './PageCard.css'
import { Page } from "../models/Page"
type Props = {
  page:Page;
  toConfirm:boolean;
  onRateLevel : ()=>void;
  onRateText : (rate:number, confirming:boolean)=>void;
}
export const PageCard:React.FC<Props> = ({ page,toConfirm,onRateLevel,onRateText }) => {
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
 
  const positiveBtn = toConfirm ? 'Accept' : 'Great';
  const negativeBtn = toConfirm ? 'Decline' : 'Awful';

  return <>
    <div className="card">
      <div className="card-level" style={{ backgroundColor: backgroundColor }} onClick={onRateLevel}>
        {page.level}</div>
      <h2 className="card-text">{page.text}</h2>
      <div className="card-rate">
        <button onClick={()=>onRateText(1, toConfirm)}>{positiveBtn}</button>
        <button onClick={()=>onRateText(-1, toConfirm)}>{negativeBtn}</button>
      </div>
    </div>
  </>
}