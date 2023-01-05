import { TabContext, TabList, TabPanel } from '@mui/lab';
import { AppBar, Box, Container, Paper, Tab, Tabs, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { AppContexts } from '../App';
import useToFetchUserActionSpecificPostData from '../hooks/useToFetchData';
import ShowUserCreatedPost from '../components/UserCreatedPost';


import UserProfileInfoSection from '../components/UserProfileInfoSection'
import { readDataFromServer } from '../utils';

function UserProfile() {
    let appCtx = useContext(AppContexts);

    useEffect(() => {
        appCtx.handleLastVisitedRouteBeforeSessionExpired(`/users/${appCtx?.user?._id}/profile`)
        appCtx.getUserDataFromJwtTokenStoredInLocalStorage()
    }, [])

    return (
        <Paper
            sx={{ backgroundColor: "secondary", color: "info", fontSize: { xs: "small", md: "large", lg: "larger" }, }}
        >
            <UserProfileInfoSection appCtx={appCtx} />
            <Typography variant="h2">User Profile</Typography>
            <UserProfileTabs />
        </Paper>
    )
}

let UserProfileTabs = () => {
    let [tabValue, setTabValue] = useState("1");

    let handleTabValueChange = (event, current) => {
        // console.log(current, "current!!")
        setTabValue(current);
    }

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={tabValue}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList
                        onChange={handleTabValueChange}
                        aria-label="lab API tabs example"
                        variant='fullWidth'
                        indicatorColor="secondary"
                        textColor='secondary'
                        sx={{
                            // backgroundColor: "info.light", 
                            // color: "primary.light", 
                            fontWeight: "bold"
                        }}
                    >
                        <Tab label="All Posts" value="1" />
                        <Tab label="Liked Posts" value="2" />
                        <Tab label="Loved Posts" value="3" />
                        <Tab label="Shared Posts" value="4" />
                        <Tab label="Commented Posts" value="5" />
                        <Tab label="Disliked Posts" value="6" />
                    </TabList>
                </Box>
                <TabPanel value="1"><RenderAllPostsTab /></TabPanel>
                <TabPanel value="2"><RenderActionSpecificPosts actionType={"Like"} /></TabPanel>
                <TabPanel value="3"><RenderActionSpecificPosts actionType={"Love"} /></TabPanel>
                <TabPanel value="4"><RenderActionSpecificPosts actionType={"Share"} /></TabPanel>
                <TabPanel value="5"><RenderActionSpecificPosts actionType={"Comment"} /></TabPanel>
                <TabPanel value="6"><RenderActionSpecificPosts actionType={"Dislike"} /></TabPanel>
            </TabContext>
        </Box>
    )
}

export let RenderAllPostsTab = () => {
    let [postsData, setPostsData] = useState([]);

    let appCtx = useContext(AppContexts);

    let params = useParams()

    let handlePostsData = (result) => {
        // console.log(result.data.data, result, "!!")
        setPostsData(result.data.data)
    }

    let getAllPostsForThisUser = () => {
        let url = `${appCtx.baseUrl}/posts/${params.userID}`
        readDataFromServer(url, handlePostsData)
    }

    // making sure every time when another user profile is getting visited from that same visiting user profile route, it refreshes already existing dataset before rendering
    useEffect(() => {
        setPostsData([])
        getAllPostsForThisUser()
    }, [params.userID])

    useEffect(() => {
        getAllPostsForThisUser()
    }, [])

    let renderAllPosts = () => postsData?.sort((a, b) => new Date(a.created) < new Date(b.created) ? 1 : -1).map((dataset, idx) => (idx < 11) && <ShowUserCreatedPost key={dataset._id} postData={dataset} setShowCreatePost={() => null} />)

    return (
        <Paper
            sx={{
                // backgroundColor: "primary.dark", 
                // color: "info.contrastText"
            }}
        >
            <Typography variant="h3">All Posts</Typography>
            {/* <Container> */}
            {postsData?.length ? renderAllPosts() : <ShowUserToVisitNewsFeeds text={"Created yet"} />}

            {/* </Container> */}
        </Paper>
    )
}

const ShowUserToVisitNewsFeeds = ({ text }) => {
    return (
        <>
            <Typography variant='h2'>No Posts are {text}</Typography>
            <Typography variant="h4">Perhaps consder visting and playing around from <Link to={"/"}>Timeline Feeds</Link> would help!! Try now :)</Typography>
        </>
    )
}

let RenderActionSpecificPosts = ({ actionType }) => {
    let appCtx = useContext(AppContexts);

    let { postsData } = useToFetchUserActionSpecificPostData(appCtx, actionType)

    // console.log(postsData, "data!!")

    let renderAllPosts = () => postsData?.sort((a, b) => new Date(a.created) < new Date(b.created) ? 1 : -1).map((dataset, idx) => (idx < 11) && <ShowUserCreatedPost key={dataset._id} postData={dataset} setShowCreatePost={() => null} />)

    return (
        <Paper>
            <Typography variant="h3">All {actionType}d Posts</Typography>
            {/* <Container> */}
            {postsData?.length ? renderAllPosts() : <ShowUserToVisitNewsFeeds text={`${actionType}d`} />}
            {/* </Container> */}
        </Paper>
    )
}

export default UserProfile