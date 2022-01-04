import ReactDOM from 'react-dom';
import styled from 'styled-components'

type ModalProps = {
    toggleModal: () => void;
}

const Overlay = styled.div`
  background-color: rgba(0,0,0,0.5);
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Modal: React.FC<ModalProps> = ({ toggleModal, children }) => {
    return ReactDOM.createPortal(<Overlay onClick={toggleModal}>
        <div onClick={e => e.stopPropagation()}>
            {children}
        </div>
    </Overlay>, document.getElementById('modal-root')!)


}
