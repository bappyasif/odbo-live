import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Home from './routes/Home';
import Oauth2Login from './routes/Oauth2Login';

// export const baseUrl = "http://localhost:4000"

export const baseUrl = "https://busy-lime-dolphin-hem.cyclic.app"

function App() {
  let [user, setUser] = useState()
  const getUser = () => {
    fetch(`${baseUrl}/login/success`, {
      method: "GET",
      credentials: "include",
      headers: {
        // "Accept": "application/json",
        // "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
        // "ACCESS-CONTROL-ALLOW-ORIGIN": baseUrl
      }
    })
      .then(resp => resp.status === 200 && resp.json())
      .catch(err => console.log(err, "request error!!"))
      .then(data => setUser(data))
      .catch(err => console.log(err, "response error!!"))
  }

  const getNonOauth2UserAuthenticatedData = () => {
    const url = `${baseUrl}/ep-auth/userSecrets`
    // fetchAuthenticatedUserData(url, setUser)
  }

  useEffect(() => {
    !user && getUser()
  }, [])

  console.log(user, "user!!")

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home user={user?.user} />} />
        <Route path='/login' element={<Oauth2Login />} />
      </Routes>
    </div>
  );
}

export default App;
