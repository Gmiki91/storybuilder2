import axios from "axios";
import { useCallback, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FormTypes } from "../components/modal/forms/FormTypes";
import { NewPage } from "../components/modal/forms/NewPage";
import { RateLevel } from "../components/modal/forms/RateLevel";
import { Modal } from "../components/modal/Modal";
import { PageCard } from "../components/PageCard";
import { Page } from "../models/Page";
import { Story } from "../models/Story";

const StoryPage = () => {
  const { storyId } = useParams();
  const [story, setStory] = useState<Story>({}as Story);
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(-1);
  const [formType, setFormType] = useState<FormTypes>('');

  //console.log('[StoryPage] renders')
  const init = useCallback(async () => {
    const story = await axios.get<Story>(`${process.env.REACT_APP_LOCAL_HOST}stories/${storyId}`).then(result => result.data);
    const pageIds = story.pageIds.join(',');
    if (pageIds.length > 0) {
      const pages = await axios.get<Page[]>(`${process.env.REACT_APP_LOCAL_HOST}pages/${pageIds}`).then(result => result.data);
      setPages(pages);
    }
    setStory(story);
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
      language: story.language,
      authorId: story.authorId,
      rating: [],
      status: 'Pending'
        }
    const pageId = await axios.post(`${process.env.REACT_APP_LOCAL_HOST}pages/`, page).then((result) => result.data)
    const body = { pageId: pageId, storyId: storyId }
    axios.post(`${process.env.REACT_APP_LOCAL_HOST}stories/addPage`, body).then(() =>{
      init();
      setFormType('');
    });

  }

  const handleRateText =(rate:number, pageId:string)=>{
    axios.put(`${process.env.REACT_APP_LOCAL_HOST}stories/rate`,{rate,storyId} );
     axios.put(`${process.env.REACT_APP_LOCAL_HOST}pages/rateText`, {rate,pageId}).then(()=>{
      init();
     })
  }

  const handleRateLevel=(rate:string)=>{
    const body = {rate:rate, pageId:pages[currentPageIndex]._id};
    axios.put(`${process.env.REACT_APP_LOCAL_HOST}pages/rateLevel`, body).then(()=>{
      init();
      setCurrentPageIndex(-1)
    });
  }

  const handleCloseModal=()=>{
    if (formType === 'newPage') setFormType('');
    if (currentPageIndex>-1) setCurrentPageIndex(-1);
  }

  const pageList = pages.length > 0 ? pages.map((page, i) => <PageCard
    key={page._id}
    page={page}
    onRateLevel={() => setCurrentPageIndex(i)}
    onRateText={(rate)=>handleRateText(rate,page._id)}
  />) : <div>No pages yet </div>

  const getForm = () => {
    if (formType === 'newPage') return <NewPage onSubmit={(e) => addPage(e)} onClose={() => setFormType('')} />
    if ( currentPageIndex>-1) return <RateLevel level={pages[currentPageIndex].level} onSubmit={handleRateLevel} onClose={() => setCurrentPageIndex(-1)} />
    return null;
  }

  const form = getForm();
  return story ? <>
    <h1>{story.title}</h1>
    {formType !== '' || currentPageIndex>-1 ?
      <Modal closeModal={handleCloseModal}>
        {form}
      </Modal> : null}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {pageList}
    </div>
    <br></br>
    <button onClick={() => setFormType('newPage')}>Add Page</button>
  </>
    : <div>loading</div>
}

export default StoryPage;