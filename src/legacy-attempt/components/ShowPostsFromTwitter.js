import { Twitter } from '@mui/icons-material';
import { Avatar, Box, Card, CardContent, CardHeader, CardMedia, IconButton, ImageList, ImageListItem, Link, Stack, Tooltip, Typography } from '@mui/material'
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react'
import { AppContexts } from '../App';
import { useToFetchSearchedTermedTwitterData } from '../hooks/useToFetchData';
import { readDataFromServer } from '../utils';

function ShowPostsFromTwitter({topics}) {
  // console.log(topics, "TOPICS!!")

  let renderDataset = () => topics.map(name => <ShowSearchTermData key={name} searchTerm={name} />)

  return (
    <Box>
      <Typography>Showing Post from Twitter</Typography>
      {topics.length ? renderDataset() : null}
    </Box>
  )
}

const ShowSearchTermData = ({ searchTerm }) => {
  let [tweetsData, setTweetsData] = useState([])
  let [tweetsAttachments, setTweetsAttachments] = useState([])

  let appCtx = useContext(AppContexts);

  let { dataset } = useToFetchSearchedTermedTwitterData(searchTerm)

  useEffect(() => {
    if (dataset?.length) {
      let slicedForTweets = dataset.slice(1)
      setTweetsData(slicedForTweets);

      let attachments = dataset[0];
      setTweetsAttachments(attachments)
    }
  }, [dataset])

  useEffect(() => {
    setTweetsData([])
    setTweetsAttachments([])
  }, [])

  let renderPosts = () => tweetsData.map(item => <RenderPost key={item.id} item={item} baseUrl={appCtx.baseUrl} attachments={tweetsAttachments} />)

  return (
    <Box>
      {tweetsData.length ? renderPosts() : null}
    </Box>
  )
}

export let RenderPost = ({ item, baseUrl, attachments }) => {
  let [userData, setUserData] = useState({})

  // manually creating a twitter link so that upon click user is redirected to actual post
  let tweetUrl = `https://twitter.com/twitter/status/${item.id}`

  let handleData = result => setUserData(result)

  let extractAccountNameAndUserName = () => {
    let url = `${baseUrl}/twitter/users/${item.author_id}`
    readDataFromServer(url, handleData)
  }

  useEffect(() => {
    extractAccountNameAndUserName()
  }, [item])

  return (
    userData?.data?.data?.name
      ?
      <Card
        sx={{
          mt: 1.5, marginBottom: "9px !important", p: 1.5, bgcolor: "info.light",
          maxWidth: "940px",
          margin: "auto"
        }}
      >
        <TweetCardHeader userData={userData} tweetUrl={tweetUrl} />
        <TweetCardContent item={item} />
        <TweetCardMedia item={item} attachments={attachments} />
      </Card>
      : null
  )
}

const TweetCardMedia = ({ item, attachments }) => {
  return (
    <CardMedia
      sx={{color: "info.contrastText"}}
    >
      <ShowTweetMediaResources item={item} attachments={attachments} />
    </CardMedia>
  )
}

const TweetCardContent = ({ item }) => {
  return (
    <CardContent>
      <Typography variant='h4'>{item.text}</Typography>
    </CardContent>
  )
}

const TweetCardHeader = ({ userData, tweetUrl }) => {
  return (
    <CardHeader
      sx={{
        backgroundColor: "info.dark", color: "info.contrastText"
      }}
      avatar={
        <Avatar sx={{ width: "110px", height: "110px", objectFit: "contain" }}>
          <img width={110} height={110} src={userData?.data?.data.profile_image_url} />
        </Avatar>
      }

      title={
        <Stack sx={{ flexDirection: "row", gap: 1.1, alignItems: "baseline" }}>
          <Typography variant='h6' sx={{ textTransform: "capitalize" }}>{userData?.data?.data.name}</Typography>
          <Typography variant='body1'>@{userData?.data?.data.username}</Typography>
        </Stack>
      }

      subheader={
        <Stack sx={{ flexDirection: "row", gap: 1.1, alignItems: "baseline", color: "info.contrastText" }}>
          <Typography variant='body1'>Joined Since: {moment(userData?.data?.data.created_at).format("MM-DD-YYYY")}</Typography>
          <Typography variant='body1' sx={{ p: 2 }}>Followers: {userData?.data?.data.public_metrics.followers_count}</Typography>
          <Typography variant='body1' sx={{ p: 2 }}>Following: {userData?.data?.data.public_metrics.following_count}</Typography>
        </Stack>
      }

      action={
        <Tooltip title="see this post in twitter">
          <IconButton>
            <Link href={tweetUrl} target={"_blank"}>
              <Twitter sx={{color: "info.contrastText"}} />
            </Link>
          </IconButton>
        </Tooltip>
      }
    >
    </CardHeader>
  )
}

const ShowTweetMediaResources = ({ item, attachments }) => {
  let [mediaUrls, setMediaUrls] = useState([]);

  const handleMediaResources = () => {
    attachments?.media?.forEach(mediaItem => {
      item.attachments.media_keys.forEach(mediaKey => {
        if ((mediaKey === mediaItem.media_key) && (mediaItem.url || mediaItem.preview_image_url)) {
          setMediaUrls(prev => {
            let chkIdx = prev.findIndex(item => (item.urlStr === mediaItem.url) || (item.urlStr === mediaItem.preview_image_url));
            return chkIdx === -1 ? [...prev, { urlStr: (mediaItem.url || mediaItem.preview_image_url), type: mediaItem.type }] : prev
          })
        }
      })
    })
  }

  useEffect(() => {
    handleMediaResources()
  }, [])

  // console.log(mediaUrls, "mediaUrls")

  let renderUrlResources = () => mediaUrls.map((item, idx) => <RenderMediaResource key={item+idx} item={item} />)

  return (
    <ImageList
      variant={"masonry"}
      cols={mediaUrls.length > 1 ? 2 : 1}
    >
      {mediaUrls.length ? renderUrlResources() : null}
    </ImageList>
  )
}

const RenderMediaResource = ({ item }) => {
  const decideElementMarkup = () => {
    let markup = ""
    if (item.type === "video") {
      markup = <img style={{ objectFit: "contain" }} height={"inherit"} src={item.urlStr} loading={"lazy"} />
    } else if (item.type === "photo") {
      markup = <img style={{ objectFit: "contain" }} height={"inherit"} src={item.urlStr} loading={"lazy"} />
    }
    return markup;
  }
  return (
    <ImageListItem
    >
      {decideElementMarkup()}
    </ImageListItem>
  )
}

export default ShowPostsFromTwitter