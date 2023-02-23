import React, { useContext, useEffect, useRef, useState } from 'react'
import { GiphyFetch } from "@giphy/js-fetch-api"
import { Grid } from "@giphy/react-components"
import EmojiPicker from "emoji-picker-react"
import { Editor } from "@tinymce/tinymce-react"
import { FormElement } from './FormElements'
import { BoxElement, ButtonElement, CardElement, ContainerElement, FormControlElement, GifElement, HelperTextElement, IconButtonElement, ImageElement, InputLabelElement, PaperElement, PollElement, PrivacyElement, SearchUserInputElement, TypographyElement, UserInputElement, VideoCameraFrontElement } from './MuiElements'
import ChoosePrivacy from './ChoosePrivacy'
import CreatePoll from './CreatePoll'
import ShowUserPostMedias from './ShowUserPostMedias'
import { Avatar, Box, Button, CardContent, CircularProgress, FormControl, Icon, Input, InputLabel, Paper, Stack, Typography } from '@mui/material'
import { PostAddTwoTone } from '@mui/icons-material'
import { sendDataToServer, sendDataWithProtectionToServer } from '../utils'
import { AppContexts } from '../App'
import { useNavigate } from 'react-router-dom'
import { ButtonToIndicateHelp, HowToUseCreatePostComponent } from './HowToUseApp'
import ConsentsPrompt from './ConsentsPrompt'
import AnnouncementAlert from './AnnouncementAlert'
import { isMobile } from 'react-device-detect'

function CreatePost({ handleSuccessfullPostShared }) {
  let [addedOptions, setAddedOptions] = useState({})
  let [errors, setErrors] = useState([])
  let [postText, setPostText] = useState(null)
  let [annTxt, setAnnTxt] = useState({});

  let ref = useRef();

  const navigate = useNavigate()

  let appCtx = useContext(AppContexts)

  let handleErrors = data => setErrors(data.errors);

  let handlePostData = result => {
    setAddedOptions({})
    setPostText(null)

    appCtx.updateAvailablePostsFeeds(result.post)
    handleSuccessfullPostShared && handleSuccessfullPostShared(result.post._id)
  }

  let handleAddedOptions = (evt, elm, val) => {
    if (elm === "Gif") {
      setAddedOptions(prev => ({ ...prev, [elm]: val?.id, current: elm }))
    } else if (elm !== "body") {
      val
        ? setAddedOptions(prev => ({ ...prev, [elm]: val, current: elm }))
        : setAddedOptions(prev => {
          // checking if same element actionable component is Open already, if so then we will toggle it by changing its value something which does not have any Component tied to it
          const chk = prev["current"] === elm

          return ({ ...prev, current: chk ? "Choose Again" : elm })
        })
    } else {
      setAddedOptions(prev => ({ ...prev, [elm]: evt.target.getContent(), current: elm }))
    }
  }

  const updateAnnouncementText = (data) => setAnnTxt(prev => ({ ...prev, ...data }))

  const afterAlert = () => setAnnTxt({});

  const afterConsentAction = () => {
    setAnnTxt({});
    navigate("/login")
  };

  let createPost = () => {
    if (appCtx?.user?._id) {
      if (addedOptions.body) {
        if (addedOptions.body.length < 220) {
          let url = `${appCtx.baseUrl}/posts/post/create/${appCtx.user._id}`
          sendDataWithProtectionToServer(url, addedOptions, handlePostData, handleErrors, appCtx?.user?.userJwt?.refreshToken)
        } else {
          // alert("more than characters limit count found, maximum word count is 220")
          updateAnnouncementText({ mainText: "more than characters limit count found, maximum word count is 220" })
        }
      } else {
        // alert("at least post text needs to be there")
        updateAnnouncementText({ mainText: "at least post text needs to be there" })
      }
    } else {
      // re routing prompt for user consent to login page for authentication
      // let choose = prompt("you need to be registered or authenticated before creating any post, do you want to proceed to login Page? Y || N", "Y")
      // updateAnnouncementText({elementName: "login prompt", mainText: "you need to be registered or authenticated before creating any post, do you want to proceed to login Page?", primaryAction: () => navigate("/login"), cancelAction: () => null})
      updateAnnouncementText({ elementName: "login prompt", mainText: "you need to be registered or authenticated before creating any post, do you want to proceed to login Page?", primaryAction: afterConsentAction, cancelAction: () => setAnnTxt({}) })
      // if (choose === "Y" || choose === "y") {
      //   navigate("/login")
      // }
    }
  }

  console.log(annTxt,  "ANNTXT!!")

  return (
    <ContainerElement width={"md"}>
      <PaperElement position="relative">
        {
          (annTxt?.elementName)
            ? <ConsentsPrompt elementName={annTxt.element} titleText={"Lets Log You In"} mainText={annTxt.mainText} primaryAction={annTxt.primaryAction} cancelAction={annTxt.cancelAction} />
            : annTxt?.mainText
              ? <AnnouncementAlert titleText={"App Alert!!"} mainText={annTxt.mainText} handleAnnoucement={afterAlert} />
              : null
        }
        <ButtonToIndicateHelp forWhichItem={"Create Post"} />
        {appCtx.dialogTextFor === "Create Post" ? <HowToUseCreatePostComponent /> : null}
        <PostCreatingModalUi
          appCtx={appCtx}
          handleAddedOptions={handleAddedOptions}
          addedOptions={addedOptions}
          postText={postText}
          setPostText={setPostText}
          createPost={createPost}
        />
      </PaperElement>
    </ContainerElement>
  )
}

