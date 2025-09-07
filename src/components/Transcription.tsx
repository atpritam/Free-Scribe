'use client';

import React from 'react';
import { TranscriptionProps } from '../types';

const Transcription: React.FC<TranscriptionProps> = ({ text }) => {

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
  );
};

export default Transcription;
