import moment from "moment";

const sendDataToServer = (endpoint, dataObj, errorHandler, handleData) => {
    fetch(endpoint, {
        method: "post",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataObj)
    }).then((resp) => {
        if (resp.status >= 200 && resp.status <= 299) {
            // just making all previously existing error to be removed with an empty array
            errorHandler([]);
            let data = resp.json();
            data
                .then(respData => {
                    // alert("login successfull")
                    handleData(respData)
                })
                .catch(err => console.error('error occured', err))
        } else {
            let data = resp.json();
            data
                .then(respData => {
                    errorHandler(respData);
                })
                .catch(err => console.error('error occured', err))
        }
    }).catch(err => console.error('post request is failed', err))
}

const updateUserInDatabase = (endpoint, dataObj, dataUpdater, navigate, navigateTo) => {
    fetch(endpoint, {
        method: "put",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataObj)
    }).then(resp => {
        let data = null
        if (resp.status >= 200 && resp.status <= 299) {
            data = resp.json();
            data.then(() => {
                // alert("user data is updated, will be redirected to home page")
                let key = Object.keys(dataObj)[0]
                let value = Object.values(dataObj)[0]
                dataUpdater(key, value)
                navigateTo ? navigate(`/${navigateTo}`) : navigate("/")
            }).catch(err=>console.log(err))
        }
    }).catch(err=>console.log(err));
}

const updateDataInDatabase = (endpoint, dataObj, dataUpdater) => {
    fetch(endpoint, {
        method: "put",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataObj)
    }).then(resp => resp.json())
    .catch(err => console.error(err, "request responded with error"))
    .then(data => {
        dataUpdater && dataUpdater(data)
    })
    .catch(err => console.error(err, "something's wrong!!"))
}

const readDataFromServer = (endpoint, dataUpdater) => {
    fetch(endpoint)
        .then(resp => resp.json())
        .catch(err => {
            dataUpdater({ errors: [err], data: [] })
        })
        .then(data => {
            dataUpdater({ data: data, errors: [] })
        })
        .catch(err => dataUpdater({ errors: [err], data: [] }))
}

const getAuthenticatedUserDataFromServer = (endpoint, dataUpdater) => {
    fetch(
        endpoint,
        {
            method: "GET",
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                "Access-Control-Allow-Credentials": true
            }
        }
    ).then(resp => {
        if (resp.status >= 200 && resp.status < 300) {
            return resp.json()
        }
    }).catch(err => console.error(err, "response err!!"))
        .then(data => {
            dataUpdater({ data: data, errors: [] })
        })
        .catch(err => dataUpdater({ errors: [err], data: [] }))
}

const logoutUserFromApp = (url, clearOutUserData) => {
    fetch(url)
        .then(res => res.json())
        .catch(err => console.log("response error!!", err))
        .then(data => {
            console.log("logged out!!", data.success)
            removeJwtDataFromLocalStorage()
            clearOutUserData && clearOutUserData()
        })
        .catch(err => console.error(err))
}

const deleteResourceFromServer = (endpoint, dataObj, dataUpdater) => {
    fetch(endpoint, {
        method: "delete",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataObj)
    }).then(resp => {
        if(resp.status === 200) {
            return resp.json()
        }
    })
    .catch(err => console.log(err, "response error!!"))
    .then(result => {
        dataUpdater && dataUpdater(result)
    })
    .catch(err => console.error(err))
}

const getUserDataAfterJwtVerification = (url, accessToken, dataUpdater, refreshToken) => {
    console.log(accessToken, refreshToken, "!!")
    fetch(url,
        {
            method: "GET",
            credentials: 'include',
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "refreshToken": `${refreshToken}`,
                "Accept": 'application/json',
                'Content-Type': 'application/json',
                "Access-Control-Allow-Credentials": true
            },
            // body: JSON.stringify({refreshToken: refreshToken})
        }
    ).then(resp => {
        if(resp.status >= 200 && resp.status < 400) {
            return resp.json()
        } else {
            removeJwtDataFromLocalStorage()
            // navigate("/login")
        }
    })
    .catch(err => console.log(err, "response error!!"))
    .then(result => {
        console.log(result, "RESULT!!")
        dataUpdater && dataUpdater(result)
    })
    .catch(err => console.error(err))
}

const storeJwtAuthDataInLocalstorage = (token, expiresIn) => {
    // setting 5 min token validation window
    const expires = Date.now() + (300 * 1000);
    localStorage.setItem("expires", expires);
    localStorage.setItem("token", token);
}

export const getExpiration = () => {
    const expiration = localStorage.getItem("expires");
    const expiresAt = JSON.parse(expiration);
    return expiresAt
}

const userStillLoggedIn = () => {
    const loginStatus = moment().isBefore(getExpiration());
    
    return loginStatus
}

const removeJwtDataFromLocalStorage = () => {
    localStorage.removeItem("expires")
    localStorage.removeItem("token")
}

export {
    sendDataToServer,
    readDataFromServer,
    getAuthenticatedUserDataFromServer,
    getUserDataAfterJwtVerification,
    updateUserInDatabase,
    updateDataInDatabase,
    logoutUserFromApp,
    deleteResourceFromServer,
    storeJwtAuthDataInLocalstorage,
    removeJwtDataFromLocalStorage,
    userStillLoggedIn
}