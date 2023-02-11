import { Stack } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { H1Element, H2Element } from './GeneralElements'
import { NavigationLinks } from './MainNavigation'

function ErrorPage() {
  let [show, setShow] = useState(false);

  const startTimer = () => {
    let timer = setTimeout(() => {
      setShow(true);
    }, 200)

    return () => clearTimeout(timer)
  }

  useEffect(() => {
    // when this timer runs it gives a window of two seconds for reload based valid page loads to show loading page component instead of error page
    startTimer()
  }, [])

  return (
    show
      ?
      <>
        <H1Element value={"Opps Page You're Looking For Is Not Found"} />
        <Stack >
          <H2Element value={"consider these options to look into"} />
          <NavigationLinks />
        </Stack>
      </>
      : null
  )
}

export default ErrorPage