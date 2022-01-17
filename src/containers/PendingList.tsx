import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { LOCAL_HOST } from "constants/constants";
import { PageCard } from 'components/PageCard';
import { Page } from 'models/Page';

const PendingList = () => {
    const [pendingList, setPendingList] = useState<Page[]>([]);
    const { storyId, pageIds } = useParams();

    const init = useCallback(
        () => axios.get(`${LOCAL_HOST}/pages/pendig/${pageIds}`).then(result => setPendingList(result.data))
        , [pageIds])

    useEffect(() => {
        init();
    }, [init])

    const onClick = (event: number) => {
        console.log(event);
    }
    return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {pendingList.map(page => <PageCard
            key={page._id}
            page={page}
            pending={true}
            onRateLevel={() => console.log("ratelevel")}
            onRateText={onClick} />
        )}
    </div>
}
export default PendingList;