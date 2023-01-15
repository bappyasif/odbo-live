import { ArrowBackIosTwoTone, ArrowForwardIosTwoTone, HighlightOffTwoTone } from '@mui/icons-material';
import { Alert, AlertTitle, Button, ButtonGroup, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListItem, ListItemText, Typography } from '@mui/material'
import { Stack } from '@mui/system';
import React, { useContext, useEffect, useState } from 'react'
import { AppContexts } from '../App';

export function HowToUseApp() {
    return (
        <div>HowToUseApp</div>
    )
}

export const HowToUseCreatePostComponent = () => {

    const titleText = 'Things you can do with Create post!!'

    const actions = [
        { name: "Editor", descriptions: ["This is a Rich Text Editor(tinymce). You can use this editor to have your post text look much more presentable than just plan text", "You can use this to add code or emoticon within your post", "You can also see current word/character counts from toolbar or at bottom right corner of editor", "Feel free to play with other available tools from this editor to make your posts standout nicely"] },
        { name: "Image", descriptions: ["You can add a picture from web to include this in your post", "Currently you can Only use any valid Image Url to do so", "No file upload is currently available"] },
        { name: "Video", descriptions: ["You can add a video from web to include this in your post", "Currently you can Only use any valid Video Url to do so", "No file upload is currently available"] },
        { name: "Gif", descriptions: ["When you click on it a List of most trending Gifs will show up", "You can choose one of them in your post as well", "Currently only one Gif resource per post is available"] },
        { name: "Poll", descriptions: ["When clicked on it a Poll creating view will show up", "You can ask a question to your audience via this", "Your can add choices for your audience to choose from and cast their votes on"] },
        { name: "Privacy", descriptions: ["When clicked upon a Privacy selecting choices will dropdown will show up", "You can make your posts private and only visible to your friends by selecting option Friends", "By default Privacy is Everyone, if you dont change it"] },
        { name: "Create", descriptions: ["When you're ready with your post hit this button to post it on OdBo", "When you create a post this will show up in your profile and also in your news feeds page, a.k.a page that you are currently on"] }
    ];

    return (
        <RenderDialogForComponent actions={actions} titleText={titleText} />
    )

}

export const HowToUsePostListItems = () => {
    const titleText = 'Things you can do from Post Listings!!'
    const actions = [
        {name: "Post Thread", descriptions: ["If you click any where in Post Content body, you will be routed to this post thread", "You can do every functionality from Post thread as you would from Home or Profile page as well"]},
        {name: "Post List Option Settings", descriptions: ["You can delete post if its created by you", "You can visit thread from selecting that option from there as well, which is highly recommended"]},
        {name: "Interaction - Comment", descriptions: ["You click on Comment icon from post listing view to begin writing a comment", "you can write as many comments for any posts as you would like", "When you click Send button comment will be submitted and not otherwise", "When submitted as a comment then it will show up in Post comemnts sectioon just below Post Listing", "App will keep track of your Commented posts for posterity", "You can see all commented posts from your Profile page as well"]},
        {name: "Interaction - Like", descriptions: ["You can like any post by clicking Like button on a Post Listing", "You can also Unlike this by clicking on it again", "All of your like posts will be available to see from your Profile page"]},
        {name: "Interaction - Dislike", descriptions: ["You can Dislike any post by clicking Dislike button on a Post Listing", "You can also Un-Dislike this by clicking on it again", "All of your Dislike posts will be available to see from your Profile page"]},
        {name: "Interaction - Love", descriptions: ["You can love any post by clicking Love button on a Post Listing", "You can also Un-love this by clicking on it again", "All of your love posts will be available to see from your Profile page"]},
        {name: "Interaction - Share", descriptions: ["You can share any post by clicking Share button on a Post Listing", "When clicked a new create post alike modal will show up to Share and create a new Post on OdBo", "All of your share posts will be available to see from your Profile page"]},
    ]

    return (
        <RenderDialogForComponent actions={actions} titleText={titleText} />
    )
}

