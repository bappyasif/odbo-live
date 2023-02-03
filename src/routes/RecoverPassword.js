import { Stack, Typography } from '@mui/material'
import { Container } from '@mui/system'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContexts } from '../App'
import { RenderingFormControl, ReusableFormActionButtons, ReusableFormView } from './PasswordReset'
import { sendDataToServer } from '../utils'

function RecoverPassword() {
  let [otpReady, setOtpReady] = useState(null);
  // let [otpCodeAfterVerified, setOtpCodeAfterVerified] = useState(null);
  let [afterVerified, setAfterVerified] = useState({})

  const handleAfterVerified = (elem, value) => setAfterVerified(prev => ({ ...prev, [elem]: value }));

  console.log(otpReady, "!!", afterVerified)

  useEffect(() => {
    setOtpReady("send");
  }, [])

  return (
    <Container>
      <Typography variant='h2'>Recover Your Password With An OTP</Typography>
      {
        otpReady === "send"
          ? <BeginOtpResetPassword setOtpReady={setOtpReady} handleAfterVerified={handleAfterVerified} />
          : otpReady === "verify"
            ? <VerifyOtpAfterReceiving setOtpReady={setOtpReady} handleAfterVerified={handleAfterVerified} />
            : otpReady === "reset"
              ? <ResetPasswordWithOtp afterVerified={afterVerified} />
              : null
      }
    </Container>
  )
}

const BeginOtpResetPassword = ({ setOtpReady, handleAfterVerified }) => {
  const appCtx = useContext(AppContexts);

  const navigate = useNavigate();

  const afterOtpBeenSent = (result) => {
    // console.log(result, "RESULT!!")
    alert("check your email for an OTP has been sent!! OTP IS VALID FOR 15 MINUTES ONLY!!")
    setOtpReady("verify");
    // handleAfterVerified("email", formData?.email)
  }

  const handleGetOtp = (formData) => {
    // console.log("getOtp!!", formData)

    const url = `${appCtx.baseUrl}/users/send-otp-code`

    if (checkGuestUserPresence(formData?.email)) {
      alert("nope, no cant do, protected account!!")
      navigate("/")
    } else if (!formData?.email) {
      alert("nope, no cant do, No Email Address Has Been Provided!!")
    } else {
      // to do
      // setDisableEmail(true);
      // console.log("otp sent to email")
      sendDataToServer(url, formData, () => null, afterOtpBeenSent)
      handleAfterVerified("email", formData?.email)
      // performProtectedUpdateOperation(formData, refreshToken, url, null, null, navigate)
    }
  }

  const formControls = [
    {
      id: "email",
      labelText: "*Email Address: ",
      type: "email",
      placeholder: "Enter Your Already Registered Email Address",
      required: true,
    },
  ];

  return (
    <ReusableFormComponent
      actionName={"Send OTP"}
      checkCondition={"Send OTP"}
      primaryAction={handleGetOtp}
      formControls={formControls}
      legendText={"Provide your already registered Account email with OdBo, to get an OTP sent to your email address"}
    />
  )
}

const VerifyOtpAfterReceiving = ({setOtpReady, handleAfterVerified}) => {
  const appCtx = useContext(AppContexts);

  const afterOtpBeenVerified = (result) => {
    alert("otp verified!!")
    setOtpReady("reset");
    console.log(result, "VERFIED")
    handleAfterVerified("otpCode", result?.otpCode)
  }

  const handleVerificationFailed = (result) => {
    console.log(result?.msg)
    if (result.length) {
      alert("verification failed")
      // setOtpReady(false)
      setOtpReady("send")
    }
  }

  const handleVerify = (data) => {
    const url = `${appCtx.baseUrl}/users/verify-otp-code`
    if (!data?.otpCode) {
      alert("nope, no cant do, No OTP Code Has Been Provided!!")
    } else {
      sendDataToServer(url, data, handleVerificationFailed, afterOtpBeenVerified)
    }
  }

  const formControls = [
    {
      id: "otpCode",
      labelText: "*OTP CODE GOES HERE: ",
      type: "text",
      placeholder: "Enter Your Received OTP From Your Email Here",
      required: true
    }
  ];

  return (
    <ReusableFormComponent
      actionName={"Verify OTP"}
      checkCondition={"Verify OTP"}
      primaryAction={handleVerify}
      formControls={formControls}
      legendText={"Enter Your OTP Below For Verification"}
    />
  )
}

