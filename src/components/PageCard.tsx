import './PageCard.css'
import { Page } from "../models/Page"
type Props = {
  page:Page;
  onRateLevel : ()=>void;
  onRateText : (rate:number)=>void;
}
export const PageCard:React.FC<Props> = ({ page,onRateLevel,onRateText }) => {
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

  return <>
    <div className="card">
      <div className="card-level" style={{ backgroundColor: backgroundColor }} onClick={onRateLevel}>{page.level}</div>
      <h2 className="card-text">{page.text}</h2>
      <div className="card-rate">
        <button onClick={()=>onRateText(1)}>Great</button>
        <button onClick={()=>onRateText(-1)}>Awful</button>
      </div>
     
    </div>
  </>
}