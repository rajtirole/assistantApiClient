// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Chat from './Chat';
import Login from './Login';
import Signup from './Signup';

const App = () => {
  return (
      
         <Routes>

          <Route path="/login" element={<Login></Login>} />
          <Route path="/signup" element={<Signup></Signup>} />
          <Route path="/chat/:id" element={<ProtectedRoute childern={<Chat></Chat>}></ProtectedRoute>} />
          <Route path="/" element={ <Signup></Signup> }/>
         </Routes>
  );
};

export default App;
