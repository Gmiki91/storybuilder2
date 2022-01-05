import { useEffect, useState } from "react";
import axios from "axios";
import StoryPage from "./StoryPage";
import ModalWrapper from "../components/Modal/ModalWrapper";
import { Level } from "../models/LanguageLevel";
import { Form } from "../components/Form";
import Trigger from "../components/Modal/Trigger";

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
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        axios.get<StorySummary[]>(`${process.env.REACT_APP_LOCAL_HOST}stories/all`).then(result => setStories(result.data));
    }, []);

    const storyClicked = (storyId: string) => {
        setStoryId(storyId);
    }

    const toggleModal = () =>{
        setShowModal(prevState => !prevState)
    }

    const createNewStory = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const story = {
            title: form.titel.value,
            description: form.description.value,
            language: form.language.value,
            targetLevel: form.level.value,
        }
        axios.post(`${process.env.REACT_APP_LOCAL_HOST}stories/`, story).then(result => console.log(result));
        toggleModal();
    }

    const mainContent = <>
     <Trigger text={'Create new story' } toggleModal={toggleModal} />
        <ModalWrapper 
        visibility={showModal} 
        toggleModal={toggleModal}>
            <Form onSubmit={createNewStory} />
        </ModalWrapper>
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
