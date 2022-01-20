import axios from 'axios';
import { useState } from 'react';
import { LOCAL_HOST } from "constants/constants";
const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [response, setResponse] = useState();

    const resetPassword = () => {
        axios.post(`${LOCAL_HOST}/users/forgotPassword`, { email })
            .then(result => {
                setResponse(result.data.message)
            })
            .catch(error => setResponse(error.response.data.message));
    }

    return <>
        <input placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
        <button disabled={email.trim()===''} onClick={resetPassword}>Get email</button>
        {response && <p>{response}</p>}
    </>
}

export default ForgotPassword;