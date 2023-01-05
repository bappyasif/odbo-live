import { LanguageTwoTone } from '@mui/icons-material';
import { Card, CardContent, CardHeader, CardMedia, Container, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import { AppContexts } from '../App';
import { useToFetchPostsFromNyTimes } from '../hooks/useToFetchData'
import { ButtonToIndicateHelp, HowToUseThirdPartyApiContentsListItems } from '../components/HowToUseApp';

function ContentsFromNyTimes() {
    return (
        <Container>
            <RenderPopularPostsFromNyTimes />
            <RenderMostSharedPostsFromNyTimes />
        </Container>
    )
}

export const CurateKeywordBasedPostsFromNyTimes = ({ topics }) => {
    let renderPosts = () => topics.map(topic => <RenderKeywordBasedPost key={topic} searchTerm={topic} />)

    return (
        <Stack sx={{ mt: "11px", gap: 1.5 }}>
            {topics.length ? renderPosts() : null}
        </Stack>
    )
}

const RenderKeywordBasedPost = ({ searchTerm }) => {
    let [articles, setArticles] = useState([]);

    let url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchTerm}&api-key=${process.env.REACT_APP_NY_TIMES_API_KEY}`

    let { data } = useToFetchPostsFromNyTimes(url)

    useEffect(() => setArticles(data), [data])

    let renderTwoPosts = () => articles.map((item, idx) => idx < 2 && <RenderDataForArticles key={idx} data={item} />)

    // console.log(articles, "articlesPosts", searchTerm)

    return (
        <>
            {articles.length ? renderTwoPosts() : null}
        </>
    )
}

export const RenderMostSharedPostsFromNyTimes = () => {
    let [mostSharedPosts, setMostSharedPosts] = useState([]);

    const periods = [1, 7, 30];

    const rndGen = () => Math.floor(Math.random() * 3)

    let url = `https://api.nytimes.com/svc/mostpopular/v2/shared/${periods[rndGen()]}/facebook.json?api-key=${process.env.REACT_APP_NY_TIMES_API_KEY}`

    let { data } = useToFetchPostsFromNyTimes(url)

    useEffect(() => setMostSharedPosts(data), [data])

    let renderTwoPosts = () => mostSharedPosts.map((item, idx) => idx < 2 && <RenderData key={idx} assetId={item.asset_id} data={item} />)

    // console.log(mostSharedPosts, "mostSharedPosts")

    return (
        <Stack sx={{ mt: "11px", gap: 1.5 }}>
            {mostSharedPosts.length ? renderTwoPosts() : null}
        </Stack>
    )
}

export const RenderPopularPostsFromNyTimes = () => {
    let [popularPosts, setPopularPosts] = useState([]);

    const periods = [1, 7, 30];

    const rndGen = () => Math.floor(Math.random() * 3)

    const url = `https://api.nytimes.com/svc/mostpopular/v2/viewed/${periods[rndGen()]}.json?api-key=${process.env.REACT_APP_NY_TIMES_API_KEY}`

    let { data } = useToFetchPostsFromNyTimes(url)

    useEffect(() => setPopularPosts(data), [data])

    let renderTwoPosts = () => popularPosts.map((item, idx) => idx < 2 && <RenderData key={idx} assetId={item.asset_id} data={item} />)

    // console.log(popularPosts, "popularPosts")

    return (
        <Stack sx={{ mt: "11px", gap: 1.5 }}>
            {popularPosts.length ? renderTwoPosts() : null}
        </Stack>
    )
}

const RenderDataForArticles = ({ data }) => {
    let [dataset, setDataset] = useState({})

    const makingDataReliableForRendering = () => {
        const dataObj = {}

        dataObj.title = data.headline.main
        dataObj.source = data.source
        dataObj.section = data.section_name
        dataObj.byline = data.byline.original
        dataObj.url = data.web_url
        dataObj.abstract = data.abstract || data.snippet
        dataObj.leadParagraph = data.lead_paragraph
        dataObj.articleMediaUrl = data?.multimedia[2]?.url

        setDataset(dataObj)
    }

    useEffect(() => {
        makingDataReliableForRendering()
    }, [data])

    // console.log(data, "articleData", dataset)

    return dataset.title ? <RenderData data={dataset} /> : null
}

const RenderData = ({ data }) => {
    const appCtx = useContext(AppContexts)

    return (
        data.abstract
            ?
            <Card
                sx={{
                    mb: 1.1, mt: 1.1, outline: "solid 1.1px info.main", 
                    maxWidth: "989px", margin: "auto", position: "relative",
                    backgroundColor: "info.dark", color: "info.contrastText"
                }}
            >
                <ButtonToIndicateHelp forWhichItem={"Api Content Listings"} />
                {appCtx.dialogTextFor === "Api Content Listings" ? <HowToUseThirdPartyApiContentsListItems /> : null}

                <RenderPostHeaderView data={data} />
                {data?.leadParagraph ? null : <RenderPostMediaView data={data} />}
                <RenderPostContentView data={data} />
            </Card>
            : null
    )
}

const RenderPostMediaView = ({ data }) => {
    let getUrl = () => {
        let url = ""
        let metadataArr = data.media[0] ? data.media[0]["media-metadata"] : []
        url = metadataArr[metadataArr.length - 1]?.url
        return url;
    }

    return (
        <CardMedia
            component={"img"}
            height="350"
            image={getUrl()}
            sx={{ objectFit: "fill" }}
        />
    )
}

const RenderPostContentView = ({ data }) => {
    return (
        <CardContent>
            <Typography sx={{ textAlign: "justify" }} variant={data?.leadParagraph ? "subtitle1" : 'h6'}>{data.abstract}</Typography>
            {data?.leadParagraph ? <Typography sx={{ textAlign: "justify", mt: 2.4 }} variant='h4'>{data.leadParagraph}</Typography> : null}
        </CardContent>
    )
}

const RenderPostHeaderView = ({ data }) => {
    let handleClick = () => {
        window.open(data.url, "_blank").focus()
    }

    return (
        <CardHeader
            sx={{
                textAlign: "right"
            }}
            title={<Typography sx={{fontSize: {xs: "24px", md: "36px", lg: "3.75rem"}}} variant='h2' textAlign={"justify"}>{data.title}</Typography>}
            subheader={
                <Stack sx={{ flexDirection: "row", gap: 2, alignItems: "center", justifyContent: "center", color: "info.contrastText" }}>
                    <Typography variant='p'>Source: {data.source}</Typography>
                    <Typography variant='body1'>Section: {data.section}</Typography>
                    <Typography variant='subtitle2'>{data.byline}</Typography>
                </Stack>
            }
            action={
                <Tooltip title="view in source site">
                    <IconButton onClick={handleClick}>
                        <LanguageTwoTone />
                    </IconButton>
                </Tooltip>
            }
        >
        </CardHeader>
    )
}

export default ContentsFromNyTimes