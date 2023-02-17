import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React, { useEffect, useState } from 'react'

function AnnouncementAlert({titleText, mainText, handleAnnoucement}) {
    let [show, setShow] = useState(false);
    const handleOk = () => {
        console.log("okay clicked")
        setShow(false);
        handleAnnoucement();
    }
    useEffect(() => {
        setShow(true)
    }, [titleText])
  return (
    <Dialog
        open={show}
        onClose={handleOk}
    >
        <DialogTitle>{titleText ? titleText : "This is a title"}</DialogTitle>
        <DialogContent>
            <DialogContentText>{mainText ? mainText : "this is descriptive text"}</DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleOk}>OK</Button>
        </DialogActions>
    </Dialog>
  )
}

export default AnnouncementAlert