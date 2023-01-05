import React, { useContext, useEffect, useRef, useState } from 'react'
import { FieldsetElement, FormElement, InputElement, LabelElement, LegendElement, SubmitButton } from '../components/FormElements'
import { H1Element, WrapperDiv } from '../components/GeneralElements'
import { removeJwtDataFromLocalStorage, sendDataToServer } from '../utils';
import { AppContexts } from "../App"
import ShowErrors from '../components/ShowErrors';
import { Box, Button, Dialog, DialogContent, DialogTitle, Fab, FormControl, Icon, IconButton, Input, InputAdornment, InputLabel, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import { AccountCircleTwoTone, Check, Error, Facebook, GitHub, Google, LinkedIn, LoginTwoTone, PasswordTwoTone, Twitter } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { VisualizeWordCountProgress } from '../components/CreatePost';
import { useToCloseModalOnClickedOutside } from '../hooks/toDetectClickOutside';

function LoginForm() {
    let [errors, setErrors] = useState([]);
    let [formData, setFormData] = useState({});
    let [processingRequest, setProcessingRequest] = useState(null);

    const navigate = useNavigate()

    const appCtx = useContext(AppContexts);

    let handleChange = (evt, elm) => setFormData(prev => ({ ...prev, [elm]: evt.target.value }))

    let handleError = data => {
        setErrors(data.errors);
        setProcessingRequest("error");
        let timer = setTimeout(() => {
            setProcessingRequest("")
            if (timer >= 1700) clearTimeout(timer)
        }, 1700)
    }

    let updateData = result => {
        setProcessingRequest("success");
        removeJwtDataFromLocalStorage();
        appCtx.handleData(result)

        let timer = setTimeout(() => {
            result?.user?.topics?.length < 4
                ? navigate("/choose-topics")
                : appCtx.routeBeforeSessionExpired
                    ? navigate(appCtx.routeBeforeSessionExpired)
                    : navigate("/");
            if (timer >= 1100) {
                appCtx.handleLastVisitedRouteBeforeSessionExpired(null)
                clearTimeout(timer)
            }
        }, 1100)
    }

    let handleSubmit = evt => {
        evt.preventDefault();
        setProcessingRequest("loading");

        let timer = setTimeout(() => {
            sendDataToServer(appCtx.baseUrl + "/login", formData, handleError, updateData)
            if (timer >= 1700) clearTimeout(timer)
        }, 1700)
    }
    // console.log(formData, "formData!!");

    // console.log(appCtx.routeBeforeSessionExpired, "appCtx.routeBeforeSessionExpired")

    return (
        <Box
            sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", position: "relative", gap: 6, height: "100vh" }}
        >
            <ShowDataProcessingLoaders processingRequest={processingRequest} />
            <GuestUsers setFormData={setFormData} handleSubmit={handleSubmit} />

            <WrapperDiv className="login-form">
                <Typography fontWeight={"bold"} fontSize={"42px"} variant='h3'>Login Form</Typography>

                <FormElement handleSubmit={handleSubmit}>
                    <LegendElement text={"Enter your registered email and password"} />
                    <LoginFromControlComponent handleChange={handleChange} />
                    <Button
                        type='submit' variant='contained' startIcon={<LoginTwoTone />}
                    >
                        <Typography variant='h6'>Login</Typography>
                    </Button>
                </FormElement>

                {errors?.length ? <ShowErrors errors={errors} /> : null}
            </WrapperDiv>

            <ThirdPartyLoginOutlets />

        </Box>
    )
}

export const ShowSessionExpiredDialog = () => {
    const [show, setShow] = useState(false);

    const ref = useRef();

    useToCloseModalOnClickedOutside(ref, () => setShow(false))

    const closeModalAfterTwoSeconds = () => {
        let timer = setTimeout(() => {
            setShow(false);

            return () => clearTimeout(timer)
        }, 2000)
    }
    
    useEffect(() => {
        show && closeModalAfterTwoSeconds()
    }, [show])

    useEffect(() => {
        setShow(true)
    }, [])

    return (
        <Paper
            ref={ref}
        >
            <Dialog
                open={show}
            >
                <DialogTitle>
                    <Typography>Session Expired!!</Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography>You are now redirected to Login page</Typography>
                    <Typography variant='subtitle1'>After successfull login, you will be redirected back to your previously visited page</Typography>
                </DialogContent>
            </Dialog>
        </Paper>
    )
}

const LoginFromControlComponent = ({ handleChange }) => {
    const formControlElements = [
        { name: "email", type: "email", text: "e.g. Email: example@domain.com", icon: <AccountCircleTwoTone /> },
        { name: "password", type: "password", text: "e.g. Password: p1a2s3s4w5o6r7d8", icon: <PasswordTwoTone /> },
    ]

    let renderFormControls = () => formControlElements.map(item => <RenderFormControlElement key={item.name} item={item} handleChange={handleChange} />)

    return (
        <Stack
            sx={{
                m: .8,
                mb: 1.8
            }}
        >
            {renderFormControls()}
        </Stack>
    )
}

export const RenderFormControlElement = ({ item, handleChange }) => {
    let [userInput, setUserInput] = useState("")

    const handleUserInput = (evt) => {
        if (
            item.name === "email" && evt.target.value.length < 45
            ||
            item.name === "password" && evt.target.value.length < 90
        ) {
            setUserInput(evt.target.value);
            handleChange(evt, item.name)
        } else {
            alert(`${item.name} limit of ${item.name === "email" ? 44 : 89} has eceeded`)
        }
    }
    return (
        <FormControl
            sx={{
                mt: 2,
                position: "relative"
            }}
        >
            <Input
                name={item.name}
                id={item.name}
                type={item.type}
                required={true}
                onChange={handleUserInput}
                placeholder={item.text}
                startAdornment={
                    <InputAdornment position='start'>
                        {item.icon}
                    </InputAdornment>
                }
            />
            <VisualizeWordCountProgress smallerSize={true} textContent={userInput} maxLimit={item.name === "email" ? 44 : 89} forLogin={true} topPlacingUnits={"0.371px"} />
        </FormControl>
    )
}

export const ShowDataProcessingLoaders = ({ processingRequest }) => {
    let decideLoader = () => {
        let loader = null;
        if (processingRequest === "loading") {
            loader = <LinearProgress sx={{ height: "20px" }} />
        } else if (processingRequest === "success") {
            loader = <RenderLoader icon={<Check />} announcement="Authentication Successfull" />
        } else if (processingRequest === "error") {
            loader = <RenderLoader icon={<Error />} announcement="Authentication Error" />
        }

        return loader;
    }

    return (
        <Box
            sx={{
                position: "absolute",
                top: processingRequest !== "loading" ? "2px" : "-18px",
                width: "100%",
                textAlign: processingRequest !== "loading" ? "justify" : "auto",
                paddingLeft: processingRequest !== "loading" ? "2px" : "auto"
            }}
        >
            {decideLoader()}
        </Box>
    )
}

let RenderLoader = ({ icon, announcement }) => {
    let [bgColor, setBgColor] = useState(null);

    useEffect(() => {
        setBgColor(announcement === "Authentication Error" ? "error" : announcement === "Authentication Successfull" ? "primary.light" : "auto")
    }, [announcement])

    return (
        <Fab
            variant='extended'
            sx={{
                cursor: "auto", width: "fit-content", p: 1.1,
                backgroundColor: bgColor
            }}
            aria-label="user log in successfull" color="primary"
        >
            {icon}
            <Typography variant="h6" marginLeft={1.1}>{announcement}</Typography>
        </Fab>
    )
}

let ThirdPartyLoginOutlets = () => {
    let renderLoginOutlets = () => loginOutlets.map(item => <RenderLoginOutlet key={item.name} item={item} />)

    return (
        <Paper sx={{ ml: 2, mt: 1, borderRadius: 2 }}>
            <Typography variant='h2'>Login With</Typography>
            {renderLoginOutlets()}
        </Paper>
    )
}

let RenderLoginOutlet = ({ item }) => {
    const navigate = useNavigate()

    let appCtx = useContext(AppContexts);

    let getAuthenticatedUserData = () => {
        appCtx.getUser();
        navigate("/")
    }

    let handleClick = evt => {
        let url = ''
        if (item.name === "Google") {
            url = `http://localhost:3000/auth/google`
        } else if (item.name === "Facebook") {
            url = `http://localhost:3000/auth/facebook`
        } else if (item.name === "Github") {
            url = `http://localhost:3000/auth/github`
        } else if (item.name === "Twitter") {
            url = `http://localhost:3000/auth/twitter`
        }

        loginPrompt(url, getAuthenticatedUserData)
    }

    return (
        <Stack
            onClick={handleClick}
            sx={{ alignItems: "center", flexDirection: "row", justifyContent: "left", m: 1, p: 1, pl: 4, pr: 4, outline: "solid .2px", borderRadius: 11, cursor: "pointer" }}
        >
            <IconButton>
                <Icon sx={{ m: .4, color: "skyblue", textAlign: "left" }}>
                    {item.icon}
                </Icon>
            </IconButton>
            <Typography variant='h4' sx={{ textAlign: "center", ml: 4 }}>{item.name}</Typography>
        </Stack>
    )
}

let GuestUsers = ({ handleSubmit, setFormData }) => {
    let guestUsers = [{ name: "Guest Een" }, { name: "Guest Twee" }]
    let renderUsers = () => guestUsers.map(user => <RenderGuestUser key={user.name} item={user} handleSubmit={handleSubmit} setFormData={setFormData} />)
    return (
        <Box>
            <Typography variant='h2'>Guest Accounts</Typography>
            {renderUsers()}
        </Box>
    )
}

let RenderGuestUser = ({ item, handleSubmit, setFormData }) => {
    let [dataReady, setDataReady] = useState(false);

    let handleClick = (e) => {
        setFormData({ email: `guest@${item.name === "Guest Een" ? "een" : "twee"}.com`, password: `g${item.name === "Guest Een" ? "een" : "twee"}` })
        setDataReady(e);
    }

    useEffect(() => {
        dataReady && handleSubmit(dataReady)
    }, [dataReady])

    return (
        <IconButton sx={{px: 2, py: 1}} onClick={handleClick}>
            <AccountCircleTwoTone />
            <Typography>{item.name}</Typography>
        </IconButton>
    )
}

let loginPrompt = (url, getData) => {
    const newWindow = window.open(url, "_blank", "width=500, height=500")

    let timer = 0;

    if (newWindow) {
        timer = setInterval(() => {
            if (newWindow.closed) {
                if (timer) clearInterval(timer)
                getData()
            }
        }, 1001)
    }
}

let loginOutlets = [
    {
        name: "Google",
        icon: <Google />
    },
    {
        name: "Facebook",
        icon: <Facebook />
    },
    {
        name: "Github",
        icon: <GitHub />
    },
    {
        name: "Twitter",
        icon: <Twitter />
    }
]

export default LoginForm