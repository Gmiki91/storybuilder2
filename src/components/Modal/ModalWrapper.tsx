import { FormTypes } from "../forms/FormTypes";
import { NewStoryForm } from "../forms/NewStoryForm";
import { Modal } from "../modal/Modal"
import { Filter } from "./Filter";

type Props = {
    form: FormTypes;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    onClose:()=>void;
}

const ModalWrapper: React.FC<Props> = ({ form, onSubmit,onClose }) => {

    const getForm = () =>{
        switch(form){
            case 'filter': return <Filter onCloseForm={onClose} onSubmit={onSubmit} />;
            case 'newStory':return <NewStoryForm  onCloseForm={onClose} onSubmit={onSubmit} />
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
