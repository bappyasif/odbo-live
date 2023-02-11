import { CircularProgress, Stack, Typography } from '@mui/material'
import React, { useContext, useEffect } from 'react'
import { AppContexts } from '../App'

function LoadingPage() {
    const appCtx = useContext(AppContexts);

    const startTimer = () => {
        let timer = setTimeout(() => {
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
            <Typography variant='h2'>Please wait while page is loading, thank you :) <span><CircularProgress color='secondary' sx={{ margin: "auto"}} /></span> </Typography>
        </Stack>
    )
}

export default LoadingPage