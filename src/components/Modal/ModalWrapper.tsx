import { useState } from "react";
import { Filter, FilterTypes } from "../forms/Filter";
import { NewStoryForm } from "../forms/NewStoryForm";
import { Modal } from "../modal/Modal"
import Trigger from "./Trigger";

type Form = 'filter' | 'newStory' | ''
type Props = {
    onNewStorySubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    filters: FilterTypes;
    changedFilters: (changes: FilterTypes) => void;
    applyFilters: () => void;
}
const ModalWrapper: React.FC<Props> = ({ filters, changedFilters, onNewStorySubmit, applyFilters }) => {
    const [form, setForm] = useState<Form>('');

    const onStorySubmit = (e:React.FormEvent<HTMLFormElement>) =>{
        onNewStorySubmit(e);
        setForm('');
    }

    const onFilterSubmit = () =>{ 
        applyFilters();
        setForm('');
    }
    
    return <>
        <Trigger text={'Create new story'} onClick={() => { setForm('newStory') }} />
        <Trigger text={'Filter'} onClick={() => { setForm('filter') }} />
        {form !== '' ?
        <Modal closeModal={() => setForm('')} >
            {form === 'newStory' ?
            <NewStoryForm
                onCloseForm={() => setForm('')}
                onSubmit={(e)=>onStorySubmit(e)} /> :
            <Filter
                onCloseForm={() => setForm('')}
                onApply={onFilterSubmit}
                filters={filters}
                changeFilter={changedFilters}
            />}
        </Modal>
        : null}
    </>
}
export default ModalWrapper;
