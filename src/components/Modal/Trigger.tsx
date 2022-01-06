type Props={
    text:string,
    toggleModal:()=>void
}

const Trigger = ({ text,  toggleModal }:Props) => {
  return (
    <button onClick={toggleModal}>{text}</button>
  );
};
export default Trigger;
