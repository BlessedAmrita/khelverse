'use client';
import React, { useState } from 'react';
import { Input, Button, Accordion, AccordionItem } from "@heroui/react";
import { MagnifyingGlassIcon, PlayCircleIcon, DocumentIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const faqs = [
    {
        question: "How do I create a training plan?",
        answer: "To create a training plan, go to the 'Training Plans' section and click 'Generate a New Plan'. You'll need to provide information about your goals, current fitness level, and preferences. The system will then create a personalized plan for you."
    },
    {
        question: "How can I connect with a coach?",
        answer: "Visit the 'Your Coach' section and use the search functionality to find coaches that match your requirements. You can filter by sport, experience level, and other criteria. Once you find a suitable coach, you can send them a connection request."
    },
    {
        question: "How do I participate in events?",
        answer: "Browse available events in the 'Events' section. You can filter events by type, location, and date. Click on an event to view details and register. Make sure to check the eligibility criteria before registering."
    },
    {
        question: "What is career guidance?",
        answer: "Career guidance helps athletes plan their professional journey. It includes advice on sponsorships, retirement planning, and career transitions. Access this feature through the 'Career Guidance' section."
    }
];

const videoTutorials = [
    {
        title: "Getting Started with KhelVerse",
        description: "Learn the basics of using KhelVerse",
        duration: "3:00",
        thumbnail: "https://res.cloudinary.com/dgj1gzq0l/image/upload/v1749739333/logooo_kaacyj.jpg",
        videoUrl: "https://www.youtube.com/embed/5erx-DQRUaY"
    },
    {
        title: "Creating Your First Training Plan",
        description: "Step-by-step guide to creating a training plan",
        duration: "7:15",
        thumbnail: "https://res.cloudinary.com/dpmlrxlzr/image/upload/v1749750145/Screenshot_2025-06-12_231127_nz9mfm.png"
    },
    {
        title: "Connecting with Coaches",
        description: "How to find and connect with the right coach",
        duration: "6:45",
        thumbnail: "https://res.cloudinary.com/dgj1gzq0l/image/upload/v1749724002/Yourcoach_connected_xdpedy.png"
    }
];

function HelpCenter() {
    const [searchQuery, setSearchQuery] = useState('');
    const [openVideo, setOpenVideo] = useState(null);

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="relative min-h-screen w-full">
            {/* Background image and overlay */}
            <div className="absolute inset-0 -z-10 bg-black">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
                    style={{ backgroundImage: "url('https://res.cloudinary.com/dgj1gzq0l/image/upload/v1747821491/new_bg_bz1uqj.svg')" }}
                />
                <div className="absolute inset-0 bg-black/70" />
            </div>
            <div className="max-w-7xl mx-auto px-4 py-10">
                <h1 className="text-4xl font-sprintura text-center mb-8 text-white">Help Center</h1>

                {/* Search Bar */}
                <div className="relative max-w-2xl mx-auto mb-12">
                    <Input
                        type="text"
                        placeholder="Search for help..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-apts-dark border-apts-purple text-white"
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <button className="flex items-center justify-center p-6 bg-apts-purple-dark text-white hover:bg-apts-purple pulse-btn rounded-xl transition-all w-full">
                        <PlayCircleIcon className="h-6 w-6 mr-2" />
                        <span>Video Tutorials</span>
                    </button>
                    <button
                        className="flex items-center justify-center p-6 bg-apts-purple-dark text-white hover:bg-apts-purple pulse-btn rounded-xl transition-all w-full"
                        onClick={() => window.open('https://drive.google.com/file/d/1Qiab_CLKRRDNrP0oslQwsLr2f9dyqa1C/view?usp=sharing', '_blank')}
                    >
                        <DocumentIcon className="h-6 w-6 mr-2" />
                        <span>Documentation</span>
                    </button>
                    <button className="flex items-center justify-center p-6 bg-apts-purple-dark text-white hover:bg-apts-purple pulse-btn rounded-xl transition-all w-full">
                        <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2" />
                        <span>Contact Support</span>
                    </button>
                </div>

                {/* Video Tutorials */}
                <section className="mb-12">
                    <h2 className="text-2xl font-sprintura mb-6 text-white">Video Tutorials</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {videoTutorials.map((video, index) => (
                            <div
                                key={index}
                                className="bg-apts-dark rounded-xl overflow-hidden shadow-lg cursor-pointer hover:ring-2 hover:ring-apts-purple/60 transition-all"
                                onClick={() => video.videoUrl && setOpenVideo(video)}
                            >
                                <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <h3 className="font-semibold mb-2 text-white">{video.title}</h3>
                                    <p className="text-gray-400 text-sm mb-2">{video.description}</p>
                                    <span className="text-apts-purple text-sm">{video.duration}</span>
                                    {video.videoUrl && (
                                        <button
                                            className="ml-4 text-apts-purple underline"
                                            onClick={e => { e.stopPropagation(); setOpenVideo(video); }}
                                        >
                                            Watch
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Video Modal */}
                {openVideo && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                        <div className="bg-black rounded-xl p-4 max-w-2xl w-full relative">
                            <button
                                className="absolute top-2 right-2 text-white text-2xl"
                                onClick={() => setOpenVideo(null)}
                            >
                                ×
                            </button>
                            <div className="aspect-w-16 aspect-h-9 w-full h-96">
                                <iframe
                                    src={openVideo.videoUrl}
                                    title={openVideo.title}
                                    frameBorder="0"
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                    className="w-full h-full rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* FAQs */}
                <section>
                    <h2 className="text-2xl font-sprintura mb-6 text-white">Frequently Asked Questions</h2>
                    <Accordion>
                        {filteredFaqs.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                title={<span className="text-white px-6 py-4 block">{faq.question}</span>}
                                className="mb-4 bg-apts-dark rounded-xl border border-apts-purple/40"
                            >
                                <p className="p-4 text-white">{faq.answer}</p>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </section>

                {/* Contact Support */}
                <section className="mt-12 text-center">
                    <h2 className="text-2xl font-sprintura mb-4 text-white">Still Need Help?</h2>
                    <p className="text-gray-400 mb-6">Our support team is here to help you 24/7</p>
                    <button className="bg-apts-purple-dark hover:bg-apts-purple pulse-btn text-white px-8 py-3 rounded-xl font-semibold transition-all">
                        Contact Support
                    </button>
                </section>
            </div>
        </div>
    );
}

export default HelpCenter; 