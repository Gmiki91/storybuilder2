type Props={
    text:string,
    onClick:()=>void
}

const Trigger = ({ text,  onClick }:Props) => {
  return (
    <button onClick={onClick}>{text}</button>
  );
};
export default Trigger;
