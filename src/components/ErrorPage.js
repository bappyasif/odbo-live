import { Stack } from '@mui/system'
import React from 'react'
import { H1Element, H2Element } from './GeneralElements'
import { NavigationLinks } from './MainNavigation'

function ErrorPage() {
  return (
    <>
   <H1Element value={"Opps Page You're Looking For Is Not Found"} /> 
   <Stack >
    <H2Element value={"consider these options to look into"} />
    <NavigationLinks />
   </Stack>
    </>
  )
}

export default ErrorPage