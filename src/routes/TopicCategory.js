import { Button, Stack, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import { AppContexts } from '../App'
import { updateUserInDatabase } from '../utils'

import { ButtonIconElement, RenderTopic, topicCategories } from './ChooseTopics'

function TopicCategory() {
    let [topics, setTopics] = useState([])
    
    let [selectedTopics, setSelectedTopics] = useState([])
    
    let { category } = useParams()
    
    let appCtx = useContext(AppContexts);

    let handleTopics = () => {
        topicCategories.forEach(item => {
            if (Object.keys(item) == category) setTopics(Object.values(item))
        })
    }

    let navigate = useNavigate();

    let updateDataInApp = () => appCtx.updateUserProfileDataInApp("topics", selectedTopics)

    let handleClickAndSave = () => {
        let url = `${appCtx.baseUrl}/users/${appCtx.user._id}`
        // updateUserInDatabase(url, {topics: selectedTopics}, appCtx.updateData, navigate)
        // console.log(selectedTopics, "seletedTopics!!")
        updateUserInDatabase(url, {topics: selectedTopics}, updateDataInApp, navigate, "edit-user-profile")
    }

    let renderTopics = () => topics[0]?.map(name => <RenderTopic key={name} topic={name} setSelectedTopics={setSelectedTopics} list={selectedTopics} />)

    useEffect(() => handleTopics(), [category])

    useEffect(() => {
        if(appCtx.user?.topics) {
            setSelectedTopics(appCtx.user.topics)
        }
    }, [])

    console.log(category, "check!!", topicCategories[0].category, topics, selectedTopics)

    return (
        <>
            <Typography variant='h1' component={"p"} sx={{ pl: 1 }}>{category}</Typography>
            <Typography variant='h2'>{selectedTopics.length === 0 ? `Atleast choose 4 topics` : selectedTopics.length > 4 ? `${selectedTopics.length} topics are selected` : `${selectedTopics.length} out of 4 topics`}</Typography>
            <Stack
                sx={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    m: 1,
                    p: 1.5,
                    backgroundColor: "lightskyblue",
                    borderRadius: 2,
                    alignItems: "center",
                }}
            >
                {renderTopics()}
            </Stack>
            {/* <Button onClick={handleClickAndSave}>
                <Typography variant="h6">Save</Typography>
            </Button> */}
            <ButtonIconElement list={selectedTopics} handleClick={handleClickAndSave} />
        </>
    )
}

export default TopicCategory