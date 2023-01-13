import React from 'react'
import {Link} from "react-router-dom"
import { baseUrl } from '../App';


export const Navbar = ({ user }) => {
    const logout = () => {
      window.open(`${baseUrl}/auth/logout`, "_self");
    };
    return (
      <div className="navbar">
        <span className="logo">
          <Link className="link" to="/">
            Home Route | 
          </Link>
        </span>
        {user ? (
          <ul className="list">
            <li className="listItem">
              <img
                src={user.photos ? user.photos[0].value : "https://source.unsplash.com/featured/300x202"}
                alt=""
                className="avatar"
              />
            </li>
            <li className="listItem">{user.displayName || user.name}</li>
            <li><Link className="link" to="/login/success">
            | Secret Page For Oauth2 | 
          </Link></li>
          <li><Link className="link" to="/secretRoute">
            | Secret Page For Non Oauth2 Users | 
          </Link></li>
            <li className="listItem" onClick={logout}>
              Logout
            </li>
          </ul>
        ) : (
          <Link className="link" to="login">
            | Login
          </Link>
        )}
      </div>
    );
  };