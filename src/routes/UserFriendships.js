import { AccountCircleTwoTone, HowToRegRounded, MoreVertTwoTone, PersonOffRounded, PersonOffTwoTone, UndoTwoTone } from '@mui/icons-material';
import { Avatar, Box, Card, CardActions, CardContent, CardHeader, ClickAwayListener, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Paper, Popper, Stack, Tooltip, Typography } from '@mui/material'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContexts } from '../App'
import { useToCloseModalOnClickedOutside } from '../hooks/toDetectClickOutside';
import { ButtonToIndicateHelp, HowToUseExistingFriendsListings, HowToUseFriendsRequestsListings } from '../components/HowToUseApp';
import { performProtectedUpdateOperation, readDataFromServer, updateDataInDatabase, updateUserInDatabase } from '../utils';
import { MutualFriends } from './ConnectUsers';
import ConsentsPrompt from '../components/ConsentsPrompt';
import moment from 'moment';

let UserFriendships = () => {
    const appCtx = useContext(AppContexts);

    useEffect(() => {
        appCtx.handleLastVisitedRouteBeforeSessionExpired("/user-friendships")
        appCtx.getUserDataFromJwtTokenStoredInLocalStorage();
    }, [])

    return (

        <Paper
            sx={{
                display: "flex",
                // flexDirection: "row",
                flexDirection: { xs: "column", lg: "row" },
                justifyContent: "center",
                alignItems: "flex-start",
                // backgroundColor: "info.dark",
                color: "info.contrastText",
                // gap: 9
                gap: { xs: 4, md: 5, lg: 6 },
                padding: "0 65px",
                // height: "100vh"
                height: "100%"
            }}
        >
            <ExistingFriendList />
            {/* <FriendsRequests /> */}
            <RenderAllFriendReuests />
        </Paper>
    )
}

let ExistingFriendList = () => {
    let appCtx = useContext(AppContexts);

    let renderFriends = () => appCtx?.user?.friends?.map(frnd => <RenderFriend key={frnd} friendID={frnd} baseUrl={appCtx.baseUrl} />)

    // console.log(appCtx?.user?.friendships, appCtx?.user)

    return (
        <Paper sx={{ backgroundColor: "secondary.dark", color: "text.primary", width: { xs: "100%", lg: "100%" } }}>
            <Typography variant="h4">Friends Listings:</Typography>
            <Divider sx={{ height: 2, my: .8, backgroundColor: "darkslategray" }} />
            <Stack sx={{ gap: 1.1 }}>
                {renderFriends()}
            </Stack>
            {
                appCtx?.user?.friends?.length === 0
                    ?
                    <Typography
                        variant="h6"
                        sx={{
                            // outline: "solid .6px lightskyblue",
                            borderRadius: 2,
                            // mt: 4, 
                            p: 1.1
                        }}
                    >
                        Friends list is empty, add some :)
                    </Typography>
                    : null
            }
        </Paper>
    )
}

