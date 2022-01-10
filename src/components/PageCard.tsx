import './PageCard.css'
import { Page } from "../models/Page"
type Props = {
  page:Page
}
export const PageCard:React.FC<Props> = ({ page }) => {
  const getColor = () => {
    switch (page.level) {
      case 'A': return '#8fffba';
      case 'B': return '#fffc80';
      case 'C': return '#ff8080';
      case 'N': return '#d6d6d6';
    }
  }
  const backgroundColor = getColor();
  console.log(backgroundColor);

  return <>
    <div className="card">
      <div className="card-level" style={{ backgroundColor: backgroundColor }}>{page.level}</div>
      <h2 className="card-text">{page.text}</h2>
      <div className="card-rate">
        <button>Rate</button>
      </div>
      <div className="card-tranlations">
        <button>Translations</button>
      </div>
    </div>
  </>
}