const PostCreatingModalUi = ({ appCtx, handleAddedOptions, setPostText, postText, addedOptions, createPost }) => {
  let ref = useRef();

  const handleCreatePost = () => {
    ref.current.reset()
    createPost()
  }

  return (
    <CardElement>
      <CardContent>
        <Stack
          sx={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: { xs: "center", lg: "space-between" },
            px: .2,
            pr: 1.1
          }}
        >
          <Avatar
            sx={{ display: { xs: "none", md: "flex" }, width: { xs: 110, md: 170, lg: 200, xl: 211 }, height: { xs: 110, md: 170, lg: 200, xl: 251 }, mr: 1.5, p: .4, alignSelf: "center", objectFit: "fill" }}
            alt={"fullname" || appCtx.user?.fullName}
            src={appCtx.user?.ppUrl || "https://random.imagecdn.app/500/150"}
          />
          <Stack
            sx={{
              // width: { xs: "459px", md: "620px", lg: "100%" },
            }}
          >
            <form ref={ref} style={{ position: "relative", width: "100%" }}>
              <ShowRichTextEditor handleChange={handleAddedOptions} setPostText={setPostText} />
              <VisualizeWordCountProgress textContent={postText} maxLimit={220} topPlacingUnits={"6.2px"} />
            </form>
            <Stack
              sx={{
                flexDirection: "row",
                justifyContent: { xs: "center", lg: "space-between" },
                flexWrap: { xs: "wrap", lg: "nowrap" },
                mt: .6
              }}
            >
              {iconsBtns.map(item => <ShowIconBtns key={item.name} item={item} handleAddedOptions={handleAddedOptions} />)}
            </Stack>

            {
              !(addedOptions.Image || addedOptions.Video || addedOptions.Gif || addedOptions.Privacy || addedOptions.Poll)
                ? <CreatePostButton handleCreatePost={handleCreatePost} appCtx={appCtx} />
                : null
            }

          </Stack>
        </Stack>

        <ShowClickActionsFunctionality currentElement={addedOptions.current} handleValue={handleAddedOptions} />

        <ShowUserPostMedias mediaContents={addedOptions} />
      </CardContent>

      {
        (addedOptions.Image || addedOptions.Video || addedOptions.Gif || addedOptions.Privacy || addedOptions.Poll)
          ? <CreatePostButton handleCreatePost={handleCreatePost} appCtx={appCtx} />
          : null
      }

    </CardElement>
  )
}

