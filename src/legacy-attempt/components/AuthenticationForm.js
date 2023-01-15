import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AuthenticationForm({url, formControls, setUser, actionText}) {
    const [formData, setFormData] = useState({})

    const navigate = useNavigate()

    const handleFormDataChange = (evt, el) => setFormData(prev => ({ ...prev, [el]: evt.target.value }))

    const sendLoginRequest = () => {
        // const url = 'http:///localhost:4000/ep-auth/login';
        fetch(url, {
            method: "POST",
            credentials: "include",
            headers: {
                "Accept": "Application/json",
                "content-Type": "Application/json"
            },
            body: JSON.stringify(formData)
        }).then(resp => resp.json())
            .catch(err => console.log("response error!!", err))
            .then(data => {
                console.log(data)
                setUser(data);
                navigate("/");
            })
            .catch(err => console.log("data error", err))
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();
        if (formData.email && formData.password) {
            sendLoginRequest()
        } else {
            alert("enter your registered email and password")
        }
    }

    const renderFormControls = () => formControls?.map(item => <RenderFormControl key={item.id} item={item} changeHandler={handleFormDataChange} />);

    return (
        <form method='post' onSubmit={handleSubmit}>
            {renderFormControls()}
            <button style={{fontSize: "large", padding: "6px 20px"}} className="submit" type='submit'>{actionText}</button>
        </form>
    )
}

const RenderFormControl = ({item, changeHandler}) => {
    return (
        <fieldset>
            <label style={{display: "block"}}>{item.label}</label>
            <input style={{fontSize: "large", width: "330px"}} type={item.type} placeholder={item.placeholder} name={item.id} id={item.id} required onChange={e => changeHandler(e, item.id)} />
        </fieldset>
    )
}

export default AuthenticationForm