export const HowToUseCommentListItems = () => {
    const titleText = 'Things you can do from Comment Listings!!'
    const actions = [
        {name: "Post Thread", descriptions: ["If you click on Show Thread, you will be routed to this post thread", "You can do every functionality from Post thread as you would from Home or Profile page as well"]},
        {name: "Comment Listings Option Settings", descriptions: ["You can delete comment if its created by you", "You can also delete any comemnts if it's on your Post", "You can edit also Edit comment if its created by you"]},
        {name: "Interaction - Like", descriptions: ["You can like any Comment by clicking Like button on a Comment Listing", "You can also Unlike this by clicking on it again"]},
        {name: "Interaction - Dislike", descriptions: ["You can Dislike any Comment by clicking Dislike button on a Comment Listing", "You can also Un-Dislike this by clicking on it again"]},
        {name: "Interaction - Love", descriptions: ["You can Love any post by clicking Love button on a Comment Listing", "You can also Un-love this by clicking on it again"]},
    ]

    return (
        <RenderDialogForComponent actions={actions} titleText={titleText} />
    )
}

export const HowToUseThirdPartyApiContentsListItems = () => {
    const titleText = 'Things you can do from Third Party Api Content Listings!!'
    const actions = [
        {name: "NYTimes Contents Type", descriptions: ["You will most popular posts extracting from either today, 7day or 1 month earlier times", "You will see posts based on Topics that you selected on your profile onboarding process", "If you want to bring any changes to that you can edit your Topic list from Edit Profile page"]},
        {name: "NYTimes Contents View", descriptions: ["You will see a small fragment of Actual post from their free to use api", "You will see a Web or Globe alike icon on top right corner of each posts, which you can click and see Original Article from source"]},
        {name: "Twitter Contents Type", descriptions: ["You will see most recent tweets on Topics that you chose", "If you want to bring any changes to that you can edit your Topic list from Edit Profile page"]},
        {name: "Twitter Contents View", descriptions: ["You will see actual Tweets contents in them", "You will also see user egnagements parameters on them as well", "You will see a Twitter icon on top right corner of each such posts", "You can visit Twitter and see its actual post from there by clicking on that Twitter icon"]}
    ]

    return (
        <RenderDialogForComponent actions={actions} titleText={titleText} />
    )
}

export const HowToUseShowMorePostsListings = () => {
    const titleText = 'Things you can do from Show More Post Listings!!'
    const actions = [
        {name: "Initial Users Posts Loads Details", descriptions: ["You will see a maximum of 11 posts at a time which were created by Users like You and Others"]},
        {name: "Initial Api Provided Posts Loads Details", descriptions: ["You will see a maximum of 16 posts at a time which were Vurated from Api such as NyTimes and Twitter recent Search endpoint"]},
        {name: "What can you expect", descriptions: ["You will see this on News Feeds page to let you know that there are more posts from earlier times are available for You to explore"]},
        {name: "What you will see", descriptions: ["When you click on this Show More button more Post Listings will be loaded onto Page for you to see and interact with"]},
    ]

    return (
        <RenderDialogForComponent actions={actions} titleText={titleText} />
    )
}

export const HowToUseConnectUsersListings = () => {
    const titleText = 'Things you can do from Connect Users Listings!!'
    const actions = [
        {name: "Send A Friend Request", descriptions: ["You can send any users from listings a Friend request by clicking on Send button from User Listing Card", "When you sent a friend request you can undo that action by clicking on Undo Button"]},
        {name: "Undo A Friend Request", descriptions: ["You can only click Undo button when there is a friend request is being Sent other wise it will stay Stale"]},
        {name: "Other User Card Behaviors", descriptions: ["When you alreay a frined you will see that on User Card", "When you are already a friend with some User then Both Send and Undo buttons will be Non Responsive to clicks"]},
        {name: "Card Clickable Buttons Behaviors", descriptions: ["By default only Send button will be Clickable", "Send button will be Satel when a Friend request is Sent to that User", "When friend request is Sent only then Undo Button will be Responsive to User Clicks"]}
    ]

    return (
        <RenderDialogForComponent actions={actions} titleText={titleText} />
    )
}

export const HowToUseExistingFriendsListings = () => {
    const titleText = 'Things you can do from Existing Friends Listings!!'
    const actions = [
        {name: "Listings Options", descriptions: ["You can click on it to open up available options to interact with", "You can visit their Profile Page", "You can also delete them from Friend list as well, if you want to"]},
    ]

    return (
        <RenderDialogForComponent actions={actions} titleText={titleText} />
    )
}

