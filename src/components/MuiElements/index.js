import { Tab, Tabs, Input, Button, Box, Typography, Card, CardHeader, Avatar, CardContent, Stack, Skeleton, IconButton, Paper, Container, TextField, FormControl, InputLabel, FormHelperText, MenuItem, Select, Tooltip } from "@mui/material";
import moment from "moment";
import { Link } from "react-router-dom";
import { Masonry } from "@mui/lab"
import { PeopleAltRounded, AllInclusiveRounded, PollRounded, PrivacyTipRounded, InsertEmoticonRounded, GifBoxRounded, ImageRounded, VideoCameraFrontRounded, DeleteOutlineRounded, ThumbUpAltRounded, ThumbDownAltRounded, HeatPumpRounded, ShareRounded, PublicRounded } from "@mui/icons-material";

const TabsElement = (props) => {
    return (
        <Tabs
            value={props.value}
            onChange={props.handleChange}
            className={props.className}
            centered
        >{props.children}</Tabs>
    )
}

const TabElement = (props) => {
    return (
        <Tab
            icon={props.icon}
            label={props.labelText}
            to={props.path}
            LinkComponent={Link}
        >
            {props.children}
        </Tab>
    )
}

const TabElementWithoutLink = ({ icon, labelText }) => {
    return <Tab icon={icon} label={labelText} />
}

const MuiInputElement = ({ id, type, handleChange, text, required, color, error, fontSize }) => {
    console.log(error)
    return (
        <Input
            sx={{ fontSize: fontSize ? fontSize : "auto", border: 0, margin: 1.1, width: "263px", color: color, backgroundColor: error ? "GrayText" : "transparent", borderColor: "primary.main" }}
            id={id}
            name={id}
            type={type}
            // onChange={handleChange}
            onChange={(e) => handleChange(e, id)}
            placeholder={text}
            required={required}
            color={color}
            // fullWidth={true}
            error={error}
        />
    )
}

const MuiButtonElement = ({ type, text, fullWidth=false }) => {
    return (
        <Button fullWidth={fullWidth} variant="contained" color={"success"} type={type} sx={{ borderRadius: 9 }}>{text}</Button>
    )
}

const MuiBoxElement = (props) => {
    return (
        <Box
            sx={{ border: 1.1, borderColor: props.color, alignItems: "center", display: "flex", flexDirection: props.direction, gap: 2, pl: 1.1, pr: 1.1, borderRadius: 1.1 }}
            color={props.color || "teal"}>{props.children}</Box>
    )
}

const TypographyElement = ({ text, type, styles, forConnect }) => {
    return <Typography variant={type} sx={{...styles, m: forConnect ? 1.1 : 0, mb: forConnect ? 4 : 0, mt: forConnect ? 4 : 0}}>{text}</Typography>
}

const CardElement = (props) => {
    return <Card className={props.className} sx={props.styles}>{props.children}</Card>
}

const AvatarElement = ({ url, altText, forPost, forComment, forConnect }) => {
    return (
        <Avatar
            sx={{ width: forPost ? 74 : forComment ? 42 : 110, height: forPost ? 74 : forComment ? 42 : 90, mr: 0, p: forConnect ? 2 : 0 }}
            alt={altText}
            src={url}
        />
    )
}

const CardHeaderElement = ({ styles, avatarUrl, title, joined, altText, forPost, forComment, forConnect }) => {
    return (
        <CardHeader
            avatar={<AvatarElement url={avatarUrl} altText={altText} forPost={forPost} forComment={forComment} forConnect={forConnect} />}
            title={<Typography marginLeft={forPost ? 0 : forConnect ? 0 : 2} textAlign={"left"} variant={forPost ? "h4" : forComment ? "subtitle2" : forConnect ? "h5" : "h2"}>{title}</Typography>}
            subheader={<Typography sx={{ textAlign: "left" }} variant={forPost ? "subtitle1" : forComment ? "subtitle2" : forConnect ? "p" : "h6"}>{`Member Since: ${moment(joined).fromNow()}`}</Typography>}
        // sx={{fontSize: "33px"}}
            sx={{...styles, backgroundColor: forConnect ? "info.dark" : "inherit",  borderRadius: 2, p: 0}}
        />
    )
}

const CardContentElement = (props) => {
    return <CardContent sx={{mt: 2, p:0}}>{props.children}</CardContent>
}

const ButtonElement = ({ text, type, fontSize, action, disable, variant }) => {
    return (
        <Tooltip title={!disable ? text : null}>
            <Button
                type={type}
                // disabled={disable}
                onClick={action}
                sx={{
                    fontSize: fontSize || "20px",
                    borderRadius: 4,
                    width: "100%",
                    backgroundColor: disable ? "info.light" : "info.dark",
                    color: "info.contrastText",
                    pointerEvents: disable ? "none" : "auto",
                    '&:hover': {
                        backgroundColor: 'secondary.main',
                        color: "primary.contrastText",
                        opacity: 0.9,
                    },
                }}
                variant={variant}
            >
                {text}
            </Button>
        </Tooltip>
    )
}

