import React from 'react';

const Banner = () => {
    return (
        <div className="w-full relative">
            <div
                className="w-full h-32 sm:h-40 md:h-56 lg:h-72 xl:h-80 bg-cover bg-center relative"
                style={{
                    backgroundImage: "url('/newbanner1.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Dark overlay for better text visibility */}
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Banner content (optional) */}
                <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                    <div className="text-white">
                        {/* Uncomment if you want to add text */}
                        {/* <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 drop-shadow-lg">
                            শহীদ ওসমান হাদি
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg lg:text-2xl font-semibold drop-shadow-md">
                            ন্যায়বিচারের জন্য আমাদের সংগ্রাম অব্যাহত থাকবে
                        </p> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;