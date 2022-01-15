import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button } from 'authentication/AuthForm';
import { LOCAL_HOST } from 'constants/constants';
import { useAuth } from 'context/AuthContext';

const Signup = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthTokens } = useAuth();
  const navigate = useNavigate();

  const postSignup = () => {
    axios.post(`${LOCAL_HOST}/users/signup`, {
      email,
      password
    }).then(result => {
      console.log(result);
      if (result.status === 200) {
        setAuthTokens(result.data);
        setLoggedIn(true);
      } else {
        setIsError(true);
      }
    }).catch(e => {
      setIsError(true);
    });
  }

  console.log(isLoggedIn);
  if (isLoggedIn) {
    navigate("/");
  }
  return (
    <Card>
      <Form>
        <Input type="email"
          value={email}
          onChange={e => {
            setEmail(e.target.value);
          }}
          placeholder="email"
        />
        <Input type="password"
          value={password}
          onChange={e => {
            setPassword(e.target.value);
          }}
          placeholder="password"
        />
        <Button onClick={postSignup}>Sign up</Button>
      </Form>
      <Link to="/login">Already have an account?</Link>
    </Card>
  );
}

export default Signup;