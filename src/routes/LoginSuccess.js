import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../App';

function LoginSuccess() {
  const navigate = useNavigate(); 

  useEffect(() => {
    fetch(`${baseUrl}/auth/secretPage`,{
      method: "GET",
      credentials: "include",
      // "Access-Control-Allow-Origin": "http://localhost:4000",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
        // "Access-Control-Allow-Headers": "Accept",
        // "Access-Control-Allow-Origin": "http://localhost:4000"
      }
    }).then((resp) => {
    console.log("request done")
    if(resp.status != 200) {
      return navigate("/login")
    }
    return resp.json();
  })
    .catch(err=>console.log('request error', err))
    .then((data)=>{
      console.log("response done", data)
    })
    .catch(err=>console.log('response error', err))
  }, [])

  return (
    <div>Login Successfull Validated With Jwt and Session Cookie</div>
  )
}

export default LoginSuccess