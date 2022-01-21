import axios from 'axios';
import { useState, useCallback, useEffect } from 'react'
import { LOCAL_HOST } from "constants/constants";
import { useAuth } from 'context/AuthContext';
const Settings = () => {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}`};
    const { setAuthToken } = useAuth();
    const [user, setUser] = useState();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [response, setResponse] = useState();


    const loadUser = useCallback(()=>{
        axios.get(`${LOCAL_HOST}/users/`, { headers })
    },[])

    useEffect(() => {
        loadUser();
    },[])

    const handlePasswordChange = () => {
        axios.patch(`${LOCAL_HOST}/users/updatePassword`,{currentPassword, newPassword} ,{ headers })
        .then(result => {
            setResponse(result.data.message);
            setAuthToken(result.data.token);
        })
        .catch(error => setResponse(error.response.data.message));
    }

    return <>
        <label>Change password</label>
        <input type="password" placeholder="Current password" onChange={e => setCurrentPassword(e.target.value)} value={currentPassword} />
        <input type="password" placeholder="New password" onChange={e => setNewPassword(e.target.value)} value={newPassword} />
        <button onClick={handlePasswordChange}>Submit</button>
        {response && <p>{response}</p>}
    </>
}

export default Settings;