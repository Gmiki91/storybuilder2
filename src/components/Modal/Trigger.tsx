type TriggerProps={
    text:string,
    toggleModal:()=>void
}

const Trigger = ({ text,  toggleModal }:TriggerProps) => {
  return (
    <button onClick={toggleModal}>{text}</button>
  );
};
export default Trigger;
