// src/ProtectedRoute.js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
const ProtectedRoute = ({childern}) => {
    console.log(childern);
    const navigate=useNavigate()
  const { auth } = useAuth();
if(auth){
    return <div>{childern}</div>
}
 else{
    navigate('./login')
 }
};

export default ProtectedRoute;
