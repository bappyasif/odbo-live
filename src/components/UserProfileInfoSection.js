import { Edit, WallpaperRounded } from '@mui/icons-material'
import { Box, Button, Container, Divider, Fab, IconButton, ImageListItem, ImageListItemBar, Paper, Stack, TextField, Typography } from '@mui/material'
import moment from 'moment'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { AppContexts } from "../App"
import { ButtonToIndicateHelp, HowToUseUserProfilePage } from '../components/HowToUseApp'
import { checkIfItHasJpgExtension } from '../routes/EditUserProfile'
import { readDataFromServer, updateDataInDatabase } from '../utils'
import { MutualFriends } from '../routes/ConnectUsers'

function UserProfileInfoSection({ appCtx, userId }) {
    let [userProfileData, setUserProfileData] = useState({})

    const userprofileDataHandler = result => setUserProfileData(result.data.data)

    let getDataForUserProfile = () => {
        // let url = `${appCtx.baseUrl}/users/${userId}`
        let url = `${appCtx.baseUrl}/users/${userId}/publicPayload`
        readDataFromServer(url, userprofileDataHandler)
    }

    useEffect(() => {
        // if there is a user id passed on from a route, that means a "user profile id" which data needs to be gathered from server
        userId && getDataForUserProfile()
        // if its not coming from route params, that means user is visiting its own profile, thus updating with its value instead
        appCtx && !userId && setUserProfileData(appCtx.user)
    }, [])

    // making sure every time when another user profile is getting visited from that same visiting user profile route, it refreshes already existing dataset before rendering
    useEffect(() => {
        userId && setUserProfileData({})
        userId && getDataForUserProfile()
    }, [userId])

    useEffect(() => {
        !userId && setUserProfileData(appCtx.user)
    }, [appCtx.user])

    return (
        <Box sx={{ mb: 2, backgroundColor: "text.secondary" }}>
            <RenderUserProfilePhoto userData={userProfileData._id ? userProfileData : appCtx.user} fromPP={false} forVisitingProfile={userId} />

            <Box
                sx={{
                    width: { xs: 450, sm: 620, md: 920 },
                    margin: "auto", bgcolor: "gainsboro",
                    pl: 2, pr: 2, pb: .1, borderRadius: 2
                }}
            >
                {
                    userProfileData._id
                        ?
                        <Stack
                            sx={{
                                backgroundColor: "primary.light",
                                color: "info.contrastColor",
                                px: 1.1
                            }}
                        >
                            <UserNameAndInfo userData={userProfileData} userId={userId} />
                            <Divider variant="fullWidth" sx={{ mt: 1.1 }} />
                            <SomeUserSpecificInfo userData={userProfileData} forCurrentUserProfile={userId === appCtx.user._id ? true : userId ? false : true} />
                            <UserFriendsAndInfo userData={userProfileData} />
                        </Stack>
                        : null
                }
            </Box>
        </Box>
    )
}

