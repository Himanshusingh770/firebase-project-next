'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuth } from '../redux/reducers/authReducer';

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      dispatch(setAuth(accessToken));
    }
  }, [dispatch]);

  return <div>HomePage</div>;
};

export default Home;
