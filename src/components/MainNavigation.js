import React, { useContext, useEffect, useRef, useState } from 'react'
import { LoginTwoTone, AppRegistrationTwoTone, VerifiedUserSharp, DynamicFeedSharp, PeopleTwoTone, PersonTwoTone, DynamicFeedTwoTone, ManageAccountsTwoTone, LogoutTwoTone, InfoTwoTone, DarkModeTwoTone, SettingsSuggestTwoTone, Settings, LightModeTwoTone, DeleteForeverTwoTone, SyncLockTwoTone } from "@mui/icons-material";
import { H1Element, NavElement, WrapperDiv } from '../components/GeneralElements'
import { MuiInputElement, TabElement } from '../components/MuiElements';
import { logoutUserFromApp, sendDataToServer, deleteProtectedDataFromServer, removeJwtDataFromLocalStorage } from '../utils';
import { AppContexts } from '../App';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Avatar, Box, Button, ButtonGroup, FormControl, FormControlLabel, Switch, Tooltip, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useToCloseModalOnClickedOutside } from '../hooks/toDetectClickOutside';

function MainNavigation() {
  let [showFloatingLogin, setShowFloatingLogin] = useState(true)

  let appCtx = useContext(AppContexts);

  const location = useLocation()

  useEffect(() => {
    if (location.pathname === "/login") {
      setShowFloatingLogin(false)
    } else if (location.pathname === "/register") {
      setShowFloatingLogin(false)
    } else {
      setShowFloatingLogin(true)
    }
  }, [location.pathname])

  return (
    <AppBar
      position="static"
      variant='elevation'
      sx={{
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#6c757d"
      }}
    >
      <H1Element value={"OdBo"} />
      {
        appCtx?.user?._id
          ?
          <>
            <NavsWhenUserAuthenticated appCtx={appCtx} />
            <FloatingAuthenticatedUserFunctionality appCtx={appCtx} />
          </>
          :
          <>
            <NavsWhenUserIsNotAuthenticated />
            {showFloatingLogin ? <FloatingLogin /> : null}
          </>
      }
    </AppBar>
  )
}

const FloatingAuthenticatedUserFunctionality = ({ appCtx }) => {
  let [showDropdown, setShowDropdown] = useState(false)

  let toggleDropdown = () => setShowDropdown(prev => !prev)

  let closeDropdown = () => setShowDropdown(false);

  return (
    <Stack sx={{ flexDirection: "row", gap: 4, position: "relative", alignItems: "center" }}>
      <AssistiveModeActivatingToggler />

      <AppDarkModeToggler />

      <Typography
        sx={{
          display: { xs: "none", lg: "block" }
        }}
        variant="h6"
      >
        Welcome, Dear {appCtx?.user?.fullName}
      </Typography>

      <UserProfileNavigationIcon appCtx={appCtx} />

      <DropdownMenu closeDropdown={closeDropdown} toggleDropdown={toggleDropdown} showDropdown={showDropdown} />
    </Stack>
  )
}

const DropdownMenu = ({ closeDropdown, toggleDropdown, showDropdown }) => {
  let ref = useRef();

  useToCloseModalOnClickedOutside(ref, closeDropdown)

  return (
    <Box ref={ref}>
      <Button
        sx={{
          borderRadius: "50%",
          bgcolor: "primary",
          outline: "solid darkblue .2px",
          "&:hover": {
            bgcolor: "primary.dark",
            color: "text"
          }
        }}
        onClick={toggleDropdown}
      >
        <Tooltip title={showDropdown ? "" : "More Options"}>
          <Settings fontSize='large' />
        </Tooltip>
      </Button>

      {showDropdown ? <ShowAuthUserDropdowns closeDropdown={closeDropdown} /> : null}
    </Box>
  )
}

const UserProfileNavigationIcon = ({ appCtx }) => {
  return (
    <Tooltip title={"Visit Your User Profile"}>
      <Link to={`/users/${appCtx.user?._id}/profile`}>
        <Avatar sx={{ width: 65, height: 51 }} alt={`profile picture of ${appCtx?.user?.fullName}`} src={appCtx?.user?.ppUrl || "https://random.imagecdn.app/500/150"} />
      </Link>
    </Tooltip>
  )
}

const ModeToggler = (props) => {
  return (
    <Stack
      sx={{
        display: { xs: "none", lg: "flex" }
      }}
    >
      <FormControlLabel
        control={
          <Switch
            checked={Boolean(props.checked)}
            onChange={props.changeHandler}
            size='medium'
            color="primary"
          />
        }
        label={<Typography variant='h6'>{props.label}</Typography>}
      />
    </Stack>
  )
}

const AppDarkModeToggler = () => {
  const appCtx = useContext(AppContexts);
  return (
    <ModeToggler
      checked={appCtx.darkMode}
      changeHandler={appCtx.handleToggleDarkMode}
      label={`Turn ${appCtx.darkMode ? "Off" : "On"} Dark Mode`}
    />
  )
}

