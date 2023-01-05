import { AllOutTwoTone, CheckCircleTwoTone, DownloadingTwoTone, KeyboardArrowUp } from '@mui/icons-material';
import { Button, Fab, Paper, Stack, Switch, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { TwitterTimelineEmbed, TwitterShareButton, TwitterFollowButton, TwitterHashtagButton, TwitterMentionButton, TwitterTweetEmbed, TwitterMomentShare, TwitterDMButton, TwitterVideoEmbed, TwitterOnAirButton } from 'react-twitter-embed';
import { AppContexts } from '../App'
import { CurateKeywordBasedPostsFromNyTimes, RenderMostSharedPostsFromNyTimes, RenderPopularPostsFromNyTimes } from '../components/ContentsFromNyTimes';
import CreatePost from '../components/CreatePost';
import { ButtonToIndicateHelp, HowToUseShowMorePostsListings } from '../components/HowToUseApp';
import ShowPostsFromTwitter, { RenderPost } from '../components/ShowPostsFromTwitter';
import ShowUserCreatedPost from '../components/UserCreatedPost';
import { readDataFromServer } from '../utils';
import { ScrollToTop } from './PostCommentsThread';

function UserSpecificNewsFeeds(props) {
    let [tweetPostsDataset, setTweetPostsDataset] = useState([]);
    let [showCreatePost, setShowCreatePost] = useState(true);
    let [showPostsUntilIndex, setShowPostsUntilIndex] = useState(11);
    let [fetchPrivatePosts, setFetchPrivatePosts] = useState(false)

    let appCtx = useContext(AppContexts);

    let location = useLocation()

    let handleDataset = result => {
        console.log(result, "result!!", ...result?.data?.data, "<><>", tweetPostsDataset)

        result?.data?.data && setTweetPostsDataset(prev => {
            let findIdx = prev.findIndex(item => result.data.data.findIndex(elem => elem.postData.id === item.postData.id))
            console.log(findIdx, "findIdx!!")
            // return ([...prev, ...result.data.data])
            return (findIdx === -1 ? [...prev, ...result.data.data] : [...prev])
        })
    }

    let handleAllAccessiblePosts = result => {
        appCtx.handleAvailablePostsFeeds(result.data.data)
        // when already available posts are ready to display, commence with private posts fetch request
        appCtx.user.friends?.length && setFetchPrivatePosts(true);
    }

    let topics = appCtx?.user?.topics;

    useEffect(() => {
        if (appCtx?.user?.friends?.length !== -1) {

            topics?.forEach(topic => {
                let url = `${appCtx.baseUrl}/twitter/search/${topic}/${topic}`
                // readDataFromServer(url, handleDataset)
            })
        }
    }, [topics])

    let getAllAccessiblePosts = () => {
        let url = `${appCtx.baseUrl}/posts/`
        readDataFromServer(url, handleAllAccessiblePosts)
    }

    let handleAllPrivatePosts = (result) => {
        // creating a new dataset from already available posts data and then adding on found Private Posts from fetch request
        let newPosts = [...appCtx.availablePostsFeeds, ...result.data.data]
        // after curating a modified posts dataset, updating app posts data with this new dataset
        appCtx.handleAvailablePostsFeeds(newPosts)
        // once done, resetting private posts fetch request flag to false
        setFetchPrivatePosts(false);
    }

    let getFriendsPrivatePosts = () => {
        let url = `${appCtx.baseUrl}/posts/${appCtx.user._id}/friends/posts/private`
        readDataFromServer(url, handleAllPrivatePosts)
    }

    // when fetchPrivateRequest flag is on then code for private posts requests will run
    useEffect(() => {
        fetchPrivatePosts && getFriendsPrivatePosts()
    }, [fetchPrivatePosts])

    // on each render on this path, app will requests for data from server to feed on page
    useEffect(() => {
        location.pathname && getAllAccessiblePosts()
    }, [appCtx.user?._id, location.pathname])

    // making sure each time route changes existing posts gets removed so that state variable changes dont become unstable
    useEffect(() => appCtx.handleAvailablePostsFeeds([]), [location.pathname])

    useEffect(() => appCtx?.user?._id && appCtx.randomlySelectSixTopics(), [])

    // console.log(userPostsDataset, "postsDataset!!", allAccessiblePosts)
    // console.log("postsDataset!!", allAccessiblePosts)

    let renderTweetPosts = () => tweetPostsDataset?.map(dataset => <RenderPost key={dataset?.postData._id} item={dataset} baseUrl={appCtx.baseUrl} />)

    let renderAllAccessiblePosts = () => appCtx.availablePostsFeeds?.sort((a, b) => new Date(a.created) < new Date(b.created) ? 1 : -1).map((dataset, idx) => (idx < showPostsUntilIndex) && <ShowUserCreatedPost key={dataset._id} postData={dataset} setShowCreatePost={setShowCreatePost} />)

    let handleShowMore = () => {
        setShowPostsUntilIndex(prev => prev + 10 > appCtx.availablePostsFeeds.length ? appCtx.availablePostsFeeds.length : prev + 10)
    }

    let [toggle, setToggle] = useState(false);

    let handleToggle = () => setToggle(!toggle)

    console.log(showPostsUntilIndex, "untilIndex", appCtx.availablePostsFeeds.length)

    return (
        <Paper sx={{minHeight: "100vh"}}>
            {/* <Typography variant='h1' id="top-marker">User Specific News Feeds</Typography> */}

            {showCreatePost ? <CreatePost /> : null}

            <Stack id="top-marker" sx={{ position: "relative" }}>
                <ShowApiContentsToggler handleToggle={handleToggle} toggle={toggle} dataReady={false} />
            </Stack>
            {
                toggle
                    ?
                    <ShowPostsFromThirdPartyApisTopBunk />
                    : null
            }

            {appCtx.availablePostsFeeds.length ? renderAllAccessiblePosts() : null}

            {/* <TweetEmbed tweetsDataset={tweetPostsDataset} /> */}

            {
                toggle
                    ?
                    <ShowPostsFromThirdPartyApisBottomBunk />
                    : null
            }

            <Button
                startIcon={<AllOutTwoTone sx={{ fontSize: "29px !important" }} />}
                variant='contained'
                sx={{
                    width: "fit-content",
                    margin: "auto",
                    position: "relative",
                    backgroundColor: "primary.light"
                }}
            >
                <Typography
                    onClick={handleShowMore}
                    variant="h6"
                >
                    Show More
                </Typography>

                <ButtonToIndicateHelp hoverPosition={{ left: "-185px", top: "-110px" }} alertPosition={{ left: 0 }} forWhichItem={"Show More Listings"} />
                {appCtx.dialogTextFor === "Show More Listings" ? <HowToUseShowMorePostsListings /> : null}
            </Button>

            <ScrollToTop {...props}>
                <Fab size="small" aria-label="scroll back to top">
                    <KeyboardArrowUp />
                </Fab>
            </ScrollToTop>
        </Paper>
    )
}

const ShowApiContentsToggler = ({ toggle, handleToggle, dataReady }) => {
    return (
        <Stack
            sx={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 4
            }}
        >
            <Switch
                checked={toggle}
                onChange={handleToggle}
                name="api content loader toogle"
                color="primary"
            />
            <Button
                onClick={handleToggle}
                startIcon={toggle ? <CheckCircleTwoTone /> : <DownloadingTwoTone />}
            >
                <Typography>{`${toggle ? "Hide" : "Show"} Third Party Api Contents`}</Typography>
            </Button>
        </Stack>
    )
}

