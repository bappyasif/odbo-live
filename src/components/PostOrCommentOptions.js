import { DangerousTwoTone, DvrTwoTone, ModeEditTwoTone, MoreVertTwoTone, SettingsSuggestTwoTone } from '@mui/icons-material';
import { Box, Button, ClickAwayListener, IconButton, MenuItem, MenuList, Popper, Tooltip, Typography } from '@mui/material';
import React, { useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContexts } from '../App';
import { deleteProtectedDataFromServer, deleteResourceFromServer } from '../utils';
import AnnouncementAlert from './AnnouncementAlert';
import ConsentsPrompt from './ConsentsPrompt';

export const PostOrCommentOptions = ({ postOwner, postId, commentId, deleteCommentFromDataset, userId, showEditableText }) => {
    let [showMenu, setShowMenu] = useState(false);
    let [anchorEl, setAnchorEl] = useState(null)
    let [annTxt, setAnnTxt] = useState({});

    let ref = useRef();

    const handleAnnTxt = (data) => setAnnTxt(prev => ({ ...prev, ...data }))

    const clearAnnTxt = () => setAnnTxt({})

    let options = [{ text: "Edit", icon: <ModeEditTwoTone /> }, { text: "Delete", icon: <DangerousTwoTone /> }, { text: "Thread", icon: <DvrTwoTone /> }]

    if (commentId) {
        options = options.filter(item => item.text !== "Thread");
    } else if (postId) {
        options = options.filter(item => item.text !== "Edit");
    }

    let renderOptions = () => options.map(item => <RenderPostOption key={item.text} postOwner={postOwner} item={item} postId={postId} commentId={commentId} deleteCommentFromDataset={deleteCommentFromDataset} openDropdown={setShowMenu} userId={userId} showEditableText={showEditableText} handleAnnTxt={handleAnnTxt} clearAnnTxt={clearAnnTxt}  />)

    let handleClick = (e) => {
        setShowMenu(!showMenu)
        setAnchorEl(e.currentTarget)
    }

    const handleClose = () => {
        setShowMenu(false)
        setAnchorEl(null)
    }

    // console.log(annTxt, "ANNTXT!!!!")

    return (
        <Box
            ref={ref}
            sx={{
                position: "absolute",
                right: 0,
                top: 0,
                pr: .9
            }}
        >
            {
                annTxt?.elementName
                    ? <ConsentsPrompt elementName={annTxt.element} titleText={annTxt.titleText} mainText={annTxt.mainText} primaryAction={annTxt.primaryAction} cancelAction={annTxt.cancelAction} />
                    : annTxt?.mainText
                        ? <AnnouncementAlert titleText={"App Alert!!"} mainText={annTxt.mainText} handleAnnoucement={clearAnnTxt} />
                        : null
            }

            <Tooltip title="click to open menu">
                <IconButton
                    sx={{ color: "text.primary" }}
                    id='lock-button'
                    onClick={handleClick}>{postId ? <MoreVertTwoTone /> : <SettingsSuggestTwoTone />}</IconButton>
            </Tooltip>

            <Popper
                sx={{
                    backgroundColor: "gainsboro",
                    left: "-45.6px !important"
                }}
                id="lock-menu"
                anchorEl={anchorEl}
                open={showMenu}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'lock-button',
                    role: 'listbox',
                }}

            >
                <ClickAwayListener onClickAway={handleClose}>
                    <MenuList
                        sx={{
                            p: 0, backgroundColor: "secondary.light",
                            fontWeight: "bold",
                        }}
                    >
                        {renderOptions()}
                    </MenuList>
                </ClickAwayListener>
            </Popper>
        </Box>
    )
}

let RenderPostOption = ({ handleAnnTxt, clearAnnTxt, postOwner, item, postId, commentId, deleteCommentFromDataset, openDropdown, userId, showEditableText }) => {
    let appCtx = useContext(AppContexts);

    const navigate = useNavigate()

    let deleteThisPostFromAppData = () => {
        if (postId) {
            appCtx.deletePostFromAvailablePostsFeeds(postId)
        } else {
            deleteCommentFromDataset(commentId)
        }
    }

    const handleDelete = (url, data) => {
        const refreshToken = appCtx?.user?.userJwt?.refreshToken;
        deleteProtectedDataFromServer(url, data, deleteThisPostFromAppData, refreshToken)
        clearAnnTxt();
    }

    const commenceDelete = (url, data) => {
        // const userChoice = prompt("Are you sure you want to delete? Deleted data is not again retrieveable....Type in Y to delete", "N")
        handleAnnTxt({ elementName: "delete action", titleText: "Irreversible Action!! Proceed With Care!!", mainText: "Are you sure you want to delete? Deleted data is not again retrieveable....Clic Yes to delete", primaryAction: () => handleDelete(url, data), cancelAction: clearAnnTxt})

        // if (userChoice === "Y" || userChoice === "y") {
        //     // deleteResourceFromServer(url, data, deleteThisPostFromAppData)
        //     // deleteProtectedDataFromServer(url, data, deleteThisPostFromAppData)
        // } else {
        //     alert("you chose not to delete :)")
        // }
    }

    const optionsActions = () => {
        if (commentId) {
            if (item.text === "Delete") {
                const url = `${appCtx.baseUrl}/comments/${commentId}`
                const data = { commentId: commentId }
                commenceDelete(url, data)
            } else if (item.text === "Edit") {
                showEditableText(true)
            }
        } else {
            if (item.text === "Delete") {
                const url = `${appCtx.baseUrl}/posts/${postId}`
                const data = { postId: postId }
                commenceDelete(url, data)
            } else {
                navigate(`/posts/${postId}/comments/`, { replace: true })
            }
        }
    }

    const handleClick = () => {
        if (postOwner && item.text === "Delete") {
            optionsActions()
        } else if (
            (userId !== appCtx?.user?._id) && (item.text !== "Thread")
            ||
            (!appCtx?.user?._id && item.text !== "Thread")
        ) {
            // alert("This is not an authorized action, probably you are not owner of this content....")
            handleAnnTxt({mainText: "This is not an authorized action, probably you are not owner of this content...."})
        } else {
            optionsActions()
        }

        openDropdown(false)
    }

    return (
        <MenuItem
            sx={{
                p: 0,
                borderRadius: 2
            }}
        >
            <Tooltip title={(!appCtx?.user?._id && item.text !== "Thread") ? `Login to ${item.text}` : item.text}>
                <Button
                    sx={{ color: "text.primary", px: 2.4, }}
                    onClick={(!appCtx?.user?._id && item.text === "Thread") ? handleClick : (appCtx?.user?._id) ? handleClick : null}
                    startIcon={item.icon}
                >
                    <Typography variant='h6' sx={{ color: "text.primary", fontWeight: "bold" }}>{item.text}</Typography>
                </Button>
            </Tooltip>
        </MenuItem>
    )
}