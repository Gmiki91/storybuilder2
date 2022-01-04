import { useState } from "react";
import { Story } from "../models/Story";

const StoryPage = (props:{id:string}) =>{
    const [story, setStory] = useState<Story>();
  //  axios.get(`story/${props.id}`).then(result=>setStory(result.data))
    return <>storypage</>
}

export default StoryPage;