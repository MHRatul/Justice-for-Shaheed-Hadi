import React, { useState, useEffect } from 'react';
import { Share2, Facebook, Copy, CheckCircle } from 'lucide-react';
import { GiInjustice } from "react-icons/gi";

const CountdownTimer = ({ config }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareUrl, setShareUrl] = useState('');
    const [copied, setCopied] = useState(false);

    const targetDate = new Date(config.targetDate).getTime();

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const difference = now - targetDate;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                setTimeLeft({ days, hours, minutes, seconds });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    useEffect(() => {
        setShareUrl(window.location.href);
    }, []);

    const handleShare = () => {
        setShowShareModal(true);
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            alert('লিংক কপি হয়েছে!');
        }
    };

    const shareToFacebook = () => {
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        window.open(fbUrl, '_blank', 'width=600,height=400');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
            <div
                className="max-w-2xl w-full bg-white rounded-3xl
             shadow-[0_0_40px_rgba(255,255,255,0.8)]
             p-8 md:p-12 border border-red-100
             relative overflow-hidden"
                style={{
                    backgroundImage: "url('/justiceforhadi.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >

                {/* Overlay for transparency */}
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm"></div>


                {/* Content with relative positioning to stay above overlay */}
                <div className="relative z-10">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-full text-sm font-bold mb-12 shadow-lg">
                            <GiInjustice size={20} />
                            বিচারের দাবি
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4" style={{ lineHeight: '1.2' }}>
                            {config.title}
                        </h1>
                        <p className="text-lg md:text-xl text-gray-6900 font-medium">
                            {config.description}
                        </p>
                    </div>

                    {/* Countdown Display */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                        {[
                            { value: timeLeft.days, label: 'দিন' },
                            { value: timeLeft.hours, label: 'ঘন্টা' },
                            { value: timeLeft.minutes, label: 'মিনিট' },
                            { value: timeLeft.seconds, label: 'সেকেন্ড' }
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-center shadow-xl transform hover:scale-105 transition-all duration-300"
                            >
                                <div className="text-4xl md:text-5xl font-bold text-white mb-2 tabular-nums">
                                    {item.value}
                                </div>
                                <div className="text-sm md:text-base text-red-50 font-semibold">
                                    {item.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Share Button */}
                    <div className="text-center mb-8">
                        <button
                            onClick={handleShare}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-10 rounded-xl shadow-lg flex items-center gap-3 mx-auto transition-all duration-300 transform hover:scale-105"
                        >
                            <Share2 size={22} />
                            শেয়ার করুন
                        </button>
                    </div>

                    {/* Message */}
                    <div className="p-6 bg-gradient-to-r from-white-50 to-red-100 rounded-2xl border-l-4 border-red-600 shadow-inner backdrop-blur-sm bg-opacity-90">
                        <p className="text-gray-800 text-center leading-relaxed font-medium">
                            শহীদ ওসমান হাদির হত্যাকাণ্ডের ন্যায়বিচার নিশ্চিত করতে হবে।
                            প্রতিটি মুহূর্ত গণনা করা হচ্ছে যতক্ষণ না ন্যায়বিচার প্রতিষ্ঠিত হয়।
                        </p>
                    </div>
                </div>
            </div>

            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform animate-fadeIn">
                        <h3 className="text-3xl font-bold text-gray-900 mb-6">শেয়ার করুন</h3>

                        {/* URL Display */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                লিংক কপি করুন:
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={shareUrl}
                                    readOnly
                                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50 text-sm focus:outline-none focus:border-blue-500"
                                />
                                <button
                                    onClick={copyToClipboard}
                                    className="px-5 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-colors flex items-center gap-2 font-semibold"
                                >
                                    {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                                    {copied ? 'কপি হয়েছে' : 'কপি'}
                                </button>
                            </div>
                        </div>

                        {/* Share Buttons */}
                        <div className="space-y-3 mb-6">
                            <button
                                onClick={shareToFacebook}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg transform hover:scale-105"
                            >
                                <Facebook size={22} />
                                Facebook এ শেয়ার করুন
                            </button>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => setShowShareModal(false)}
                            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 rounded-xl transition-colors"
                        >
                            বন্ধ করুন
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CountdownTimer;