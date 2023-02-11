import React, { createContext, useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from "react-router-dom"
import './App.css';
import MainNavigation from './components/MainNavigation';
import LoginForm, { ShowSessionExpiredDialog } from './routes/LoginForm';
import RegisterUser from './routes/RegisterUser';
import ErrorPage from './components/ErrorPage';
import ConnectUsers from './routes/ConnectUsers';
import ChooseTopics from './routes/ChooseTopics';
import EditUserProfile from './routes/EditUserProfile';
import TopicCategory from './routes/TopicCategory';
import LoginSuccess from './routes/LoginSuccess';
import { getAuthenticatedUserDataFromServer, getProtectedDataAfterJwtVerification, getUserDataAfterJwtVerification, storeJwtAuthDataInLocalstorage, userStillLoggedIn } from './utils';
import UserSpecificNewsFeeds from './routes/UserSpecificNewsFeeds';
import UserFriendships from './routes/UserFriendships';
import PostCommentsThread from './routes/PostCommentsThread';
import UserProfile from './routes/UserProfile';
import VisitAnotherUserProfile from './routes/VisitAnotherUserProfile';
import { ThemeProvider } from '@emotion/react';
import { createTheme, Paper } from '@mui/material';
import { getDesignTokens } from './utils/customTheme';
import PasswordReset from './routes/PasswordReset';
import RecoverPassword from "./routes/RecoverPassword"
import UserSessionValidityChecks from './components/UserSessionValidityChecks';
import LoadingPage from './components/LoadingPage';

export const AppContexts = createContext()

function App() {
  let [user, setUser] = useState([]);
  let [jwtUser, setJwtUser] = useState({});
  let [userAccessiblePostsDataset, setUserAccessiblePostsDataset] = useState([])
  let [topics, setTopics] = useState([])
  let [dialogTextFor, setDialogTextFor] = useState(null);
  let [showDialogModal, setShowDialogModal] = useState(false);
  let [assistiveMode, setAssistiveMode] = useState(false);
  let [darkMode, setDarkMode] = useState(false);
  let [jwtExists, setJwtExists] = useState(false);
  let [routeBeforeSessionExpired, setRouteBeforeSessionExpired] = useState(false);
  let [loading, setLoading] = useState(false);

  const location = useLocation();

  const navigate = useNavigate();

  const turnOffLoading = () => {
    setLoading(false)
    console.log("toggled Off!!")
  }

  const turnOnLoading = () => {
    setLoading(true)
    console.log("toggled On!!")
  }

  const toggleSsoLogin = () => {
    const ssoStatus = localStorage.getItem("ssoLogin");
    if (ssoStatus !== undefined) {
      localStorage.setItem("ssoLogin", !ssoStatus)
    } else {
      localStorage.setItem("ssoLogin", true)
    }
    // setSsoLogin(prev => !prev)
  }

  const removeStoredRouteAfterLogout = () => setRouteBeforeSessionExpired(null);

  const handleLastVisitedRouteBeforeSessionExpired = endpoint => setRouteBeforeSessionExpired(endpoint)

  const handleToggleDarkMode = () => {
    setDarkMode(prev => {
      localStorage.setItem("odbo-dark-mode", !prev)
      return !prev
    })
  }

  const handleAssitiveModeToggle = () => setAssistiveMode(!assistiveMode)

  const handleOpenDialogModal = () => setShowDialogModal(true)

  const handleCloseDialogModal = () => setShowDialogModal(false)

  const handleDialogTextFor = (name) => setDialogTextFor(name);

  const randomlySelectSixTopics = () => {
    let foundTopics = user.topics;

    let rndNum = Math.floor(Math.random() * foundTopics.length);

    setTopics(prev => {
      let chkIdx = prev.findIndex(topic => topic === foundTopics[rndNum])

      let trimTopic = () => foundTopics[rndNum]?.split(" ").join("")

      return chkIdx === -1 ? [...prev, trimTopic()] : prev
    })
  }

  let handleData = result => {
    result?.user ? setJwtUser(result?.user) : setUser(result?.data?.data)

    // this is for user authentication via third party passwport jwt startegy
    if (result?.data?.userJwt) {
      // console.log("SSO Block")
      alert("sorry free hosting is not fully cors friendly thus passport strategy authentication is not taking effect on subsequent successful requests for user info!!")
      setUser(prev => ({ ...prev, userJwt: result.data.userJwt }))
      const data = result.data.userJwt;
      storeJwtAuthDataInLocalstorage(data.token, data.expiresIn)
    }

    // this is for jwt based passport authentication
    if (result?.userJwt !== undefined) {
      // console.log("JWT Block")
      setJwtUser(prev => ({ ...prev, userJwt: result.userJwt }))
      const data = result.userJwt;
      storeJwtAuthDataInLocalstorage(data.token, data.expiresIn)
    }

    turnOnLoading();
  }

  let updateData = (key, value) => setUser(prev => {
    // checking if data is already in list
    let fIdx = prev[key].findIndex(val => val === value);
    if (fIdx === -1 && key !== "frRecieved") {
      // adding to array list
      return ({ ...prev, [key]: [...prev[key], value] })
    } else {
      // removing from array list
      let filtered = prev[key].filter(val => val !== value);
      return ({ ...prev, [key]: filtered })
    }
  })

  const acceptOrRejectFriendRequestUpdater = (action, friendId) => {
    setUser(prev => {
      if (action === "accept") {
        prev.friends.push(friendId)
      }

      let filtered = prev.frRecieved.filter(id => id !== friendId);

      return ({ ...prev, frRecieved: filtered })
    })
  }

  const updateUserProfileDataInApp = (propName, propValue) => {
    setUser(prev => ({ ...prev, [propName]: propValue }))
  }

  const removeUserIdFromCurrentUserFriendsList = (friendId) => {
    let filteredFriendsList = user.friends.filter(val => val !== friendId)
    setUser(prev => ({ ...prev, friends: filteredFriendsList }))
  }

  let handleAvailablePostsFeeds = dataset => setUserAccessiblePostsDataset(dataset)

  let updateAvailablePostsFeeds = data => setUserAccessiblePostsDataset(prev => [...prev, data])

  const deletePostFromAvailablePostsFeeds = (postId) => {
    let filteredPosts = userAccessiblePostsDataset.filter(item => item._id !== postId)

    setUserAccessiblePostsDataset(filteredPosts)
  }

  const updateSpecificPostData = (createdPost, dataKey, dataValue) => {

    createdPost[dataKey] = dataValue;

    const newDataset = [createdPost, ...userAccessiblePostsDataset]

    handleAvailablePostsFeeds(newDataset);
  }

  const clearCurrentUserData = () => {
    setUser({})
    setJwtUser({})
    setUserAccessiblePostsDataset([])
  }

  function getUser() {
    const url = `${contexts.baseUrl}/login/success`
    getAuthenticatedUserDataFromServer(url, handleData)
    // console.log("running from app scope!!")
  }

  const getSystemPreferenceTheme = () => {
    const themeType = window.matchMedia("(prefers-color-scheme): dark").matches

    setDarkMode(themeType ? "dark" : "light")
  }

  const updateUserStateForProtectiveRoutes = result => {
    if (result?.userJwt) {
      // console.log("!!JWT Block!!")
      setUser(prev => ({ ...prev, userJwt: result.userJwt }))
      const data = result.userJwt;
      storeJwtAuthDataInLocalstorage(data.token, data.expiresIn)
    } else if (result === undefined) {
      clearCurrentUserData();
      navigate("/login")
    }
  }

  function getUserDataFromJwtTokenStoredInLocalStorage() {
    const token = localStorage.getItem("token");

    const url = `${contexts.baseUrl}/protected`

    if (token) {
      setJwtExists(true);
      getProtectedDataAfterJwtVerification(url, token, updateUserStateForProtectiveRoutes, user?.userJwt?.refreshToken)
    } else {
      clearCurrentUserData();
      setJwtExists(false);
      turnOnLoading();
      navigate("/login");
    }
  }

  const previouslyExistingAppDataOnLocalstorage = () => {
    const isDarkMode = localStorage.getItem("odbo-dark-mode");
    const ssoLoginStatus = localStorage.getItem("ssoLogin");

    if (isDarkMode !== null) {
      setDarkMode(isDarkMode)
    }

    !ssoLoginStatus && getUserDataFromJwtTokenStoredInLocalStorage()
  }

  const fetchUserDataWithValidAccessToken = () => {
    const token = localStorage.getItem("token");
    const url = `${contexts.baseUrl}/valid-user`
    token && getProtectedDataAfterJwtVerification(url, token, handleData, null)
  }

  const contexts = {
    baseUrl: "http://localhost:3000",
    // baseUrl: "https://busy-lime-dolphin-hem.cyclic.app",
    user: user,
    handleData: handleData,
    updateData: updateData,
    acceptOrRejectFriendRequestUpdater: acceptOrRejectFriendRequestUpdater,
    handleAvailablePostsFeeds: handleAvailablePostsFeeds,
    availablePostsFeeds: userAccessiblePostsDataset,
    updateAvailablePostsFeeds: updateAvailablePostsFeeds,
    removeIdFromCurrentUserFriendsList: removeUserIdFromCurrentUserFriendsList,
    updateUserProfileDataInApp: updateUserProfileDataInApp,
    clearCurrentUserData: clearCurrentUserData,
    getUser: getUser,
    deletePostFromAvailablePostsFeeds: deletePostFromAvailablePostsFeeds,
    randomizedTopics: topics,
    handleOpenDialogModal: handleOpenDialogModal,
    handleCloseDialogModal: handleCloseDialogModal,
    handleDialogTextFor: handleDialogTextFor,
    dialogTextFor: dialogTextFor,
    showDialogModal: showDialogModal,
    handleAssitiveModeToggle: handleAssitiveModeToggle,
    assistiveMode: assistiveMode,
    handleToggleDarkMode: handleToggleDarkMode,
    darkMode: darkMode,
    randomlySelectSixTopics: randomlySelectSixTopics,
    isUserLoggedIn: userStillLoggedIn,
    getUserDataFromJwtTokenStoredInLocalStorage: getUserDataFromJwtTokenStoredInLocalStorage,
    routeBeforeSessionExpired: routeBeforeSessionExpired,
    handleLastVisitedRouteBeforeSessionExpired: handleLastVisitedRouteBeforeSessionExpired,
    removeStoredRouteAfterLogout: removeStoredRouteAfterLogout,
    updateSpecificPostData: updateSpecificPostData,
    toggleSsoLoginStatus: toggleSsoLogin,
    turnOffLoading: turnOffLoading,
    turnOnLoading: turnOnLoading
  }

  useEffect(() => {
    // making topics get refreshed before user comes back to news feeds
    user?._id && topics.length && setTopics([])
  }, [location.pathname !== "/"])

  useEffect(() => {
    // when jwtUser data is present we'll deal with this, and for simplicity making userData empty
    if (Object.keys(jwtUser).length !== 0) { setUser(jwtUser) }
  }, [jwtUser])

  useEffect(() => {
    if (location.pathname === "/" && topics?.length > 0 && topics?.length < 4 && user?._id) {
      randomlySelectSixTopics()
    }
  }, [topics])

  useEffect(() => {
    if (user?._id && user?.topics) {
      setTopics([])
    }
  }, [user?._id])

  useEffect(() => {
    if (!user?._id) {
      const fakeTopics = ["astronomy", "animalplanet", "world", "sport"]
      setTopics(fakeTopics)
    }

    // to fetch data when page reloads and token is still valid
    fetchUserDataWithValidAccessToken();

    getSystemPreferenceTheme();
  }, [])

  useEffect(() => {
    !jwtExists && previouslyExistingAppDataOnLocalstorage()
  }, [jwtExists])

  const theme = createTheme(getDesignTokens(darkMode ? "dark" : "light"))

  return (
    <AppContexts.Provider value={contexts}>
      <div className="App" style={{ backgroundColor: "grey[400]", minHeight: "100vh" }}>
        <MainNavigation />

        {(!localStorage.getItem("token") && routeBeforeSessionExpired) ? <ShowSessionExpiredDialog /> : null}

        {/* for overall token validity checks prompt to user, to avoid getting un authorized response on protected resources */}
        {user?._id ? <UserSessionValidityChecks /> : null}

        {/* {loading ? <LoadingPage /> : null} */}

        <ThemeProvider theme={theme}>
          <Paper>
            <Routes>
              {
                !user?._id
                  ?
                  <>
                    <Route path='/success/login' element={<LoginSuccess />} />
                    <Route path="/recover-password" element={<RecoverPassword />} />
                    <Route path='/login' element={<LoginForm handleData={handleData} />} />
                    {/* <Route path='/login/success' element={<LoginSuccess />} /> */}
                    <Route path='/register' element={<RegisterUser handleData={handleData} />} />
                  </>
                  :
                  <>
                    <Route path='/reset-password' element={<PasswordReset />} />
                    <Route path='/user-friendships' element={<UserFriendships />} />
                    <Route path='/connect' element={<ConnectUsers />} />
                    <Route path='/edit-user-profile' element={<EditUserProfile />} />
                    <Route path='/users/:userID/profile' element={<UserProfile />} />
                    <Route path='/choose-topics' element={<ChooseTopics />} />
                    <Route path='/choose-topics/:category' element={<TopicCategory />} errorElement={<ErrorPage />} />
                  </>
              }

              <Route path='/' element={<UserSpecificNewsFeeds />} />

              <Route path='/posts/:postId/comments' element={<PostCommentsThread />} />

              <Route path='/users/:userID/visit/profile' element={<VisitAnotherUserProfile />} />

              {/* <Route path='*' element={<ErrorPage />} /> */}
              {
                loading
                ? <Route path='*' element={<LoadingPage />} />
                : <Route path='*' element={<ErrorPage />} />
              }
            </Routes>
          </Paper>
        </ThemeProvider>
      </div>
    </AppContexts.Provider>
  );
}

export default App;
