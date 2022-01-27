import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button } from 'authentication/AuthForm';
import { LOCAL_HOST } from 'constants/constants';
import { useAuth } from 'context/AuthContext';

const Signup = () => {
  const [isError, setIsError] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setToken} = useAuth();
  const navigate = useNavigate();

  const postSignup = () => {
    axios.post(`${LOCAL_HOST}/users/signup`, {
      name,
      email,
      password
    }).then(result => {
      if (result.status === 201) {
        setToken(result.data.token);
        navigate("/");
      } else {
        setIsError(true);
      }
    }).catch(e => {
      setIsError(true);
    });
  }

  return (
    <Card>
      <Form>
      <Input
          value={name}
          onChange={e => {
            setName(e.target.value);
          }}
          placeholder="username"
        />
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