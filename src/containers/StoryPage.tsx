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

type Params = {
  storyId: string,
  status: 'pending' | 'confirmed';
}

const StoryPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuth().authToken !== '';
  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
  const userId = localStorage.getItem('userId');
  const { storyId, status } = useParams<Params>();

  const [story, setStory] = useState({} as Story);
  const [page, setPage] = useState({} as Page);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [formType, setFormType] = useState<FormTypes>('');
  const [pageStatus, setPageStatus] = useState(status);

  const pageType = pageStatus === 'pending' ? 'pendingPageIds' : 'pageIds';
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
    if (story[pageType] && story[pageType].length > 0) {
      const id = story[pageType][currentPageIndex];
      const page = await axios.get<Page>(`${LOCAL_HOST}/pages/${id}`).then(result => result.data);
      setPage(page);
    }else{
      setPage({} as Page);
    }
  }, [currentPageIndex, story, pageType])

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
    const pageId = await axios.post(`${LOCAL_HOST}/pages/`, page, { headers: headers }).then((result) => result.data);
    const body = { pageId: pageId, storyId: storyId };
    axios.post(`${LOCAL_HOST}/stories/pendingPage`, body).then(() => {
      loadStory();
    });
  }

  const handleRateText = async (rate: number, confirming: boolean) => {
    if (isAuthenticated) {
        let call1;
        let call2;
        if (confirming) {
          const body = { pageId: page._id, storyId: storyId };
          if (rate === -1) { //remove Page
            call1 = axios.delete(`${LOCAL_HOST}/pages/${page._id}`)
            call2 = axios.put(`${LOCAL_HOST}/stories/pendingPage`, body)
          } else { //add Page
            call1 = axios.post(`${LOCAL_HOST}/users/`, { pageId: page._id }, { headers });
            call2 = axios.put(`${LOCAL_HOST}/stories/page`, body);
          }
        } else  if (userId === story.authorId) {
          console.log('cant rate your own story');
        } else if (userId === page.authorId) {
          console.log('cant rate your own page');
        } else {
          call1 = await axios.put(`${LOCAL_HOST}/pages/rateText`, { rate: rate, pageId: page._id }, { headers: headers })
          call2 = await axios.put(`${LOCAL_HOST}/stories/rate`, { rate, storyId });
        }
        await Promise.all([call1, call2]);
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
    toConfirm={pageStatus === 'pending' && story.authorId === userId }
    onRateLevel={() => setFormType('rateLevel')}
    onRateText={handleRateText}
  /> : <div>No pages yet </div>

  const toggleItems = (status: 'pending' | 'confirmed') => {
    setCurrentPageIndex(0);
    setPageStatus(status);
  }

  const getForm = () => {
    if (formType === 'newPage') return <NewPage onSubmit={(e) => addPage(e)} onClose={() => setFormType('')} />
    if (formType === 'rateLevel') return <RateLevel level={page.level} onSubmit={handleRateLevel} onClose={() => setCurrentPageIndex(-1)} />
    return null;
  }

  const onLastPage = story[pageType]?.length > 0 ? currentPageIndex === story[pageType].length - 1 : true;
  const addPageVisible = pageStatus !== 'pending' && onLastPage && (story.openEnded || userId === story.authorId);
  const toggleStatus = pageStatus === 'confirmed' ? story.pendingPageIds && story.pendingPageIds.length > 0 && <div onClick={() => toggleItems('pending')}>
    Pending: {story.pendingPageIds.length}
  </div> : <div onClick={() => toggleItems('confirmed')}>Return to story</div>
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
      {currentPageIndex > 0 && <button onClick={() => setCurrentPageIndex(prevState => prevState - 1)}>prev</button>}
      <p>{story[pageType].indexOf(page._id)+1}</p>
      {!onLastPage && <button onClick={() => setCurrentPageIndex(prevState => prevState + 1)}>next</button>}
    </div>
      {addPageVisible && <button onClick={() => { isAuthenticated ? setFormType('newPage') : navigate('/login') }}>Add Page</button>}
    {toggleStatus}
  </>
    : <div>loading</div>
}

export default StoryPage;