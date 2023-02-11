import { CircularProgress, Stack, Typography } from '@mui/material'
import React, { useContext, useEffect } from 'react'
import { AppContexts } from '../App'

function LoadingPage() {
    const appCtx = useContext(AppContexts);

    const startTimer = () => {
        let timer = setTimeout(() => {
            // appCtx.toggleLoadingStatus()
            appCtx.turnOffLoading()
        }, 1100)

        return () => clearTimeout(timer)
    }

    useEffect(() => {
        startTimer();
    }, [])

    return (
        <Stack sx={{
            minHeight: "100vh"
        }}>
            {/* <CircularProgress color='success' sx={{height: "200px", margin: "auto"}} /> */}
            <Typography variant='h2'>Please wait while page is loading, thank you :) <span><CircularProgress color='secondary' sx={{ margin: "auto"}} /></span> </Typography>
            {/* <Typography variant='h2'>Please wait while page is loading, thank you :) <Typography variant='h4'><CircularProgress color='secondary' sx={{ margin: "auto"}} /></Typography> </Typography> */}
            {/* <Typography variant='h2'>Please wait while page is loading, thank you :) <Typography variant='h4'><CircularProgress color='secondary' sx={{ width:"400px", margin: "auto"}} /></Typography> </Typography> */}
        </Stack>
    )
}

export default LoadingPage