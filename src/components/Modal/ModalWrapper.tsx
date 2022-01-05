import { Modal } from "./Modal";

type ModalContainerProps = {
    visibility: boolean;
    toggleModal: () => void;
}

const ModalWrapper: React.FC<ModalContainerProps> = ({ visibility, toggleModal, children }) => {
    return <>
        {visibility
            ? <Modal
                toggleModal={toggleModal}>{children}
            </Modal> : null}
    </>
}
export default ModalWrapper;