const BoxElement = (props) => {
    return <Box sx={{ width: "100%", order: props.order, display: "flex", gap: 2, justifyContent: "center", mt: 2 }} className={props.className}>{props.children}</Box>
}

const StackElement = (props) => <Stack sx={{...props.styles}} className={props.className}>{props.children}</Stack>

const MasonryElement = props => <Masonry 
    // sx={{columns: {xs: 1, md: 2, lg: 3}}} 
    // columns={3} 
    // sx={{backgroundColor: "info.dark"}}
    columns={{ xs: 1, md: 2, lg: 3 }}
    spacing={2} className={props.className}>{props.children}</Masonry>

const SkeletonBasicElement = ({ height, width, animation, variant }) => <Skeleton variant={variant || "circular"} animation={animation || "wave"} height={height || 10} width={width || "80%"} />

const IconButtonElement = (props) => <IconButtonElement onClick={e => props.clickHandler(e, props.elm, '')}>{props.children}</IconButtonElement>

const DeleteIconElement = ({ fontSize }) => <DeleteOutlineRounded fontSize={fontSize || "medium"} />

const LikeIconElement = ({ fontSize }) => <ThumbUpAltRounded fontSize={fontSize || "medium"} />

const DislikeIconElement = ({ fontSize }) => <ThumbDownAltRounded fontSize={fontSize || "medium"} />

const LoveIconElement = ({ fontSize }) => <HeatPumpRounded fontSize={fontSize || "medium"} />

const ShareIconElement = ({ fontSize }) => <ShareRounded fontSize={fontSize || "medium"} />

const PaperElement = (props) => <Paper sx={{ position: props.position || "relative", backgroundColor: props.bgColor || "darkslategray" }}>{props.children}</Paper>

const ContainerElement = props => <Container maxWidth={props.width || "lg"}>{props.children}</Container>

const TextFieldMultilineElement = () => <TextField multiline rows={4} defaultValue="this is a test" />

const VideoCameraFrontElement = ({ fontSize }) => <VideoCameraFrontRounded fontSize={fontSize || "medium"} />

const ImageElement = ({ fontSize }) => <ImageRounded fontSize={fontSize || "medium"} />

const GifElement = ({ fontSize }) => <GifBoxRounded fontSize={fontSize || "medium"} />

const EmoticonElement = ({ fontSize }) => <InsertEmoticonRounded fontSize={fontSize || "medium"} />

const PrivacyElement = ({ fontSize }) => <PrivacyTipRounded fontSize={fontSize || "medium"} />

const PollElement = ({ fontSize }) => <PollRounded fontSize={fontSize || "medium"} />

const EverybodyElement = ({ fontSize }) => <PublicRounded fontSize={fontSize || "medium"} />

const FriendsElement = ({ fontSize }) => <PeopleAltRounded fontSize={fontSize || "medium"} />

const FormControlElement = (props) => <FormControl sx={props.styles || { width: "100%" }}>{props.children}</FormControl>

const InputLabelElement = ({ hFor, text }) => <InputLabel htmlFor={hFor}>{text}</InputLabel>

const UserInputElement = ({ id, helperId, type, handleChange, width }) => <Input type={type} id={id} aria-describedby={helperId} onChange={handleChange} fullWidth={true} />

const HelperTextElement = ({ id, text }) => <FormHelperText id={id}>{text}</FormHelperText>

const SearchUserInputElement = ({ id, type, handleChange }) => <Input sx={{ pt: 2, pl: 2, mb: 4, bgcolor: "text.success", border: 1.1, borderColor: "teal", fontSize: "x-large" }} type={type} id={id} onChange={handleChange} />

const SelectElement = (props) => <Select id={props.id} value={props.value} onChange={(e) => console.log(e, e.target.value)}>{props.children}</Select>

const MenuItemElement = ({ value, text }) => <MenuItem value={value}>{text}</MenuItem>

// const MuiIconElement = ({icon}) => {

// }

export {
    MenuItemElement,
    SelectElement,
    SearchUserInputElement,
    HelperTextElement,
    UserInputElement,
    InputLabelElement,
    FormControlElement,
    FriendsElement,
    EverybodyElement,
    PollElement,
    PrivacyElement,
    EmoticonElement,
    GifElement,
    ImageElement,
    VideoCameraFrontElement,
    TextFieldMultilineElement,
    ContainerElement,
    PaperElement,
    IconButtonElement,
    DeleteIconElement,
    LikeIconElement,
    DislikeIconElement,
    LoveIconElement,
    ShareIconElement,
    SkeletonBasicElement,
    MasonryElement,
    StackElement,
    BoxElement,
    ButtonElement,
    CardContentElement,
    AvatarElement,
    CardHeaderElement,
    TabsElement,
    TabElement,
    TabElementWithoutLink,
    MuiInputElement,
    MuiButtonElement,
    MuiBoxElement,
    TypographyElement,
    CardElement
}