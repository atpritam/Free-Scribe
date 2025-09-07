'use client';

import React, {useState, useRef, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import HomePage from '../components/HomePage';
import FileDisplay from '../components/FileDisplay';
import Transcribing from '../components/Transcribing';
import { MessageTypes } from '../utils/presets';
import Footer from '../components/Footer';
import Information from '../components/Information';
import { TranscriptionResult, AudioFile, AudioStream } from '../types';

export default function App() {
  const [file, setFile] = useState<AudioFile | null>(null);
  const [audioStream, setAudioStream] = useState<AudioStream | null>(null);
  const [output, setOutput] = useState<TranscriptionResult[] | false>(false);
  const [loading, setLoading] = useState<boolean>(false); 
  const [text, setText] = useState<string | null>(null);

  const handleAudioReset = (): void => {
    setFile(null);
    setAudioStream(null);
  };

  const resetToHomePage = (): void => {
    setFile(null);
    setAudioStream(null);
    setOutput(false);
    setLoading(false);
    setText(null);
  };

  const isAudioAvailable = file || audioStream;

  const worker = useRef<Worker | null>(null);

  const readAudioFrom = async (file: File): Promise<Float32Array> => {
    const sampling_rate = 16000;
    const audioCTX = new AudioContext({ sampleRate: sampling_rate });
    const response = await file.arrayBuffer();
    const decoded = await audioCTX.decodeAudioData(response);
    const audio = decoded.getChannelData(0);
    return audio;
  };

  const readAudioFromBlob = async (blob: Blob): Promise<Float32Array> => {
    const sampling_rate = 16000;
    const audioCTX = new AudioContext({ sampleRate: sampling_rate });
    const response = await blob.arrayBuffer();
    const decoded = await audioCTX.decodeAudioData(response);
    const audio = decoded.getChannelData(0);
    return audio;
  };

  const handleFormSubmission = useCallback(async (): Promise<void> => {
    if (!file && !audioStream) {
      return;
    }

    if (!worker.current) return;
    
    const model_name = `openai/whisper-tiny.en`;
    let audio: Float32Array;

    if (file) {
      audio = await readAudioFrom(file);
    } else if (audioStream) {
      audio = await readAudioFromBlob(audioStream);
    } else {
      return;
    }

    worker.current.postMessage({
      type: MessageTypes.INFERENCE_REQUEST,
      audio,
      model_name
    });
  }, [file, audioStream]);

  useEffect(() => {
    if (audioStream) {
      handleFormSubmission();
    }
  }, [audioStream, handleFormSubmission]);

  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(new URL('../utils/whisper.worker.js', import.meta.url), {
        type: 'module'
      });
    }

    const onMessageReceived = async (e: MessageEvent) => {
      switch (e.data.type) {
        case 'LOADING':
          setLoading(true);
          break;
        case 'RESULT':
          setOutput(e.data.results);
          break;
        default: 
          break;
      }
    };

    worker.current.addEventListener('message', onMessageReceived);

    return () => {
      if (worker.current) {
        worker.current.removeEventListener('message', onMessageReceived);
      }
    };
  }, []);

  useEffect(() => {
    if (output) {
      const t = output.map((line) => line.text).join('\n');
      setText(t);
    }
  }, [output]);

  return (
    <div className='flex flex-col max-w-[1000px] mx-auto w-full'>
      <section className='min-h-screen flex flex-col'>
        <Header resetToHomePage={resetToHomePage} />
        {output ? (
            <Information text={text} />
        ) : loading? (
          <Transcribing />
        ) : isAudioAvailable ? (
          <FileDisplay
            handleAudioReset={handleAudioReset}
            file={file}
            audioStream={audioStream}
            handleFormSubmission={handleFormSubmission}
          />
        ) : (
          <HomePage setFile={setFile} setAudioStream={setAudioStream} />
        )}
      </section>
      <Footer />
    </div>
  );
}
