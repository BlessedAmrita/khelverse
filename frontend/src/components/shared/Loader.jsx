import React from 'react'

function Loader() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-apts-black">
            <div className="text-center">
                <div className="w-16 h-16 border-t-4 border-apts-purple rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-apts-white text-lg font-sprintura">TRACK. TRAIN. TRIUMPH</p>
            </div>
        </div>
    )
}

export default Loader