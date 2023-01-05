import { Paper, Typography } from '@mui/material'
import React, { useContext } from 'react'
import { useParams } from 'react-router';
import { AppContexts } from '../App';
import UserProfileInfoSection from '../components/UserProfileInfoSection'
import { RenderAllPostsTab } from './UserProfile';

function VisitAnotherUserProfile() {
    let params = useParams()
    // console.log(params.userID, params, "paRAMS!!")
    let appCtx = useContext(AppContexts);

    return (
        <Paper>
            <Typography variant="h2">User Profile</Typography>
            <UserProfileInfoSection userId={params.userID} appCtx={appCtx} />
            <RenderAllPostsTab />
        </Paper>
    )
}

export default VisitAnotherUserProfile