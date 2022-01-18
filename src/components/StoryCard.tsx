import axios from "axios"
import { LOCAL_HOST } from "constants/constants"
import { Story } from "models/Story"

type Props = {
    story: Story,
    favorite: boolean,
    onClick: () => void,
    handlePendingList: () => void,
}

export const StoryCard: React.FC<Props> = ({ story, favorite, onClick, handlePendingList }) => {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    const addToFavorites = () => {
        axios.post(`${LOCAL_HOST}/users/favorites`, { storyId: story._id }, { headers })
    }
    const removeFromFavorites = () =>{
        axios.put(`${LOCAL_HOST}/users/favorites`, { storyId: story._id }, { headers })
    }
    return <div>
        <div onClick={onClick}>
            {story.title} {story.language}:{story.level} {story.updatedAt.toString().slice(14, 19)} {story.rating}
        </div>
        {favorite ? <button onClick={removeFromFavorites}>Remove from favorite</button>: <button onClick={addToFavorites}>Add to favorites</button>}
        {story.pendingPageIds.length > 0 && <button onClick={handlePendingList}>Pending items: {story.pendingPageIds.length}</button>}
    </div>
}