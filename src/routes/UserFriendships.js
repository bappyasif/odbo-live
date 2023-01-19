import { AccountCircleTwoTone, HowToRegRounded, MoreVertTwoTone, PersonOffRounded, PersonOffTwoTone } from '@mui/icons-material';
import { Avatar, Box, Card, CardActions, CardContent, CardHeader, ClickAwayListener, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Popper, Stack, Tooltip, Typography } from '@mui/material'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContexts } from '../App'
import { useToCloseModalOnClickedOutside } from '../hooks/toDetectClickOutside';
import { ButtonToIndicateHelp, HowToUseExistingFriendsListings, HowToUseFriendsRequestsListings } from '../components/HowToUseApp';
import { readDataFromServer, updateDataInDatabase, updateUserInDatabase } from '../utils';
import { MutualFriends } from './ConnectUsers';

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
                flexDirection: { md: "column", lg: "row" },
                justifyContent: "center",
                alignItems: "flex-start",
                // backgroundColor: "info.dark",
                color: "info.contrastText",
                // gap: 9
                gap: { xs: 1.1, md: 2.2, lg: 6 },
                padding: "0 65px",
                height: "100vh"
            }}
        >
            <ExistingFriendList />
            <FriendsRequests />
        </Paper>
    )
}

let ExistingFriendList = () => {
    let appCtx = useContext(AppContexts);

    let renderFriends = () => appCtx?.user?.friends?.map(frnd => <RenderFriend key={frnd} friendID={frnd} baseUrl={appCtx.baseUrl} />)

    return (
        <Paper sx={{ backgroundColor: "info.light", color: "info.contrastText", width: { xs: "100%", lg: "50%" } }}>
            <Typography variant="h4">Friends Listings:</Typography>
            <Stack sx={{ gap: 1.1 }}>
                {renderFriends()}
            </Stack>
            {
                appCtx?.user?.friends?.length === 0
                    ?
                    <Typography
                        variant="h6"
                        sx={{
                            outline: "solid .6px lightskyblue",
                            borderRadius: 2, mt: 4, p: 1.1
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

    const menuRef = useRef();

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
        let url = `${baseUrl}/users/${friendID}`
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
                        backgroundColor: "info.light", color: "info.contrastText"
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

                {showActionOptions ? <ActionListOptions handleClose={handleCloseMenu} anchorEl={showMenu} friendId={data._id} toggleShowActionOptions={toggleShowActionOptions} /> : null}
            </Stack>
            : null
    )
}

let FriendCardHeader = ({ data }) => {

    let imgUrl = data.ppUrl || "https://random.imagecdn.app/76/56"

    return (
        <CardHeader
            sx={{
                width: "20vw", position: "relative",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "baseline", md: "center" },
                backgroundColor: "info.dark",
                color: "info.contrastText"
            }}
            avatar={
                <Avatar
                    src={imgUrl}
                    sx={{ width: { xs: "42px", lg: "92px" }, height: { xs: "42px", lg: "62px" } }}
                />
            }
            title={<Typography sx={{ fontSize: { xs: "small", md: "large", lg: "larger" } }} variant='h5'>{data.fullName}</Typography>}
            subheader={"Friend Since!!"}
        >
        </CardHeader>
    )
}

let ActionListOptions = ({ toggleShowActionOptions, friendId, anchorEl, handleClose }) => {
    let options = [{ name: "View Profile", icon: <AccountCircleTwoTone /> }, { name: "Remove From Friend List", icon: <PersonOffTwoTone /> }]

    let renderOptions = () => options.map(item => <RenderActionListOption key={item.name} item={item} toggleShowActionOptions={toggleShowActionOptions} friendId={friendId} />)

    // making popper get appropriate mui props value to initiate menu opening or close sequence
    const open = Boolean(anchorEl)

    return (
        <Popper
            sx={{ left: "-128px !important" }}
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

let RenderActionListOption = ({ item, toggleShowActionOptions, friendId }) => {
    let appCtx = useContext(AppContexts)

    let navigate = useNavigate()

    let removeFromCurentUserStateVariable = () => appCtx.removeIdFromCurrentUserFriendsList(friendId)

    let removeFromFriendList = () => {
        let url = `${appCtx.baseUrl}/users/${appCtx.user._id}/remove`

        updateDataInDatabase(url, { friendId: friendId }, removeFromCurentUserStateVariable)
    }

    let visitUserProfile = () => {
        navigate(`/users/${friendId}/visit/profile`)
    }

    let handleClick = () => {
        toggleShowActionOptions()
        if (item.name === "View Profile") {
            visitUserProfile()
        } else if (item.name.includes("Remove")) {
            let userChose = prompt("Are you sure you want to REMOVE this user as a FRIEND? Type Y to continue", "N")
            if (userChose === "Y" || userChose === "y") {
                removeFromFriendList()
            } else {
                alert("You chose NOT TO REMOVE this user as a FRIEND")
            }
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
                    backgroundColor: 'info.main',
                    color: "info.contrastText",
                    '&:hover': {
                        color: "floralwhite",
                        backgroundColor: 'lightskyblue',
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
                    secondary={<Typography sx={{ fontSize: { xs: "small", md: "large", lg: "larger" }, fontWeight: "bolder" }} variant="h6">{item.name}</Typography>}
                />
            </ListItem>
        </MenuItem>
    )
}

function FriendsRequests() {
    let appCtx = useContext(AppContexts);

    let renderFriendRequests = () => appCtx?.user?.frRecieved?.map(friendId => <ShowFriendRequest key={friendId} friendId={friendId} baseUrl={appCtx.baseUrl} />)

    return (
        <Paper
            sx={{
                minWidth: "29vw",
                width: { xs: "100%", lg: "50%" },
                backgroundColor: "lightsteelblue",
                color: "primary.light"
            }}
        >
            <Typography variant={'h4'}>Friend Requests Recieved</Typography>
            <Divider />
            <Box
                sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}
            >
                {
                    appCtx?.user?.frRecieved?.length
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

let ShowFriendRequest = ({ friendId, baseUrl }) => {
    let [data, setData] = useState({})

    let url = `${baseUrl}/users/${friendId}`

    const appCtx = useContext(AppContexts);

    let dataHandler = dataset => setData(dataset.data.data)

    useEffect(() => {
        readDataFromServer(url, dataHandler)
    }, [url])

    let renderListAssets = () => listAssets.map(elem => <RenderListIconElement key={elem.tooltip} elem={elem} friendId={friendId} />)

    return (
        <Stack sx={{ width: "100%", }}>
            <List sx={{ display: "flex", alignItems: "center", position: "relative" }}>

                <ButtonToIndicateHelp alertPosition={{ left: 0, top: 18 }} forWhichItem={"Friends Requests Listings"} />
                {appCtx.dialogTextFor === "Friends Requests Listings" ? <HowToUseFriendsRequestsListings /> : null}

                <ListItem
                    sx={{
                        outline: "solid .6px red", borderRadius: 2, justifyContent: "space-around",
                        flexDirection: { xs: "column", md: "row" }
                    }}
                >
                    <Avatar
                        alt='user profile picture'
                        src={data.ppUrl || 'https://random.imagecdn.app/76/56'}
                        sx={{ width: 76, height: 56 }}
                    />

                    <Typography sx={{ ml: 2, mr: 2 }} variant="h4">{data.fullName}</Typography>
                    <MutualFriends friends={data.friends} variantType="p" />
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
            updateUserInDatabase(`${url}/accept`, data, appCtx.acceptOrRejectFriendRequestUpdater, navigate, "user-friendships")

        } else if (elem.tooltip === "Reject") {
            let data = { reject: friendId }
            updateUserInDatabase(`${url}/reject`, data, appCtx.acceptOrRejectFriendRequestUpdater, navigate, "user-friendships")
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

export default UserFriendships