let RenderUserProfilePhoto = ({ userData, fromPP, forVisitingProfile }) => {
    let { ppUrl, cpUrl, fullName } = { ...userData }

    let [showModal, setShowModal] = useState(false);

    let toggleShowModal = () => setShowModal(!showModal);

    let closeShowModal = () => setShowModal(false);

    let decideImgResourceUrl = () => {
        let src = "";

        if (fromPP && ppUrl) {
            src = checkIfItHasJpgExtension(ppUrl) ? ppUrl : `${ppUrl}`
        } else if (fromPP && !ppUrl) {
            src = `${fakeDataModel[0].coverPhotoUrl}?w85&h95&fit=crop&auto=format`
        } else if (!fromPP && cpUrl) {
            src = checkIfItHasJpgExtension(cpUrl) ? cpUrl : `${cpUrl}?w85&h95&fit=crop&auto=format`
        } else if (!fromPP && !cpUrl) {
            src = `${fakeDataModel[0].coverPhotoUrl}?w85&h95&fit=crop&auto=format`
        }

        return src;
    }

    return (
        <Stack
            sx={{
                flexDirection: "column",
                position: "relative",
            }}
        >
            <ImageListItem>
                <img
                    src={decideImgResourceUrl()}
                    // srcSet={`${decideImgResourceUrl()}&dpr= 2 2x`}
                    alt={`user ${fullName ? fullName : "X"} profile display`}
                    loading='lazy'
                    style={{objectFit: fromPP ? "fill" : "cover"}}
                />
                {
                    forVisitingProfile
                        ? null
                        : <ImageListItemBar
                            sx={{
                                justifyContent: "center",
                            }}

                            title={<Typography variant="h6">{fromPP ? "Profile" : "Cover"} Photo</Typography>}

                            onClick={toggleShowModal}

                            actionIcon={
                                <IconButton
                                >
                                    <WallpaperRounded
                                        sx={{ color: "floralwhite" }}
                                    />
                                </IconButton>
                            }
                        />
                }
            </ImageListItem>

            {showModal ? <ShowUrlGrabbingModal closeModal={closeShowModal} fromPP={fromPP} /> : null}
        </Stack>
    )
}

let ShowUrlGrabbingModal = ({ closeModal, fromPP }) => {
    let [urlText, setUrlText] = useState(null);

    let appCtx = useContext(AppContexts);

    let url = `${appCtx.baseUrl}/users/${appCtx.user._id}/profile`

    let afterUpdateIsSuccessfull = () => {
        appCtx.updateUserProfileDataInApp(fromPP ? "ppUrl" : "cpUrl", urlText);
        closeModal()
    }

    let handlPhotoUrlUpload = () => {
        let data = { [fromPP ? "ppUrl" : "cpUrl"]: urlText }
        updateDataInDatabase(url, data, afterUpdateIsSuccessfull)
    }
    let handleClick = () => {
        if (urlText) {
            handlPhotoUrlUpload();
        } else {
            alert("Enter A Valid Url!!")
        }
    }

    let handleUrlInput = (evt) => setUrlText(evt.target.value)

    return (
        <Paper
            sx={{
                position: "absolute",
                p: 2,
                pl: .4,
                pr: .4,
                backgroundColor: "honeydew",
                borderRadius: 2,
                left: fromPP ? "29%" : "38.7%",
                bottom: fromPP ? "12.1%" : "0%"
            }}
        >
            <Container
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column"
                }}
            >
                <TextField onChange={handleUrlInput} fullWidth={true} id='outline-basic' label={`Enter Your New ${fromPP ? "Profile Photo" : "Cover Image"} Url`} variant={"outlined"} color="secondary" />
                <Stack
                    sx={{
                        flexDirection: "row",
                        gap: 2,
                        mt: 1.3
                    }}
                >
                    <Button onClick={handleClick} size="large" variant="contained" color="success">Update Photo</Button>
                    <Button onClick={closeModal} size="large" variant="contained" color="secondary">Keep Existing</Button>
                </Stack>
            </Container>
        </Paper>
    )
}

let SomeUserSpecificInfo = ({ userData, forCurrentUserProfile }) => {
    let { bio, created, webLink } = { ...userData }

    let innerStackStyles = { flexDirection: "row", gap: "35px", alignItems: "baseline" }

    let items = [{ name: "Bio", value: bio || fakeDataModel[0].bio }]

    let renderBio = () => items.map(item => <RenderUserProfileData key={item.name} item={item} styles={innerStackStyles} />)

    let otherItems = [{ name: "Joined", value: moment(created ? created : fakeDataModel[0].created).format("MM-DD-YYYY") }, { name: "Website", value: webLink ? webLink : fakeDataModel[0].weblink }]

    let renderOtherItems = () => otherItems.map(item => <RenderUserProfileData key={item.name} item={item} styles={innerStackStyles} />)

    return (
        <Stack sx={{ textAlign: "justify", mt: 2 }}>
            {renderBio()}

            <Stack
                sx={{
                    flexDirection: { xs: "column", md: "row" },
                    justifyContent: "space-between", mt: 2
                }}
            >
                {renderOtherItems()}
                {
                    forCurrentUserProfile
                        ? null
                        : <MutualFriends friends={userData.friends} variantType="h6" forProfile={!forCurrentUserProfile} />
                }
            </Stack>
        </Stack>
    )
}

