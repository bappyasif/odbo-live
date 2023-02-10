import { Box, LinearProgress, Stack, Typography } from '@mui/material'
import { Container } from '@mui/system'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContexts } from '../App'
import { ReusableFormView } from './PasswordReset'
import { sendDataToServer } from '../utils'
import ShowErrors from '../components/ShowErrors'

function RecoverPassword() {
  let [otpReady, setOtpReady] = useState(null);

  let [afterVerified, setAfterVerified] = useState({})

  let [errors, setErrors] = useState([]);

  let [showLoading, setShowLoading] = useState(false);

  const handleAfterVerified = (elem, value) => setAfterVerified(prev => ({ ...prev, [elem]: value }));

  const handleErrorsList = (result) => {
    if (result?.errors?.length) {
      setErrors(result.errors)
    } else {
      result?.msg && setErrors([{ msg: result.msg }])
    }
  }

  const removeErrorsAfterTimeout = () => {
    const timer = setTimeout(() => {
      setErrors([]);
    }, 4000)

    return () => clearTimeout(timer)
  }

  useEffect(() => {
    errors?.length && removeErrorsAfterTimeout()
  }, [errors])

  useEffect(() => {
    setErrors([]);
    setShowLoading(false);
  }, [otpReady])

  useEffect(() => {
    setOtpReady("send");
  }, [])

  return (
    <Container>
      <Typography variant='h2'>Recover Your Password With An OTP</Typography>
      {
        otpReady === "send"
          ? <BeginOtpResetPassword handleErrorsList={handleErrorsList} setShowLoading={setShowLoading} setErrors={setErrors} setOtpReady={setOtpReady} handleAfterVerified={handleAfterVerified} />
          : otpReady === "verify"
            ? <VerifyOtpAfterReceiving handleErrorsList={handleErrorsList} setShowLoading={setShowLoading} setErrors={setErrors} setOtpReady={setOtpReady} handleAfterVerified={handleAfterVerified} />
            : otpReady === "reset"
              ? <ResetPasswordWithOtp handleErrorsList={handleErrorsList} setShowLoading={setShowLoading} setErrors={setErrors} afterVerified={afterVerified} />
              : null
      }

      <HandleLoading showLoading={showLoading} />

      <HandleErrors errors={errors} />

    </Container>
  )
}

const HandleLoading = ({showLoading}) => {
  return (
    showLoading
    ?
    <LinearProgress 
      color="secondary"
    />
    : null
  )
}

const HandleErrors = ({errors}) => {
  return (
    errors?.length
      ?
      <Box sx={{ my: 2 }}>
        <Typography variant='h4'>{errors[0]?.msg ? "Error Occured!!" : "Validaation Failed!!"}</Typography>
        <ShowErrors styles={{ position: "relative" }} errors={errors} />
      </Box>
      : null
  )
}

