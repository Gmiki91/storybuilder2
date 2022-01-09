import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { StoryList } from "../components/StoryList";
import { StorySummary } from "../models/StorySummary";
import { Filter } from "../components/forms/Filter";
import { NewStoryForm } from "../components/forms/NewStoryForm";
import { FormTypes } from "../components/forms/FormTypes";
import { Trigger } from "../components/modal/Trigger";
import { Modal } from "../components/modal/Modal";
import StoryPage from "./StoryPage";

type ListModifications = {
    sortBy: string,
    sortDirection: number,
    from: string,
    languages: string[],
    levels: string[],
    openEnded: string;
}

const Home: React.FC = () => {
    console.log('[HOME] render')
    const [listModifications, setListModifications] = useState<ListModifications>({
        sortBy: 'rating',
        sortDirection: 1,
        from: 'all',
        languages: [],
        levels: [],
        openEnded: 'both'
    });
    const [storyId, setStoryId] = useState<string>();
    const [stories, setStories] = useState<StorySummary[]>([]);
    const [filters, applyFilters] = useState(false);
    const [form, setForm] = useState<FormTypes>('');

    const getSortedList = useCallback(() => {
        axios.post<StorySummary[]>(`${process.env.REACT_APP_LOCAL_HOST}stories/modifiedList`, listModifications)
            .then(result => {
                setStories(result.data);
                setForm('');
            });
    }, [filters]);

    useEffect(() => {
        getSortedList();
    }, [getSortedList]);

    const storyClicked = (storyId: string) => {
        //axios.delete(`${process.env.REACT_APP_LOCAL_HOST}stories/${storyId}`).then(() => getSortedList());
        setStoryId(storyId);
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
        });
    }

    const handleSortDirection = (direction: number) => {
        setListModifications(prevState => ({ ...prevState, sortDirection: direction }));
        applyFilters(prevState => !prevState);
    }

    const handleSortBy = (property: string) => {
        setListModifications(prevState => ({ ...prevState, sortBy: property }));
        applyFilters(prevState => !prevState);
    }

    const getForm = () => {
        switch (form) {
            case 'filter':
                return <Filter
                    onCloseForm={() => setForm('')}
                    onApply={() => applyFilters(prevState => !prevState)}
                    filters={listModifications}
                    changeFilter={(changes) => setListModifications(prevState => ({ ...prevState, ...changes }))} />
            case 'newStory':
                return <NewStoryForm
                    onCloseForm={() => setForm('')}
                    onSubmit={handleFormSubmit} />
            default:
                return null;
        }
    }

    const modalChild = getForm();

    const list = <>
        <Trigger text={'Create new story'} onClick={() => { setForm('newStory') }} />
        <Trigger text={'Filter'} onClick={() => { setForm('filter') }} />
        {form !== '' ?
            <Modal closeModal={() => setForm('')}>
                {modalChild}
            </Modal> : null}
        <br></br>
        {stories.length > 0 ?
            <StoryList
                stories={stories}
                storyClicked={storyClicked}
                handleSortDirection={handleSortDirection}
                handleSortBy={handleSortBy} />
            : <div>loading</div>}
    </>
    const content = storyId ? <StoryPage id={storyId} /> : list;
    return content;
};
export default Home;
