import { GiphyFetch } from '@giphy/js-fetch-api';
import { Gif, VideoOverlay } from '@giphy/react-components';
import { ChevronLeftTwoTone, ChevronRightTwoTone } from '@mui/icons-material';
import { Alert, Box, Divider, ListItem, ListItemButton, ListItemText, Paper, Stack, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import { AppContexts } from '../App';
import { performProtectedUpdateOperation, updateDataInDatabase } from '../utils';
import { ShowRespectiveIcon } from './ChoosePrivacy';

function ShowUserPostMedias({ mediaContents }) {
    let generateContents = () => {
        let content = [];

        for (let key in mediaContents) {
            if (key === "Image" && mediaContents[key]?.includes("http")) {
                content.push(<img key={"Image"} src={mediaContents[key]} style={{ order: 1 }} />)
            } else if (key === "Image" && !mediaContents[key]?.includes("http")) {
                content.push(<img key={"Image"} src={handleMediaFileChecks(mediaContents[key])} style={{ order: 1 }} />)
            } else if (key === "Video" && mediaContents[key]?.includes("http")) {
                content.push(<video key={"Video"} height={200} src={mediaContents[key]} controls style={{ order: 2 }} />)
            } else if (key === "Gif" && mediaContents[key]) {
                content.push(<ShowGif key={"Gif"} id={mediaContents[key]} />)
                // content.push(<Gif key={"Gif"} gif={mediaContents[key]} height={{ lg: "100%" }} width={"100%"} style={{ order: 3 }} />)
            } else if (key === "Poll" && mediaContents[key]) {
                content.push(<ShowPoll key={"Poll"} pollData={mediaContents[key]} postId={mediaContents.Id} order={4} />)
            } else if (key === "Privacy") {
                content.push(<ShowRespectiveIcon key={"Privacy"} privacy={mediaContents[key]} order={5} />)
            }

        }

        return content
    }

    let renderContents = () => [...generateContents()]

    return (
        <Box
            sx={{ display: "flex", flexDirection: "column", mb: 2, gap: 2, justifyContent: "stretch", }}
        >
            {renderContents()}
        </Box>
    )
}

const ShowGif = (idObj) => {
    const [gifData, setGifData] = useState(null)

    const gf = new GiphyFetch(process.env.REACT_APP_GIPHY_FETCH_API_KEY)

    const beginGifFetch = () => {
        console.log(idObj, "fetching!!")
        gf.gif(idObj.id)
            .then(data => {
                if (data) {
                    console.log(data, "data!!!!")
                    setGifData(data.data)
                }
            }).catch(err => console.log("gif fetching has failed", err))
    }

    useEffect(() => {
        idObj && beginGifFetch()
    }, [idObj])

    return (
        gifData
            ? <Gif
                gif={gifData}
                // height={{ lg: "60%" }}
                // overlay={VideoOverlay}
                width={510}
                style={{ order: 3, pointerEvents: "none", alignSelf: "center"}}
            />
            : null
    )
}

const ShowPoll = ({ pollData, order, postId }) => {
    let { votersList, question, ...options } = { ...pollData }

    let [voted, setVoted] = useState(false);

    let [voteAttempted, setVoteAttempted] = useState(false);

    const appCtx = useContext(AppContexts)

    const dataUpdater = result => null

    const checkUserAlreadyVoted = () => {
        const foundUser = votersList?.length ? votersList?.filter(id => id === appCtx?.user?._id) : []

        return foundUser?.length
    }

    const updateDataWithVoters = () => {
        let updatedList = [];

        if (votersList?.length && !checkUserAlreadyVoted()) {
            updatedList = votersList.push(appCtx.user._id)
        } else {
            updatedList.push(appCtx.user._id)
        }

        const data = { propKey: "poll", propValue: [{ votersList: updatedList, question, ...options }] }

        const url = `${appCtx.baseUrl}/posts/update/shared/${postId}`

        // updateDataInDatabase(url, data, dataUpdater)

        // performProtectedUpdateOperation(data, appCtx.user?.userJwt?.refreshToken, url, dataUpdater, null, null)

        performProtectedUpdateOperation(data, appCtx.user?.userJwt?.refreshToken, url)

        // console.log(data, 'ready!!', updatedList, [].push(appCtx.user._id))
    }

    const updatePostPollDataInDatabase = (optionCountObj) => {
        options[optionCountObj.optionNum] = optionCountObj;

        setVoteAttempted(true);
        updateDataWithVoters();
    }

    let renderOptions = () => {
        let allOptions = [];

        for (let key in options) {
            let temp = { number: key, text: options[key].text || options[key], count: options[key].count || 0 }
            allOptions.push(<RenderPollOption setVoteAttempted={setVoteAttempted} voted={voted} setVoted={setVoted} key={key} option={temp} numberOfOptions={Object.values(options).length} updatePostPollDataInDatabase={updatePostPollDataInDatabase} />)
        }

        return [...allOptions];
    }

    useEffect(() => {
        if (checkUserAlreadyVoted()) {
            setVoted(true);
            setVoteAttempted(true);
        } else {
            setVoted(false);
            setVoteAttempted(false);
        }
    }, [])

    return (
        <Paper sx={{ mb: 2, order: order, pointerEvents: appCtx?.user?._id ? "auto" : "none" }}>
            <Typography
                variant='h4'
            >Poll Question: {question}</Typography>

            {!appCtx?.user?._id ? <VoteAlert setVoteAttempted={setVoteAttempted} text={'You need to be logged in before casting your Vote!!'} severity={"warning"} /> : null}

            {(voteAttempted) ? <VoteAlert setVoteAttempted={setVoteAttempted} text={'You Voted, One Vote Per User!!'} severity={"success"} /> : null}

            <Divider sx={{ mb: 5.8 }} />

            <Stack
                sx={{ flexDirection: "column", gap: 1.1, flexWrap: "wrap", height: "290px", alignItems: renderOptions()?.length >= 3 ? "center" : "center" }}
            >
                {renderOptions()}
            </Stack>
        </Paper>
    )
}

const VoteAlert = ({ setVoteAttempted, text, severity }) => {
    const beginTimer = () => {
        const timer = setTimeout(() => {
            setVoteAttempted(false)

            return () => clearTimeout(timer);
        }, 2000)
    }

    useEffect(() => {
        beginTimer()
    }, [])

    return (
        <Alert sx={{ justifyContent: "center", position: "absolute", width: "-webkit-fill-available" }} severity={severity}>{text}</Alert>
    )
}

const RenderPollOption = ({ setVoteAttempted, option, numberOfOptions, updatePostPollDataInDatabase, voted, setVoted }) => {
    let [clickCount, setClickCount] = useState(0);

    let handleCount = () => {
        setVoted(true);
        !voted && setClickCount(prev => prev + 1)
        setVoteAttempted(true)
    }

    const handleWhichOptionVoted = () => {
        const optionData = { optionNum: option.number, text: option.text, count: clickCount }
        updatePostPollDataInDatabase(optionData)
    }

    useEffect(() => {
        voted && handleWhichOptionVoted()
    }, [voted])

    useEffect(() => {
        setClickCount(option.count || 0);
        setVoted(false);
        setVoteAttempted(false);
    }, [])

    return (
        <ListItemButton
            sx={{ backgroundColor: "primary.light", borderRadius: 6, m: 1, mb: 2, width: numberOfOptions >= 3 ? (window.innerWidth / 6) : "100%", flexDirection: "column", justifyContent: "flex-start" }}
            onClick={handleCount}
        >
            <ListItemText
                sx={{
                    textAlign: "justify",
                    alignSelf: "flex-start"
                }}
                primary={
                    <>
                        <Typography
                            className="slider"
                            sx={{
                                textAlign: "left",
                                height: "33px",
                                width: ((clickCount / window.innerWidth) / numberOfOptions) * 100,
                                backgroundColor: "secondary.dark",
                                position: "absolute",
                                opacity: .51
                            }}></Typography>
                        <Typography variant='h5' sx={{ color: "chartreuse", display: "flex", alignItems: "center", fontWeight: "bold" }}><ChevronLeftTwoTone fontSize='large' /> {` ${clickCount} `} <ChevronRightTwoTone fontSize='large' /> Votes</Typography>
                    </>
                }
                secondary={
                    <Typography
                        sx={{ display: 'inline', fontWeight: "bold" }}
                        component="span"
                        variant="h4"
                        color="text.primary"
                    >
                        {option.text}
                    </Typography>
                }
            />
        </ListItemButton>
    )
}

// handling media file checks
export let handleMediaFileChecks = (mediaFile) => {
    let mediaSrc = mediaFile;
    if (mediaFile instanceof File || mediaFile instanceof Blob || mediaFile instanceof MediaSource) {
        mediaSrc = URL.createObjectURL(mediaFile)
    }
    return mediaSrc;
}

export default ShowUserPostMedias