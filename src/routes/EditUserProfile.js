import { CloseTwoTone, NotInterestedTwoTone, SaveAltTwoTone, WallpaperRounded } from '@mui/icons-material'
import { TextField, Box, Button, FormControl, IconButton, ImageListItem, ImageListItemBar, Input, InputLabel, Paper, Stack, TextareaAutosize, Typography, Tooltip } from '@mui/material'
import moment from 'moment'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContexts } from '../App'
import { VisualizeWordCountProgress } from '../components/CreatePost'
import { useToCloseModalOnClickedOutside } from '../hooks/toDetectClickOutside'
import { ButtonToIndicateHelp, HowToUseEditUserProfilePage } from '../components/HowToUseApp'
import { fakeDataModel } from '../components/UserProfileInfoSection'
import { updateDataInDatabase } from '../utils'
import ChooseTopics from './ChooseTopics'

function EditUserProfile() {
    let [userData, setUserData] = useState({})

    let [reloadDataFlag, setReloadDataFlag] = useState(false);

    const appCtx = useContext(AppContexts);

    // const navigate = useNavigate()

    // const beginTimer = () => {
    //     let timer = setTimeout(() => {
    //         !userData?.fullName && console.log(appCtx?.user)
    //     }, [990])
    // }

    let updateUserEditTopicsDataFromChooser = (updatedTopicsList) => {
        setUserData({})
        // console.log(appCtx.user, "checkit", userData, updatedTopicsList)
        setReloadDataFlag(true);
    }

    let handleData = (evt, elem) => {
        if (elem === "topics") {
            let temp = evt.target.value.split(",").map(v => v.trim())
            setUserData(prev => ({ ...prev, [elem]: temp }))

        } else {
            if (
                elem === "bio" && evt.target.value.length < 220
                ||
                elem === "fullName" && evt.target.value.length < 72
                ||
                elem === "cpUrl" && evt.target.value.length < 200
                ||
                elem === "ppUrl" && evt.target.value.length < 200
            ) {
                setUserData(prev => ({ ...prev, [elem]: evt.target.value }))
            } else {
                alert(`character limit of ${elem === "bio" ? 220 : (elem === "ppUrl" || elem === "cpUrl") ? 200 : 72} has exceeded`)
            }
        }
    }

    useEffect(() => {
        setUserData(appCtx.user || fakeDataModel[0])
        appCtx.handleLastVisitedRouteBeforeSessionExpired("/edit-user-profile")
        // appCtx.handleLastVisitedRouteBeforeSessionExpired(`/users/${appCtx?.user?._id}/profile`)
        appCtx.getUserDataFromJwtTokenStoredInLocalStorage()
    }, [])

    useEffect(() => {
        if (reloadDataFlag) {
            setUserData(appCtx.user)
            setReloadDataFlag(false)
        }
    }, [reloadDataFlag])

    console.log(userData, "!!")

    return (
        <Box

        >
            <Typography sx={{ position: "relative" }} variant='h1'>Edit User Profile</Typography>
            <ButtonToIndicateHelp alertPosition={{ left: 0 }} forWhichItem={"Edit User Profile Page"} />
            {appCtx.dialogTextFor === "Edit User Profile Page" ? <HowToUseEditUserProfilePage /> : null}

            {userData.created ? <RenderPhoto cpUrl={userData.cpUrl || fakeDataModel[0].coverPhotoUrl} fullName={userData.fullName} /> : null}
            {userData.created ? <RenderFormWithData handleData={handleData} data={userData} updateTopicsDataFromChooser={updateUserEditTopicsDataFromChooser} /> : null}
            {userData.created ? <RenderFormActionButtons userData={userData} appCtx={appCtx} /> : null}
        </Box>
    )
}

let RenderFormActionButtons = ({ userData, appCtx }) => {
    let buttons = [{ name: "Save", icon: <SaveAltTwoTone /> }, { name: "Cancel", icon: <NotInterestedTwoTone /> }]

    let renderButtons = () => buttons.map(item => <RenderActionButton key={item.name} item={item} userData={userData} appCtx={appCtx} />)

    return (
        <Stack sx={{ flexDirection: "row", gap: 4, justifyContent: "center" }}>
            {renderButtons()}
            {/* <OpenTopicsChooserModal /> */}
        </Stack>
    )
}

let RenderActionButton = ({ item, userData, appCtx }) => {
    let { fullName, topics, cpUrl, ppUrl, _id, bio } = userData

    let navigate = useNavigate();

    let updateDataInApp = () => {
        appCtx.updateUserProfileDataInApp("fullName", fullName)
        appCtx.updateUserProfileDataInApp("topics", topics)
        appCtx.updateUserProfileDataInApp("cpUrl", cpUrl)
        appCtx.updateUserProfileDataInApp("ppUrl", ppUrl)
    }

    let updateDataInServer = () => {
        let url = `${appCtx.baseUrl}/users/${appCtx.user._id}/profile`;

        let data = { "fullName": fullName, "topics": topics, "cpUrl": cpUrl, "ppUrl": ppUrl, "bio": bio }

        console.log(data,"!!")

        updateDataInDatabase(url, data, updateDataInApp)
    }

    let handleClick = () => {
        if (item.name === "Save") {
            if (!userData.fullName) {
                alert("can not be empty")
            } else {
                updateDataInServer();
            }
        }

        navigate(`/users/${_id}/profile/`)
    }

    return (
        <Button fullWidth={true} onClick={handleClick} size='large' startIcon={item.icon} variant="outlined" sx={{ verticalAlign: "middle" }}>
            <Typography color={"info.contrastText"} variant='h6' fontWeight={"bold"}>{item.name}</Typography>
        </Button>
    )
}

