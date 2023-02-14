import { MenuItem, Select, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { BoxElement, EverybodyElement, FormControlElement, FriendsElement, InputLabelElement, MuiBoxElement, StackElement, TypographyElement } from './MuiElements'

function ChoosePrivacy({ handleValue, currentElement }) {
    let [settingSelected, setSettingSelected] = useState('')

    let handleSettingSelected = event => {
        setSettingSelected(event.target.value)
    }

    let renderSettings = () => privacyIcons.map(item => <MenuItem key={item.name} value={item.name}>{item.name}</MenuItem>)

    let updatePrivacy = () => {
        // uploading value into state
        handleValue(null, currentElement, settingSelected);
        // changing current elemnt to something which has no actionable components attached to it
        handleValue(null, "choose again", "");
    }

    useEffect(() => {
        settingSelected && updatePrivacy()
    }, [settingSelected])

    return (
        <BoxElement>
            {settingSelected && <ShowRespectiveIcon privacy={settingSelected} />}
            <FormControlElement variant="filled" styles={{ m: 1, minWidth: 220 }}>
                <InputLabelElement hFor={"select-elem"} text={"Select Privacy"} />
                <Select
                    labelId="select-elem"
                    id="select-elem"
                    value={settingSelected}
                    onChange={handleSettingSelected}
                    label="Select Privacy"
                >
                    <MenuItem value="">None</MenuItem>
                    {renderSettings()}
                </Select>
            </FormControlElement>
        </BoxElement>
    )
}

export let ShowRespectiveIcon = ({ privacy, order }) => {
    let icon = null;
    let text = "";
    if (privacy === "Everybody" || privacy === "") {
        icon = <EverybodyElement />
        // text = "Everybody Can Interact With This Post"
        text = "For Everybody"
    } else if (privacy === "Friends") {
        icon = <FriendsElement />
        // text = "Only Friends Can Interact With This Post"
        text = "For Friends"
    } 
    // else if (privacy === "") {
    //     icon = <EverybodyElement />
    //     text = "Everybody Can Interact With This Post"
    // }

    return (
        <Stack 
            sx={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "baseline",
                gap: 2,
                mt: 1.1,
                outline: "solid .6px lightskyblue",
                color: "text.secondary"
            }}
            order={order}
        >
            {/* <Typography sx={{ fontSize: { xs: "20px", md: "36px" } }} variant='h4'>{"Privacy Announcement : "}</Typography> */}
            <Typography sx={{ fontSize: { xs: "20px", md: "36px" } }} variant='h4'>{"Privacy : "}</Typography>
            <Typography sx={{ fontSize: { xs: "11px", md: "29px" }, display: "flex", alignItems: "center", gap: .9 }} variant='h6'>{text || "Everybody"} <span style={{fontSize: { xs: "11px", md: "22px" }, display: "flex"}}>{icon}</span></Typography>
        </Stack>
    )
}

// dataset for privacy settings
let privacyIcons = [
    { name: "Everybody", icon: <EverybodyElement /> },
    { name: "Friends", icon: <FriendsElement /> }
]

export default ChoosePrivacy