import axios from "axios";
import { useEffect, useState } from "react";
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

type SearchCriteria = {
    storyName: string,
    sortBy: string,
    sortDirection: number,
    from: string,
    languages: string[],
    levels: string[],
    openEnded: string;
}

const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
const Home: React.FC = () => {
    console.log('[HOME] render');
    const token = useAuth().authToken;
    const isAuthenticated = token !== '';
    const navigate = useNavigate();
    const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
        storyName: '',
        sortBy: 'rating',
        sortDirection: 1,
        from: 'all',
        languages: [],
        levels: [],
        openEnded: 'both'
    });
    const [stories, setStories] = useState<Story[]>([]);
    const [filters, applyFilters] = useState(false);
    const [formType, setFormType] = useState<FormTypes>('');
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

    useEffect(() => {
        if (isAuthenticated)
            axios.get(`${LOCAL_HOST}/users/favorites`, { headers }).then(result => setFavoriteIds(result.data.data))
    }, [isAuthenticated]);

    useEffect(() => {
        axios.post(`${LOCAL_HOST}/stories/all`, searchCriteria)
            .then(result => {
                setStories(result.data.data);
                setFormType('');
            });
    }, [filters]);

    useEffect(() => {
        let timeOut: NodeJS.Timeout;
        if (searchCriteria.storyName.length > 2) {
            timeOut = setTimeout(() => applyFilters(prevState => !prevState), 1000);
        }
        return () => clearTimeout(timeOut);
    }, [searchCriteria.storyName])

    const handleNewStory = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const story = {
            title: form.titel.value,
            description: form.description.value,
            language: form.language.value,
            level: form.level.value,
        }
        const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
        axios.post(`${LOCAL_HOST}/stories/`, story, { headers }).then((result) => setStories(prevState => [...prevState, result.data.story]));
        setFormType('');
    }

    const handleSort = (sort: number|string) => {
        if(typeof sort === 'string') setSearchCriteria(prevState => ({ ...prevState, sortBy: sort }));
        else setSearchCriteria(prevState => ({ ...prevState, sortDirection: sort }));

        applyFilters(prevState => !prevState);
    }


    const handleStoryNameSearch = (name: string) => {
        if(name.length<3 && searchCriteria.storyName.length >=3){
            applyFilters(prevState => !prevState);
        }
        setSearchCriteria(prevState => ({ ...prevState, storyName: name }));
    }

    const addToFavorites = (storyId: string) => {
        setFavoriteIds(prevState => ([...prevState, storyId]))
        axios.post(`${LOCAL_HOST}/users/favorites`, { storyId }, { headers });
    }
    const removeFromFavorites = (storyId: string) => {
        const newList = [...favoriteIds];
        const index = newList.indexOf(storyId);
        newList.splice(index, 1);
        setFavoriteIds(newList);
        axios.put(`${LOCAL_HOST}/users/favorites`, { storyId }, { headers });
    }

    const getForm = () => {
        switch (formType) {
            case 'filter':
                return <Filter
                    onCloseForm={() => setFormType('')}
                    onApply={() => applyFilters(prevState => !prevState)}
                    filters={searchCriteria}
                    changeFilter={(changes) => setSearchCriteria(prevState => ({ ...prevState, ...changes }))} />
            case 'newStory':
                return <NewStory
                    onCloseForm={() => setFormType('')}
                    onSubmit={handleNewStory} />
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
        <input placeholder="Search by story title" value={searchCriteria.storyName} onChange={(e) => handleStoryNameSearch(e.target.value)} />
        {stories.length > 0 ?
            <StoryList
                addToFavorites={addToFavorites}
                removeFromFavorites={removeFromFavorites}
                stories={stories}
                favoriteIds={favoriteIds}
                handleSort={handleSort} />
            : <div>loading</div>}
    </>
};
export default Home;
