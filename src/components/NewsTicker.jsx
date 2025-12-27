import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ImNewspaper } from "react-icons/im";
import { FaGenderless } from "react-icons/fa6";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const NewsTicker = () => {
    const [newsItems, setNewsItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await axios.get(`${API_URL}/news`);
            setNewsItems(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch news:', error);
            // Fallback to default news if API fails
            setNewsItems([
                { id: 1, content: "শহীদ ওসমান হাদির হত্যাকাণ্ডের বিচার দাবিতে দেশব্যাপী আন্দোলন অব্যাহত" },
                { id: 2, content: "ন্যায়বিচার নিশ্চিত না হওয়া পর্যন্ত আন্দোলন চলবে" },
                { id: 3, content: "সকল শহীদদের স্মরণে আমরা প্রতিজ্ঞাবদ্ধ" },
            ]);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full bg-red-600 text-white py-3">
                <div className="flex items-center justify-center">
                    <span className="text-sm">খবর লোড হচ্ছে...</span>
                </div>
            </div>
        );
    }

    if (newsItems.length === 0) {
        return null;
    }

    return (
        <div className="w-full bg-red-600 text-white py-3 overflow-hidden">
            <div className="flex items-center">
                <div className="bg-red-800 px-6 py-2 font-bold flex-shrink-0">
                    <span className="text-sm md:text-base flex items-center gap-2">
                        <ImNewspaper className="text-lg" />
                        সর্বশেষ খবর
                    </span>
                </div>
                <div className="flex-1 overflow-hidden ml-4">
                    <div className="animate-scroll whitespace-nowrap inline-block">
                        {newsItems.map((news) => (
                            <span key={news.id} className="inline-flex items-center gap-2 mx-8 text-sm md:text-base">
                                <FaGenderless className="text-xs" />
                                {news.content}
                            </span>
                        ))}
                        {/* Duplicate for seamless loop */}
                        {newsItems.map((news) => (
                            <span key={`dup-${news.id}`} className="inline-flex items-center gap-2 mx-8 text-sm md:text-base">
                                <FaGenderless className="text-xs" />
                                {news.content}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsTicker;