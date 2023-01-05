import React from 'react'
import { H1Element, LiElement, UlElement, WrapperDiv } from './GeneralElements'

function ShowErrors({errors}) {
    let renderErrorsList = () => errors?.map((error, idx) => <LiElement key={idx} msg={error.msg} />);

  return (
    <WrapperDiv className="show-errors">
        <H1Element value={"Errors List"} />
        <UlElement>
            {renderErrorsList()}
        </UlElement>
    </WrapperDiv>
  )
}

export default ShowErrors