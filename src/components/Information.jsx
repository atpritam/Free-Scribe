import React, { useState } from 'react'
import Transcription from './Transcription'
import Translation from './Translation'
import { useRef } from 'react'

function Information(props) {
    const [tab, setTab] = useState('Transcription');
    const { text } = props;

    const translatedText = useRef('')
    const language = useRef('Select language')

    const handleTabChange = (e) => {
        setTab(e.target.innerText);
    };

    const handleCopy = () => {
        const textToCopy = tab === 'Translation' ? translatedText.current : text;
        navigator.clipboard.writeText(textToCopy);
    };

    const handleDownload = () => {
        const element = document.createElement('a');
        const textToDownload = tab === 'Translation' ? translatedText.current : text;
        const file = new Blob([textToDownload], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = tab === 'Translation' ? `Translation.txt` : `Transcription.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <main className='flex-1 p-4 flex flex-col gap-3 text-center sm:gap-4 justify-center pb-20 w-full max-w-prose mx-auto mt-10'>
            <h1 className='font-semibold text-3xl sm:text-5xl md:text-6xl'>Your <span className='text-blue-400 bold'>{tab}</span></h1>
            <div className='grid grid-cols-2 sm:mx-auto bg-white rounded overflow-hidden items-center p-1 blueShadow border-[2px] border-solid border-blue-300'>
                <button className={'px-4 rounded duration-200 py-1 ' + (tab === 'Transcription' ? ' bg-blue-300 text-white' : ' text-blue-400 hover:text-blue-600')}
                    onClick={handleTabChange}
                >Transcription</button>
                <button className={'px-4 rounded duration-200 py-1 ' + (tab === 'Translation' ? ' bg-blue-300 text-white' : ' text-blue-400 hover:text-blue-600')}
                    onClick={handleTabChange}
                >Translation</button>
            </div>
            <div className='fixed-height-container'>
            {
                tab === 'Transcription' ?
                    (<Transcription text={text} />) :
                    (<Translation text={text} translatedText={translatedText} language={language}/>)
            }
            </div>
            <div className='flex items-center gap-4 mx-auto mt-3'>
                <button onClick={handleCopy} title="Copy" className='bg-white hover:text-blue-500 duration-200 text-blue-300 px-2 aspect-square grid place-items-center rounded'>
                    <i className="fa-solid fa-copy"></i>
                </button>
                <button onClick={handleDownload} title="Download" className='bg-white hover:text-blue-500 duration-200 text-blue-300 px-2 aspect-square grid place-items-center rounded'>
                    <i className="fa-solid fa-download"></i>
                </button>
            </div>
        </main>
    );
}

export default Information;
