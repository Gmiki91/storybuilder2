import axios from "axios";
import { useCallback, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FormTypes } from "../components/forms/FormTypes";
import { PageForm } from "../components/forms/PageForm";
import { Modal } from "../components/modal/Modal";
import { PageCard } from "../components/PageCard";
import { Page } from "../models/Page";
import { Story } from "../models/Story";

const StoryPage = () => {
  const {storyId} = useParams();
  const [story, setStory] = useState<Story>();
  const [pages, setPages] = useState<Page[]>([]);
  const [form, setForm] = useState<FormTypes>('');

  const init = useCallback(async () => {
    const story = await axios.get<Story>(`${process.env.REACT_APP_LOCAL_HOST}stories/${storyId}`).then(result => result.data);
    const pageIds = story.pageIds.join(',');
    if (pageIds.length > 0) {
      const pages = await axios.get<Page[]>(`${process.env.REACT_APP_LOCAL_HOST}pages/${pageIds}`).then(result => result.data);
      setPages(pages);
    }
    setStory(story);
    setForm('');
  }, [storyId]);

  useEffect(() => {
    init();
  }, [init])

  const addPage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const page = {
      text: form.text.value,
      level: form.level.value,
      language: story!.language,
      authorId: story!.authorId,
      rating: [],
      status: 'Pending',
      translations: []
    }
    const pageId = await axios.post(`${process.env.REACT_APP_LOCAL_HOST}pages/`, page).then((result) => result.data)
    const obj = { pageId: pageId, storyId: story!._id }
    axios.post(`${process.env.REACT_APP_LOCAL_HOST}stories/addPage`, obj).then(() => init());
  }

  const pageList = pages.length > 0 ? pages.map(page => <PageCard key={page._id} page={page} />) : <div>No pages yet </div>

  return story ? <>
    <h1>{story.title}</h1>
    {form !== '' ?
      <Modal closeModal={() => setForm('')}>
        <PageForm onSubmit={(e) => addPage(e)} onClose={() => setForm('')} />
      </Modal> : null}
      <div style={{display: 'flex', flexDirection:'column', alignItems: 'center'}}>
    {pageList}
    </div>
    <br></br>
    <button onClick={() => setForm('newPage')}>Add Page</button>
  </>
    : <div>loading</div>
}

export default StoryPage;