const CreatePostButton = ({ handleCreatePost, appCtx }) => {
  return (
    <Stack
      sx={{ position: "relative" }}
      onClick={handleCreatePost}
    >
      <Button sx={{ backgroundColor: "primary.light" }} variant='contained' endIcon={<PostAddTwoTone />}>
        <Typography variant={"h6"}>{!appCtx?.user?._id ? "Login to " : ""}Create Post</Typography>
      </Button>
    </Stack>
  )
}

export const VisualizeWordCountProgress = ({ forRegister, forLogin, textContent, maxLimit, smallerSize, topPlacingUnits }) => {
  let [progress, setProgress] = useState(0);

  let handleProgress = () => {
    let countPercentile = Math.round((textContent?.length / maxLimit) * 100)
    if (textContent?.length <= maxLimit) {
      setProgress(countPercentile)
    } else {
      alert("character count limit exceeded!!")
    }
  }

  useEffect(() => {
    textContent?.length && handleProgress()
    textContent?.length === 0 && setProgress(0)
  }, [textContent])

  return (
    <CircularProgress
      sx={{
        position: "absolute",
        right: (!forLogin || !forRegister) ? "4px" : "auto",
        left: forLogin ? "-2px" : forRegister ? "-35px" : "auto",
        top: topPlacingUnits ? topPlacingUnits : 1.1,
        zIndex: 9,
        height: smallerSize ? "31px !important" : "auto",
        width: smallerSize ? "29px !important" : "auto",
        color: progress === 100 ? "red" : "auto"
      }}
      variant="determinate"
      value={progress}
    />
  )
}

let ShowRichTextEditor = ({ handleChange, setPostText }) => {
  return (
    <>
      <Editor
        initialValue=" "
        init={{
          selector: 'textarea',  // change this value according to your HTML
          init_instance_callback: function (editor) {
            editor.getWin().document.body.style.backgroundColor = '#6c757d'
            editor.on("keyup change", (e) => {
              let regExp = /<[^>]*>/g
              setPostText(editor.getContent().replace(regExp, ''))
            });
          },
          browsers : isMobile ? "msie,gecko,opera,safari" : null,
          height: 161,
          branding: false,
          menubar: false,
          preview_styles: false,
          plugins: 'link code emoticons autolink wordcount autoresize',
          toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | emoticons | wordcount',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:22px }'
        }}
        id="body"
        onChange={(e) => handleChange(e, 'body')}
      />
    </>
  )
}

let ShowClickActionsFunctionality = ({ currentElement, handleValue }) => {
  let renderFunctionality = null;

  if ((currentElement === "Image" || currentElement === "Video")) {
    renderFunctionality = <ShowUrlGrabbingForm handleValue={handleValue} currentElement={currentElement} />
  } else if (currentElement === "Gif") {
    renderFunctionality = <ShowGifSelectingElement handleValue={handleValue} currentElement={currentElement} />
  } else if (currentElement === "Emoji") {
    renderFunctionality = <ShowEmoJiPickerElement />
  } else if (currentElement === "Poll") {
    renderFunctionality = <CreatePoll handleValue={handleValue} currentElement={currentElement} />
  } else if (currentElement === "Privacy") {
    renderFunctionality = <ChoosePrivacy handleValue={handleValue} currentElement={currentElement} />
  }

  return (
    <Paper>
      {renderFunctionality}
    </Paper>
  )
}

let ShowEmoJiPickerElement = () => {
  return (
    <>
      <EmojiPicker />
    </>
  )
}

