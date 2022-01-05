import './Form.css';

type FormProps = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const Form: React.FC<FormProps> = ({ onSubmit }) => {
  return (
    <form className="form-box" onSubmit={onSubmit}>
      <div >
        <input id="titel" placeholder="Story title" />
      </div>

      <div>
        <textarea id="description" placeholder="Write a short synopsis to the story"/>
      </div>
      <div>
        <input id="language" placeholder="Which language to use?"/>
      </div>
      <div>
        <input id="level" placeholder="What is the target level?"/>
      </div>
      <div >
        <button type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};
export default Form;