export const HowToUseFriendsRequestsListings = () => {
    const titleText = 'Things you can do from Friends Requests Listings!!'
    const actions = [
        {name: "Accept Request", descriptions: ["You can Accept a Friend Request", "When you accept a friend request User name will show up in Friends List"]},
        {name: "Reject Request", descriptions: ["You can Reject a Friend Request", "When you reject a friend request User name will be removed from Friend Request List"]},
    ]

    return (
        <RenderDialogForComponent actions={actions} titleText={titleText} />
    )
}

export const HowToUseUserProfilePage = () => {
    const titleText = 'Things you can do from User Profile Page!!'
    const actions = [
        {name: "Change Cover Picture Directly", descriptions: ["You can change Cover Photo directly from profile page", "You will have to click on Cover Photo thumnail caption and it will popup a modal fascilitating this feature"]},
        {name: "Change Profile Picture Directly", descriptions: ["You can change Profile Picture directly from profile page", "You will have to click on Profile Photo thumnail caption and it will popup a modal fascilitating this feature"]},
        {name: "Edit Profile", descriptions: ["You can click on Edit button, right beside User Email address", "After you click on Edit button a new page will show up to fascilitate other possible changes from tehir at once all together"]},
        {name: "Categorized Posts - All Posts", descriptions: ["You can see all of your posts that You Created so far in this Tab Panel view"]},
        {name: "Categorized Posts - Liked", descriptions: ["You can see all of those posts that You Liked in this Tab Panel view"]},
        {name: "Categorized Posts - Disliked", descriptions: ["You can see all of those posts that You Disliked in this Tab Panel view"]},
        {name: "Categorized Posts - Loved", descriptions: ["You can see all of those posts that You Loved in this Tab Panel view"]},
        {name: "Categorized Posts - Shared", descriptions: ["You can see all of those posts that You Shared in this Tab Panel view"]},
        {name: "Categorized Posts - Commented", descriptions: ["You can see all of those posts that You Commented in this Tab Panel view"]},
    ]

    return (
        <RenderDialogForComponent actions={actions} titleText={titleText} />
    )
}

export const HowToUseEditUserProfilePage = () => {
    const titleText = 'Things you can do from Edit User Profile Page!!'
    const actions = [
        {name: "Change Cover Picture Url", descriptions: ["You can change Cover Photo Url", "You will see image loads up instantaneously if url is valid"]},
        {name: "Change Profile Picture Url", descriptions: ["You will see image loads up instantaneously if url is valid"]},
        {name: "Change User Profile Name", descriptions: ["You can only change user profile name from here"]},
        {name: "Change User Profile Bio", descriptions: ["You can only change user profile Bio from here"]},
    ]

    return (
        <RenderDialogForComponent actions={actions} titleText={titleText} />
    )
}

const RenderDialogForComponent = ({actions, titleText}) => {
    let [slideNumber, setSlideNumber] = useState(0);
    let [renderSlide, setRenderSlide] = useState(null);

    const appCtx = useContext(AppContexts);

    let renderActions = () => actions.map(action => <RenderHowToUseInformations key={action.name} actionItem={action} />)

    const handleButtonActions = (buttonName) => {
        if (buttonName === "Previous") {
            if (slideNumber > 0 && slideNumber < actions.length) {
                setSlideNumber(prev => prev - 1)
            }
        } else if (buttonName === "Next") {
            if (slideNumber >= 0 && slideNumber < actions.length - 1) {
                setSlideNumber(prev => prev + 1)
            }
        } else if (buttonName === "Cancel") {
            appCtx.handleCloseDialogModal()
        }
    }

    useEffect(() => {
        setRenderSlide(renderActions()[slideNumber])
    }, [slideNumber])

    return (
        <Dialog
            onClose={appCtx.handleCloseDialogModal}
            open={appCtx.showDialogModal}
        >
            <RenderHowToUseInformationsTitleText text={titleText} />
            <DialogContent dividers>
                {renderSlide}
            </DialogContent>
            <Stack
                sx={{
                    flexDirection: "row",
                    justifyContent: "center"
                }}
            >
                <Typography variant='body1'>Slide Number: <b>{slideNumber + 1}</b> Out Of <b>{actions.length}</b></Typography>
            </Stack>
            <DialogActions
                sx={{
                    justifyContent: "center"
                }}
            >
                <RenderDialogActionsButtons totalSlides={renderActions().length} slideNumber={slideNumber} handleButtonActions={handleButtonActions} />
            </DialogActions>
        </Dialog>
    )
}

