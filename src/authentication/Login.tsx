import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { useAuth } from 'context/AuthContext';
import { LOCAL_HOST } from "constants/constants";
import { Card, Form, Input, Button,Error } from 'authentication/AuthForm';

const Login = () => {
  const [isError, setIsError] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [password, setPassword] = useState("");
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const postLogin = () => {
    axios.post(`${LOCAL_HOST}/users/login`, {
      userInput,
      password
    }).then(result => {
      if (result.status === 200) {
        setToken(result.data.token);
        navigate("/");
      } else {
        setIsError(true);
      }
    }).catch(e => {
      setIsError(true);
    });
  }

  const googleLogin = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    if ('tokenId' in response) {
        axios.post(`${LOCAL_HOST}/users/loginGoogle`,{token:response.tokenId}).then(result=>{
          if (result.status === 200) {
            setToken(result.data.token);
            navigate("/");
          } else {
            setIsError(true);
          }
        }).catch(e => {
          setIsError(true);
        });
    }else{
      setIsError(true);
    }
  }

  return (
    <Card>
      <Form>
        <Input
          value={userInput}
          onChange={e => {
            setUserInput(e.target.value);
          }}
          placeholder="username or email"
        />

        <Input type="password"
          value={password}
          onChange={e => {
            setPassword(e.target.value);
          }}
          placeholder="password"
        />
        <Button onClick={postLogin}>Log In</Button>
      </Form>
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}
        buttonText="Log in with Google"
        onSuccess={googleLogin}
        onFailure={(e) => console.log(e)}
        cookiePolicy={'single_host_origin'} />
      <Link to="/forgotPassword">Forgot your password?</Link>
      <Link to="/signup">Don't have an account?</Link>
      {isError && <Error>The username or password provided were incorrect!</Error>}
    </Card>
  );
}

export default Login;