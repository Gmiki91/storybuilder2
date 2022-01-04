import { Modal } from "./Modal";
import Trigger from "./Trigger";

type ModalContainerProps = {
    triggerText: string;
    visibility:boolean;
    toggleModal:()=>void;
}

const ModalWrapper: React.FC<ModalContainerProps> = ({ triggerText,visibility,toggleModal, children }) => {
  
    return <>
        <Trigger text={triggerText} toggleModal={toggleModal} />
        {visibility
            ? <Modal
                toggleModal={toggleModal}>{children}
            </Modal> : null}
    </>
}
export default ModalWrapper;
