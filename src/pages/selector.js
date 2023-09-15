import React from 'react';
import { useRouter } from 'next/router';

const Selector = () => {
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
        <div className="flex flex-row items-center justify-center h-screen bg-black">
            <div
                className='bg-green-800 ml-10 text-white w-[600px] h-[600px] rounded-3xl text-center justify-center'
                style={{
                    backgroundImage: 'linear-gradient(313deg, rgba(249, 130, 20, 0.1) -15.02%, rgba(20, 249, 130, 0.4) 137.34%), url("https://kj1bcdn.b-cdn.net/media/10157/modern-harvesting-machines.jpg")',
                    backgroundSize: 'cover', // Ensure the image covers the entire element
                    backgroundPosition: 'center', // Center the image
                    opacity: '0.7', // Adjust the opacity (0.7 means 70% opacity)
                }}
            >
                <div className='text-3xl mt-10 text-yellow-400 font-bold ml-32 w-[60%]' style={headingStyle}>
                    Our High Quality Organic Products
                </div>
                <div class='w-96 ml-28 mt-20'>We offer premium, all-natural products of the highest quality, cultivated through organic farming practices. Our commitment to organic standards ensures that our customers receive the healthiest and most environmentally-friendly options available. Experience the pure and unadulterated goodness of our organic offerings today.</div>
                <button className='absolute bottom-[100px] left-96'>
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
            <div
                className='bg-green-800 ml-10 text-white w-[600px] h-[600px] rounded-3xl text-center justify-center'
                style={{
                    backgroundImage: 'linear-gradient(313deg, rgba(249, 130, 20, 0.4) -15.02%, rgba(20, 249, 130, 0.4) 137.34%), url("https://nicholas.duke.edu/sites/default/files/styles/banner/public/images/energyiStock-952105020_0.jpg?h=f7dc1c74&itok=Ge8YAJLm")',
                    backgroundSize: 'cover', // Ensure the image covers the entire element
                    backgroundPosition: 'center', // Center the image
                }}
            >
                <div className='text-3xl mt-10 text-yellow-400 font-bold ml-32 w-[60%]' style={headingStyle}>
                    Make an Energy-Efficient Home With Us
                </div>
                <div class='w-96 ml-28 mt-20'>Partner with us to create your energy-efficient dream home. Our experts use sustainable materials and innovative designs to maximize energy efficiency, reduce carbon footprint, and lower utility costs. Join us in building a comfortable, eco-friendly sanctuary that benefits your wallet and the planet.</div>

                <div>
                    <button className='absolute bottom-[100px] right-[370px]' href="https://visionjain.github.io/Microsoft-future-ready-talent-project/">
                        <a
                            className="group relative inline-flex items-center overflow-hidden rounded bg-indigo-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-indigo-500"
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

                            <span className="text-sm font-medium transition-all group-hover:me-4" >
                                Know More
                            </span>
                        </a>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Selector;
