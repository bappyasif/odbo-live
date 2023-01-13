import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import { Navbar } from './components/Navbar';
import Home from './routes/Home';
import { Login } from './routes/Login';
import LoginSuccess from './routes/LoginSuccess';
import SecretRoute, { fetchAuthenticatedUserData } from './routes/SecretRoute';

function App() {
  let [user, setUser] = useState()
  const getUser = () => {
    fetch("http://localhost:4000/auth/login/success", {
      method: "GET",
      credentials: "include",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      }
    })
      .then(resp => resp.status === 200 && resp.json())
      .catch(err => console.log(err, "request error!!"))
      .then(data => setUser(data))
      .catch(err => console.log(err, "response error!!"))
  }

  const getNonOauth2UserAuthenticatedData = () => {
    const url = "http:///localhost:4000/ep-auth/userSecrets"
    fetchAuthenticatedUserData(url, setUser)
  }

  useEffect(() => {
    !user && getUser()
    !user && getNonOauth2UserAuthenticatedData();
  }, [])

  console.log(user, "user!!")

  return (
    <div className="App">
      <Navbar user={user?.user} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login setUser={setUser} user={user} />} />
        <Route path='/login/success' element={<LoginSuccess />} />
        <Route path='/secretRoute' element={<SecretRoute setUser={setUser} />} />
      </Routes>
    </div>
  );
}

export default App;
