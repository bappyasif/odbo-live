import React, { useEffect } from 'react'

function SecretRoute({setUser}) {
    useEffect(() => {
        const url = "http:///localhost:4000/ep-auth/userSecrets"
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
            // "Access-Control-Allow-Credentials": true
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