let RenderFriend = ({ friendID, baseUrl }) => {
    let [data, setData] = useState();
    let [showActionOptions, setShowActionOptions] = useState(false);
    let [showMenu, setShowMenu] = useState(null)
    let [annTxt, setAnnTxt] = useState({});

    const menuRef = useRef();

    const handleAnnTxt = (data) => setAnnTxt(prev => ({ ...prev, ...data }))

    const clearAnnTxt = () => setAnnTxt({})

    const handleOpenMenu = (e) => {
        setShowMenu(e.currentTarget)
        setShowActionOptions(true)
    }

    const handleCloseMenu = (e) => {
        setShowMenu(null)
        setShowActionOptions(false)
    }

    const appCtx = useContext(AppContexts)

    let toggleShowActionOptions = () => setShowActionOptions(!showActionOptions);

    let dataHandler = dataset => {
        setData(dataset.data.data)
    }

    let getFriendData = () => {
        let url = `${baseUrl}/users/${friendID}/publicPayload`
        readDataFromServer(url, dataHandler)
    }

    useEffect(() => {
        friendID && getFriendData()
    }, [])

    return (
        data?.fullName
            ?
            <Stack
                sx={{
                    outline: showActionOptions ? "none" : "solid .6px lightskyblue",
                    borderRadius: 2,
                }}
            >
                <Card
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        // flexDirection: {xs: "column", lg: "row"},
                        gap: 2,
                        alignItems: "flex-start",
                        position: "relative",
                        justifyContent: "space-between",
                        backgroundColor: "secondary.light", color: "text.primary"
                    }}
                >
                    <ButtonToIndicateHelp forWhichItem={"Existing Friends Listings"} />
                    {appCtx.dialogTextFor === "Existing Friends Listings" ? <HowToUseExistingFriendsListings /> : null}
                    <FriendCardHeader data={data} toggleShowActionOptions={toggleShowActionOptions} />
                    <CardContent sx={{ alignSelf: "center", width: "29%" }}>
                        <MutualFriends friends={data.friends} variantType="subtitle2" />
                    </CardContent>
                    <CardActions>
                        <IconButton
                            ref={menuRef}
                            sx={{ position: "relative" }}
                            onClick={handleOpenMenu}
                        >
                            <MoreVertTwoTone />
                        </IconButton>
                    </CardActions>
                </Card>

                {
                    annTxt?.elementName
                        ? <ConsentsPrompt elementName={annTxt.element} titleText={annTxt.titleText} mainText={annTxt.mainText} primaryAction={annTxt.primaryAction} cancelAction={annTxt.cancelAction} />
                        // : annTxt?.mainText
                        //     ? <AnnouncementAlert titleText={"App Alert!!"} mainText={annTxt.mainText} handleAnnoucement={clearAnnTxt} />
                        : null
                }

                {showActionOptions ? <ActionListOptions handleAnnTxt={handleAnnTxt} clearAnnTxt={clearAnnTxt} handleClose={handleCloseMenu} anchorEl={showMenu} friendId={data._id} toggleShowActionOptions={toggleShowActionOptions} /> : null}
            </Stack>
            : null
    )
}

let FriendCardHeader = ({ data }) => {
    const appCtx = useContext(AppContexts);

    let imgUrl = data.ppUrl || "https://random.imagecdn.app/76/56"

    const getFriendSinceWhen = () => {
        const obj = appCtx?.user?.friendships.find(item => Object.keys(item)[0] === data._id)
        const sinceWhen = obj && moment(obj[data?._id]).fromNow()
        return sinceWhen
        // return obj[data._id];
    }

    // console.log(data, "data!!", getFriendSinceWhen())

    return (
        data?._id
            ?
            <CardHeader
                sx={{
                    // width: "20vw", 
                    position: "relative",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: { xs: "baseline", md: "center" },
                    backgroundColor: "secondary.dark",
                    color: "text.primary",
                    p: 1.1
                }}
                avatar={
                    <Avatar
                        src={imgUrl}
                        sx={{ width: { xs: "42px", lg: "92px" }, height: { xs: "42px", lg: "62px" } }}
                    />
                }
                title={<Typography sx={{ fontSize: { xs: "small", md: "large", lg: "larger" }, wordBreak: "break-all" }} variant='h5'>{data.fullName}</Typography>}
                subheader={"Friend Since " + getFriendSinceWhen()}
            >
            </CardHeader>
            : null
    )
}

let ActionListOptions = ({ handleAnnTxt, clearAnnTxt, toggleShowActionOptions, friendId, anchorEl, handleClose }) => {
    let options = [{ name: "View Profile", icon: <AccountCircleTwoTone /> }, { name: "Remove From Friend List", icon: <PersonOffTwoTone /> }]

    let renderOptions = () => options.map(item => <RenderActionListOption key={item.name} item={item} toggleShowActionOptions={toggleShowActionOptions} friendId={friendId} handleAnnTxt={handleAnnTxt} clearAnnTxt={clearAnnTxt} />)

    // making popper get appropriate mui props value to initiate menu opening or close sequence
    const open = Boolean(anchorEl)

    return (
        <Popper
            sx={{ left: { xs: "-2px !important", md: "-92px !important", lg: "-164px !important" } }}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
        >
            <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                    sx={{ p: 0, outline: "solid .6px lightskyblue" }}
                >
                    {renderOptions()}
                </MenuList>
            </ClickAwayListener>
        </Popper>
    )
}

