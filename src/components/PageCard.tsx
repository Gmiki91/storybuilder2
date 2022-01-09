import { Page } from "../models/Page"

export const PageCard = (props: { page: Page }) => {
    return <>
      <p>{props.page.level}</p>
      {props.page.text}
      <button>rate</button>
      <button>translatiosn</button>
    </>
  }