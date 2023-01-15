import React, { useEffect } from 'react'
import { baseUrl } from '../App'

function SecretRoute({setUser}) {
    useEffect(() => {
        const url = `${baseUrl}/ep-auth/userSecrets`
        fetchAuthenticatedUserData(url, setUser)
    }, [])

    return (
        <div>SecretRoute Hoeraaaa!!!!</div>
    )
}

export const fetchAuthenticatedUserData = (url, setData) => {
    fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
            "ACCESS-CONTROL-ALLOW-ORIGIN": baseUrl
        }
    }).then(resp => resp.json())
        .catch(err => console.log("response error", err))
        .then(data => {
            console.log(data, "Dataaaaa!!")
            data?.user && setData(data);
        })
        .catch(err => console.log("data error", err))
}

export default SecretRoute