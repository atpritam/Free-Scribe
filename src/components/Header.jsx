'use client';

import React from 'react';
import Link from 'next/link';

const Header = (props) => {
    const { handleNew } = props;

    return (
        <header className='flex items-center justify-between gap-4 p-4'>
            <Link href="/">
                <h1 className='font-medium'>
                    Free<span className='text-blue-400 font-bold'>Scribe</span>
                </h1>
            </Link>
            <div className='flex items-center gap-4'>
                <a 
                    href="https://buymeacoffee.com/pritamchk" 
                    target='_blank' 
                    className='text-slate-600 cursor-pointer' 
                    rel="noreferrer"
                >
                    Donate
                </a>
                <Link 
                    href="/"
                    className={`specialBtn flex items-center gap-2 px-3 py-2 rounded-lg text-blue-400 cursor-pointer transition-opacity duration-300`}
                >
                    <p>New</p>
                    <i className="fa-solid fa-plus"></i>
                </Link>
            </div>
        </header>
    );
}

export default Header;
