import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AuthenticationForm from '../components/AuthenticationForm';

export const Login = ({ setUser, user }) => {
    const [showRegistration, setShowRegistration] = useState(false);
    
    const toggle = () => setShowRegistration(prev => !prev);

    const google = () => {
        window.open("http://localhost:4000/auth/google", "_self");
    };

    const github = () => {
        window.open("http://localhost:4000/auth/github", "_self");
    };

    const facebook = () => {
        window.open("http://localhost:4000/auth/facebook", "_self");
    };

    return (
        <div className="login">
            <h1 className="loginTitle">Choose a Login Method</h1>
            <div className="wrapper">
                <div className="left">
                    <div className="loginButton google" onClick={google}>
                        Google
                    </div>
                    <div className="loginButton facebook" onClick={facebook}>
                        Facebook
                    </div>
                    <div className="loginButton github" onClick={github}>
                        Github
                    </div>
                </div>
                <div className="center">
                    <div className="line" />
                    <div className="or">OR</div>
                </div>
                {
                    user?.user
                        ? null
                        :
                        <div className="right">
                        {
                            showRegistration
                            ? <UserRegistration setUser={setUser} />
                            : <UserLogin setUser={setUser} />
                        }
                    </div>
                }
                <DecideWhichAuthenticationMethodToShow toggle={toggle} showRegistration={showRegistration} />
            </div>
        </div>
    );
};

const DecideWhichAuthenticationMethodToShow = ({toggle ,showRegistration}) => {
    const leftText = showRegistration ? "Already has an Account?" : "No Account yet?"
    const buttonText = showRegistration ? "Login" : "Register"
    return (
        <div>
            <p>{leftText}</p>
            <button style={{fontSize: "large", padding: "11px 22px"}} onClick={toggle}>{buttonText} Here</button>
        </div>
    )
}

const UserRegistration = ({ setUser }) => {
    const url = 'http:///localhost:4000/ep-auth/register';

    const formControls = [
        { label: "Name", type: "text", id: "name", placeholder: "enter your name here" },
        { label: "Email", type: "email", id: "email", placeholder: "enter your email address" },
        { label: "Password", type: "password", id: "password", placeholder: "enter your password here" },
        { label: "Confirm Password", type: "password", id: "confirm", placeholder: "retype your password here" }
    ];

    return (
        <div>
            <h1>Registration Form</h1>
            <AuthenticationForm url={url} formControls={formControls} setUser={setUser} actionText={"Register"} />
        </div>
    )
}

const UserLogin = ({ setUser }) => {
    const url = 'http:///localhost:4000/ep-auth/login';

    const formControls = [
        { label: "Email", type: "email", id: "email", placeholder: "enter your registered email address here" },
        { label: "Password", type: "password", id: "password", placeholder: "enter your password here" }
    ];

    return (
        <div>
            <h1>Login Form</h1>
            <AuthenticationForm url={url} formControls={formControls} setUser={setUser} actionText={"Login"} />
        </div>
    )
}