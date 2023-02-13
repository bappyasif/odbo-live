import React, { useContext, useEffect, useRef, useState } from 'react'
import { FormElement, LegendElement } from '../components/FormElements'
import { WrapperDiv } from '../components/GeneralElements'
import { removeJwtDataFromLocalStorage, sendDataToServer } from '../utils';
import { AppContexts } from "../App"
import ShowErrors from '../components/ShowErrors';
import { Box, Button, Container, Dialog, DialogContent, DialogTitle, Divider, Fab, FormControl, Icon, IconButton, Input, InputAdornment, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import { AccountCircleTwoTone, Check, Error, Facebook, GitHub, Google, LoginTwoTone, PasswordTwoTone, Twitter } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
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
        // appCtx.toggleLoadingStatus();
        appCtx.turnOnLoading();

        let timer = setTimeout(() => {
            sendDataToServer(appCtx.baseUrl + "/login", formData, handleError, updateData)
            if (timer >= 1700) clearTimeout(timer)
        }, 1700)
    }

    useEffect(() => {
        appCtx.clearCurrentUserData();
        removeJwtDataFromLocalStorage();
    }, [])
    // console.log(formData, "formData!!");

    // console.log(appCtx.routeBeforeSessionExpired, "appCtx.routeBeforeSessionExpired")

    return (
        <Box
            sx={{
                display: "flex", flexDirection: "row", justifyContent: "center",
                alignItems: "center", position: "relative", minHeight: "100vh",
                gap: 2, px: 2
            }}
        >
            <ShowDataProcessingLoaders processingRequest={processingRequest} />

            <Stack
                sx={{

                }}
            >
                <ShowWarningAboutSecurity />

                <Container
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", lg: "row" },
                        // justifyContent: "space-between",
                        // justifyContent: "start",
                        // alignItems: "center",
                        gap: { xs: 1.1, lg: 2 }
                    }}
                >
                    <Stack
                        sx={{
                            display: {md: "flex", lg: "auto"},
                            gap: 2, width: "fit-content", margin: "auto", justifyContent: ""
                        }}
                    >
                        <GuestUsers setFormData={setFormData} handleSubmit={handleSubmit} />

                        <Paper 
                        // sx={{mb: 2}}
                        >
                            <WrapperDiv className="login-form">
                                <Typography fontWeight={"bold"} fontSize={"42px"} variant='h3'>Login Form</Typography>

                                {errors?.length ? <ShowErrors errors={errors} /> : null}

                                <FormElement handleSubmit={handleSubmit}>
                                    <LegendElement text={"Enter your registered email and password"} />
                                    <LoginFromControlComponent handleChange={handleChange} />
                                    <Button
                                        type='submit' variant='contained' startIcon={<LoginTwoTone />}
                                    >
                                        <Typography variant='h6'>Login</Typography>
                                    </Button>

                                    <Divider sx={{ my: 1.1 }} />
                                    <Stack sx={{ backgroundColor: "secondary.main", width: "fit-content" }}>
                                        <Link style={{ display: "flex", fontSize: "x-large", width: "fit-content" }} to="/recover-password">Forgot Password</Link>
                                    </Stack>
                                </FormElement>

                                {/* {errors?.length ? <ShowErrors errors={errors} /> : null} */}
                            </WrapperDiv>
                        </Paper>
                    </Stack>

                    <ThirdPartyLoginOutlets />
                </Container>
            </Stack>

        </Box>
    )
}

export const ShowWarningAboutSecurity = () => {
    return (
        <Stack sx={{ py: 6, px: 2 }}>
            <Typography variant='h4'>This is not a fully tested site by any Security Experts</Typography>
            <Typography variant='h6'>Please be advised before using any of your personal data</Typography>
        </Stack>
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
            (item.name === "email" && evt.target.value.length < 45)
            ||
            (item.name === "password" && evt.target.value.length < 90)
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
                position: "relative",
                width: { xs: "341px", md: "440px" },
                margin: "auto",
                mt: 2,
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
        <Paper
            sx={{
                // pl: 2, 
                // mt: 1, 
                borderRadius: 2,
                marginTop: {xs: 1, lg: 0}
                // pt: 2
                // width: "fit-content",
                // height: "max-content"
            }}
        >
            <Typography variant='h2'>Login With</Typography>
            <Stack
                sx={{
                    display: "flex",
                    flexDirection: { xs: "row", lg: "column" },
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                    // width: "fit-content"
                    // m: 1, p: 1, pl: 4, pr: 4,
                }}
            >
                {renderLoginOutlets()}
            </Stack>
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
            url = `${appCtx.baseUrl}/auth/google`
        } else if (item.name === "Facebook") {
            url = `${appCtx.baseUrl}/auth/facebook`
        } else if (item.name === "Github") {
            url = `${appCtx.baseUrl}/auth/github`
        } else if (item.name === "Twitter") {
            url = `${appCtx.baseUrl}/auth/twitter`
        }


        // alert("would have been available if this was hosted in a custom domain!! try using any of these guest accounts or (email / password) based login option, thanks for your interest :)")

        let consent = prompt("currently this wont fully log you into this app but you will be registered noetheless but wont be logged in due to CORS issue but if this was hosted on a proprieratory server the it would have, if you still want to proceed, press Y", "N");

        // console.log(consent, ["Y", "y"].includes(consent))

        if (["Y", "y"].includes(consent)) {
            appCtx.toggleSsoLoginStatus();
            loginPrompt(url, getAuthenticatedUserData)
        } else {
            alert("try using guest accounts for an user experience or perhaps consider registering with your email for Full Access, thank you :)")
        }

        // loginPrompt(url, getAuthenticatedUserData)
    }

    return (
        <Stack
            onClick={handleClick}
            sx={{
                alignItems: "center", flexDirection: "row",
                justifyContent: { xs: "space-between", lg: "space-around" },
                width: { xs: "260px", lg: "350px" },
                m: 1, p: 1, pl: 4, pr: 4, outline: "solid .2px",
                borderRadius: 11, cursor: "pointer"
            }}
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
        <Paper
            sx={{
                p: 1,
                px: 2,
                mb: 2
            }}
        >
            <Typography variant='h2'>Guest Accounts</Typography>
            {renderUsers()}
        </Paper>
    )
}

let RenderGuestUser = ({ item, handleSubmit, setFormData }) => {
    let [dataReady, setDataReady] = useState(false);

    let handleClick = (e) => {
        // setFormData({ email: `guest@${item.name === "Guest Een" ? "een" : "twee"}.com`, password: `g${item.name === "Guest Een" ? "een" : "twee"}` })
        setFormData({ email: item.name === "Guest Een" ? process.env.REACT_APP_GUEST_EEN_EMAIL : process.env.REACT_APP_GUEST_TWEE_EMAIL, password: item.name === "Guest Een" ? process.env.REACT_APP_GUEST_EEN_PASSWORD : process.env.REACT_APP_GUEST_TWEE_PASSWORD })
        setDataReady(e);
    }

    useEffect(() => {
        dataReady && handleSubmit(dataReady)
    }, [dataReady])

    return (
        <IconButton sx={{ px: 2, py: 1 }} onClick={handleClick}>
            <AccountCircleTwoTone fontSize="large" />
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