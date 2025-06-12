'use client';

import React, { useState } from 'react';

const helpContent = {
    athlete: {
        title: 'Need Help?',
        content: `
      <ul>
        <li><b>Training Plans:</b> Generate, view, and manage your personalized plans.</li>
        <li><b>Coach Connection:</b> Find and connect with experienced coaches.</li>
        <li><b>Events:</b> Register and participate in sports events.</li>
        <li><b>Career Guidance:</b> Get advice, job listings, and sponsorship info.</li>
        <li><b>KhelBot:</b> Chat for instant support and tips.</li>
      </ul>
    `,
        moreLink: '/help',
    },
    coach: {
        title: 'Need Help?',
        content: `
      <ul>
        <li><b>Athlete Profiles:</b> View and manage your connected athletes.</li>
        <li><b>Training Plans:</b> Review, approve, and give feedback on plans.</li>
        <li><b>Sessions:</b> Schedule and manage training sessions.</li>
        <li><b>Events:</b> Create and manage events for your athletes.</li>
        <li><b>KhelBot:</b> Chat for instant support and tips.</li>
      </ul>
    `,
        moreLink: '/help',
    },
};

export default function FloatingHelpButton({ role = 'athlete', pageHelp }) {
    const [open, setOpen] = useState(false);
    const help = helpContent[role] || helpContent.athlete;

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setOpen(true)}
                aria-label="Help"
                className="fixed z-50 bottom-32 right-8 bg-apts-purple text-white rounded-full p-4 shadow-lg hover:bg-apts-purple-dark transition-all"
                style={{ boxShadow: '0 4px 24px rgba(80, 0, 120, 0.15)' }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>

            {/* Modal/Popover */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-end justify-end pointer-events-none">
                    <div
                        className="bg-black/40 fixed inset-0 pointer-events-auto"
                        onClick={() => setOpen(false)}
                    />
                    <div
                        className="m-8 mb-40 max-w-sm w-full bg-transparent backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-6 pointer-events-auto flex flex-col gap-3"
                        style={{ right: 0, bottom: 0, position: 'fixed' }}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-bold text-apts-purple font-sprintura">Need Help?</h2>
                            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-apts-purple text-xl font-bold">×</button>
                        </div>
                        <div className="text-white text-sm" dangerouslySetInnerHTML={{ __html: pageHelp || help.content }} />
                        <a
                            href={help.moreLink}
                            className="mt-2 text-apts-purple hover:underline text-sm font-medium self-end"
                            onClick={() => setOpen(false)}
                        >
                            Learn more
                        </a>
                    </div>
                </div>
            )}
        </>
    );
} 