let UserFriendsAndInfo = ({ userData }) => {
    let { friends, frSent, frRecieved } = { ...userData }

    let innerStackStyles = { flexDirection: "row", gap: "35px", alignItems: "baseline" }

    let items = [{ name: "Friends count", value: friends?.length || fakeDataModel[0].friends }, { name: "Friend Requests Recieved", value: frRecieved?.length || fakeDataModel[0].frRcvd }, { name: "Friend Requests Sent", value: frSent?.length || fakeDataModel[0].frSent }]

    let renderItems = () => items.map(item => <RenderUserProfileData key={item.name} item={item} styles={innerStackStyles} />)

    return (
        <Stack
            sx={{ 
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "space-between", mt: 2, mb: 2
            }}
        >
            {renderItems()}
        </Stack>
    )
}

let UserNameAndInfo = ({ userData, userId }) => {
    let { fullName, email } = { ...userData }

    const appCtx = useContext(AppContexts);

    let navigate = useNavigate();

    let styles = {
        flexDirection: "row",
        gap: 2,
        mt: .6,
        alignItems: "baseline",
        justifyContent: "space-between"
    }

    let items = [{ name: "FullName", value: fullName || fakeDataModel[0].fullName }, { name: "Email", value: email || fakeDataModel[0].email }]

    let renderItems = () => items.map(item => <RenderUserProfileData key={item.name} item={item} styles={styles} />)

    let handleClick = () => {
        navigate("/edit-user-profile")
    }

    return (
        <Stack
            sx={{ flexDirection: "column", gap: .6, mt: .6 }}
        >
            <RenderUserProfilePhoto userData={userData} fromPP={true} forVisitingProfile={userId} />
            <Stack
                sx={{
                    flexDirection: { xs: "column", md: "row" },
                    gap: { xs: .9, md: 2, lg: 4 },
                    mt: .6,
                    alignItems: "baseline",
                    justifyContent: "space-around",
                    position: "relative",
                    flexWrap: "wrap"
                }}
            >
                <ButtonToIndicateHelp alertPosition={{ left: 0 }} forWhichItem={"User Profile Page"} />
                {appCtx.dialogTextFor === "User Profile Page" ? <HowToUseUserProfilePage /> : null}

                {renderItems()}
                {
                    !userId
                        ?
                        <Fab
                            sx={{
                                position: { sm: "absolute", md: "relative" },
                                right: { sm: 0 }
                            }}
                            onClick={handleClick} variant="extended" color="primary" aria-label="add"
                        >
                            <Edit sx={{ mr: 1 }} />
                            Edit Info
                        </Fab>
                        : null
                }
            </Stack>
        </Stack>
    )
}

let RenderUserProfileData = ({ item, styles }) => {
    let assignNameVariant = () => (item.name === "Email" || item.name === "FullName") ? "h5" : "h6"

    let assignValueVariant = () => (item.name === "Email" || item.name === "FullName") ? "h4" : "h6"

    return (
        <Stack
            sx={{ ...styles }}
        >
            <Typography fontWeight={"bold"} variant={assignNameVariant()}>{item.name}: </Typography>
            <Typography variant={assignValueVariant()}>{item.value}</Typography>
        </Stack>
    )
}

export let fakeDataModel = [
    {
        fullName: "FULL NAME",
        email: "email@ail.vod",
        friends: 4,
        frSent: 4,
        frRcvd: 4,
        coverPhotoUrl: "https://picsum.photos/500/150",
        profilePhotoUrl: "https://picsum.photos/85/95",
        bio: "loremipsum",
        weblink: "https://www.twitter.com/axby",
        created: new Date().toISOString(),
    }
]

export default UserProfileInfoSection