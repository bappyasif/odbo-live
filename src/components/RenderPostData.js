import { Avatar, Card, CardContent, CardHeader, Typography } from '@mui/material'
import moment from 'moment'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AppContexts } from '../App'
import ShowUserPostMedias from './ShowUserPostMedias'
import { readDataFromServer } from '../utils'
import { sanitize } from 'dompurify'

function RenderPostDataEssentials({ postData, shareMode }) {
    let { body, created, gif, poll, privacy, imageUrl, videoUrl, _id } = { ...postData }

    let [userData, setUserData] = useState({})

    const appCtx = useContext(AppContexts)

    let handleUserData = (result) => setUserData(result.data.data)

    let getDataAboutThisPostUser = () => {
        // let url = `${appCtx.baseUrl}/users/${postData.userId}`
        let url = `${appCtx.baseUrl}/users/${postData.userId}/publicPayload`
        readDataFromServer(url, handleUserData)
    }

    useEffect(() => {
        postData.userId && getDataAboutThisPostUser()
    }, [])

    let preparingAdditionalsForRendering = {
        Id: _id,
        Image: imageUrl,
        Video: videoUrl,
        Gif: gif[0],
        Poll: poll[0],
        Privacy: privacy
    }

    return (
        <>
            <Card>
                <RenderCardHeader userData={userData} />

                {shareMode ? null : <Typography sx={{ display: {xs: "none", sm: "block"}, color: "info", position: "absolute", top: 29, right: 20 }} variant="subtitle2">{`Live Since: ${moment(created).fromNow()}`}</Typography>}

                <RenderCardContent postId={postData._id} body={body} preparingAdditionalsForRendering={preparingAdditionalsForRendering} />
            </Card>
        </>
    )
}

export const RenderCardContent = ({ postId, body, preparingAdditionalsForRendering }) => {
    const params = useParams();

    const navigate = useNavigate()

    let handleShowThread = () => {
        navigate(`/posts/${postId}/comments/`)
    }

    return (
        <CardContent
            sx={{
                cursor: params.postId ? "auto" : "pointer",
                pointerEvents: (params.postId && !preparingAdditionalsForRendering["Poll"]?.question) ? "none" : "auto"
            }}
            onClick={handleShowThread}
        >
            <Typography variant='h4' sx={{ color: "primary.light", p: .2, textAlign: "justify", margin: "0 20px 0 108px" }} dangerouslySetInnerHTML={{ __html: sanitize(body) }}></Typography>
            <ShowUserPostMedias mediaContents={preparingAdditionalsForRendering} />
        </CardContent>
    )
}

export const RenderCardHeader = ({ userData, forComment }) => {
    let appCtx = useContext(AppContexts);

    return (
        <CardHeader
            sx={{
                backgroundColor: forComment ? "primary.light" : "info.light"
            }}
            avatar={
                <Link className='posted-by' style={{ textDecoration: "none" }} to={appCtx?.user?._id ? `/users/${userData?._id}/visit/profile` : '/'}>
                    <Avatar
                        src={userData?.ppUrl || "https://random.imagecdn.app/500/150"}
                        sx={{ bgcolor: "red[500]", width: forComment ? "42px" : "74px", height: forComment ? "42px" : "74px" }}
                        aria-label="recipe"
                        alt={`User ${userData?.fullName || ''} profile display`}
                    />
                    <p className='posted-by-tooltip-text'>{appCtx?.user?._id ? "Visit Profile" : "Login To Visit Profile"}</p>
                </Link>
            }
            title={
                <Link className='posted-by' style={{ textDecoration: "none" }} to={appCtx?.user?._id ? `/users/${userData?._id}/visit/profile` : '/'}>
                    <Typography sx={{color: "info.contrastText"}} variant={forComment ? "h6" : "h4"}>{userData?.fullName || "User Name"}</Typography>
                    <p className='posted-by-tooltip-text'>{appCtx?.user?._id ? "Visit Profile" : "Login To Visit Profile"}</p>
                </Link>
            }
            subheader={
                <Typography sx={{ color: "info.contrastText", fontSize: forComment ? "smaller" : "auto" }} variant={forComment ? "p" : "subtitle2"}>{`Member Since: ${moment(userData?.created).fromNow()}`}</Typography>
            }
        />
    )
}

export default RenderPostDataEssentials