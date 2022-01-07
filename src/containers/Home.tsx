import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import StoryPage from "./StoryPage";
import ModalWrapper from "../components/modal/ModalWrapper";
import Trigger from "../components/modal/Trigger";
import StoryList from "../components/StoryList";
import { StorySummary } from "../components/StorySummary";
import { FormTypes } from "../components/forms/FormTypes";

const Home: React.FC = () => {
    console.log('[HOME] render')
    const [storyId, setStoryId] = useState<string>();
    const [stories, setStories] = useState<StorySummary[]>([]);
    const [sortBy, setSortBy] = useState<string>('rating');
    const [sortDirection, setSortDirection] = useState<number>(1);
    const [modalForm, setModalForm] = useState<FormTypes>('');

    const getSortedList = useCallback(() => {
        axios.get<StorySummary[]>(`${process.env.REACT_APP_LOCAL_HOST}stories/${sortBy}/${sortDirection}`)
            .then(result => setStories(result.data));
    }, [stories]);

    useEffect(() => {
        getSortedList();
    }, [sortBy, sortDirection]);

    const storyClicked = (storyId: string) => {
        setStoryId(storyId);
    }
    const createNewStory = (event: React.FormEvent<HTMLFormElement>) => {
        const form = event.currentTarget;
        const story = {
            title: form.titel.value,
            description: form.description.value,
            language: form.language.value,
            targetLevel: form.level.value,
        }
        axios.post(`${process.env.REACT_APP_LOCAL_HOST}stories/`, story).then(() => getSortedList());
        setModalForm('');
    }
    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        switch (modalForm) {
            case 'filter':
                break;
            case 'newStory': createNewStory(event);
                break;
            default: return null;
        }
    }

    const list = <>
        <Trigger text={'Create new story'} onClick={() => setModalForm('newStory')} />
        <Trigger text={'Filter'} onClick={() => setModalForm('filter')} />
        <ModalWrapper
            form={modalForm}
            onSubmit={handleFormSubmit}
            onClose={() => setModalForm('')}>
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
