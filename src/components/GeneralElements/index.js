import React from "react"
import { Link } from "react-router-dom"

let WrapperDiv = (props) => {
    return <div style={{...props.styles}} className={`wrapper-div ${props.className}`}>{props.children}</div>
}

let DivElement = ({className, value}) => {
    return <div className={className}>{value}</div>
}

let H1Element = ({value}) => {
    return <h1 style={{marginRight: value==="OdBo" ? "11px" : "auto"}}>{value}</h1>
}

let H2Element = ({value}) => {
    return <h2>{value}</h2>
}

let H3Element = ({value}) => {
    return <h3>{value}</h3>
}

let H4Element = ({value}) => {
    return <h4>{value}</h4>
}

let NavElement = (props) => {
    return <nav className="nav-elem">{props.children}</nav>
}

let AnchorElement = ({className, value}) => {
    return <a href="/" className={className}>{value}</a>
}

let UlElement = props => {
    return <ul>{props.children}</ul>
}

let OlElement = props => {
    return <ul>{props.children}</ul>
}

let LiElement = (props) => {
    return <li style={{listStyle: "inside"}}>{props.msg}</li>
}

let LinkElement = ({className, value, path}) => {
    return <Link className={className} to={path}>{value}</Link>
}

export {
    WrapperDiv,
    DivElement,
    H1Element,
    H2Element,
    H3Element,
    H4Element,
    NavElement,
    AnchorElement,
    UlElement,
    OlElement,
    LiElement,
    LinkElement
}