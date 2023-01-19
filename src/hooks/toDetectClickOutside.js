import React, { useEffect } from 'react'

export function useToCloseModalOnClickedOutside(ref, handler) {

    useEffect(() => {
        let listener = event => {
            if(!ref.current || ref.current.contains(event.target)) return
            handler(event)
        }

        document.addEventListener("mousedown", listener);

        return () => document.removeEventListener("mousedown", listener)
    }, [ref, handler])
}