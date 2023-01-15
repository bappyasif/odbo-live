import React from 'react'
import { baseUrl } from '../App'

function Home({ user }) {
    const clickHandler = () =>window.open(`${baseUrl}/logout`, "_self")
    return (
        <div>
            <h1>Home Page {user?.name}</h1>
            {
                user?.name
                    ? <p onClick={clickHandler}><a href='#'>Logout</a></p>
                    : <p>Go to <a href='/login'>Login</a> page</p>
            }
            {/* <p>Go to <a href='/login'>Login</a> page</p> */}
        </div>
    )
}

export default Home