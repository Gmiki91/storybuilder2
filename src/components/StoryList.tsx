import { StoryCard } from "./StoryCard";
import { Story } from "models/Story";
import { useNavigate } from "react-router-dom";

type Props = {
    stories: Story[];
    favoriteIds: string[];
    removeFromFavorites:(storyId:string)=>void;
    addToFavorites:(storyId:string)=>void;
}

export const StoryList: React.FC<Props> = ({ stories, favoriteIds, addToFavorites, removeFromFavorites }) => {
    console.log('[StoryList] render');
    const navigate = useNavigate();
    return <>
        {stories.map(story =>
            <StoryCard
                favorite={favoriteIds.includes(story._id)}
                addToFavorites={()=>addToFavorites(story._id)}
                removeFromFavorites={()=>removeFromFavorites(story._id)}
                story={story}
                key={story._id}
                onClick={() => navigate(`/${story._id}`)}
            />
        )}
    </>
}