const RenderDialogActionsButtons = ({ handleButtonActions, slideNumber, totalSlides }) => {
    const actionButtons = [
        { name: "Previous", icon: <ArrowBackIosTwoTone /> },
        { name: "Cancel", icon: <HighlightOffTwoTone /> },
        { name: "Next", icon: <ArrowForwardIosTwoTone /> }
    ]

    let renderActionButtons = () => actionButtons.map(item => <RenderDialogActionButton key={item.name} buttonItem={item} handleButtonActions={handleButtonActions} />)

    return (
        <ButtonGroup>
            {renderActionButtons()}
        </ButtonGroup>
    )
}

const RenderDialogActionButton = ({ buttonItem, handleButtonActions }) => {
    return (
        <Button
            onClick={() => handleButtonActions(buttonItem.name)}
            sx={{
                borderRadius: 9
            }}
            startIcon={buttonItem.name !== "Next" && buttonItem.icon}
            endIcon={buttonItem.name === "Next" && buttonItem.icon}
        >
            <Typography>{buttonItem.name}</Typography>
        </Button>
    )
}

const RenderHowToUseInformationsTitleText = ({ text }) => {
    return (
        <DialogTitle variant='h5'>{text}</DialogTitle>
    )
}

const RenderHowToUseInformations = ({ actionItem }) => {
    let { name, descriptions } = { ...actionItem }

    let renderDescriptions = () => descriptions.map((item, idx) => <RenderActionDescriptionDetail key={item + idx} text={item} />)

    return (
        <DialogContentText>
            <Typography variant='h4'>{name}</Typography>
            <List>
                {renderDescriptions()}
            </List>
        </DialogContentText>
    )
}

const RenderActionDescriptionDetail = ({ text }) => {
    return (
        <ListItem>
            <ListItemText>
                <Typography variant='h6'>{text}</Typography>
            </ListItemText>
        </ListItem>

    )
}

export const ButtonToIndicateHelp = ({ alertPosition, forWhichItem, hoverPosition }) => {
    let [showMoreInfo, setShowMoreInfo] = useState(false);

    const appCtx = useContext(AppContexts);
    
    const handleShowMoreInfo = () => {
        setShowMoreInfo(true)
    }
    
    const handleHideMoreInfo = () => {
        setShowMoreInfo(false)
    }

    const handleDialogModalActivity = () => {
        appCtx.handleDialogTextFor(forWhichItem)
        appCtx.handleOpenDialogModal()
    }

    return (
        appCtx.assistiveMode
        ?
        <>
            <Alert
                onMouseEnter={handleShowMoreInfo}
                onMouseLeave={handleHideMoreInfo}
                onClick={handleDialogModalActivity}
                sx={{
                    position: "absolute",
                    zIndex: 9,
                    backgroundColor: "rgba(255,255,255,.4)",
                    borderRadius: "50%",
                    padding: "2px",
                    fontSize: "2em",
                    pl: "15px",
                    opacity: .9,
                    outline: "solid .8px aqua",
                    '&:hover': {
                        backgroundColor: 'rgba(255,255,255,.9)',
                        opacity: .9,
                    },
                    ...alertPosition
                }}
                severity='info'
            />
            <CircularProgress
                color='error' 
                sx={{
                    position: "absolute",
                    left: 0,
                    width: "22px !important",
                    height: "22px !important",
                    zIndex: "8"
                }}
            />
            {showMoreInfo ? <MoreInfoOnHover hoverPosition={hoverPosition} /> : null}
        </>
        : null
    )
}

export const MoreInfoOnHover = ({ name, hoverPosition }) => {
    return (
        <Button
            sx={{
                position: "absolute",
                left: 0,
                zIndex: 9,
                top: "35px",
                maxWidth: "200px",
                ...hoverPosition
            }}
        >
            <Alert severity='info'>
                <AlertTitle>How To Use Info</AlertTitle>
                <Typography variant='body2'>Click on this info icon to find out!!</Typography>
            </Alert>
        </Button>
    )
}