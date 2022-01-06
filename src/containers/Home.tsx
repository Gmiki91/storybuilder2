import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import StoryPage from "./StoryPage";
import ModalWrapper from "../components/modal/ModalWrapper";
import { NewStoryForm } from "../components/forms/NewStoryForm";
import Trigger from "../components/modal/Trigger";
import StoryList from "../components/StoryList";
import { StorySummary } from "../components/StorySummary";

const Home: React.FC = () => {
    console.log('[HOME] render')
    const [storyId, setStoryId] = useState<string>();
    const [stories, setStories] = useState<StorySummary[]>([]);
    const [sortBy, setSortBy] = useState<string>('rating');
    const [sortDirection, setSortDirection] = useState<number>(1);
    const [showModal, setShowModal] = useState(false);

    const getSortedList = useCallback(() => {
        axios.get<StorySummary[]>(`${process.env.REACT_APP_LOCAL_HOST}stories/${sortBy}/${sortDirection}`)
        .then( result => setStories(result.data));
    }, [sortBy, sortDirection]);

    useEffect(() => {
        getSortedList();
    }, []);

    const storyClicked = (storyId: string) => {
        setStoryId(storyId);
    }

    const toggleModal = () => {
        setShowModal(prevState => !prevState);
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
        axios.post(`${process.env.REACT_APP_LOCAL_HOST}stories/`, story).then(() => getSortedList());
        toggleModal();
    }

    const list = <>
        <Trigger text={'Create new story'} toggleModal={toggleModal} />
        <ModalWrapper
            visibility={showModal}
            toggleModal={toggleModal}>
            <NewStoryForm onSubmit={createNewStory} />
        </ModalWrapper>
        <br></br>
        <StoryList
            stories={stories}
            storyClicked={storyClicked}
            handleSortDirection={setSortDirection}
            handleSortBy={setSortBy} />

    </>
    const content = storyId ? <StoryPage id={storyId} /> : list;
    return content;
};
export default Home;
