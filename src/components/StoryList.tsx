import { SortBy } from "./SortBy";
import { StoryCard } from "./StoryCard";
import { Story } from "models/Story";
import { useNavigate } from "react-router-dom";

type Props = {
    stories: Story[];
    favoriteIds: string[];
    handleSortBy: (sortBy: string) => void;
    handleSortDirection: (sortDirection: number) => void;
    removeFromFavorites:(storyId:string)=>void;
    addToFavorites:(storyId:string)=>void;
}

export const StoryList: React.FC<Props> = ({ stories, favoriteIds, handleSortBy, handleSortDirection, addToFavorites, removeFromFavorites }) => {
    console.log('[StoryList] render');
    const navigate = useNavigate();
    return <>
        <SortBy
            options={[
                { text: 'Rating', value: 'rating' },
                { text: 'Updated at', value: 'updatedAt' },
                { text: 'Title', value: 'title' },
            ]}
            selectChanged={(e) => handleSortBy(e.target.value)} />
        <img style={{ width: '20px', height: '20px' }} src={require(`../assets/uparrow.png`)} alt="uparrow" onClick={() => handleSortDirection(1)} />
        <img style={{ width: '20px', height: '20px' }} src={require(`../assets/downarrow.png`)} alt="downarrow" onClick={() => handleSortDirection(-1)} />
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