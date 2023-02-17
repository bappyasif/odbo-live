import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React, { useEffect, useState } from 'react'

function ConsentsPrompt({ elementName, titleText, mainText, primaryAction, cancelAction }) {
    let [show, setShow] = useState(false);

    const closeModal = () => setShow(false);
    const openModal = () => setShow(true);

    const handleYes = () => {
        console.log("handle yes")
        primaryAction()
    }

    const handleNo = () => {
        console.log("handle no")
        closeModal()
        cancelAction()
    }

    useEffect(() => {
        openModal();
        // console.log(titleText, "titleText")
    }, [elementName])

    // useEffect(() => {
    //     openModal()
    // }, [])

    return (
        <Dialog
            open={show}
            onClose={handleNo}
        >
            <DialogTitle>{titleText || "This is a test Dialog Title"}</DialogTitle>
            <DialogContent>
                <DialogContentText>{mainText || "This is a more decription of what needs to be done"}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleYes}>Yes</Button>
                <Button onClick={handleNo}>No</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConsentsPrompt