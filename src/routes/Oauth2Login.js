import React from 'react'
import { baseUrl } from '../App'

function Oauth2Login() {
    const clickHandler = () => {
        window.open(`${baseUrl}/auth/google`, "_self")
    }
  return (
    <div>
        <span>Login With</span><button onClick={clickHandler}>Google</button>
    </div>
  )
}

export default Oauth2Login