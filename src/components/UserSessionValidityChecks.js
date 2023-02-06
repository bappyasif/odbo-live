import { Dialog, DialogContent, DialogContentText, DialogTitle, Paper, Stack, Typography } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { AppContexts } from '../App'
import { useToCloseModalOnClickedOutside } from '../hooks/toDetectClickOutside';
import { removeJwtDataFromLocalStorage } from '../utils';

function UserSessionValidityChecks() {
    let [showPrompt, setShowPrompt] = useState(false);
    const appCtx = useContext(AppContexts);
    // const location = useLocation()

    const handleShowPrompt = () => {
        let timer = setTimeout(() => {
            // alert("Session needs to be reauthorized, only 10 seconds left till it expires!!")
            setShowPrompt(true);
        }, 20000)

        return () => clearTimeout(timer)
    }

    const precursoryProcesses = () => {
        // appCtx.handleLastVisitedRouteBeforeSessionExpired("/");
        removeJwtDataFromLocalStorage()
        appCtx.getUserDataFromJwtTokenStoredInLocalStorage();
    }

    const prepareForNewSession = () => {
        const timer = setTimeout(() => {
            // alert("routing to login page for re-authorization")
            precursoryProcesses();
        }, 10000)

        return () => clearTimeout(timer)
    }

    useEffect(() => {
        showPrompt && prepareForNewSession()
    }, [showPrompt])

    useEffect(() => {
        handleShowPrompt()
    }, [])

    return (
        <Stack>
            {showPrompt ? <ShowExpiryCountDown /> : null}
        </Stack>
    )
}

const ShowExpiryCountDown = () => {
    let [count, setCount] = useState(null);
    let [timer, setTimer] = useState(null);
    let [show, setShow] = useState(false);

    const ref = useRef();

    // const beginCountDown = () => {
    //     const timer = setInterval(() => {
    //         console.log(count, timer, "checks!!", timer < 10000)
    //         if(timer < 10000) {
    //             setCount(prev => prev-1)
    //             timer += 1000
    //         } else {
    //             clearInterval(timer)
    //         }
    //     }, 1000)

    //     return () => clearInterval(timer);
    // }

    const beginCountDown = () => {
        const timer = setInterval(() => {
            setCount(prev => prev-1)
        }, 1000)

        setTimer(timer)
        setShow(true);
        
        return () => clearInterval(timer);
    }

    // useToCloseModalOnClickedOutside(ref, () => setCount(0))
    useToCloseModalOnClickedOutside(ref, () => setShow(false))

    useEffect(() => {
        count === 10 && beginCountDown();
        count === 1 && clearInterval(timer);
        !show && count === 4 && setShow(true)
    }, [count])

    useEffect(() => {
        setCount(10);
        setShow(false);
        // beginCountDown();
    }, [])

    return (
        <Paper
            ref={ref}
        >
            <Dialog open={show}>
            <DialogTitle>
                <Typography variant='h4'>Session Is Expiring In {count}</Typography>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>You will be taken to Login Page for re authentication</DialogContentText>
            </DialogContent>
        </Dialog>
        </Paper>
        // <Stack 
        //     sx={{
        //         backgroundColor: "darkslategray",
        //         color: "whitesmoke",
        //         // position: "absolute",
        //         // width: "fit-content",
        //         // zIndex: 99,
        //         // left: "20%"
        //     }}
        //     ref={ref}
        // >
        //     <Typography variant='h4'>Session Is Expiring In {count}</Typography>
        //     <DialogContentText>You will be taken to Login Page for re authentication</DialogContentText>
        // </Stack>
        // <Dialog ref={ref} open={count}>
        //     <DialogTitle>
        //         <Typography variant='h4'>Session Is Expiring In {count}</Typography>
        //     </DialogTitle>
        //     <DialogContent>
        //         <DialogContentText>You will be taken to Login Page for re authentication</DialogContentText>
        //     </DialogContent>
        // </Dialog>
    )
}

export default UserSessionValidityChecks