const AssistiveModeActivatingToggler = () => {
  const appCtx = useContext(AppContexts);
  return (
    <ModeToggler
      checked={appCtx.assistiveMode}
      changeHandler={appCtx.handleAssitiveModeToggle}
      label={`Turn ${appCtx.assistiveMode ? "Off" : "On"} Assitive Mode`}
    />
  )
}

let ShowAuthUserDropdowns = ({ closeDropdown }) => {
  const appCtx = useContext(AppContexts);

  let options = [
    { name: "Assistive Mode", icon: <InfoTwoTone /> },
    { name: `${appCtx.darkMode ? "Light" : "Dark"} Mode`, icon: appCtx.darkMode ? <LightModeTwoTone /> : <DarkModeTwoTone /> },
    { name: "Edit Profile", icon: <ManageAccountsTwoTone /> },
    { name: "Reset Password", icon: <SyncLockTwoTone /> },
    { name: "Logout", icon: <LogoutTwoTone /> },
    { name: "Delete Account", icon: <DeleteForeverTwoTone /> },
  ]

  let renderOptions = () => options.map(item => <RenderDropDownOption key={item.name} item={item} closeDropdown={closeDropdown} />)

  return (
    <Stack
      sx={{
        position: "absolute", right: 0, top: "65px", borderRadius: 4,
        gap: "9px", backgroundColor: "gainsboro", p: 2, zIndex: 9
      }}
    >
      {renderOptions()}
    </Stack>
  )

}

const RenderDropDownOption = ({ item, closeDropdown }) => {
  let appCtx = useContext(AppContexts);

  const navigate = useNavigate();

  const clearOutUserData = () => {
    appCtx.clearCurrentUserData()
    appCtx.removeStoredRouteAfterLogout()
    navigate("/");
  }

  const handleLogoutUser = () => {
    let url = `${appCtx.baseUrl}/logout`
    logoutUserFromApp(url, clearOutUserData)
  }

  const afterDelete = (result) => {
    if (result?.success) {
      alert("so sorry to see you go :( you can always choose to comeback again, see ya soon, tot ziens, tot zo :)")
    } else {
      alert("your token has expired, re-authorize first by loging in again to complete this action")
    }
    removeJwtDataFromLocalStorage();
    appCtx.clearCurrentUserData();
    navigate("/login");
  }

  const deleteCurrentlyLoggedInUserAccount = () => {
    const url = `${appCtx.baseUrl}/users/${appCtx.user._id}`
    const refreshToken = appCtx.user?.userJwt?.refreshToken;
    deleteProtectedDataFromServer(url, {}, afterDelete, refreshToken)
  }

  const handleDelete = () => {
    const getConsent = prompt("Continue to delete your account? This process is irreversible!! Press Y to Delete Your Account", "N")

    if (["Y", "y"].includes(getConsent)) {
      if (["guest@een.com", "guest@twee.com"].includes(appCtx.user.email)) {
        alert("nope!! no cant do, its a protected accounted")
      } else {
        deleteCurrentlyLoggedInUserAccount()
      }
    } else {
      alert("Its nice to have you here, keep enjoying what you like :)")
    }
  }

  const handleReset = () => {
    navigate("/reset-password");
  }

  let handleClick = () => {
    if (item.name === "Logout") {
      handleLogoutUser()
    } else if (item.name === "Edit Profile") {
      navigate(`/edit-user-profile`);
    } else if (item.name === "Assistive Mode") {
      appCtx.handleAssitiveModeToggle()
    } else if (item.name === "Dark Mode" || item.name === "Light Mode") {
      appCtx.handleToggleDarkMode()
    } else if (item.name === "Delete Account") {
      handleDelete()
    } else if (item.name === "Reset Password") {
      handleReset()
    }
    closeDropdown()
  }

  return (
    <Tooltip sx={{ mb: .2 }} title={item.name}>
      <Button onClick={handleClick} startIcon={item.icon} sx={{ justifyContent: "space-between", fontWeight: "bold", outline: "solid 2px darkslategray", "&:hover": { outline: "solid 2px floralwhite", color: "darkslategray" } }}>
        <Typography variant='subtitle2'>{item.name}</Typography>
      </Button>
    </Tooltip>
  )
}

export let NavigationLinks = () => {
  let appCtx = useContext(AppContexts);

  return (
    <NavElement className="main-nav">
      <TabElement className={"nav-item"} labelText={"Login"} path={"login"} icon={<LoginTwoTone />} />
      <TabElement className={"nav-item"} labelText={"Register"} path={"register"} icon={<AppRegistrationTwoTone />} />
      <TabElement className={"nav-item"} labelText={"Connect"} path={"connect"} icon={<VerifiedUserSharp />} />
      <TabElement className={"nav-item"} labelText={"Feeds"} path={"news-feeds"} icon={<DynamicFeedSharp />} />
      <TabElement className={"nav-item"} labelText={"Friends"} path={"user-friendships"} icon={<PeopleTwoTone />} />
      <TabElement className={"nav-item"} labelText={"Profile"} path={`users/${appCtx.user?._id}/profile`} icon={<PersonTwoTone />} />
    </NavElement>
  )
}

