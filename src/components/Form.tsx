export const Form = (props:{ onSubmit:(event:React.FormEvent<HTMLFormElement>)=>void }) => {
    return (
    <form onSubmit={props.onSubmit}>
      <div className="form-group">
        <input className="form-control" id="titel" placeholder="title" />
      </div> 
      
      <div className="form-group">
        <input className="form-control" id="description"
         placeholder="Write a short synopsis to the story" 
        />
    </div>
    <div className="form-group">
        <input  className="form-control" id="language"
         placeholder="Which language to use?" 
        />
    </div>
    <div className="form-group">
        <input  className="form-control" id="level"
         placeholder="What is the target level regarding proficiency?" 
        />
    </div>
      <div className="form-group">
        <button className="form-control btn btn-primary" type="submit">
          Submit
        </button>
    </div>
    </form>
    );
    };
    export default Form;