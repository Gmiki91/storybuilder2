type Props={
    text:string,
    onClick:()=>void
}

export const Trigger = ({ text,  onClick }:Props) => {
  return (
    <button onClick={onClick}>{text}</button>
  );
};
