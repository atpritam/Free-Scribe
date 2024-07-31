import React from 'react'

const Header = (props) => {
    const {isAudioAvailable} = props
    return (
        <header className='flex items-center justify-between gap-4 p-4'>
            <a href="/"><h1 className='font-medium'>Free<span className='text-blue-400 bold'>Scribe</span></h1></a>
            {
                isAudioAvailable  ? 
                (
                <div className='gap-4 flex items-center '>
                    <a href="/" className='flex items-center gap-2 specialBtn px-3 py-2 rounded-lg text-blue-400'>
                        <p>New</p>
                        <i className="fa-solid fa-plus"></i>
                    </a>
                </div>
                ) :
                ('')
            }
        </header>
    )
}

export default Header