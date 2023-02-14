import { CancelTwoTone } from '@mui/icons-material';
import { Box, Button, Icon, Stack, Tooltip, Typography } from '@mui/material'
import React, { useContext } from 'react'
import { AppContexts } from '../App';
import CreatePost from './CreatePost';
import RenderPostDataEssentials from './RenderPostData';
import { actions } from './UserCreatedPost';
import { afterDataUpdateOperationHandleError, performProtectedUpdateOperation, updateDataInDatabase } from '../utils';

function SharePostModal({ counts, postData, showModal, setShowModal, setShowCreatePost, handleCounts, setShareFlag, shareFlag }) {
    let appCtx = useContext(AppContexts);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: "391px", md: "auto", lg: 900 },
        bgcolor: '#6c757d',
        border: '2px solid #000',
        boxShadow: 24,
        py: 2,
        zIndex: 2,
        borderRadius: 6
    };

    let { likesCount, loveCount, dislikesCount, shareCount, _id } = { ...postData }

    let preparingCounts = {
        Like: counts.Like || likesCount,
        Love: counts.Love || loveCount,
        Dislike: counts.Dislike || dislikesCount,
        Share: counts.Share || shareCount
    }

    const afterDataUpdateOperation = (key, value, result) => {
        // afterDataUpdateOperationHandleError(key, appCtx)
        // update this informationm in app state as well
        // console.log(key, value, result, postData, "AFTER UPDATE POST DATA?!", postData?.body)
        if (result.success) {
            appCtx.updateSpecificPostData(result.updatedPost, "includedSharedPostId", postData._id)
        } else {
            afterDataUpdateOperationHandleError(key, appCtx)
        }
    }

    let updateNewlyCreatedPostWithSharedPostId = (newPostId) => {
        let url = `${appCtx.baseUrl}/posts/update/shared/${newPostId}/`
        const data = { propKey: "includedSharedPostId", propValue: _id }
        // it needs an updater to reflect shared post included at initial post rendering
        performProtectedUpdateOperation(data, appCtx.user?.userJwt?.refreshToken, url, afterDataUpdateOperation)
        // performProtectedUpdateOperation(data, appCtx.user?.userJwt?.refreshToken, url)
        // performProtectedUpdateOperation(data, appCtx.user?.userJwt?.refreshToken, url, () => null, null, null)
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

    // let updateNewlyCreatedPostWithSharedPostId = (newPostId) => {
    //     let url = `${appCtx.baseUrl}/posts/update/shared/${newPostId}/`
    //     // updateDataInDatabase(url, { propKey: "includedSharedPostId", propValue: _id })
    //     const data = { propKey: "includedSharedPostId", propValue: _id }
    //     performProtectedUpdateOperation(data, appCtx.user?.userJwt?.refreshToken, url, null, null, null)
    // }

    // console.log(shareFlag, "!!from share", preparingCounts.Share)

    return (
        <Box sx={style}>
            <CreatePost handleSuccessfullPostShared={handleSuccessfullPostShared} />
            <Stack sx={{ mx: 3.05 }}>
                <RenderPostDataEssentials postData={postData} forShareModal={true} />
                <ShowPostUserEngagementsDetails counts={preparingCounts} forShareModal={true} />
                {/* <span style={{width: "92%"}}>
                    <ShowPostUserEngagementsDetails counts={preparingCounts} forShareModal={true} />
                </span> */}
            </Stack>
            <Button
                sx={{ mt: 1.1, mb: 0, backgroundColor: "beige", fontWeight: "bold", px: .9, borderRadius: 1.1 }}
                onClick={handleModalsVisibility}
            // startIcon={<CancelTwoTone />}
            >
                <CancelTwoTone sx={{ display: "flex", fontSize: "36px", mr: 1.1 }} />
                <Typography variant='body2' sx={{ fontSize: "x-large", fontWeight: "bolder" }}>Cancel</Typography>
            </Button>
        </Box>
    )
}

export let ShowPostUserEngagementsDetails = ({ forShareModal, counts, forComment, clickHandler, currentUser, forSharedPost }) => {
    return (
        <Stack
            className="post-actions-icons"
            sx={{ flexDirection: "row", justifyContent: "center", backgroundColor: "primary.light", color: "info.contrastText", gap: 2, position: "relative" }}
        >
            {actions.map(item => !((item.name === "Comment" || item.name === "Share") && forComment) && (
                <Tooltip
                    key={item.name}
                    sx={{ cursor: "help" }}
                    title={
                        (!currentUser && !forShareModal)
                            ? `Login to ${item.name}`
                            : counts[item.name]
                                ? `${item.name}d by ${counts[item.name]} people`
                                : (forSharedPost || forShareModal)
                                    ? `${item.name}d by ${counts[item.name] || 0} people`
                                    : `Be first to ${item.name}`
                    }
                >
                    <Stack
                        onClick={() => forComment ? clickHandler(item.name) : null}
                        sx={{
                            backgroundColor: counts[item.name] ? "secondary.light" : "info.light",
                            cursor: forComment && forSharedPost ? "auto" : forComment ? "pointer" : "auto",
                            // p: forComment && 0,
                            // p: (forComment && 0) || (forShareModal && 0),
                            p: (forComment || forShareModal) && 0,
                            my: (forShareModal) ? 0 : .6,
                            borderRadius: 4,
                            // fontSize: forShareModal && "11px"
                        }}
                    >
                        <Button
                            // sx={{ cursor: "auto", color: "info.contrastText" }}
                            sx={{p: forShareModal && 0}}
                            startIcon={counts[item.name] ? item.icon : null}
                            // startIcon={<Stack sx={{fontSize: forShareModal && "11px"}} >{counts[item.name] ? item.icon : null}</Stack>}
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