import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import { auth, provider } from "../FireBase";
import { signInWithPopup } from "firebase/auth";
import Home from "../Home";


import logo from '../images/image.png';

function SignIn() {
  const [user, setUser] = useState('');

  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      setUser(result.user.email);
      localStorage.setItem('email', result.user.email);
      localStorage.setItem('user', result.user.displayName);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    setUser(localStorage.getItem('email'));
  }, []);

  return (
    <Routes>
    {user ? (
      <Route path="/" element={<Navigate to="/" />} />
    ) : (
      <Route path="/" element={<img src={logo} onLoad={signIn}></img>} />
    )}

    <Route path="/home" element={<Home />} />
  </Routes>
  );

}

export default SignIn;
