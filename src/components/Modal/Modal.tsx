import ReactDOM from 'react-dom';
import styled from 'styled-components'

type Props = {
    closeModal: () => void;
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

export const Modal: React.FC<Props> = ({ closeModal, children }) => {
    return ReactDOM.createPortal(<Overlay onClick={closeModal}>
        <div onClick={e => e.stopPropagation()}>
            {children}
        </div>
    </Overlay>, document.getElementById('modal-root')!)


}
