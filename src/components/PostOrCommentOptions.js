import { DangerousTwoTone, DvrTwoTone, ModeEditTwoTone, MoreVertTwoTone, SettingsSuggestTwoTone } from '@mui/icons-material';
import { Box, Button, ClickAwayListener, IconButton, MenuItem, MenuList, Popper, Tooltip, Typography } from '@mui/material';
import React, { useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContexts } from '../App';
import { deleteResourceFromServer } from '../utils';

export const PostOrCommentOptions = ({ postOwner, postId, commentId, deleteCommentFromDataset, userId, showEditableText }) => {
    let [showMenu, setShowMenu] = useState(false);
    let [anchorEl, setAnchorEl] = useState(null)

    let ref = useRef();

    let options = [{ text: "Edit", icon: <ModeEditTwoTone /> }, { text: "Delete", icon: <DangerousTwoTone /> }, { text: "Thread", icon: <DvrTwoTone /> }]

    if (commentId) {
        options = options.filter(item => item.text !== "Thread");
    } else if (postId) {
        options = options.filter(item => item.text !== "Edit");
    }

    let renderOptions = () => options.map(item => <RenderPostOption key={item.text} postOwner={postOwner} item={item} postId={postId} commentId={commentId} deleteCommentFromDataset={deleteCommentFromDataset} openDropdown={setShowMenu} userId={userId} showEditableText={showEditableText} />)

    let handleClick = (e) => {
        setShowMenu(!showMenu)
        setAnchorEl(e.currentTarget)
    }

    const handleClose = () => {
        setShowMenu(false)
        setAnchorEl(null)
    }

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
            <Tooltip title="click to open menu">
                <IconButton
                    sx={{ color: "info.contrastText" }}
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

let RenderPostOption = ({ postOwner, item, postId, commentId, deleteCommentFromDataset, openDropdown, userId, showEditableText }) => {
    let appCtx = useContext(AppContexts);

    const navigate = useNavigate()

    let deleteThisPostFromAppData = () => {
        if (postId) {
            appCtx.deletePostFromAvailablePostsFeeds(postId)
        } else {
            deleteCommentFromDataset(commentId)
        }
    }

    const commenceDelete = (url, data) => {
        const userChoice = prompt("Are you sure you want to delete? Deleted data is not again retrieveable....Type in Y to delete", "N")

        if (userChoice === "Y" || userChoice === "y") {
            deleteResourceFromServer(url, data, deleteThisPostFromAppData)
        } else {
            alert("you chose not to delete :)")
        }
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
            alert("This is not an authorized action, probably you are not owner of this content....")
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
                    sx={{color: "text.primary", px: 2.4,}}
                    onClick={(!appCtx?.user?._id && item.text === "Thread") ? handleClick : (appCtx?.user?._id) ? handleClick : null}
                    startIcon={item.icon}
                >
                    <Typography variant='h6' sx={{color: "text.primary", fontWeight: "bold"}}>{item.text}</Typography>
                </Button>
            </Tooltip>
        </MenuItem>
    )
}