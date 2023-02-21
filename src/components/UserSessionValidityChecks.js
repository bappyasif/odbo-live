import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Stack, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContexts } from '../App'
import { removeJwtDataFromLocalStorage } from '../utils';

function UserSessionValidityChecks() {
    let [showPrompt, setShowPrompt] = useState(false);
    
    const appCtx = useContext(AppContexts);
    
    const navigate = useNavigate()

    const handleShowPrompt = () => {
        let timer = setTimeout(() => {
            // Session needs to be reauthorized, only 10 seconds left till it expires!!
            setShowPrompt(true);
        }, 198000)

        return () => {
            clearTimeout(timer)
        }
    }

    const precursoryProcesses = () => {
        removeJwtDataFromLocalStorage()
        appCtx.getUserDataFromJwtTokenStoredInLocalStorage();
        navigate("/login");
    }

    useEffect(() => {
        handleShowPrompt()
    }, [showPrompt])

    return (
        <Stack>
            {showPrompt ? <ShowExpiryCountDown setShowPrompt={setShowPrompt} precursoryProcesses={precursoryProcesses} /> : null}
        </Stack>
    )
}

const ShowExpiryCountDown = ({setShowPrompt, precursoryProcesses}) => {
    let [count, setCount] = useState(null);
    let [timer, setTimer] = useState(null);
    let [show, setShow] = useState(false);

    const appCtx = useContext(AppContexts);

    const beginCountDown = () => {
        const timer = setInterval(() => {
            setCount(prev => prev-1)
        }, 1000)

        setTimer(timer)
        setShow(true);
        
        return () => clearInterval(timer);
    }

    const closeModal = () => setShow(false)

    const reAuthorizeTokenValidity = () => {
        appCtx.getUserDataFromJwtTokenStoredInLocalStorage();
        setShowPrompt(false);
        setTimer(null)
        closeModal();
    }

    useEffect(() => {
        count === 10 && beginCountDown();
        count === 0 && clearInterval(timer);
        !show && count === 4 && setShow(true)
        count === 0 && precursoryProcesses()
    }, [count])

    useEffect(() => {
        setCount(10);
        closeModal()
    }, [])

    return (
        <Paper>
            <Dialog
                onClose={closeModal} 
                open={show}
            >
            <DialogTitle>
                <Typography variant='h4'>Session Is Expiring In {count}</Typography>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>You will be taken to Login Page for re authentication</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={reAuthorizeTokenValidity} variant="contained" fullWidth="true">Click Here To Stay Logged In....</Button>
            </DialogActions>
        </Dialog>
        </Paper>
    )
}

export default UserSessionValidityChecks