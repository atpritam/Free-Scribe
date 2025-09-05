'use client';

import React from 'react'

function Transcription(props) {

    const { text } = props;

  return (
    <div>
        {
            text ? (
                <p >{text}</p>
            ) : (
                <p>No Transcription Available</p>
            )
        }
    </div>
  )
}

export default Transcription
