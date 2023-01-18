import { CancelTwoTone } from '@mui/icons-material';
import { Box, Button, Stack, Tooltip, Typography } from '@mui/material'
import React, { useContext } from 'react'
import { AppContexts } from '../App';
import CreatePost from './CreatePost';
import RenderPostDataEssentials from './RenderPostData';
import { actions } from './UserCreatedPost';
import { updateDataInDatabase } from '../utils';

function SharePostModal({ counts, postData, showModal, setShowModal, setShowCreatePost, handleCounts, setShareFlag, shareFlag }) {
    let appCtx = useContext(AppContexts);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 900,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        zIndex: 2,
    };

    let { likesCount, loveCount, dislikesCount, shareCount, _id } = { ...postData }

    let preparingCounts = {
        Like: counts.Like || likesCount,
        Love: counts.Love || loveCount,
        Dislike: counts.Dislike || dislikesCount,
        Share: counts.Share || shareCount
    }

    let handleModalsVisibility = () => {
        setShowCreatePost(true)
        setShowModal(false)
    }

    let handleSuccessfullPostShared = (newlyCreatedPostId) => {
        handleModalsVisibility();

        handleCounts("Share", !shareFlag)
        setShareFlag(!shareFlag)

        console.log(_id, "newly ctreated post ID", newlyCreatedPostId)
        updateNewlyCreatedPostWithSharedPostId(newlyCreatedPostId)
    }

    let updateNewlyCreatedPostWithSharedPostId = (newPostId) => {
        let url = `${appCtx.baseUrl}/posts/update/shared/${newPostId}/`
        updateDataInDatabase(url, { propKey: "includedSharedPostId", propValue: _id })
    }

    // console.log(shareFlag, "!!from share", preparingCounts.Share)

    return (
        <Box sx={style}>
            <CreatePost handleSuccessfullPostShared={handleSuccessfullPostShared} />
            <RenderPostDataEssentials postData={postData} shareMode={true} />
            <ShowPostUserEngagementsDetails counts={preparingCounts} />
            <Button
                sx={{ mt: 1.1, mb: 0, backgroundColor: "beige", fontWeight: "bold", padding: 1.1, borderRadius: 1.1 }}
                onClick={handleModalsVisibility}
                startIcon={<CancelTwoTone />}
            >
                <Typography variant='body2'>Cancel</Typography>
            </Button>
        </Box>
    )
}

export let ShowPostUserEngagementsDetails = ({ counts, forComment, clickHandler, currentUser }) => {
    return (
        <Stack
            className="post-actions-icons"
            sx={{ flexDirection: "row", justifyContent: "center", backgroundColor: "primary.light", color: "info.contrastText", gap: 2, position: "relative" }}
        >
            {actions.map(item => !((item.name === "Comment" || item.name === "Share") && forComment) && (
                <Tooltip key={item.name} sx={{ cursor: "help" }} title={(!currentUser) ? `Login to ${item.name}` : `${item.name}d by`}>
                    <Stack
                        onClick={() => forComment ? clickHandler(item.name) : null}
                        sx={{
                            backgroundColor: counts[item.name] ? "secondary.light" : "info.light",
                            cursor: forComment ? "pointer" : "auto",
                            p: forComment && 0,
                            my: .6,
                            borderRadius: 4
                        }}
                    >
                        <Button
                            // sx={{ cursor: "auto", color: "info.contrastText" }}
                            startIcon={counts[item.name] ? item.icon : null}
                        >
                            {counts[item.name] ? null : item.icon}
                            <Typography variant={"subtitle2"}>{counts[item.name] ? counts[item.name] : null}</Typography>
                        </Button>
                    </Stack>                   
                </Tooltip>
            ))}
        </Stack>
    )
}

export default SharePostModal