let RenderActionListOption = ({ item, toggleShowActionOptions, friendId, handleAnnTxt, clearAnnTxt }) => {
    let appCtx = useContext(AppContexts)

    let navigate = useNavigate()

    let removeFromCurentUserStateVariable = () => {
        appCtx.removeIdFromCurrentUserFriendsList(friendId)
        appCtx.removeFriendshipForThisFriendId(friendId)
    }

    let removeFromFriendList = () => {
        const url = `${appCtx.baseUrl}/users/${appCtx.user._id}/remove`
        const data = { friendId: friendId }

        // updateDataInDatabase(url, { friendId: friendId }, removeFromCurentUserStateVariable)
        performProtectedUpdateOperation(data, appCtx.user?.userJwt?.refreshToken, url, removeFromCurentUserStateVariable, "user-friendships", navigate)
    }

    let visitUserProfile = () => {
        navigate(`/users/${friendId}/visit/profile`)
    }

    let handleClick = () => {
        toggleShowActionOptions()
        if (item.name === "View Profile") {
            visitUserProfile()
        } else if (item.name.includes("Remove")) {
            // let userChose = prompt("Are you sure you want to REMOVE this user as a FRIEND? Type Y to continue", "N")
            handleAnnTxt({ elementName: "delete action", titleText: "Dangerous Action!! Proceed With Caution!!", mainText: "Are you sure you want to REMOVE this user as a FRIEND? Click Yes to Remove", primaryAction: removeFromFriendList, cancelAction: clearAnnTxt })
            // if (userChose === "Y" || userChose === "y") {
            //     removeFromFriendList()
            // } else {
            //     alert("You chose NOT TO REMOVE this user as a FRIEND")
            // }
        }
    }

    return (
        <MenuItem
            sx={{ p: 0 }}
        >
            <ListItem
                sx={{
                    mt: .11,
                    mr: .11,
                    pr: 1.1,
                    backgroundColor: 'secondary.dark',
                    color: "text.primary",
                    '&:hover': {
                        // color: "gainsboro",
                        backgroundColor: 'secondary.light',
                    },
                }}
                onClick={handleClick}
            >
                <ListItemAvatar>
                    <Avatar>
                        {item.icon}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    secondary={<Typography sx={{ fontSize: { xs: "small", md: "large", lg: "larger" }, fontWeight: "bolder", wordBreak: "break-all", px: 4 }} variant="h6">{item.name}</Typography>}
                />
            </ListItem>
        </MenuItem>
    )
}

// function FriendsRequests() {
//     let appCtx = useContext(AppContexts);

//     let renderFriendRequests = () => appCtx?.user?.frRecieved?.map(friendId => <ShowFriendRequest key={friendId} friendId={friendId} baseUrl={appCtx.baseUrl} />)

//     return (
//         <Paper
//             sx={{
//                 minWidth: "29vw",
//                 width: { xs: "100%", lg: "50%" },
//                 backgroundColor: "lightsteelblue",
//                 color: "primary.light"
//             }}
//         >
//             <Typography variant={'h4'}>Friend Requests Recieved</Typography>
//             <Divider />
//             <Box
//                 sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}
//             >
//                 {
//                     appCtx?.user?.frRecieved?.length
//                         ?
//                         renderFriendRequests()
//                         :
//                         <Typography variant='h6'>All Requests been caught up!!</Typography>
//                 }
//                 {/* {renderFriendRequests()} */}
//             </Box>
//         </Paper>
//     )
// }

const RenderAllFriendReuests = () => {
    let appCtx = useContext(AppContexts);
    const requestTypes = [
        { list: appCtx?.user?.frRecieved, type: "Recieved", actions: listAssets },
        { list: appCtx?.user?.frSent, type: "Sent", actions: sentRequestListAssets }
    ];

    const renderRequestTypes = () => requestTypes.map(item => <ReuseableFriendRequestsList key={item.type} friendsList={item.list} requestType={item.type} listAssets={item.actions} />)

    return (
        <Stack sx={{ gap: 6, width: "100%", alignItems: "center" }}>
            {renderRequestTypes()}
        </Stack>
    )
}


const ReuseableFriendRequestsList = ({ friendsList, requestType, listAssets }) => {

    let renderFriendRequests = () => friendsList?.map(friendId => <ShowFriendRequest key={friendId} friendId={friendId} actions={listAssets} />)

    return (
        <Paper
            sx={{
                minWidth: "29vw",
                minHeight: "20vh",
                width: { xs: "100%", lg: "83%" },
                backgroundColor: "secondary.dark",
                color: "text.primary",
                // p: .9
            }}
        >
            <Typography variant={'h4'}>Friend Requests {requestType}</Typography>
            <Divider sx={{ height: 2, my: .8, backgroundColor: "darkslategray" }} />
            <Box
                sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}
            >
                {
                    friendsList?.length
                        ?
                        renderFriendRequests()
                        :
                        <Typography variant='h6'>All Requests been caught up!!</Typography>
                }
                {/* {renderFriendRequests()} */}
            </Box>
        </Paper>
    )
}