const ResetPasswordWithOtp = ({afterVerified}) => {
  const navigate = useNavigate();

  const appCtx = useContext(AppContexts);

  const formControls = [
    {
      id: "otpCode",
      labelText: "*OTP Code: ",
      type: "text",
      placeholder: "Your Verified OTP Code",
      required: true,
      disabled: true,
      value: afterVerified?.otpCode
    },
    {
      id: "email",
      labelText: "*Email Address: ",
      type: "email",
      placeholder: "Enter Your Already Registered Email Address",
      required: true,
      disabled: true,
      value: afterVerified?.email
    },
    {
      id: "password",
      labelText: "*New Password: ",
      type: "password",
      placeholder: "Please Choose Your Password",
      required: true
    },
    {
      id: "confirm",
      labelText: "*Confirm Password: ",
      type: "password",
      placeholder: "Please Confirm Your Password",
      required: true
    },
  ];

  const afterPasswordReset = (result) => {
    console.log(result, "RESULT!!")
    alert("Your password has been now reset, and will be taken to Login Page :)")
    // setOtpReady("verify")
    navigate("/login");
  }

  const handleResetPassword = (formData) => {
    console.log("handle reset passord!!", formData)
    const url = `${appCtx.baseUrl}/users/reset-password-with-otp`

    if (checkGuestUserPresence(formData?.email)) {
      alert("nope, no cant do, protected account!!")
      navigate("/")
    } else if (!formData?.password || !formData?.confirm) {
      alert("nope, no cant do, No Password or Confirm Password Has Been Provided!!")
    } else {
      // to do
      // setDisableClick(true)
      console.log("password reset request sent")
      const newFormData = { email: afterVerified.email, otpCode: afterVerified.otpCode, ...formData }
      sendDataToServer(url, newFormData, () => null, afterPasswordReset)
      // performProtectedUpdateOperation(formData, refreshToken, url, null, null, navigate)
    }
  }

  // useEffect(() => {
  //   setFormData({ email: afterVerified.email, otpCode: afterVerified.otpCode })
  // }, [])

  return (
    <ReusableFormComponent
      actionName={"Reset Password"}
      checkCondition={"Reset Password"}
      primaryAction={handleResetPassword}
      formControls={formControls}
      legendText={"Fillup all these informations to complete your Password Reset Process"}
    />
  )
}