let ShowGifSelectingElement = ({ handleValue, currentElement }) => {
  let [searchText, setSearchText] = useState(null);
  let [gifData, setGifData] = useState(null);

  let giphyFetch = new GiphyFetch(process.env.REACT_APP_GIPHY_FETCH_API_KEY);

  let fetchGifs = (offset) => searchText ? giphyFetch.search(searchText, { offset, limit: 10 }) : giphyFetch.trending({ offset, limit: 10 });

  let handleOnGifClicked = (gif, e) => {
    e.preventDefault();
    setGifData(gif)
    handleValue(e, currentElement, gif);
    handleValue(e, "choose again", "");
  }

  let handleSearchText = evt => setSearchText(evt.target.value)

  return (
    <Box
      sx={{
        width: "100vw"
      }}
    >
      <ShowGifSearch handleSearchText={handleSearchText} />

      <Stack
        sx={{
          maxHeight: "290px",
          overflowY: "scroll"
        }}
      >
        <Grid
          onGifClick={handleOnGifClicked}
          fetchGifs={fetchGifs}
          width={window.innerWidth}
          columns={4}
          gutter={6}
          key={searchText}
        />
      </Stack>
    </Box>
  )
}

let ShowGifSearch = ({ handleSearchText }) => {
  return (
    <FormControl
      sx={{
        my: 1.1,
        mt: 2.2,
        width: "100%",
      }}
    >
      <InputLabel htmlFor='url'>Search Gif</InputLabel>
      <Input sx={{ fontSize: "x-large" }} type={"text"} id={"url"} aria-describedby={"search gif"} onChange={handleSearchText} fullWidth={true} />
    </FormControl>
  )
}

let ShowUrlGrabbingForm = ({ handleValue, currentElement }) => {
  let [value, setValue] = useState(null);

  let handleChange = event => setValue(event.target.value)

  let handleSubmit = event => {
    event.preventDefault();
    // uploading url into state
    handleValue(event, currentElement, value);
    // changing current elemnt to something which has no actionable components attached to it
    handleValue(event, "choose again", "");
  }

  const handleCancelClick = evt => {
    handleValue(evt, "choose again", "");
  }

  return (
    <Box sx={{ m: 2 }}>
      <FormElement handleSubmit={handleSubmit}>
        <FormControlElement>
          <InputLabelElement hFor={"url"} text={"Enter Url Of Media Resource Here"} />
          <UserInputElement id={"url"} helperId="url-helper-text" type={"text"} handleChange={handleChange} />
          <HelperTextElement id={"url-helper-text"} text={"Enter a valid a url of your media resource"} />
        </FormControlElement>
        <Stack
          sx={{
            flexDirection: "row", justifyContent: "space-between", px: .9
          }}
        >
          <ButtonElement type={"submit"} text="Upload" variant={"contained"} />
          <ButtonElement text="Cancel" variant={"contained"} action={handleCancelClick} />
        </Stack>
      </FormElement>
    </Box>
  )
}

let ShowIconBtns = ({ item, handleAddedOptions }) => {

  return (
    <Button
      onClick={e => handleAddedOptions(e, item.name, '')}
      variant='outlined'
      // startIcon={item.elem}
      sx={{
        mx: .2, mt: 0,
        backgroundColor: "secondary.light", color: "text.primary",
        // minWidth: { xs: "auto", md: "auto" },
        minWidth: "fit-content",
        display: "flex", alignItems: "center",
        // p: 0,
      }}
    >
      <Icon
        sx={{
          display: "flex",
          width: "fit-content"
          // p: {xs: .1, md: "auto"}
        }}
      >
        {item.elem}
      </Icon>
      <Typography variant='h6' sx={{ color: "text.primary", display: { xs: "none", lg: "block" } }}>{item.name}</Typography>
      {/* <TypographyElement styles={{ color: "text.primary", fontSize: "large" }} text={item.name} type={"span"} /> */}
    </Button>
  )
}

// dataset for post create icons elements
let iconsBtns = [
  { name: "Image", elem: <ImageElement /> },
  { name: "Video", elem: <VideoCameraFrontElement /> },
  { name: "Gif", elem: <GifElement /> },
  { name: "Poll", elem: <PollElement /> },
  { name: "Privacy", elem: <PrivacyElement /> }
];

export default CreatePost