const BeginOtpResetPassword = ({ handleErrorsList, setShowLoading, setErrors, setOtpReady, handleAfterVerified }) => {
  let [disableClick, setDisableClick] = useState(false);

  const appCtx = useContext(AppContexts);

  const navigate = useNavigate();

  const afterOtpBeenSent = (result) => {
    alert("check your email for an OTP has been sent!! OTP IS VALID FOR 15 MINUTES ONLY!!")
    setOtpReady("verify");
  }

  const handleFailedSendingOtp = (result) => {
    setDisableClick(false)
    handleErrorsList(result)
  }

  const handleGetOtp = (formData) => {
    const url = `${appCtx.baseUrl}/users/send-otp-code`

    if (checkGuestUserPresence(formData?.email)) {
      alert("nope, no cant do, protected account!!")
      navigate("/")
    } else if (!formData?.email) {
      alert("nope, no cant do, No Email Address Has Been Provided!!")
    } else {
      setDisableClick(true);
      setErrors([])
      sendDataToServer(url, formData, handleFailedSendingOtp, afterOtpBeenSent)
      handleAfterVerified("email", formData?.email)
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

  useEffect(() => {
    setShowLoading(disableClick)
  }, [disableClick])

  useEffect(() => {
    setDisableClick(false)
  }, [])

  return (
    <Stack sx={{ pointerEvents: disableClick ? "none" : "auto" }}>

      <ReusableFormComponent
        actionName={"Send OTP"}
        checkCondition={"Send OTP"}
        primaryAction={handleGetOtp}
        formControls={formControls}
        legendText={"Provide your already registered Account email with OdBo, to get an OTP sent to your email address"}
      />
    </Stack>
  )
}

const VerifyOtpAfterReceiving = ({ handleErrorsList, setShowLoading, setErrors, setOtpReady, handleAfterVerified }) => {
  let [disableClick, setDisableClick] = useState(false);

  const appCtx = useContext(AppContexts);

  const afterOtpBeenVerified = (result) => {
    alert("otp verified!!")
    setOtpReady("reset");
    handleAfterVerified("otpCode", result?.otpCode)
  }

  const handleVerificationFailed = (result) => {
    handleErrorsList(result)
    setDisableClick(false)
  }

  const handleVerify = (data) => {
    const url = `${appCtx.baseUrl}/users/verify-otp-code`

    if (!data?.otpCode) {
      alert("nope, no cant do, No OTP Code Has Been Provided!!")
    } else {
      setDisableClick(true);
      setErrors([])
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

  useEffect(() => {
    setShowLoading(disableClick)
  }, [disableClick])

  useEffect(() => {
    setDisableClick(false)
  }, [])

  return (
    <Stack sx={{ pointerEvents: disableClick ? "none" : "auto" }}>

      <ReusableFormComponent
        actionName={"Verify OTP"}
        checkCondition={"Verify OTP"}
        primaryAction={handleVerify}
        formControls={formControls}
        legendText={"Enter Your OTP Below For Verification"}
      />
    </Stack>
  )
}

const ResetPasswordWithOtp = ({ handleErrorsList, setShowLoading, setErrors, afterVerified }) => {

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

  const afterPasswordReset = (result) => {
    alert("Your password has been now reset, and will be taken to Login Page :)")
    navigate("/login");
  }

  const handleVerificationFailed = (result) => {
    console.log(result?.msg, result)
    handleErrorsList(result)
    setDisableClick(false);
  }

  const handleResetPassword = (formData) => {
    const url = `${appCtx.baseUrl}/users/reset-password-with-otp`

    if (checkGuestUserPresence(formData?.email)) {
      alert("nope, no cant do, protected account!!")
      navigate("/")
    } else if (!formData?.password || !formData?.confirm) {
      alert("nope, no cant do, No Password or Confirm Password Has Been Provided!!")
    } else {
      setDisableClick(true);
      setErrors([])
      const newFormData = { email: afterVerified.email, otpCode: afterVerified.otpCode, ...formData }
      sendDataToServer(url, newFormData, handleVerificationFailed, afterPasswordReset)
    }
  }

  useEffect(() => {
    setShowLoading(disableClick)
  }, [disableClick])

  useEffect(() => {
    setDisableClick(false)
  }, [])

  return (
    <Stack sx={{ pointerEvents: disableClick ? "none" : "auto" }}>

      <ReusableFormComponent
        actionName={"Reset Password"}
        checkCondition={"Reset Password"}
        primaryAction={handleResetPassword}
        formControls={formControls}
        legendText={"Fillup all these informations to complete your Password Reset Process"}
      />
    </Stack>
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
    navigate("/")
  }

  useEffect(() => {
    setDisableClick(false)
    buttons[0].name = actionName
  }, [])

  return (
    <Stack>
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
}

const buttons = [
  { name: "Reset", icon: null, fullWidth: true, variant: "contained" },
  { name: "Cancel", icon: null, fullWidth: true, variant: "contained" }
];

export default RecoverPassword