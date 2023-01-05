import { Box, Paper, Stack, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContexts } from '../App'
import { ButtonToIndicateHelp, HowToUseConnectUsersListings } from '../components/HowToUseApp'
import { BoxElement, ButtonElement, CardContentElement, CardElement, CardHeaderElement, MasonryElement, SkeletonBasicElement, StackElement, TypographyElement } from '../components/MuiElements'
import { readDataFromServer, updateUserInDatabase } from '../utils'

function ConnectUsers() {
  let [data, setData] = useState({})
  let [timers, setTimers] = useState(false)

  let appCtx = useContext(AppContexts)

  let url = `${appCtx.baseUrl}/users`

  let dataHandler = dataset => setData(dataset)

  useEffect(() => {
    readDataFromServer(url, dataHandler);
    appCtx.handleLastVisitedRouteBeforeSessionExpired("/connect");
    appCtx.getUserDataFromJwtTokenStoredInLocalStorage();
  }, [url])

  // making timers flag to be true after 1.7sec
  let timer = setTimeout(() => setTimers(true), 1700)

  // when flag is true then we are clearing its timer for performance and best practice, also turning timers flag to false
  useEffect(() => {
    timers && clearTimeout(timer)
    timers && setTimers(false);
  }, [])

  let renderUsers = () => data?.data?.data.map(user => appCtx.user._id.toString() !== user._id && <RenderUser key={user._id} userData={user} />)

  return (
    <Paper className="cards-wrapper">
      <Stack sx={{ position: "relative" }}>
        <Typography variant='h1'>Connect With Other User</Typography>
        <ButtonToIndicateHelp alertPosition={{ left: "13px", top: 2 }} forWhichItem={"Connect Users Listings"} />
        {appCtx.dialogTextFor === "Connect Users Listings" ? <HowToUseConnectUsersListings /> : null}
      </Stack>

      {/* making skeleton show up when data is still not available */}
      {!timers && Array.from([1, 2, 3, 4]).map(idx => <CardSkeleton key={idx} />)}

      {
        timers
          ?
          <MasonryElement className="masonry-elem">
            {renderUsers()}
          </MasonryElement>
          :
          null
      }
    </Paper>
  )
}

