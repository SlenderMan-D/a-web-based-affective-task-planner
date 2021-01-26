import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as R from 'ramda'
import Router from './router'
import UserContext from './context/user'
import './App.css';

function App() {
  const [user, setUser] = useState('')
  useEffect(() => {
    axios.get('http://localhost:3232/api/user/userInfo')
      .then((res) => {
        const username = R.pathOr('', ['data', 'data', 'username'], res)
        setUser(R.pathOr('', ['data', 'data'], res))
        if (
          !username
          && window.location.pathname !== '/login'
          && window.location.pathname !== '/signup'
          && window.location.pathname !== '/reset'
        ) {
          window.location.href = '/login'
        }
      })
  }, [])
  return (
    <div className="App">
      <UserContext.Provider value={user}>
        <Router />
      </UserContext.Provider>
    </div>
  );
}

export default App;
