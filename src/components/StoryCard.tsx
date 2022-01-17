import { Story } from "models/Story"

type Props = {
    onClick: () => void,
    handlePendingList : ()=>void,
    story: Story
}

export const StoryCard: React.FC<Props> = ({ onClick,handlePendingList, story }) => <div>
    <div onClick={onClick}>
        {story.title} {story.language}:{story.level} {story.updatedAt.toString().slice(14, 19)} {story.rating}
    </div>
    {story.pendingPageIds.length>0 && <button onClick={handlePendingList}>Pending items: {story.pendingPageIds.length}</button>}
</div>
