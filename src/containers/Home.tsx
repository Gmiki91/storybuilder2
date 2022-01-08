import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import StoryPage from "./StoryPage";
import Trigger from "../components/modal/Trigger";
import StoryList from "../components/StoryList";
import { StorySummary } from "../components/StorySummary";
import { Filter } from "../components/forms/Filter";
import { NewStoryForm } from "../components/forms/NewStoryForm";
import { Modal } from "../components/modal/Modal";

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
    const [showModal, setShowModal] = useState(false);
    const [updatedFilter, setUpdatedFilter]=useState(false);
    const [form, setForm] = useState('');

    const getSortedList = useCallback(() => {
        axios.post<StorySummary[]>(`${process.env.REACT_APP_LOCAL_HOST}stories/modifiedList`, listModifications)
            .then(result => {
                setStories(result.data);
                setShowModal(false);
            });
    }, [updatedFilter]);

    useEffect(() => {
        getSortedList();
    }, [getSortedList]);

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
        });
    }

    const handleSortDirection = (direction:number) => {
        setListModifications(prevState => ({ ...prevState, sortDirection: direction }));
        setUpdatedFilter(prevState => !prevState);
    }

    const handleSortBy = (property:string) => {
        setListModifications(prevState => ({ ...prevState, sortBy: property }));
        setUpdatedFilter(prevState => !prevState);
    }

    const list = <>
        <Trigger text={'Create new story'} onClick={() => { setForm('newStory'); setShowModal(true); }} />
        <Trigger text={'Filter'} onClick={() => { setForm('filter'); setShowModal(true); }} />
        <Modal showModal={showModal} closeModal={() => setShowModal(prevState => !prevState)} >
            {form === 'newStory' ? <NewStoryForm
                onCloseForm={() => setShowModal(prevState => !prevState)}
                onSubmit={handleFormSubmit} /> : null}
            {form === 'filter' ? <Filter
                filters={listModifications}
                changeFilter={(changes) => setListModifications(prevState => ({ ...prevState, ...changes }))}
                onCloseForm={() => setShowModal(prevState => !prevState)}
                onSubmit={()=>setUpdatedFilter(prevState => !prevState)} /> : null}
        </Modal>
        <br></br>
        {stories.length>0?
        <StoryList
            stories={stories}
            storyClicked={storyClicked}
            handleSortDirection={handleSortDirection}
            handleSortBy={handleSortBy} />
            :<div>loading</div>}
    </>
    const content = storyId ? <StoryPage id={storyId} /> : list;
    return content;
};
export default Home;
