import { Cancel, Update } from '@mui/icons-material';
import { Box, Fab, Stack, TextField, Tooltip } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import { AppContexts } from '../App';
import { updateDataInDatabase } from '../utils';

export const EditComment = ({ commentId, doneEditing, body, updateCommentText, updateCommentTextFromThread }) => {
    let [text, setText] = useState();

    let handleTextChange = (evt) => setText(evt.target.value)

    useEffect(() => setText(body), [])

    return (
        <Box
            sx={{
                position: "relative",
            }}
        >
            <EditConfirmationActions commentText={text} commentId={commentId} doneEditing={doneEditing} updateCommentText={updateCommentText} updateCommentTextFromThread={updateCommentTextFromThread} />
            
            <TextField value={text} onChange={handleTextChange} />
        </Box>
    )
}

const EditConfirmationActions = ({commentText, commentId, doneEditing, updateCommentText, updateCommentTextFromThread}) => {
    const options = [{ name: "Update", icon: <Update /> }, { name: "Cancel", icon: <Cancel /> }]
    
    let renderOptions = () => options.map(item => <RenderOption key={item.name} item={item} commentText={commentText} commentId={commentId} doneEditing={doneEditing} updateCommentText={updateCommentText} updateCommentTextFromThread={updateCommentTextFromThread} />)

    return (
        <Stack
            sx={{
                position: "absolute",
                right: 0,
                flexDirection: "row"
            }}
        >
            {renderOptions()}
        </Stack>
    )
}

const RenderOption = ({ item, commentId, commentText, doneEditing, updateCommentText, updateCommentTextFromThread }) => {
    let appCtx = useContext(AppContexts);

    const updateCommentTextInCurrentAppDataset = () => {
        if(updateCommentTextFromThread) {
            updateCommentTextFromThread(commentId, commentText)
        } else {
            updateCommentText(commentId, commentText) 
        }
    }
    
    const updateCommentTextInDatabase = () => {
        let url = `${appCtx.baseUrl}/comments/${commentId}/text`
        updateDataInDatabase(url, {body: commentText}, updateCommentTextInCurrentAppDataset)
    }

    const handleClick = evt => {
        if(item.name === "Update") {
            updateCommentTextInDatabase()
        } else if(item.name === "Cancel") {
            console.log("Cancel here!!")
        }
        
        doneEditing()
    }

    return (
        <Tooltip title={item.name}>
            <Fab onClick={handleClick} color="secondary" aria-label="edit">
                {item.icon}
            </Fab>
        </Tooltip>
    )
}