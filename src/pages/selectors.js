import React from 'react';
import { useRouter } from 'next/router';
import backnavi from '../../public/backnavi.png';
import Image from 'next/image';

const Selectors = () => {
    const router = useRouter();

    const handleCustomerClick = () => {
        router.push('/customers');
    };

    const handleLabourClick = () => {
        router.push('/labours');
    };

    const headingStyle = {
        background: 'linear-gradient(95deg, #F0BF12 4.71%, #F98214 81.93%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    };

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
            <Image src={backnavi} alt="Background Image" className='h-screen w-screen' />

            {/* Content to overlay on the image */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <div>
                    <div className='text-3xl mt-10 text-center text-yellow-400 font-bold absolute bottom-[190px] w-96 right-44' style={headingStyle}>
                        Our High Quality Organic Products
                    </div>
                    <div class='absolute text-white w-96 text-lg text-center right-[170px] bottom-[-90px]'>We offer premium, all-natural products of the highest quality, cultivated through organic farming practices. Our commitment to organic standards ensures that our customers receive the healthiest and most environmentally-friendly options available. Experience the pure and unadulterated goodness of our organic offerings today.</div>
                    <button className='absolute top-[120px] right-60 w-60'>
                        <a
                            className="group relative inline-flex items-center overflow-hidden rounded px-8 py-3 text-white focus:outline-none focus:ring active:bg-indigo-500"
                            href="https://visionjain.github.io/Microsoft-future-ready-talent-project/"
                            style={{
                                background: 'linear-gradient(313deg, #F98214 -15.02%, rgba(249, 130, 20, 0.00) 137.34%)',
                                borderRadius: '66px',
                                border: '2px solid #EA760C',
                            }}
                        >
                            <span className="absolute -end-full transition-all group-hover:end-4">
                                <svg
                                    className="h-5 w-5 rtl:rotate-180"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                                    />
                                </svg>
                            </span>

                            <span className="text-sm font-medium transition-all group-hover:me-4">
                                Know More
                            </span>
                        </a>
                    </button>

                    <div className='text-3xl left-48 bottom-[190px] mt-10 text-center text-yellow-400 font-bold absolute w-96' style={headingStyle}>
                    Make an Energy-Efficient Home With Us
                    </div>
                    <div class='absolute text-lg text-white bottom-[-70px] w-96 ml-48 text-center mt-20'>Partner with us to create your energy-efficient dream home. Our experts use sustainable materials and innovative designs to maximize energy efficiency, reduce carbon footprint, and lower utility costs. Join us in building a comfortable, eco-friendly sanctuary that benefits your wallet and the planet.</div>

                    <div>
                        <button className='absolute top-[120px] left-64 w-60'>
                            <a
                                className="group relative inline-flex items-center overflow-hidden rounded px-8 py-3 text-white focus:outline-none focus:ring active:bg-indigo-500"
                                href="https://visionjain.github.io/Microsoft-future-ready-talent-project/"
                                style={{
                                    background: 'linear-gradient(313deg, #F98214 -15.02%, rgba(249, 130, 20, 0.00) 137.34%)',
                                    borderRadius: '66px',
                                    border: '2px solid #EA760C',
                                }}
                            >
                                <span className="absolute -end-full transition-all group-hover:end-4">
                                    <svg
                                        className="h-5 w-5 rtl:rotate-180"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                                        />
                                    </svg>
                                </span>

                                <span className="text-sm font-medium transition-all group-hover:me-4">
                                    Know More
                                </span>
                            </a>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Selectors;
