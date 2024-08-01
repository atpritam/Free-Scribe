import React, { useState, useEffect, useRef } from 'react';
import { LANGUAGES } from '../utils/presets';
import { translate } from '../utils/mobile.translate';
import { isMobile } from 'react-device-detect';
import  MOBILE  from '../utils/mobile.presets';

function Translation(props) {
    const { text, translatedText, language } = props;
    const [translation, setTranslation] = useState('');
    const [toLanguage, setToLanguage] = useState('Select language');
    const [translating, setTranslating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [prevLanguage, setPrevLanguage] = useState('Select language');
    const worker = useRef(null);

    useEffect(() => {
        if (!worker.current && !isMobile) {
            worker.current = new Worker(new URL('../utils/translate.worker.js', import.meta.url), {
                type: 'module'
            })
        }

        const onMessageReceived = async (e) => {
            switch (e.data.status) {
                case 'initiate':
                    setLoading(true)
                    break;
                case 'progress':
                    setLoading(true)
                    break;
                case 'update':
                    setLoading(false)
                    setTranslation(e.data.output)
                    translatedText.current = e.data.output
                    break;
                case 'complete':
                    setLoading(false)
                    setTranslation(e.data.output.map(x => x.translation_text).join(' '))
                    translatedText.current = e.data.output.map(x => x.translation_text).join(' ')
                    break;
            }
        }

        worker.current?.addEventListener('message', onMessageReceived)

        return () => worker.current?.removeEventListener('message', onMessageReceived)
    }, [])

    const generateTranslation = async () => {
        if(translating || toLanguage === 'Select language') return  
        if(prevLanguage === toLanguage) return
        translatedText.current = null
        setTranslating(true)
        setLoading(true)

        if (isMobile) {
            const translated = await translate(text, toLanguage);
            if (translated) {
                setTranslation(translated);
                translatedText.current = translated;
            }
        } else {
            worker.current.postMessage({
                text: text,
                src_lang: 'eng_Latn',
                tgt_lang: toLanguage
            })
        }


        setTranslating(false)
        setLoading(false)
        setPrevLanguage(toLanguage)
    }

    return (
        <>
            {language.current && (
                <div className='flex flex-col gap-1 mb-4'>
                    <p className='text-xs sm:text-sm font-medium text-slate-500 mr-auto'>To language</p>
                    <div className='flex items-stretch gap-2 sm:gap-4'>
                        <select
                            value={language.current}
                            className='flex-1 outline-none w-full focus:outline-none bg-white duration-200 p-2 rounded'
                            onChange={(e) => {
                                setToLanguage(e.target.value);
                                language.current = e.target.value;
                            }}
                        >
                            <option value={'Select language'}>Select language</option>
                            {
                                (isMobile) ? (
                                    MOBILE.languages.map(lang => (
                                        <option key={lang.language} value={lang.language}>{lang.name}</option>
                                    ))
                                ) : (
                                    Object.entries(LANGUAGES).map(([key, value]) => (
                                        <option key={key} value={value}>{key}</option>
                                    ))
                                )
                            }
                        </select>
                        <button onClick={generateTranslation} className='specialBtn px-3 py-2 rounded-lg text-blue-400 hover:text-blue-600 duration-200'>Translate</button>
                    </div>
                </div>
            )}
            {loading && (
                <p><i className="fa-solid fa-spinner animate-spin"></i></p>
            )}
            {translatedText.current && (
                <div className='fixed-height'>
                    <p>{translatedText.current}</p>
                </div>
            )}
        </>
    );
}

export default Translation;
