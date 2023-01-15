import { AddCircleRounded, RemoveCircleRounded } from '@mui/icons-material'
import { Box, Button, ButtonGroup, FormControl, Input, InputLabel, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

function CreatePoll({ handleValue, currentElement }) {
    return (
        <Box>
            <Typography variant='h4' component={"h2"}>Create Poll</Typography>
            <ShowPollUI handleValue={handleValue} currentElement={currentElement} />
        </Box>
    )
}

let ShowPollUI = ({ handleValue, currentElement }) => {
    let [pollData, setPollData] = useState({})
    let [options, setOptions] = useState(null)

    let handleChange = (evt, elem) => {
        console.log(elem, evt.target.value)
        if(elem === "question") {
            setPollData(prev => ({ ...prev, [elem]: evt.target.value }))
        } else {
            setPollData(prev => ({ ...prev, [elem]: { text: evt.target.value, count: 0 } })) 
        }
    }

    let handleClick = (e) => {
        e.preventDefault();

        if (pollData?.question && pollData["option1"]?.text && pollData["option2"]?.text) {
            try {
                // uploading poll into state
                handleValue(e, currentElement, pollData);
                // changing current elemnt to something which has no actionable components attached to it
                handleValue(e, "choose again", "");
            } catch(err) {
                console.log(err)
            }
        } else {
            alert("Enter question, and at least two options")
        }
    }

    const handleCancelClick = (evt) => handleValue(evt, "choose again", "");

    useEffect(() => setOptions(2), [])

    let renderOptions = () => Array.from({ length: options }).map((_, n) => <ShowOption handleChange={handleChange} key={n} n={n} />)

    return (
        <Stack>
            <Input
                sx={{ p: .11, m: 4, mb: 1.7, mt: 0, fontSize: 29 }}
                type='text'
                onChange={e => handleChange(e, 'question')}
                placeholder='ask your poll question right here'
            />
            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", flexDirection: "row" }}>
                {renderOptions()}
            </Box>
            <ActionButtons options={options} setOptions={setOptions} />
            <ButtonGroup
                sx={{ fontSize: 29, alignItems: "center", pt: .71, mt: 2, justifyContent: "space-between", gap: 2 }}
            >
                <Button
                    fullWidth={true}
                    variant='contained'
                    onClick={handleClick}
                >
                    <span>Poll Away!!</span>
                </Button>
                <Button fullWidth={true} variant='contained' onClick={handleCancelClick}>Cancel</Button>
            </ButtonGroup>
        </Stack>
    )
}

let ActionButtons = ({ options, setOptions }) => {

    let actionHandler = (event) => {
        let chk = event.target.textContent || event.target.parentNode.parentNode.textContent || event.target.parentNode.parentNode.parentNode.textContent
        if (options >= 2) {
            setOptions(prev => chk === "Add" ? prev + 1 : (chk === "Sub" && options > 2) ? prev - 1 : prev)
        }
    }

    let renderButons = () => btnsData.map(item => <Button onClick={actionHandler} variant='contained' key={item.name} endIcon={item.icon} sx={{ m: 1, p: 1, borderRadius: "11px", fontSize: "larger" }}>{item.name}</Button>)

    return (
        <Box>
            {renderButons()}
        </Box>
    )
}

let ShowOption = ({ n, handleChange }) => {
    return (
        <FormControl sx={{ m: 1, mb: 2, width: (window.innerWidth / 6) }}>
            <InputLabel htmlFor={`option${n + 1}`}>{`Option ${Number(n + 1)}`}</InputLabel>
            <Input id={`option${Number(n + 1)}`} type={"text"} onChange={e => handleChange(e, `option${Number(n + 1)}`)} placeholder='add your option value in here....' />
        </FormControl>
    )
}

let btnsData = [
    { name: "Add", icon: <AddCircleRounded /> },
    { name: "Sub", icon: <RemoveCircleRounded /> }
]

export default CreatePoll