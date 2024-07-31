import { useState, useRef, useEffect } from 'react';
import './App.css';
import Header from './components/Header.jsx';
import HomePage from './components/HomePage.jsx';
import FileDisplay from './components/FileDisplay.jsx';
import Information from './components/Information.jsx';
import Transcribing from './components/Transcribing.jsx';
import { MessageTypes } from './utils/presets.js';

function App() {
  const [file, setFile] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [output, setOutput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [text, setText] = useState(null);

  const handleAudioReset = () => {
    setFile(null);
    setAudioStream(null);
  };

  const isAudioAvailable = file || audioStream;

  const worker = useRef(null);

  const readAudioFrom = async (file) => {
    const sampling_rate = 16000;
    const audioCTX = new AudioContext({ sampleRate: sampling_rate });
    const response = await file.arrayBuffer();
    const decoded = await audioCTX.decodeAudioData(response);
    const audio = decoded.getChannelData(0);
    return audio;
  };

  const handleFormSubmission = async () => {
    if (!file && !audioStream) {
      return;
    }

    let audio = await readAudioFrom(file ? file : audioStream);
    const model_name = `openai/whisper-tiny.en`;

    worker.current.postMessage({
      type: MessageTypes.INFERENCE_REQUEST,
      audio,
      model_name
    });
  };

  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(new URL('./utils/whisper.worker.js', import.meta.url), {
        type: 'module'
      });
    }

    const onMessageReceived = async (e) => {
      switch (e.data.type) {
        case 'DOWNLOADING':
          setDownloading(true);
          console.log('DOWNLOADING');
          break;
        case 'LOADING':
          setLoading(true);
          console.log('LOADING');
          break;
        case 'RESULT':
          setOutput(e.data.results);
          console.log(e.data.results);
          break;
        case 'INFERENCE_DONE':
          setFinished(true);
          console.log("DONE");
          break;
        default:
          break;
      }
    };

    worker.current.addEventListener('message', onMessageReceived);

    return () => worker.current.removeEventListener('message', onMessageReceived);
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
        <Header isAudioAvailable={isAudioAvailable} />
        {output ? (
          <Information text={text} />
        ) : loading ? (
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
      <footer></footer>
    </div>
  );
}

export default App;
