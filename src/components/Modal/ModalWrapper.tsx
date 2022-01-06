import { Modal } from "../modal/Modal"

type Props = {
    visibility: boolean;
    toggleModal: () => void;
}

const ModalWrapper: React.FC<Props> = ({ visibility, toggleModal, children }) => {
    return <>
        {visibility
            ? <Modal
                toggleModal={toggleModal}>{children}
            </Modal> : null}
    </>
}
export default ModalWrapper;
