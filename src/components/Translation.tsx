'use client';

import React, { useState, useEffect, useRef } from 'react';
import { LANGUAGES } from '../utils/presets';
import { translate } from '../utils/mobile.translate';
import { isMobile } from 'react-device-detect';
import MOBILE from '../utils/mobile.presets.json';
import { TranslationProps } from '../types';

const Translation: React.FC<TranslationProps> = ({ text, translatedText, language }) => {
    const [, setTranslation] = useState<string>('');
    const [toLanguage, setToLanguage] = useState<string>('Select language');
    const [translating, setTranslating] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [prevLanguage, setPrevLanguage] = useState<string>('Select language');
    const worker = useRef<Worker | null>(null);

    useEffect(() => {
        if (!worker.current && !isMobile) {
            worker.current = new Worker(new URL('../utils/translate.worker.js', import.meta.url), {
                type: 'module'
            })
        }

        const onMessageReceived = async (e: MessageEvent) => {
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
                    setTranslation((e.data.output as Array<{translation_text: string}>).map(x => x.translation_text).join(' '))
                    translatedText.current = (e.data.output as Array<{translation_text: string}>).map(x => x.translation_text).join(' ')
                    break;
            }
        }

        worker.current?.addEventListener('message', onMessageReceived)

        return () => worker.current?.removeEventListener('message', onMessageReceived)
    }, [translatedText])

    const generateTranslation = async (): Promise<void> => {
        if(translating || toLanguage === 'Select language') return  
        if(prevLanguage === toLanguage) return
        translatedText.current = ''
        setTranslating(true)
        setLoading(true)

        if (isMobile) {
            const translated = await translate(text, toLanguage);
            if (translated) {
                setTranslation(translated);
                translatedText.current = translated;
            }
        } else {
            worker.current?.postMessage({
                text: text,
                src_lang: 'eng_Latn',
                tgt_lang: toLanguage
            })
        }


        setTranslating(false)
        setLoading(false)
        setPrevLanguage(toLanguage)
    };

    return (
        <>
            {language.current && (
                <div className='flex flex-col gap-1 mb-4'>
                    <p className='text-xs sm:text-sm font-medium text-slate-500 mr-auto'>To language</p>
                    <div className='flex items-stretch gap-2 sm:gap-4'>
                        <select
                            value={language.current}
                            className='flex-1 outline-none w-full focus:outline-none bg-white duration-200 p-2 rounded cursor-pointer'
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
                        <button onClick={generateTranslation} className='specialBtn px-3 py-2 rounded-lg text-blue-400 hover:text-blue-600 duration-200 cursor-pointer'>Translate</button>
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
};

export default Translation;