const ReusableFormComponent = ({ primaryAction, formControls, legendText, actionName, checkCondition }) => {
  let [formData, setFormData] = useState();

  let [disableClick, setDisableClick] = useState(false);

  const navigate = useNavigate();

  const handleFormData = evt => {
    const elem = evt.target.id;
    const value = evt.target.value;
    setFormData(prev => ({ ...prev, [elem]: value }))
  }

  const handlePrimaryAction = () => {
    setDisableClick(true);
    primaryAction(formData)
  }

  const handleCancel = () => {
    console.log("cancel")
    navigate("/")
  }

  useEffect(() => {
    setDisableClick(false)
    buttons[0].name = actionName
  }, [])

  return (
    <Stack sx={{ pointerEvents: disableClick ? "none" : "auto" }}>
      <ReusableFormView
        formButtons={buttons}
        checkCondition={checkCondition}
        handleFormData={handleFormData}
        primaryAction={handlePrimaryAction}
        secondaryAction={handleCancel}
        legendText={legendText}
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

const buttons = [
  { name: "Reset", icon: null, fullWidth: true, variant: "contained" },
  { name: "Cancel", icon: null, fullWidth: true, variant: "contained" }
];

export default RecoverPassword

/**
 * 
 * 
 const VerifyOtpFromServer = ({ setOtpReady, handleAfterVerified }) => {
  let [data, setData] = useState();

  let [disableClick, setDisableClick] = useState(false);

  const appCtx = useContext(AppContexts);

  const navigate = useNavigate()

  const handleFormControlData = evt => {
    const elem = evt.target.id;
    const value = evt.target.value;
    setData(prev => ({ ...prev, [elem]: value }))
  }

  const afterOtpBeenVerified = (result) => {
    alert("otp verified!!")
    setOtpReady("reset");
    console.log(result, "VERFIED")
    // setOtpCodeAfterVerified(result?.otpCode)
    handleAfterVerified("otpCode", result?.otpCode)
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
    // console.log("verify here!!")
    const url = `${appCtx.baseUrl}/users/verify-otp-code`
    if (!data?.otpCode) {
      alert("nope, no cant do, No OTP Code Has Been Provided!!")
    } else {
      // to do
      setDisableClick(true);
      // console.log("otp sent for verification")
      sendDataToServer(url, data, handleVerificationFailed, afterOtpBeenVerified)
      // performProtectedUpdateOperation(formData, refreshToken, url, null, null, navigate)
    }
  }

  const handleCancel = () => {
    // console.log("cancel here!!")
    // setOtpReady(false)
    setOtpReady("send")
  }

  const formControl = [
    {
      id: "otpCode",
      labelText: "*OTP CODE GOES HERE: ",
      type: "text",
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

  useEffect(() => {
    setDisableClick(false)
  }, [])

  return (
    <Stack sx={{ pointerEvents: disableClick ? "none" : "auto" }}>
      <Typography variant='h2'>Enter Your OTP Below For Verification</Typography>
      {renderFormControls()}
      <Stack sx={{ flexDirection: "row" }}>
        {renderButtons()}
      </Stack>
    </Stack>
  )
}

 const ResetPasswordAfterVerification = ({ afterVerified }) => {
  let [formData, setFormData] = useState();

  let [disableClick, setDisableClick] = useState(false);

  const navigate = useNavigate();

  const appCtx = useContext(AppContexts);

  const formControls = [
    {
      id: "otpCode",
      labelText: "*OTP Code: ",
      type: "text",
      placeholder: "Your Verified OTP Code",
      required: true,
      disabled: true,
      value: afterVerified?.otpCode
    },
    {
      id: "email",
      labelText: "*Email Address: ",
      type: "email",
      placeholder: "Enter Your Already Registered Email Address",
      required: true,
      disabled: true,
      value: afterVerified?.email
    },
    {
      id: "password",
      labelText: "*New Password: ",
      type: "password",
      placeholder: "Please Choose Your Password",
      required: true
    },
    {
      id: "confirm",
      labelText: "*Confirm Password: ",
      type: "password",
      placeholder: "Please Confirm Your Password",
      required: true
    },
  ];

  const handleFormData = evt => {
    const elem = evt.target.id;
    const value = evt.target.value;
    setFormData(prev => ({ ...prev, [elem]: value }))
  }

  const handleCancel = () => {
    console.log("cancel")
    navigate("/")
  }

  const afterPasswordReset = (result) => {
    console.log(result, "RESULT!!")
    alert("Your password has been now reset, and will be taken to Login Page :)")
    // setOtpReady("verify")
    navigate("/login");
  }

  const handleResetPassword = () => {
    console.log("handle reset passord!!", formData)
    const url = `${appCtx.baseUrl}/users/reset-password-with-otp`

    if (checkGuestUserPresence(formData?.email)) {
      alert("nope, no cant do, protected account!!")
      navigate("/")
    } else if (!formData?.password || !formData?.confirm) {
      alert("nope, no cant do, No Password or Confirm Password Has Been Provided!!")
    } else {
      // to do
      setDisableClick(true)
      console.log("password reset request sent")
      sendDataToServer(url, formData, () => null, afterPasswordReset)
      // performProtectedUpdateOperation(formData, refreshToken, url, null, null, navigate)
    }
  }

  useEffect(() => {
    setFormData({ email: afterVerified.email, otpCode: afterVerified.otpCode })
  }, [])

  return (
    <Stack sx={{ pointerEvents: disableClick ? "none" : "auto" }}>
      <ReusableFormView
        handleFormData={handleFormData}
        primaryAction={handleResetPassword}
        secondaryAction={handleCancel}
        legendText={"Fillup all these informations to complete your Password Reset Process"}
        formControls={formControls}
      />
    </Stack>
  )
}

const GetOtpFromServer = ({ setOtpReady, handleAfterVerified }) => {
  const appCtx = useContext(AppContexts);

  const [formData, setFormData] = useState({})

  let [disableEmail, setDisableEmail] = useState(false);

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
    setOtpReady("verify");
    handleAfterVerified("email", formData?.email)
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
      setDisableEmail(true);
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
      required: true,
      // disabled: disableEmail,
      // value: formData?.email
    },
  ];

  useEffect(() => {
    setDisableEmail(false)
  }, [])

  return (
    <Stack sx={{ pointerEvents: disableEmail ? "none" : "auto" }}>
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
 */