let RenderFormWithData = ({ handleData, data, updateTopicsDataFromChooser }) => {
    let renderData = []

    for (let key in data) {

        if (key !== "__v" && key !== "_id" && key !== "salt" && key !== "hash" && key !== "albums" && key !== "userJwt" ) {
            let elem = key;
            let initialValue = data[key]

            // checking if "bio" key exists in dataset, otherwise inserting it manually, it will happen just once
            let allKeys = Object.keys(data);

            let findBioIdx = allKeys.findIndex(val => val === "bio")
            if (findBioIdx === -1) {
                elem = "bio";
                data["bio"] = ""
                // key = "bio"
            }

            let findCpurlIdx = allKeys.findIndex(val => val === "cpUrl")
            if (findCpurlIdx === -1) {
                elem = "cpUrl";
                data["cpUrl"] = "https://picsum.photos/500/150"
                // key = "bio"
            }

            let findPpurlIdx = allKeys.findIndex(val => val === "ppUrl")
            if (findPpurlIdx === -1) {
                elem = "ppUrl";
                data["ppUrl"] = "https://picsum.photos/315/296"
                // key = "bio"
            }

            if (elem === "frSent" || elem === "frRecieved" || elem === "friends") {
                initialValue = data[key].length;

            } else if (elem === "created") {
                initialValue = moment(data[key]).format("DD-MM-YYYY")
            } else if (elem === "topics") {
                initialValue = data[key]
            } else if (elem === "bio") {
                initialValue = data[key]
            } else if (elem === "cpUrl") {
                initialValue = data[key]
            } else if (elem === "ppUrl") {
                initialValue = data[key]
            }


            renderData.push(<RenderFormControlItem key={key} handleData={handleData} dataVal={initialValue} elem={key} updateTopicsDataFromChooser={updateTopicsDataFromChooser} />)
        }
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 11 }}>
            <Stack>
                <RenderPhoto ppUrl={data.ppUrl || fakeDataModel[0].profilePhotoUrl} fullName={data.fullName} />
            </Stack>
            <Stack sx={{ width: "45%" }}>
                {renderData}
            </Stack>
        </Box>
    )
}

let RenderFormControlItem = ({ handleData, dataVal, elem, updateTopicsDataFromChooser }) => {
    let [showModal, setShowModal] = useState(false)
    let [editableText, setEditableText] = useState(null);

    const handleEditableText = evt => {
        setEditableText(evt.target.value);
        handleData(evt, elem)
    }

    // let appCtx = useContext(AppContexts);

    let navigate = useNavigate()

    let check = ["frSent", "profileID", "facebookID", "twitterID", "githubID", "frRcvd", "frRecieved", "friends", "created", "email", "password"].includes(elem)

    let formatElemLabel = () => {
        let label = ""

        if (elem === "frSent") {
            label = "Friend Request Sent"
        } else if (elem === "frRecieved") {
            label = "Friend Request Recieved"
        } else if (elem === "bio") {
            label = "Profile Bio"
        } else {
            label = elem
        }

        return label;
    }

    let showHelperText = () => {
        let label = "";

        if (elem === "fullName") {
            label = "This how it will show up in your profile, can not be left empty"
        } else if (elem === "bio") {
            label = "This how it will show up in your profile, should not be left empty otherwise random text will showup on profile for bio section"
        } else if (elem === "topics") {
            label = "Make sure to use comma when adding new entries, should not be left empty or "
        } else if (elem === "ppUrl" || elem === "cpUrl") {
            label = "Make sure to use comma when adding new entries, should not be left empty"
        } else {
            label = "It's system generated and can not be altered directly"
        }

        console.log(elem, "elem")

        return label
    }

    let toggleShowModal = () => setShowModal(!showModal);

    let closeModal = (result) => {
        setShowModal(false);
        // so that topics data gets updated, which were chosen from topics chooser modal
        // updateTopicsDataFromChooser(result);
        updateTopicsDataFromChooser();
        navigate("/edit-user-profile")
    }

    let showClickableIframeLink = () => {
        let btn = null;
        if (elem === "topics") {
            btn = <Button sx={{ color: "text.secondary", bgcolor: "secondary" }} onClick={toggleShowModal}>
                <Typography variant="subtitle1">Open To Choose Topics</Typography>
            </Button>
        }
        return btn;
    }

    // elem === "topics" && console.log(dataVal, "checkcheckchekc")

    return (
        <FormControl sx={{ m: 2, position: "relative" }} disabled={check} value>

            {
                elem === "bio"
                    ||
                    elem === "fullName"
                    ? <VisualizeWordCountProgress textContent={editableText ? editableText : dataVal} maxLimit={elem === "bio" ? 220 : 72} smallerSize={true} topPlacingUnits={elem === "fullName" ? "-13.9px" : "4.11px"} />
                    : null
            }

            {elem !== "bio" ? <InputLabel sx={{ textTransform: "capitalize", fontSize: 26, fontWeight: "bold" }} htmlFor={elem}>{formatElemLabel()}</InputLabel> : null}
            {
                elem === "bio"
                    ?
                    <>
                        <Typography sx={{ textAlign: "justify", pl: "17px", fontSize: "26px" }}>{formatElemLabel()}</Typography>
                        <TextareaAutosize placeholder='e.g. your bio text should go here, tell everybody how aweeesomeee you are :-)' style={{ backgroundColor: "transparent", border: "none", borderBottom: "solid .1px silver", marginLeft: "15px", fontSize: "20px", outline: "1.1px solid skyblue" }} minRows={8} maxRows={4} cols={40} defaultValue={dataVal} maxLength={220} onChange={handleEditableText} />
                    </>
                    :
                    <>
                        <Input required={true} sx={{ fontSize: 29, pl: 2 }} type={elem === "email" ? "email" : "text"} defaultValue={dataVal} onChange={handleEditableText} />
                    </>
            }
            <Typography variant="subtitle1" sx={{ color: "text", textAlign: "left", pl: 2, position: "relative" }}>{showHelperText()} {showClickableIframeLink()}</Typography>

            {showModal ? <OpenTopicsChooserModal closeModal={closeModal} /> : null}
        </FormControl>
    )
}

