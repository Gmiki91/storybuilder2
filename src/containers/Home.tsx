import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StoryList } from "components/StoryList";
import { Filter } from "components/modal/forms/Filter";
import { NewStory } from "components/modal/forms/NewStory";
import { FormTypes } from "components/modal/forms/FormTypes";
import { Trigger } from "components/modal/Trigger";
import { Modal } from "components/modal/Modal";
import { LOCAL_HOST } from "constants/constants";
import { useAuth } from "context/AuthContext";
import { Story } from "models/Story";

type ListModifications = {
    sortBy: string,
    sortDirection: number,
    from: string,
    languages: string[],
    levels: string[],
    openEnded: string;
}

const Home: React.FC = () => {
    const isAuthenticated = useAuth().authToken !== '';
    const navigate = useNavigate();
    console.log('[HOME] render')
    const [listModifications, setListModifications] = useState<ListModifications>({
        sortBy: 'rating',
        sortDirection: 1,
        from: 'all',
        languages: [],
        levels: [],
        openEnded: 'both'
    });
    const [stories, setStories] = useState<Story[]>([]);
    const [,applyFilters] = useState(false);
    const [formType, setFormType] = useState<FormTypes>('');

    const getSortedList = useCallback(() => {
        axios.post<Story[]>(`${LOCAL_HOST}/stories/all`, listModifications)
            .then(result => {
                setStories(result.data);
                setFormType('');
            });
    }, [ listModifications]);

    useEffect(() => {
        getSortedList();
    }, [getSortedList]);

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const story = {
            title: form.titel.value,
            description: form.description.value,
            language: form.language.value,
            level: form.level.value,
        }
        const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
        const storyId = await axios.post<string>(`${LOCAL_HOST}/stories/`, story, { headers }).then((result) => result.data);
        await axios.put(`${LOCAL_HOST}/users/`, { storyId }, { headers });
        getSortedList();

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
        switch (formType) {
            case 'filter':
                return <Filter
                    onCloseForm={() => setFormType('')}
                    onApply={() => applyFilters(prevState => !prevState)}
                    filters={listModifications}
                    changeFilter={(changes) => setListModifications(prevState => ({ ...prevState, ...changes }))} />
            case 'newStory':
                return <NewStory
                    onCloseForm={() => setFormType('')}
                    onSubmit={handleFormSubmit} />
            default:
                return null;
        }
    }

    const form = getForm();

    return <>
        <Trigger text={'Create new story'} onClick={() => { isAuthenticated ? setFormType('newStory') : navigate(`/login`) }} />
        <Trigger text={'Filter'} onClick={() => setFormType('filter')} />
        {formType !== '' &&
            <Modal closeModal={() => setFormType('')}>
                {form}
            </Modal>}
        <br></br>
        {stories.length > 0 ?
            <StoryList
                stories={stories}
                handleSortDirection={handleSortDirection}
                handleSortBy={handleSortBy} />
            : <div>loading</div>}
    </>
};
export default Home;
