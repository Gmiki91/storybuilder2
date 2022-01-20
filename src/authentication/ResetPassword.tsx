import axios from 'axios';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import { LOCAL_HOST } from "constants/constants";

const ResetPassword = () => {
    const navigate = useNavigate();
    const { setAuthToken } = useAuth();
    const { token } = useParams()
    const [password, setPassword] = useState('');
    const [error, setError] = useState();
    const [isLoggedIn, setLoggedIn] = useState(false);

    const resetPassword = () => {
        axios.patch(`${LOCAL_HOST}/users/resetPassword/${token}`, { password })
            .then(result => {
                setAuthToken(result.data.data);
                setLoggedIn(true);
            })
            .catch(error => setError(error.response.data.message));
    }

    if (isLoggedIn) {
        navigate("/");
    }

    return <>
        <input placeholder="Enter your new password" value={password} onChange={e => setPassword(e.target.value)} />
        <button disabled={password.trim() === ''} onClick={resetPassword}>Reset password</button>
        {error && <p>{error}</p>}
    </>
}

export default ResetPassword;