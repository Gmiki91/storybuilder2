import { Story } from "models/Story"

type Props = {
    story: Story,
    favorite: boolean,
    onClick: () => void,
    removeFromFavorites:()=>void,
    addToFavorites:()=>void
}

export const StoryCard: React.FC<Props> = ({ story, favorite, onClick, removeFromFavorites, addToFavorites }) => {
    return <div>
        <div onClick={onClick}>
            {story.title} {story.language}:{story.level} {story.updatedAt.toString().slice(14, 19)} {story.rating}
        </div>
        {favorite ? <button onClick={removeFromFavorites}>Remove from favorite</button>: <button onClick={addToFavorites}>Add to favorites</button>}
        {story.pendingPageIds.length > 0 && <div>Pending items: {story.pendingPageIds.length}</div>}
    </div>
}