let RenderUser = ({ userData }) => {
  let [friendAlready, setFriendAlready] = useState(false);
  let [friendRequestSent, setFriendRequestSentAlready] = useState(false)

  let { fullName, email, friends, created, bio, _id, ppUrl } = { ...userData }

  let test = "https://pbs.twimg.com/profile_images/877631054525472768/Xp5FAPD5_reasonably_small.jpg"

  let appCtx = useContext(AppContexts);

  let navigate = useNavigate()

  let updatingUserDataInDatabase = (data, endpoint) => {
    let url = `${appCtx.baseUrl}/users/${endpoint}`
    updateUserInDatabase(url, data, appCtx.updateData, navigate, "connect")
  }

  let handleSend = (evt) => {
    // both "send" and "undo" will perform these operations
    // when sending, data will be added and when undoing existing data will be removed
    updatingUserDataInDatabase({ frSent: userData._id }, appCtx.user._id)
    updatingUserDataInDatabase({ frRecieved: appCtx.user._id }, userData._id)
    // also updating falgged state so that DOM reacts and responds appropriately instantaneously
    // as this gets run both for SEND and UNDO, so simply toggling will give us expected result on DOM
    setFriendRequestSentAlready(prev => !prev)
  }

  useEffect(() => {
    setFriendAlready(appCtx.user.friends.includes(_id))
    setFriendRequestSentAlready(appCtx.user.frSent.includes(_id))
  }, [_id])

  // console.log(appCtx.user.frSent.includes(_id) || appCtx.user.friends.includes(_id), appCtx.user.frSent.includes(_id), appCtx.user.friends.includes(_id))

  return (
      <CardElement
        className="card-wrapper"
      styles={{ backgroundColor: "primary.light", position: "relative" }}
      >
        <CardHeaderElement styles={{ backgroundColor: "primary.dark", color: "info.contrastText" }} avatarUrl={ppUrl || test} altText={fullName} title={fullName} joined={created} forConnect={true} />
        <CardContentElement>
          <TypographyElement
            text={friendAlready ? email : "Email: be a friend to see that"}
            type={"p"}
            forConnect={true}
            styles={{ mb: 2, color: "info.contrastText", fontSize: "20px" }}
          />
          <TypographyElement
            text={bio ? bio : "This user has yet to write a bio"}
            type={"h6"}
            forConnect={true}
            styles={{ textAlign: "justify", backgroundColor: "info.dark", color: "info.contrastText", p: 1.1, borderRadius: 1.1 }}
          />
          <StackElement
            styles={{ backgroundColor: "info.dark", color: "info.contrastText" }}
            className="af-wrapper"
          >
            <MutualFriends friends={friends} />
            <Stack sx={{ flexDirection: "row", gap: 1.3, alignItems: "baseline" }}>
              <TypographyElement text={"Friends "} type={"h5"} />
              <TypographyElement text={friends.length} type={"h6"} />
            </Stack>
          </StackElement>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2, flexDirection: "column", color: "info.contrastText" }}>
            <Typography
              sx={{ 
                m: 1.1, mb: friendAlready ? .6 : 1.1, mt: friendAlready ? .6 : 1.1, 
                color: "info", backgroundColor: friendAlready ? "info.dark" : "primary.dark", borderRadius: "20px" }}
              variant='h5'
            >{friendAlready ? "Friend Already" : "Friend Request"}</Typography>
            {
              friendAlready
                ? null
                : <BoxElement className="all-btns">
                  <ButtonElement
                    text={friendRequestSent ? "Is Sent" : "Send"}
                    type="contained"
                    action={handleSend}
                    disable={friendRequestSent || friendAlready}
                  />
                  <ButtonElement
                    text={"Undo"}
                    type="contained"
                    action={handleSend}
                    disable={!friendRequestSent || friendAlready}
                  />
                </BoxElement>
            }
          </Box>
        </CardContentElement>
      </CardElement>
  )
}

export const MutualFriends = ({ friends, variantType, forProfile }) => {
  let [mutualFriends, setMutualFriends] = useState([])

  let appCtx = useContext(AppContexts);

  const updateMutualFriendsCounts = () => {
    friends.forEach(frndId => {
      let findIdx = appCtx.user.friends.findIndex(val => val === frndId)
      if (findIdx !== -1) {
        setMutualFriends(prev => {
          let checkDuplicate = prev.findIndex(val => val === frndId)
          return checkDuplicate === -1 ? [...prev, frndId] : prev
        })
      }
    })
  }

  const lookForMutualFriends = () => {
    if (friends?.length) {
      updateMutualFriendsCounts()
    }
  }

  // mutualFriends.length && console.table("mutual", mutualFriends, "frnds", friends, "user friends", appCtx.user.friends)

  useEffect(() => {
    friends?.length && lookForMutualFriends()
  }, [])

  return (
    <Stack
      sx={{
        flexDirection: forProfile ? "row" : "row",
        alignItems: forProfile ? "baseline" : "baseline",
        gap: forProfile ? 3 : 1.3,
      }}
    >
      <Typography variant={variantType ? variantType : 'h5'}>Mutual Friends</Typography>
      <Typography variant='h6'>{mutualFriends.length ? mutualFriends.length : "None"}</Typography>
    </Stack>
  )
}

let CardSkeleton = () => {
  return (
    <CardElement
      className="card-wrapper"
      styles={{ backgroundColor: "text.secondary" }}
    >
      <SkeletonBasicElement width={"40px"} height="40px" />
      <CardContentElement>
        <SkeletonBasicElement variant='rectangular' />
        <SkeletonBasicElement variant='rectangular' />
        <SkeletonBasicElement variant='rectangular' height="40px" />
        <SkeletonBasicElement variant='rectangular' height="40px" />
      </CardContentElement>
    </CardElement>
  )
}

export default ConnectUsers