import { Typography } from '@mui/material'
import React, { useEffect } from 'react'

function LoginSuccess() {
    useEffect(() => {
        setTimeout(() => {
            window.close()
        }, 1100)
    }, [])
  return (
    <Typography variant='h1'>Thanks for loging in!!</Typography>
  )
}

export default LoginSuccess