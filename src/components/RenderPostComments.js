import { Box, Button, Stack, Typography } from '@mui/material'
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContexts } from '../App'
import { EditComment } from './EditComment';
import { ButtonToIndicateHelp, HowToUseCommentListItems } from './HowToUseApp';
import { PostOrCommentOptions } from './PostOrCommentOptions';
import { RenderCardHeader } from './RenderPostData';
import { ShowPostUserEngagementsDetails } from './SharePostModal';
import { ShowUserAuthenticationOptions } from './UserCreatedPost';
import { readDataFromServer, updateDataInDatabase } from '../utils'

function RenderPostComments({ postOwner, postId, commentsData, setCommentsData, deleteCommentFromDataset }) {
    let navigate = useNavigate()

    let appCtx = useContext(AppContexts);

    let handleCommentsData = result => setCommentsData(result.data.data)

    let updateCommentText = (commentId, value) => {
        let newCommentsData = commentsData.map(item => {
            if (item._id === commentId) {
                item.body = value
            }
            return item
        })

        try {
            setCommentsData(newCommentsData);
        } catch (err) {
            console.log("eror!! caught!!", err);
        }
    }

    let getCommentsFromServer = () => {
        let url = `${appCtx.baseUrl}/comments/post/${postId}/`
        readDataFromServer(url, handleCommentsData)
    }

    useEffect(() => {
        getCommentsFromServer()
    }, [])

    // console.log(commentsData, "CommentsData!!", postId)

    let handleShowThread = () => {
        navigate(`posts/${postId}/comments/`)
    }

    let renderComments = () => commentsData.sort((a, b) => a.created < b.created ? 1 : -1)?.map((commentData, idx) => (idx < 4) && <RenderComment postOwner={postOwner} key={commentData._id} commentData={commentData} deleteCommentFromDataset={deleteCommentFromDataset} updateCommentText={updateCommentText} />)

    return (
        <Stack sx={{ alignItems: "center", gap: .6 }}>
            <Typography sx={{ color: "info.dark" }} variant="h5">Post Comments</Typography>
            {commentsData ? renderComments() : null}
            <Button fullWidth={true} sx={{ backgroundColor: "info.light", color: "info.contrastText", fontWeight: "bold", "&:hover": { backgroundColor: "primary.dark", } }} onClick={handleShowThread}>Show Thread</Button>
        </Stack>
    )
}

