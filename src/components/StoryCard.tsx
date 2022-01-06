import { StorySummary } from "./StorySummary"

type Props={
    onClick: ()=>void,
    story:StorySummary
}

export const StoryCard:React.FC<Props>=({onClick, story})=>{
    return <div onClick={onClick}>{story.title} {story.language}:{story.level} {story.updatedAt.toString().slice(14,19)} {story.rating} </div>
}