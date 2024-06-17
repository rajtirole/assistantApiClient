// src/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import apiClient from './api'




const Login = ({ history }) => {
    const navigate=useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

        let options = {
            method: "POST",
            headers: { "content-type": "application/json" },
            url: `https://assistantapiserver.onrender.com/auth/login`,
            withCookies: true,
            withCredentials: true,
            data: { email, password },
          };
          const response = await axios(options);
    //   const response = await apiClient.post('/auth/login', { email, password });
      login(response.data.token);
      console.log(response);
   if(response.data.success){
    console.log(response.data.threadId);
    let threadid=response.data.threadId
    navigate(`/chat/${threadid}`);
   }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="authContainer">
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
        <div> <p>
        Don't have an account? <a href="/signup">Signup</a>
      </p></div>
      </form>
     
    </div>
  );
};

export default Login;
