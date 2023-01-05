import React, { useContext, useEffect, useState } from 'react'
import { AppContexts } from '../App'
import CreatePost from '../components/CreatePost'
import { WrapperDiv } from '../components/GeneralElements'
import { BoxElement, CardContentElement, CardElement, CardHeaderElement, ContainerElement, DislikeIconElement, IconButtonElement, LikeIconElement, LoveIconElement, ShareIconElement, StackElement, TypographyElement } from '../components/MuiElements'
import ShowPostsFromTwitter from '../components/ShowPostsFromTwitter'
import UserProfile from '../components/UserProfileInfoSection'
import { readDataFromServer } from '../utils'

function NewsFeeds() {
    return (
        <WrapperDiv className="news-feeds">
            <UserProfile />
            <ShowBasicPosts />
        </WrapperDiv>
    )
}

let ShowBasicPosts = () => {
    let [dataset, setDataset] = useState({})

    let appCtx = useContext(AppContexts);

    let handleDataset = result => setDataset(result)

    useEffect(() => {
        let url = `${appCtx.baseUrl}/posts`;
        readDataFromServer(url, handleDataset)
    }, [])

    // console.log(dataset, "!!")

    let renderPosts = () => dataset?.data?.data.map(post => <RenderBasicPost key={post._id} data={post} />)

    return (
        <ContainerElement>
            <CreatePost />
            <ShowPostsFromTwitter />
            <BoxElement className="all-posts">
                {dataset?.data?.data ? renderPosts() : null}
            </BoxElement>
        </ContainerElement>
    )
}

let RenderBasicPost = ({ data }) => {
    let { body, created, likesCount, loveCount, dislikesCount, shareCount, mfUrl } = { ...data }
    return (
        <CardElement
            className="post-card"
            styles={{ backgroundColor: "lightGray" }}
        >
            <CardHeaderElement avatarUrl={mfUrl} title="This is a test" joined={created} altText="this is a test" />
            <CardContentElement>
                <TypographyElement text={body} type={"body2"} styles={{ width: "87%", margin: "auto", textAlign: "justify" }} />
            </CardContentElement>
            <StackElement className="post-actions-icons">
                {[likesCount, loveCount, dislikesCount, shareCount].map((count, idx) => (
                    <IconButtonElement>
                        <BoxElement className="icon-button">
                            {idx === 0 ? <LikeIconElement /> : idx === 1 ? <DislikeIconElement /> : idx === 2 ? <LoveIconElement /> : <ShareIconElement />}
                            <TypographyElement text={count} type={"span"} />
                        </BoxElement>
                    </IconButtonElement>
                ))}
            </StackElement>
        </CardElement>
    )
}

export default NewsFeeds