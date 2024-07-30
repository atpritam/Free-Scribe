import { useState } from 'react'
import './App.css'
import Header from './components/Header.jsx'
import HomePage from './components/HomePage.jsx'
import FileDisplay from './components/FileDisplay.jsx';


function App() {

  const [file, setFile] = useState(null);
  const [audioStream, setAudioStream] = useState(null);

  const isAudioAvailable = file || audioStream;

  return (
    <div className='flex flex-col max-w-[1000px] mx-auto w-full'>
      <section className='min-h-screen flex flex-col'>
        <Header />
        { 
          isAudioAvailable ?
          <FileDisplay file={file} audioStream={audioStream}/> : 
          <HomePage setAudioStream={setAudioStream} setFile={setFile}/>
        }
      </section>
    </div>
  )
}

export default App
