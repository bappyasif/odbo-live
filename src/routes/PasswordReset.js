import { Button, Dialog, DialogContent, FormControl, Input, InputLabel, Stack, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContexts } from '../App';
import { performProtectedUpdateOperation } from '../utils';

function PasswordReset() {
    const [formData, setFormData] = useState({})

    const [showDialog, setShowDialog] = useState(false);

    const appCtx = useContext(AppContexts);

    const navigate = useNavigate()

    const handleFormData = evt => {
        const elem = evt.target.id;
        const value = evt.target.value;
        setFormData(prev => ({...prev, [elem]: value}))
    }

    const afterReset = () => {
        navigate("/");
    }

    const handleReset = () => {
        const url = `${appCtx.baseUrl}/users/${appCtx.user._id}/reset-password`
        const refreshToken = appCtx.user?.userJwt?.refreshToken;
        if(checkGuestUserPresence(appCtx?.user?.fullName)) {
            alert("nope, no cant do, protected account!!")
            navigate("/")
        } else {
            performProtectedUpdateOperation(formData, refreshToken, url, null, null, navigate )
        }
    }

    const handleCancel = () => {
        setShowDialog(false)
        navigate("/")
    }

    const buttons = [
        { name: "Reset", icon: null, fullWidth: true, variant: "contained" },
        { name: "Cancel", icon: null, fullWidth: true, variant: "contained" }
    ];

    useEffect(() => {
        setShowDialog(true);
        appCtx.handleLastVisitedRouteBeforeSessionExpired("/reset-password")
        appCtx.getUserDataFromJwtTokenStoredInLocalStorage()
    }, [])

    return (
        <Dialog
            open={showDialog}
        >
            <DialogContent>
                <ReusableFormView 
                    formButtons={buttons}
                    checkCondition={"Reset"}
                    handleFormData={handleFormData} 
                    primaryAction={handleReset} 
                    secondaryAction={handleCancel} 
                    legendText={"Fillup These Informations To Reset Your Current Password"}
                    formControls={formControls}
                />
            </DialogContent>
        </Dialog>
    )
}

export const ReusableFormView = ({ handleFormData, primaryAction, secondaryAction, legendText, formControls, formButtons, checkCondition }) => {
    const renderFormControls = () => formControls.map(item => <RenderingFormControl key={item.id} item={item} handleFormData={handleFormData} />)

    return (
        <form onSubmit={e => e.preventDefault()} method="post">
            <legend>
                <Typography variant='h4'>{legendText}</Typography>
            </legend>
            <Stack>
                {renderFormControls()}
            </Stack>
            <ReUsableFormButtons formButtons={formButtons} primaryAction={primaryAction} secondaryAction={secondaryAction} checkCondition={checkCondition} />
        </form>
    )
}

export const RenderingFormControl = ({ item, handleFormData }) => {
    return (
        <FormControl sx={{mt: 2}}>
            <InputLabel>{item.labelText}</InputLabel>
            <Input
                type={item.type}
                id={item.id}
                name={item.id}
                placeholder={item.placeholder}
                onChange={handleFormData}
                required
                disabled={item?.disabled ? item.disabled : false}
                defaultValue={item?.value ? item.value : null}
            />
        </FormControl>
    )
}

const ReUsableFormButtons = ({ formButtons, primaryAction, secondaryAction, checkCondition }) => {
    const renderButtons = () => formButtons.map(item => <ReusableFormActionButtons key={item.name} buttonItem={item} actionMethod={item.name === checkCondition ? primaryAction : secondaryAction} forSubmit={item.name === checkCondition} />)

    return (
        <Stack sx={{flexDirection: "row", justifyContent: "center", gap: 4, mt: 2}}>
            {renderButtons()}
        </Stack>
    )
}

const PasswordResetFormButtons = ({ primaryAction, secondaryAction, checkCondition }) => {
    const buttons = [
        { name: "Reset", icon: null, fullWidth: true, variant: "contained" },
        { name: "Cancel", icon: null, fullWidth: true, variant: "contained" }
    ];

    const renderButtons = () => buttons.map(item => <ReusableFormActionButtons key={item.name} buttonItem={item} actionMethod={item.name === checkCondition ? primaryAction : secondaryAction} forSubmit={item.name === checkCondition} />)

    return (
        <Stack sx={{flexDirection: "row", justifyContent: "center", gap: 4, mt: 2}}>
            {renderButtons()}
        </Stack>
    )
}

export const ReusableFormActionButtons = ({ actionMethod, buttonItem, forSubmit }) => {
    return (
        <Button
            variant={buttonItem.variant}
            fullWidth={buttonItem.fullWidth}
            type={forSubmit ? "submit" : "auto"}
            onClick={actionMethod}
            startIcon={buttonItem.icon}
        >
            {buttonItem.name}
        </Button>
    )
}

const checkGuestUserPresence = (userFullname) => {
    const restrictedUsers = ["Guest Een", "Guest Twee"];
    return restrictedUsers.includes(userFullname)
}

const formControls = [
    {
        id: "current-password",
        labelText: "*Current Password: ",
        type: "password",
        placeholder: "Enter Your Current Password",
        required: true
    },
    {
        id: "new-password",
        labelText: "*New Password: ",
        type: "password",
        placeholder: "Enter Your New Password",
        required: true
    },
    {
        id: "confirm-password",
        labelText: "*Confirm Password: ",
        type: "password",
        placeholder: "Re-enter Your New Password",
        required: true
    }
];

export default PasswordReset