const ShowPostsFromThirdPartyApisBottomBunk = () => {
    const appCtx = useContext(AppContexts);

    let topics = appCtx.randomizedTopics.slice(2)

    return (
        <>
            <RenderMostSharedPostsFromNyTimes />
            <CurateKeywordBasedPostsFromNyTimes topics={topics?.length ? topics : []} />
            <ShowPostsFromTwitter topics={topics?.length ? topics : []} />
        </>
    )
}

const ShowPostsFromThirdPartyApisTopBunk = () => {
    const appCtx = useContext(AppContexts);

    let topics = appCtx.randomizedTopics.slice(0, 2)

    console.log(topics, "topics!!")

    return (
        <>
            <CurateKeywordBasedPostsFromNyTimes topics={topics?.length ? topics : []} />
            <RenderPopularPostsFromNyTimes />
            <ShowPostsFromTwitter topics={topics?.length ? topics : []} />
        </>
    )
}

const TweetEmbed = ({ tweetsDataset }) => {
    let renderEmbeds = () => tweetsDataset?.map(tweetDataset => <TwitterTweetEmbed key={tweetDataset?.postData?.id} tweetId={tweetDataset?.postData?.id} onLoad={function noRefCheck() { }} placeholder="Loading" />)
    return (
        <Paper
            className='embeds-wrap'
            sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}
        >
            {renderEmbeds()}
        </Paper>
    )
}

export default UserSpecificNewsFeeds