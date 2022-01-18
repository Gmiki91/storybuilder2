import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { useAuth } from 'context/AuthContext';
import {  LOCAL_HOST } from "constants/constants";
import { Card, Form, Input, Button } from 'authentication/AuthForm';

const Login = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthToken } = useAuth();
  const navigate = useNavigate();

  const postLogin = () => {
    axios.post(`${ LOCAL_HOST}/users/login`, {
      userInput,
      password
    }).then(result => {
      if (result.status === 200) {
        setAuthToken(result.data.token);
        localStorage.setItem("userId", result.data.userId);
        setLoggedIn(true);
      } else {
        setIsError(true);
      }
    }).catch(e => {
      setIsError(true);
    });
  }

  if (isLoggedIn) {
    navigate("/");
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
        
        <Input  type="password"
          value={password}
          onChange={e => {
            setPassword(e.target.value);
          }}
          placeholder="password"
        />
         <Button onClick={postLogin}>Log In</Button>
      </Form>
      <Link to="/signup">Don't have an account?</Link>
      { isError &&<div>The username or password provided were incorrect!</div> }
    </Card>
  );
}

export default Login;