export const RenderComment = ({ fromThread, postOwner, commentData, deleteCommentFromDataset, updateCommentText, updateCommentTextFromThread }) => {
    let { body, created, _id, likesCount, dislikesCount, loveCount, userId } = { ...commentData }

    let [counts, setCounts] = useState({})

    let [fetchReady, setFetchReady] = useState(false)

    let [countsForCurrentUser, setCountsForCurrentUser] = useState({})

    let [userData, setUserData] = useState({})

    let [promptLogin, setPromptLogin] = useState(false);

    let [currentlyClickedElement, setCurrentlyClickedElement] = useState(false);

    let [editCommentFlag, setEditCommentFlag] = useState(false);

    const appCtx = useContext(AppContexts)

    let handleUserData = (result) => setUserData(result.data.data)

    let getDataAboutThisPostUser = () => {
        let url = `${appCtx.baseUrl}/users/${userId}`
        readDataFromServer(url, handleUserData)
    }

    useEffect(() => {
        userId && getDataAboutThisPostUser()
    }, [])

    let handleCounts = (elem, flag) => setCounts(prev => ({ ...prev, [elem]: (prev[elem] && !flag) ? prev[elem] + 1 : (prev[elem] && flag) ? prev[elem] - 1 : 1 }))

    let handleCountsForCurrentUser = (elem, flag) => setCountsForCurrentUser(prev => ({ ...prev, [elem]: (prev[elem] && !flag) ? prev[elem] : (prev[elem] && flag) ? prev[elem] - 1 : 1 }))

    let clickHandler = elem => {
        if (appCtx?.user?._id) {
            setFetchReady(true);
            !countsForCurrentUser[elem] && handleCounts(elem)
            countsForCurrentUser[elem] && handleCounts(elem, "deduct")
            !countsForCurrentUser[elem] && handleCountsForCurrentUser(elem)
            countsForCurrentUser[elem] && handleCountsForCurrentUser(elem, "deduct")
        } else {
            !fromThread && setPromptLogin(!promptLogin);
            setCurrentlyClickedElement(elem);
        }
    }

    let updateCommentCountsData = () => {
        let url = `${appCtx.baseUrl}/comments/${_id}`
        let data = { ...counts, userCounts: { ...countsForCurrentUser }, userId: appCtx.user._id }
        updateDataInDatabase(url, data)
    }

    useEffect(() => {
        let timer;

        if (fetchReady) {
            timer = setTimeout(() => {
                updateCommentCountsData()

                if (timer >= 2000) {
                    clearTimeout(timer)
                    setFetchReady(false)
                }

            }, [2000])
        }

        return () => clearTimeout(timer)

    }, [fetchReady, counts])

    useEffect(() => {
        setCounts({
            Like: likesCount || 0,
            Dislike: dislikesCount || 0,
            Love: loveCount || 0
        })

        let findIdx = commentData.engaggedUsers.findIndex(engaggedUser => engaggedUser && (appCtx?.user?._id === Object.keys(engaggedUser)[0]?.toString()))

        if (findIdx !== -1 && appCtx?.user?._id) {
            setCountsForCurrentUser({
                Like: Object.values(commentData.engaggedUsers[findIdx])[0].Like,
                Love: Object.values(commentData.engaggedUsers[findIdx])[0].Love,
                Dislike: Object.values(commentData.engaggedUsers[findIdx])[0].Dislike,
            })
        }
    }, [])

    // console.log(counts, "counts@!", countsForCurrentUser, commentData)

    return (
        <Box
            sx={{
                position: "relative",
                width: { xs: 411, sm: 620, md: 780 },
                outline: "solid .29px lightskyblue",
                borderRadius: .2,
                mb: .29,
            }}
        >
            <ButtonToIndicateHelp forWhichItem={"Comment Listings"} />

            {appCtx.dialogTextFor === "Comment Listings" ? <HowToUseCommentListItems /> : null}

            <PostOrCommentOptions postOwner={postOwner} commentId={commentData._id} deleteCommentFromDataset={deleteCommentFromDataset} userId={commentData.userId} showEditableText={setEditCommentFlag} />

            <RenderCardHeader userData={userData} forComment={true} />

            <Typography sx={{ display: { xs: "none", sm: "block" }, color: "info.contrastText", position: "absolute", top: 29, right: 20 }} variant="subtitle2">{`Live Since: ${moment(created).fromNow()}`}</Typography>

            <Stack
                sx={{my: 1.8}}
            >
                {
                    editCommentFlag
                        ? <EditComment body={body} commentId={commentData._id} doneEditing={() => setEditCommentFlag(false)} updateCommentText={updateCommentText} updateCommentTextFromThread={updateCommentTextFromThread} />
                        : <Typography variant='body1' sx={{ fontWeight: "bolder", color: "primary.light", p: .1, textAlign: "justify", margin: "0 36px 0 91.1px", fontSize: "20px" }} dangerouslySetInnerHTML={{ __html: body }}></Typography>
                }
            </Stack>

            <ShowPostUserEngagementsDetails currentUser={appCtx?.user?._id} counts={counts} countsForCurrentUser={countsForCurrentUser} forComment={true} clickHandler={clickHandler} />

            {(promptLogin && !appCtx?.user?._id) ? <ShowUserAuthenticationOptions setPromptLogin={setPromptLogin} itemName={currentlyClickedElement} forComments={true} /> : null}
        </Box>
    )
}

export default RenderPostComments