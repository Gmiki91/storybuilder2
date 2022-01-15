import axios from "axios";
import { useCallback, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormTypes } from "components/modal/forms/FormTypes";
import { NewPage } from "components/modal/forms/NewPage";
import { RateLevel } from "components/modal/forms/RateLevel";
import { Modal } from "components/modal/Modal";
import { PageCard } from "components/PageCard";
import { Page } from "models/Page";
import { Story } from "models/Story";
import { LOCAL_HOST } from 'constants/constants';
import { useAuth } from "context/AuthContext";

const StoryPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuth().authToken !== '';
  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
  const { storyId } = useParams();
  const [story, setStory] = useState({} as Story);
  const [page, setPage] = useState({} as Page);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [formType, setFormType] = useState<FormTypes>('');

  //console.log('[StoryPage] renders')
  const loadStory = useCallback(async () => {
    const story = await axios.get<Story>(`${LOCAL_HOST}/stories/${storyId}`).then(result => result.data);
    setStory(story);
    setFormType('');
  }, [storyId]);

  useEffect(() => {
    loadStory();
  }, [loadStory])

  //reload page
  const loadPage = useCallback(async () => {
    if (story.pageIds && story.pageIds.length > 0) {
      const id = story.pageIds[currentPageIndex];
      const page = await axios.get<Page>(`${LOCAL_HOST}/pages/${id}`).then(result => result.data);
      setPage(page);
    }
  }, [currentPageIndex, story])

  useEffect(() => {
    loadPage();
  }, [loadPage])

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
    const pageId = await axios.post(`${LOCAL_HOST}/pages/`, page, { headers: headers }).then((result) => result.data)
    const body = { pageId: pageId, storyId: storyId }
    axios.post(`${LOCAL_HOST}/stories/addPage`, body).then(() => {
      loadStory();
    });
  }

  const handleRateText = async (rate: number) => {
    if (isAuthenticated) {
      const newVote = await axios.put<boolean>(`${LOCAL_HOST}/pages/rateText`, { rate: rate, pageId: page._id }, { headers: headers }).then((result) => result.data);
      if (newVote) {
        await axios.put(`${LOCAL_HOST}/stories/rate`, { rate, storyId });
      }
      loadStory();
    } else {
      navigate(`/login`);
    }
  }

  const handleRateLevel = (rate: string) => {
    if (isAuthenticated) {
      const body = { rate: rate, pageId: page._id };
      axios.put(`${LOCAL_HOST}/pages/rateLevel`, body, { headers: headers }).then(() => {
        loadPage();
      });
    } else {
      navigate(`/login`);
    }
  }

  const pageContent = page._id ? <PageCard
    key={page._id}
    page={page}
    onRateLevel={() => setFormType('rateLevel')}
    onRateText={(rate) => handleRateText(rate)}
  /> : <div>No pages yet </div>

  const getForm = () => {
    if (formType === 'newPage') return <NewPage onSubmit={(e) => addPage(e)} onClose={() => setFormType('')} />
    if (formType === 'rateLevel') return <RateLevel level={page.level} onSubmit={handleRateLevel} onClose={() => setCurrentPageIndex(-1)} />
    return null;
  }

  const onLastPage = story.pageIds && story.pageIds.length > 0 ? currentPageIndex === story.pageIds.length - 1 : true;

  const form = getForm();
  return story ? <>
    <h1>{story.title}</h1>
    {formType !== '' &&
      <Modal closeModal={() => setFormType('')}>
        {form}
      </Modal>}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {pageContent}
    </div>
    <br></br>
    <div className='footer'>
      {currentPageIndex > 0 ? <button onClick={() => setCurrentPageIndex(prevState => prevState - 1)}>prev</button> : null}
      {onLastPage && story.openEnded ? <button onClick={() => { isAuthenticated ? setFormType('newPage') : navigate('/login') }}>Add Page</button> : null}
      {!onLastPage ? <button onClick={() => setCurrentPageIndex(prevState => prevState + 1)}>next</button> : null}
    </div>
  </>
    : <div>loading</div>
}

export default StoryPage;