import axios from "axios";
import { useEffect, useState } from "react";
import { StoryList } from "components/StoryList";
import { Filter } from "components/modal/forms/Filter";
import { Trigger } from "components/modal/Trigger";
import { Modal } from "components/modal/Modal";
import { LOCAL_HOST } from "constants/constants";
import { useAuth } from "context/AuthContext";
import { Story } from "models/Story";
import { SortBy } from "components/SortBy";

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
    const {token} = useAuth();
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
    const [showModal, setShowModal] = useState(false);
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
    const [loading, isLoading] = useState(false);

    useEffect(() => {
        if (token)
            axios.get(`${LOCAL_HOST}/users/favorites`, { headers }).then(result => setFavoriteIds(result.data.data))
    }, [token]);

    useEffect(() => {
        isLoading(true);
        axios.post(`${LOCAL_HOST}/stories/all`, searchCriteria)
            .then(result => {
                setStories(result.data.data);
                setShowModal(false);
                isLoading(false);
            });
    }, [filters]);

    useEffect(() => {
        let timeOut: NodeJS.Timeout;
        if (searchCriteria.storyName.length > 2) {
            timeOut = setTimeout(() => applyFilters(prevState => !prevState), 1000);
        }
        return () => clearTimeout(timeOut);
    }, [searchCriteria.storyName])

    const handleSort = (sortValue: string) => {
        if (searchCriteria.sortBy === sortValue) {
            setSearchCriteria(prevState => ({ ...prevState, sortDirection: -searchCriteria.sortDirection }));
        } else {
            setSearchCriteria(prevState => ({ ...prevState, sortBy: sortValue }));
        }
        applyFilters(prevState => !prevState);
    }


    const handleStoryNameSearch = (name: string) => {
        if (name.length < 3 && searchCriteria.storyName.length >= 3) {
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


    return loading ? <div>loading...</div>
        : <>
            <input placeholder="Search by story title" value={searchCriteria.storyName} onChange={(e) => handleStoryNameSearch(e.target.value)} />
            {showModal &&
                <Modal closeModal={() => setShowModal(false)}>
                    <Filter
                        onCloseForm={() => setShowModal(false)}
                        onApply={() => applyFilters(prevState => !prevState)}
                        filters={searchCriteria}
                        changeFilter={(changes) => setSearchCriteria(prevState => ({ ...prevState, ...changes }))} />
                </Modal>}
            <br></br>
            <SortBy
                color={searchCriteria.sortDirection === 1 ? 'green' : 'red'}
                currentCriteria={searchCriteria.sortBy}
                criteriaChanged={(value) => handleSort(value)} />
            <Trigger text={'Filter'} onClick={() => setShowModal(true)} />
            {stories.length > 0 ?

                <StoryList
                    addToFavorites={addToFavorites}
                    removeFromFavorites={removeFromFavorites}
                    stories={stories}
                    favoriteIds={favoriteIds} />
                : <div>No stories yet for your search criteria.</div>}
        </>
};
export default Home;
