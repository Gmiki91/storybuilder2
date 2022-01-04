import { useEffect, useState } from "react";
import axios from "axios";
import StoryPage from "./StoryPage";
import { Level } from "../models/LanguageLevel";

type StorySummary = {
    _id: string;
    title: string;
    description: string;
    language: string;
    level: Level,
    lastUpdated: Date;
    rating: number;
}

const Home: React.FC = () => {
    const [stories, setStories] = useState<StorySummary[]>([]);
    const [storyId, setStoryId] = useState<string>();

    useEffect(() => {
        axios.get<StorySummary[]>(`${process.env.REACT_APP_LOCAL_HOST}stories/all`).then(result => setStories(result.data));
    }, []);

    const storyClicked = (storyId: string) => {
        setStoryId(storyId);
    }

    const createNewStory = () => {
        axios.post(`${process.env.REACT_APP_LOCAL_HOST}stories/`).then(result => console.log(result));
    }

    const mainContent = <>
        <button onClick={createNewStory}>Create new story</button>
        {stories.map(story => <div
            key={story._id}
            onClick={() => storyClicked(story._id)}
        >{story.title}</div>)}
    </>

    const content = (<>
        {storyId ? <StoryPage id={storyId} />
            : mainContent}</>);

    return content;
};
export default Home;