let NavsWhenUserIsNotAuthenticated = () => {
  const buttonsProps = [
    { text: "Feeds", route: "/", icon: <DynamicFeedTwoTone /> },
    { text: "Login", route: "login", icon: <LoginTwoTone /> },
    { text: "Register", route: "register", icon: <AppRegistrationTwoTone /> },
  ]

  let renderButtons = () => buttonsProps.map(item => <ButtonElement key={item.text} item={item} />)

  return (
    <ButtonGroup
      sx={{
        alignItems: "center",
        gap: 2
      }}
      variant='outlined'
    >
      {renderButtons()}
    </ButtonGroup>
  )
}

let NavsWhenUserAuthenticated = ({ appCtx }) => {
  const buttonsProps = [
    { text: "Feeds", route: "/", icon: <DynamicFeedTwoTone /> },
    { text: "Connect", route: "connect", icon: <VerifiedUserSharp /> },
    { text: "Friendships", route: "user-friendships", icon: <PeopleTwoTone /> },
  ]

  let renderButtons = () => buttonsProps.map(item => <ButtonElement key={item.text} item={item} />)

  return (
    <ButtonGroup
      sx={{
        alignItems: "center",
        gap: 2
      }}
      variant='outlined'
    >
      {renderButtons()}
    </ButtonGroup>
  )
}

const ButtonElement = ({ item }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(item.route)
  }

  return (
    <Tooltip title={item.text}>
      <Button
        onClick={handleClick}
        variant={"text"}
        sx={{
          height: "fit-content",
          color: "text.primary",
          '&:hover': {
            backgroundColor: 'text.secondary',
            opacity: .8,
            borderRadius: "11px",
            color: "gainsboro"
          },
        }}
        startIcon={item.icon}
      >
        <Typography
          sx={{
            display: { xs: "none", md: "block" }
          }}
          variant='h6'
        >
          {item.text}
        </Typography>
      </Button>
    </Tooltip>
  )
}

let FloatingLogin = () => {
  let [errors, setErrors] = useState([]);
  let [formData, setFormData] = useState({});

  const appCtx = React.useContext(AppContexts);
  const navigate = useNavigate();
  const ref = React.useRef(null);

  let handleChange = (evt, elm) => {
    let currentLength = evt.target.value.length;
    if (currentLength >= 0 && currentLength < 90) {
      setFormData(prev => ({ ...prev, [elm]: evt.target.value }))
    } else {
      alert(`you have exceeded ${elm} maximum limit of 89`)
    }
  }

  let handleError = data => {
    setErrors(data.errors)
  }

  let updateData = result => {
    appCtx.handleData(result)
    ref.current?.reset();
    result.user?.topics.length < 4 ? navigate("/choose-topics") : navigate("/");
  }

  let handleSubmit = evt => {
    evt.preventDefault();
    sendDataToServer(appCtx.baseUrl + "/login", formData, handleError, updateData)
  }

  useEffect(() => handleError([]), [formData])

  return (
    <WrapperDiv className="fl-wrapper">
      <Typography
        sx={{
          display: { xs: "none", xl: "block" },
          fontSize: { lg: "1.1rem", xl: "1.5rem" }
        }}
        variant='h5'
      >
        Login to your profile from here
      </Typography>
      <form
        ref={ref} method={"post"} onSubmit={handleSubmit}
        style={{ position: "relative", marginLeft: "11px" }}
      >
        {errors?.length ? <Typography variant='body2' sx={{ position: "absolute", color: "maroon", bottom: "-13px", left: "10.1px" }}>User email and password does not match!!</Typography> : null}

        <Stack
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "row",
            alignItems: "baseline"
          }}
        >
          <FormControl
            sx={{}}
          >
            <MuiInputElement
              type={"email"}
              id={"email"}
              handleChange={handleChange}
              text="enter email (e.g. t@e.st)"
              required={true}
              color={errors?.length ? "error" : "success"}
              error={errors?.length ? true : false}
              fontSize={{ xs: ".6em", md: ".9em", lg: "1.1em", xl: "1.3em" }}
            />
          </FormControl>
          <FormControl>
            <MuiInputElement
              type={"password"}
              id={"password"}
              handleChange={handleChange}
              text="enter password"
              required={true}
              color={errors?.length ? "error" : "success"}
              error={errors?.length ? true : false}
              fontSize={{ xs: ".6em", md: ".9em", lg: "1.1em", xl: "1.3em" }}
            />
          </FormControl>
          <Button
            color={"primary"}
            variant="contained"
            sx={{ height: "fit-content" }}
            type={"submit"}
          >
            <Typography
              sx={{
                fontSize: { xs: ".6em", md: ".9em", lg: "1.1em", xl: "1.3em" }
              }}
              variant='h6'
            >
              Login
            </Typography>
          </Button>
        </Stack>
      </form>
    </WrapperDiv>
  )
}

export default MainNavigation