let OpenTopicsChooserModal = ({ closeModal }) => {
    let url = "/choose-topics"

    const ref = useRef();

    useToCloseModalOnClickedOutside(ref, closeModal)

    return (
        <Paper
            ref={ref}
            style={{
                position: "absolute",
                border: "solid 4px",
                borderRadius: "20px 8px 8px 20px",
                bottom: "29%",
                right: "31%",
                width: "74vw",
                height: "76vh",
                zIndex: 9,
                overflowY: "scroll"
            }}
        >
            <CloseButton closeModal={closeModal} />
            <ChooseTopics closeTopicChooserModal={closeModal} />
        </Paper>
    )
}

const CloseButton = ({ closeModal }) => {
    return (
        <Tooltip title={"Close Topics Chooing Modal"}>
            <Button
                onClick={closeModal}
                variant='contained'
                sx={{
                    position: "absolute",
                    right: 2,
                    top: 2
                }}
            >
                <CloseTwoTone fontSize='large' />
            </Button>
        </Tooltip>
    )
}

// let OpenTopicsChooserModal = ({appCtx}) => {
//     let url = "/choose-topics"

//     return (
//         <iframe
//             style={{
//                 position: "absolute",
//                 top: "29%",
//                 bottom: 0,
//                 width: "65vw",
//                 height: "76vh",
//                 zIndex: 9,
//                 transform: 'translate(-50%, -50%)',
//             }}
//             src={url}
//             appCtx = {appCtx}
//         />
//     )
// }

export let checkIfItHasJpgExtension = (resUrl) => {
    let allTokens = resUrl.split(".");
    let getExtension = allTokens[allTokens.length - 1]
    let check = ["jpg", "jpeg"].includes(getExtension)
    // console.log(check, "chk extebnsion!!")
    return check;
}

export let RenderPhoto = ({ ppUrl, cpUrl, fullName }) => {
    let decideImgResourceUrl = () => {
        let src = "";

        if (ppUrl && !cpUrl) {
            checkIfItHasJpgExtension(ppUrl)
            // src = `${ppUrl}?w85&h95&fit=crop&auto=format`
            src = checkIfItHasJpgExtension(ppUrl) ? ppUrl : `${ppUrl}?w85&h95&fit=crop&auto=format`
        } else if (cpUrl) {
            // src = `${cpUrl}?w500&h150&fit=crop&auto=format`
            src = checkIfItHasJpgExtension(cpUrl) ? cpUrl : `${cpUrl}?w500&h150&fit=crop&auto=format`
        }

        return src;
    }

    return (
        <ImageListItem sx={{ width: ppUrl && "650px" }}>
            <img
                // src={`${ppUrl ? ppUrl : fakeDataModel[0].coverPhotoUrl}?w85&h95&fit=crop&auto=format`}
                // srcSet={`${ppUrl ? ppUrl : fakeDataModel[0].coverPhotoUrl}?w85&h95&fit=crop&auto=format&dpr= 2 2x`}
                src={decideImgResourceUrl()}
                srcSet={`${decideImgResourceUrl()}&dpr=2 2x`}
                alt={`user ${fullName ? fullName : "X"} profile display`}
                loading='lazy'
            />
            <ImageListItemBar
                sx={{
                    justifyContent: "center",
                }}

                title={<Typography variant="h6">{ppUrl ? "Profile" : "Cover"} Photo</Typography>}
            />
        </ImageListItem>
    )
}

export default EditUserProfile