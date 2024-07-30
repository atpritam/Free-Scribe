import { useState } from 'react'
import './App.css'
import Header from './components/Header.jsx'
import HomePage from './components/HomePage.jsx'
import FileDisplay from './components/FileDisplay.jsx';
import Information from './components/Information.jsx';
import Transcribing from './components/Transcribing.jsx';


function App() {

  const [file, setFile] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAudioReset = () => {
    setFile(null);
    setAudioStream(null);
  }

  const isAudioAvailable = file || audioStream;

  return (
    <div className='flex flex-col max-w-[1000px] mx-auto w-full'>
      <section className='min-h-screen flex flex-col'>
        <Header />
        {output ? (
          <Information output={output} finished={finished}/>
        ) : loading ? (
          <Transcribing />
        ) : isAudioAvailable ? (
          <FileDisplay handleFormSubmission={handleFormSubmission} handleAudioReset={handleAudioReset} file={file} audioStream={audioStream} />
        ) : (
          <HomePage setFile={setFile} setAudioStream={setAudioStream} />
        )}
      </section>
      <footer></footer>
    </div>
  )
}

export default App
