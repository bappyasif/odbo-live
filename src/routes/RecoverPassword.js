import { Stack, Typography } from '@mui/material'
import { Container } from '@mui/system'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContexts } from '../App'
import { RenderingFormControl, ReusableFormActionButtons, ReusableFormView } from './PasswordReset'
import { sendDataToServer } from '../utils'

function RecoverPassword() {
  let [otpReady, setOtpReady] = useState(null);
  console.log(otpReady, "!!")

  useEffect(() => {
    setOtpReady("send");
  }, [])

  return (
    <Container>
      <Typography variant='h2'>Recover Your Password With An OTP</Typography>
      {
        otpReady === "send"
          ? <GetOtpFromServer setOtpReady={setOtpReady} />
          : otpReady === "verify"
            ? <VerifyOtpFromServer setOtpReady={setOtpReady} />
            : otpReady === "reset"
              ? alert("reset")
              : alert("what happened?!")
      }
    </Container>
  )
}

const VerifyOtpFromServer = ({ setOtpReady }) => {
  let [data, setData] = useState();

  const appCtx = useContext(AppContexts);

  const navigate = useNavigate()

  const handleFormControlData = evt => {
    const elem = evt.target.id;
    const value = evt.target.value;
    setData(prev => ({ ...prev, [elem]: value }))
  }

  const afterOtpBeenVerified = (result) => {
    alert("otp verified!!")
    setOtpReady("reset")
  }

  const handleVerificationFailed = (result) => {
    console.log(result?.msg)
    if (result.length) {
      alert("verification failed")
      // setOtpReady(false)
      setOtpReady("send")
    }
  }

  const handleVerify = () => {
    console.log("verify here!!")
    const url = `${appCtx.baseUrl}/users/verify-otp-code`
    if (!data?.otpCode) {
      alert("nope, no cant do, No OTP Code Has Been Provided!!")
    } else {
      // to do
      console.log("otp sent for verification")
      sendDataToServer(url, data, handleVerificationFailed, afterOtpBeenVerified)
      // performProtectedUpdateOperation(formData, refreshToken, url, null, null, navigate)
    }
  }

  const handleCancel = () => {
    console.log("cancel here!!")
    // setOtpReady(false)
    setOtpReady("send")
  }

  const formControl = [
    {
      id: "otpCode",
      labelText: "*OTP CODE GOES HERE: ",
      type: "password",
      placeholder: "Enter Your Received OTP From Your Email Here",
      required: true
    }
  ];

  const renderFormControls = () => formControl.map(item => <RenderingFormControl key={item.id} item={item} handleFormData={handleFormControlData} />)

  const buttons = [
    { name: "Verify", icon: null, fullWidth: true, variant: "contained" },
    { name: "Cancel", icon: null, fullWidth: true, variant: "contained" },
  ];

  const renderButtons = () => buttons.map(item => <ReusableFormActionButtons key={item.name} buttonItem={item} actionMethod={item.name === "Verify" ? handleVerify : handleCancel} forSubmit={item.name === "Verify"} />)

  return (
    <Stack>
      <Typography variant='h2'>Enter Your OTP Below For Verification</Typography>
      {renderFormControls()}
      <Stack sx={{ flexDirection: "row" }}>
        {renderButtons()}
      </Stack>
    </Stack>
  )
}

const GetOtpFromServer = ({ setOtpReady }) => {
  const appCtx = useContext(AppContexts);

  const [formData, setFormData] = useState({})

  const navigate = useNavigate()

  const handleFormData = evt => {
    const elem = evt.target.id;
    const value = evt.target.value;
    setFormData(prev => ({ ...prev, [elem]: value }))
  }

  const handleCancel = () => {
    console.log("cancel")
    // navigate("/")
  }

  const afterOtpBeenSent = (result) => {
    console.log(result, "RESULT!!")
    alert("check your email for an OTP has been sent!! OTP IS VALID FOR 15 MINUTES ONLY!!")
    setOtpReady("verify")
  }

  const handleGetOtp = () => {
    console.log("getOtp!!", formData)
    const url = `${appCtx.baseUrl}/users/send-otp-code`

    if (checkGuestUserPresence(formData?.email)) {
      alert("nope, no cant do, protected account!!")
      navigate("/")
    } else if (!formData?.email) {
      alert("nope, no cant do, No Email Address Has Been Provided!!")
    } else {
      // to do
      console.log("otp sent to email")
      sendDataToServer(url, formData, () => null, afterOtpBeenSent)
      // performProtectedUpdateOperation(formData, refreshToken, url, null, null, navigate)
    }
  }
  
  const formControls = [
    {
      id: "email",
      labelText: "*Email Address: ",
      type: "email",
      placeholder: "Enter Your Already Registered Email Address",
      required: true
    },
  ];

  return (
    <Stack>
      <ReusableFormView
        handleFormData={handleFormData}
        primaryAction={handleGetOtp}
        secondaryAction={handleCancel}
        legendText={"Provide your already registered Account email with OdBo, to get an OTP sent to your email address"}
        formControls={formControls}
      />
    </Stack>
  )
}

const checkGuestUserPresence = (protectedEmail) => {
  const restrictedUsers = ["guest@een.com", "guest@twee.com"];
  return restrictedUsers.includes(protectedEmail)
  // return restrictedUsers.includes(appCtx?.user?.fullName)
  // return restrictedUsers.find(name => name === appCtx?.user?.fullName)
}

export default RecoverPassword