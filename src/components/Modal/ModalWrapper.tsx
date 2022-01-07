import { FormTypes } from "../forms/FormTypes";
import { NewStoryForm } from "../forms/NewStoryForm";
import { Modal } from "../modal/Modal"
import { Filter } from "../forms/Filter";

type Props = {
    form: FormTypes;
    onNewStory: (event: React.FormEvent<HTMLFormElement>) => void;
    onFilter:(event: React.FormEvent<HTMLFormElement>, lvls:string[], langs:string[]) => void;
    onClose:()=>void;
}

const ModalWrapper: React.FC<Props> = ({ form,onFilter, onNewStory,onClose }) => {

    const getForm = () =>{
        switch(form){
            case 'filter': return <Filter onCloseForm={onClose} onSubmit={onFilter} />;
            case 'newStory':return <NewStoryForm  onCloseForm={onClose} onSubmit={onNewStory} />
            default:return null;
        }
    }

    const children = getForm();

    return <>
        {children
            ? <Modal closeModal={onClose}>{children}</Modal> 
            : null}
    </>
}
export default ModalWrapper;
