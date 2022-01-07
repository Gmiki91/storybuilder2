import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import StoryPage from "./StoryPage";
import ModalWrapper from "../components/modal/ModalWrapper";
import Trigger from "../components/modal/Trigger";
import StoryList from "../components/StoryList";
import { StorySummary } from "../components/StorySummary";
import { FormTypes } from "../components/forms/FormTypes";

type ListModifications = {
    sortBy: string,
    sortDirection: number,
    from: string,
    languages: string[],
    level: string[],
    openEnded: string;
}

const Home: React.FC = () => {
    console.log('[HOME] render')
    const [listModifications, setListModifications] = useState<ListModifications>({
        sortBy: 'rating',
        sortDirection: 1,
        from: 'all',
        languages: [],
        level: [],
        openEnded: 'both'
    });
    const [storyId, setStoryId] = useState<string>();
    const [stories, setStories] = useState<StorySummary[]>([]);
    const [modalForm, setModalForm] = useState<FormTypes>('');

    const getSortedList = useCallback(() => {
        axios.post<StorySummary[]>(`${process.env.REACT_APP_LOCAL_HOST}stories/modifiedList`, listModifications)
            .then(result => setStories(result.data));
    }, [stories]);

    useEffect(() => {
        getSortedList();
    }, [listModifications]);

    const storyClicked = (storyId: string) => {
        axios.delete(`${process.env.REACT_APP_LOCAL_HOST}stories/${storyId}`).then(() => getSortedList());
        // setStoryId(storyId);
    }

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const story = {
            title: form.titel.value,
            description: form.description.value,
            language: form.language.value,
            targetLevel: form.level.value,
        }
        axios.post(`${process.env.REACT_APP_LOCAL_HOST}stories/`, story).then(() => {
            getSortedList();
            setModalForm('');
        });
    }

    const handleFilter = (event: React.FormEvent<HTMLFormElement>, lvls: string[], langs: string[]) => {
        event.preventDefault();
        const form = event.currentTarget;
        console.log(lvls);
        console.log(langs);
        setListModifications(prevState => ({
            ...prevState,
            from: form.from.value,
            languages: langs,
            level: lvls,
            openEnded: form.openEnded.value
        }));
        getSortedList();
        setModalForm('');
    }

    const list = <>
        <Trigger text={'Create new story'} onClick={() => setModalForm('newStory')} />
        <Trigger text={'Filter'} onClick={() => setModalForm('filter')} />
        <ModalWrapper
            form={modalForm}
            onNewStory={handleFormSubmit}
            onFilter={handleFilter}
            onClose={() => setModalForm('')}>
        </ModalWrapper>
        <br></br>
        <StoryList
            stories={stories}
            storyClicked={storyClicked}
            handleSortDirection={(e) => setListModifications(prevState => ({ ...prevState, sortDirection: e }))}
            handleSortBy={(e) => setListModifications(prevState => ({ ...prevState, sortBy: e }))} />
    </>
    const content = storyId ? <StoryPage id={storyId} /> : list;
    return content;
};
export default Home;
