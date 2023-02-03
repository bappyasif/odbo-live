import { Box, Stack, Typography } from '@mui/material'
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

  const handleAfterVerified = (elem, value) => setAfterVerified(prev => ({ ...prev, [elem]: value }));

  useEffect(() => {
    setOtpReady("send");
  }, [])

  return (
    <Container>
      <Typography variant='h2'>Recover Your Password With An OTP</Typography>
      {
        errors?.length
          ?
          <Box sx={{ my: 2 }}>
            <Typography variant='h4'>{errors[0]?.msg ? "Error Occured!!" : "Validaation Failed!!"}</Typography>
            <ShowErrors styles={{ position: "relative" }} errors={errors} />
          </Box>
          : null
      }
      {
        otpReady === "send"
          ? <BeginOtpResetPassword errors={errors} setErrors={setErrors} setOtpReady={setOtpReady} handleAfterVerified={handleAfterVerified} />
          : otpReady === "verify"
            ? <VerifyOtpAfterReceiving errors={errors} setErrors={setErrors} setOtpReady={setOtpReady} handleAfterVerified={handleAfterVerified} />
            : otpReady === "reset"
              ? <ResetPasswordWithOtp errors={errors} setErrors={setErrors} setOtpReady={setOtpReady} afterVerified={afterVerified} />
              : null
      }
    </Container>
  )
}

const BeginOtpResetPassword = ({ errors, setErrors, setOtpReady, handleAfterVerified }) => {
  let [disableClick, setDisableClick] = useState(false);

  // let [errors, setErrors] = useState([]);

  const appCtx = useContext(AppContexts);

  const navigate = useNavigate();

  const afterOtpBeenSent = (result) => {
    alert("check your email for an OTP has been sent!! OTP IS VALID FOR 15 MINUTES ONLY!!")
    setOtpReady("verify");
  }

  const handleFailedSendingOtp = (result) => {
    console.log(result, "SEND!!")
    setDisableClick(false)
    if (result?.errors?.length) {
      setErrors(result.errors)
    } else {
      result?.msg && setErrors([{ msg: result.msg }])
    }
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
    setDisableClick(false)
    setErrors([]);
  }, [])

  return (
    <Stack sx={{ pointerEvents: disableClick ? "none" : "auto" }}>

      <ReusableFormComponent
        actionName={"Send OTP"}
        checkCondition={"Send OTP"}
        primaryAction={handleGetOtp}
        formControls={formControls}
        legendText={errors?.length ? null : "Provide your already registered Account email with OdBo, to get an OTP sent to your email address"}
      />
    </Stack>
  )
}

const VerifyOtpAfterReceiving = ({ errors, setErrors, setOtpReady, handleAfterVerified }) => {
  let [disableClick, setDisableClick] = useState(false);

  const appCtx = useContext(AppContexts);

  const afterOtpBeenVerified = (result) => {
    alert("otp verified!!")
    setOtpReady("reset");
    // console.log(result, "VERFIED")
    handleAfterVerified("otpCode", result?.otpCode)
  }

  const handleVerificationFailed = (result) => {
    console.log(result?.msg, result, "at verification!!")
    if (result?.errors?.length) {
      alert("verification failed")
      setErrors(result.errors)
      // setOtpReady("send")
    } else {
      setErrors([{ msg: result?.msg }])
    }
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
    setDisableClick(false)
    setErrors([]);
  }, [])

  return (
    <Stack sx={{ pointerEvents: disableClick ? "none" : "auto" }}>

      <ReusableFormComponent
        actionName={"Verify OTP"}
        checkCondition={"Verify OTP"}
        primaryAction={handleVerify}
        formControls={formControls}
        legendText={errors?.length ? null : "Enter Your OTP Below For Verification"}
      />
    </Stack>
  )
}

const ResetPasswordWithOtp = ({ errors, setErrors, afterVerified, setOtpReady }) => {

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
    if (result?.errors?.length) {
      setErrors(result.errors);
      // alert("verification failed")
      // setOtpReady("verify")
    } else {
      result?.msg && setErrors([{ msg: result?.msg }])
      // setOtpReady("send")
    }
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
      // console.log("password reset request sent")
      setDisableClick(true);
      setErrors([])
      const newFormData = { email: afterVerified.email, otpCode: afterVerified.otpCode, ...formData }
      sendDataToServer(url, newFormData, handleVerificationFailed, afterPasswordReset)
    }
  }

  useEffect(() => {
    setDisableClick(false)
    setErrors([]);
  }, [])

  return (
    <Stack sx={{ pointerEvents: disableClick ? "none" : "auto" }}>

      <ReusableFormComponent
        actionName={"Reset Password"}
        checkCondition={"Reset Password"}
        primaryAction={handleResetPassword}
        formControls={formControls}
        legendText={errors?.length ? null : "Fillup all these informations to complete your Password Reset Process"}
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
    // console.log("cancel")
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