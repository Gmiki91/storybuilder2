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
  //console.log('[StoryPage] renders')
  const navigate = useNavigate();
  const isAuthenticated = useAuth().authToken !== '';
  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}`};
  const { storyId, status } = useParams<Params>();

  const [userId, setUserId] = useState('');
  const [story, setStory] = useState({} as Story);
  const [page, setPage] = useState({} as Page);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [formType, setFormType] = useState<FormTypes>('');
  const [pageStatus, setPageStatus] = useState(status);

  const pageType = pageStatus === 'pending' ? 'pendingPageIds' : 'pageIds';

  useEffect(()=>{
    axios.get(`${LOCAL_HOST}/users/`,{headers}).then(result=>setUserId(result.data.user._id))
  },[userId]);

  const loadStory = useCallback(async () => {
    const story = await axios.get(`${LOCAL_HOST}/stories/${storyId}`).then(result => result.data.data);
    setStory(story);
    setFormType('');
  }, [storyId]);

  useEffect(() => {
    loadStory();
  }, [loadStory])


  const loadPage = useCallback(async () => {
    if (story[pageType] && story[pageType].length > 0) {
      const id = story[pageType][currentPageIndex];
      const page = await axios.get(`${LOCAL_HOST}/pages/${id}`).then(result => result.data.page);
      setPage(page);
    } else {
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
      storyId: story._id,
      rating: [],
      status: 'Pending'
    }
    const pageId = await axios.post(`${LOCAL_HOST}/pages/`, page, { headers }).then((result) => result.data.data);
    const body = { pageId: pageId, storyId: storyId };
    axios.post(`${LOCAL_HOST}/stories/pendingPage`, body,{headers}).then(() => {
      loadStory();
    });
  }

  const removePendingPages = () => {
    const index = story.pendingPageIds.indexOf(page._id)
    const idsToDelete = [...story.pendingPageIds];
    idsToDelete.splice(index, 1);
    axios.delete(`${LOCAL_HOST}/pages/pending/${idsToDelete.join(',')}`,{headers})
  }

  const handleRateText = async (vote: number, confirming: boolean) => {
    if (isAuthenticated) {
      let call1;
      let call2;
      if (confirming) {
        const body = { pageId: page._id, storyId: storyId };
        if (vote === -1) { //remove Page
          call1 = axios.delete(`${LOCAL_HOST}/pages/${page._id}`,{headers} ) //remove page document
          call2 = axios.put(`${LOCAL_HOST}/stories/pendingPage`, body,{headers}) //remove pageId from story
        } else { //add Page
          setPageStatus("confirmed");
          call1 = axios.post(`${LOCAL_HOST}/users/`, { pageId: page._id }, { headers }); //add page to user document
          call2 = axios.put(`${LOCAL_HOST}/stories/page`, body,{headers}); //add page to story 
          story.pendingPageIds.length > 1 && removePendingPages();  //remove all other pending pages
        }
      } else {
        const difference = await axios.put(`${LOCAL_HOST}/pages/rateText`, { vote, pageId: page._id }, { headers }).then(result=>result.data.data)
        if(pageStatus ==='confirmed') call2 =  axios.put(`${LOCAL_HOST}/stories/rate`, { difference, storyId });
      }
      await Promise.all([call1, call2]);
      loadPage();
    } else {
      navigate(`/login`);
    }
  }

  const handleRateLevel = (rate: string) => {
    if (isAuthenticated) {
      const body = { rate: rate, pageId: page._id };
      axios.put(`${LOCAL_HOST}/pages/rateLevel`, body, { headers }).then(() => {
        loadPage();
      });
    } else {
      navigate(`/login`);
    }
  }

  const toggleItems = (status: 'pending' | 'confirmed') => {
    setCurrentPageIndex(0);
    setPageStatus(status);
  }

  const getForm = () => {
    if (formType === 'newPage') return <NewPage onSubmit={(e) => addPage(e)} onClose={() => setFormType('')} />
    if (formType === 'rateLevel') return <RateLevel level={page.level} onSubmit={handleRateLevel} onClose={() => setCurrentPageIndex(-1)} />
    return null;
  }

  const pageNumber = story[pageType]?.indexOf(page._id) + 1;
  const onLastPage = story[pageType]?.length > 0 ? currentPageIndex === story[pageType].length - 1 : true;
  const addPageVisible = pageStatus !== 'pending' && onLastPage && (story.openEnded || userId === story.authorId);
  const toggleStatus = pageStatus === 'confirmed' ? story.pendingPageIds && story.pendingPageIds.length > 0 && <div onClick={() => toggleItems('pending')}>
    Pending: {story.pendingPageIds.length}
  </div> : <div onClick={() => toggleItems('confirmed')}>Return to confirmed pages</div>

  const form = getForm();

  const pageContent = page._id ? <PageCard
    key={page._id}
    page={page}
    userId={userId}
    ownContent={userId===(page.authorId || story.authorId)}
    toConfirm={pageStatus === 'pending' && story.authorId === userId}
    onRateLevel={() => setFormType('rateLevel')}
    onRateText={handleRateText}
  /> : <div>No pages yet </div>

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
      {pageNumber > 0 && <p>{pageNumber} / {story[pageType].length}</p>}
      {!onLastPage && <button onClick={() => setCurrentPageIndex(prevState => prevState + 1)}>next</button>}
    </div>
    {addPageVisible && <button onClick={() => { isAuthenticated ? setFormType('newPage') : navigate('/login') }}>Add Page</button>}
    {toggleStatus}
  </>
    : <div>loading</div>
}

export default StoryPage;