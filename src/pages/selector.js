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

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold mb-6">Select Dashboard</h1>
            <button
                className="bg-blue-500 hover:bg-blue-600 text-white text-2xl font-bold p-10 px-20 rounded mb-4"
                onClick={handleCustomerClick}
            >
                Customers
            </button>
            <button
                className="bg-green-500 hover:bg-green-600 text-white text-2xl font-bold p-10 px-24 rounded mt-4"
                onClick={handleLabourClick}
            >
                Labours
            </button>
        </div>
    );
}

export default Selector;
