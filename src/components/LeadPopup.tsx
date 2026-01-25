import React, { useState, useEffect } from 'react';

const LeadPopup = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        // Check if valid session
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 10000); // 10 seconds

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 z-[100] flex flex-col items-start gap-4">
            {/* Expanded Message Box */}
            {isExpanded && (
                <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-6 shadow-2xl mb-2 w-72 animate-in fade-in slide-in-from-bottom-4 duration-300 relative">
                    <button
                        onClick={() => setIsExpanded(false)}
                        className="absolute top-2 right-2 text-white/30 hover:text-white transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <h3 className="text-white font-bold text-lg mb-2 leading-tight">
                        Не знайшли те, що шукали?
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                        Наш експерт допоможе підібрати ідеальний варіант за 5 хвилин!
                    </p>

                    <a
                        href="tel:0970977774"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-white text-black font-bold uppercase tracking-wider text-xs rounded hover:bg-gray-200 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Зателефонувати
                    </a>
                </div>
            )}

            {/* Pulsing Trigger Button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="group relative flex items-center justify-center w-14 h-14 bg-white rounded-full text-black shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-110 transition-transform duration-300"
            >
                {!isExpanded && (
                    <span className="absolute inset-0 rounded-full bg-white opacity-40 animate-ping"></span>
                )}

                {isExpanded ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                )}
            </button>
        </div>
    );
};

export default LeadPopup;
