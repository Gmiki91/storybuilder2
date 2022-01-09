import { SortBy } from "./SortBy";
import { StoryCard } from "./StoryCard";
import { StorySummary } from "../models/StorySummary";

type Props = {
    stories: StorySummary[];
    storyClicked: (id: string) => void;
    handleSortBy:(sortBy:string)=>void;
    handleSortDirection:(sortDirection:number)=>void;
}

export const StoryList: React.FC<Props> = ({stories, storyClicked, handleSortBy, handleSortDirection }) => {
    console.log('[StoryList] render');
    return <>
        <SortBy
            options={[
                { text: 'Rating', value: 'rating' },
                { text: 'Updated at', value: 'updatedAt' },
                { text: 'Title', value: 'title' },
                
            ]}
            selectChanged={(e) => handleSortBy(e.target.value)}/>
        <img style={{ width: '20px', height: '20px' }} src={require(`../assets/uparrow.png`)} alt="uparrow" onClick={() => handleSortDirection(1)} />
        <img style={{ width: '20px', height: '20px' }} src={require(`../assets/downarrow.png`)} alt="downarrow" onClick={() => handleSortDirection(-1)} />
        {stories.map(story =>
            <StoryCard
                story={story}
                key={story._id}
                onClick={() => storyClicked(story._id)} />
        )}
    </>
}