let ShowFriendRequest = ({ friendId, actions }) => {
    let [data, setData] = useState({})

    // let url = `${baseUrl}/users/${friendId}`
    const appCtx = useContext(AppContexts);

    let url = `${appCtx.baseUrl}/users/${friendId}/publicPayload`

    let dataHandler = dataset => setData(dataset.data.data)

    useEffect(() => {
        readDataFromServer(url, dataHandler)
    }, [url])

    // let renderListAssets = () => listAssets.map(elem => <RenderListIconElement key={elem.tooltip} elem={elem} friendId={friendId} />)
    let renderListAssets = () => actions.map(elem => <RenderListIconElement key={elem.tooltip} elem={elem} friendId={friendId} />)

    return (
        <Stack sx={{ width: "100%", }}>
            <List sx={{ display: "flex", alignItems: "center", position: "relative" }}>

                <ButtonToIndicateHelp alertPosition={{ left: 0, top: 18 }} forWhichItem={"Friends Requests Listings"} />
                {appCtx.dialogTextFor === "Friends Requests Listings" ? <HowToUseFriendsRequestsListings /> : null}

                <ListItem
                    sx={{
                        outline: "solid .6px", outlineColor: "primary.dark", borderRadius: 2,
                        justifyContent: "space-around",
                        // flexDirection: { xs: "column", md: "row" }, 
                        flexDirection: "row",
                        pl: 0
                    }}
                >
                    <Stack sx={{ gap: .4, alignItems: "center", minWidth: "42%", justifyContent: "center" }}>
                        <Avatar
                            alt='user profile picture'
                            src={data?.ppUrl || 'https://random.imagecdn.app/76/56'}
                            sx={{ width: { xs: 49, md: 74, lg: 110 }, height: 47 }}
                        />

                        <Typography sx={{ mx: .6, wordBreak: "break-all", px: 4, width: "-webkit-fill-available" }} variant="h6" noWrap>{data?.fullName}</Typography>
                    </Stack>
                    <MutualFriends friends={data?.friends} variantType="p" actions={actions} />
                    <Stack
                        sx={{
                            flexDirection: "row",
                            ml: 2,
                            mt: { xs: 2, md: 0 }
                        }}
                    >
                        {renderListAssets()}
                    </Stack>
                </ListItem>
            </List>
        </Stack>
    )
}

let RenderListIconElement = ({ elem, friendId }) => {
    let appCtx = useContext(AppContexts);
    let navigate = useNavigate()

    let handleClick = evt => {
        let url = `${appCtx.baseUrl}/users/${appCtx.user._id}`;

        if (elem.tooltip === "Accept") {
            let data = { accept: friendId }
            // todo
            // updateUserInDatabase(`${url}/accept`, data, appCtx.acceptOrRejectFriendRequestUpdater, navigate, "user-friendships")
            performProtectedUpdateOperation(data, appCtx.user?.userJwt?.refreshToken, `${url}/accept`, appCtx.acceptOrRejectFriendRequestUpdater, "user-friendships", navigate)

        } else if (elem.tooltip === "Reject") {
            let data = { reject: friendId }
            // todo
            // updateUserInDatabase(`${url}/reject`, data, appCtx.acceptOrRejectFriendRequestUpdater, navigate, "user-friendships")
            performProtectedUpdateOperation(data, appCtx.user?.userJwt?.refreshToken, `${url}/reject`, appCtx.acceptOrRejectFriendRequestUpdater, "user-friendships", navigate)
        } else if (elem.tooltip === "Undo Request") {
            // when undoing existing data will be removed, in this case this friednID will be removed from frSent array
            let data = { frSent: friendId }
            performProtectedUpdateOperation(data, appCtx.user?.userJwt?.refreshToken, url, appCtx.updateData, "user-friendships", navigate)
        }
    }

    return (
        <ListItemIcon>
            <Tooltip title={elem.tooltip} sx={{ p: 0 }} >
                <IconButton
                    onClick={handleClick}
                    sx={{ backgroundColor: 'primary.light' }}
                >
                    {elem.icon}
                </IconButton>
            </Tooltip>
        </ListItemIcon>
    )
}

let listAssets = [
    {
        tooltip: "Accept",
        icon: <HowToRegRounded />
    },
    {
        tooltip: "Reject",
        icon: <PersonOffRounded />
    }
]

const sentRequestListAssets = [
    {
        tooltip: "Undo Request",
        icon: <UndoTwoTone />
    }
]

export default UserFriendships