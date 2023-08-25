import React from 'react';
import { useRouter } from 'next/router';
import Landing from '@/components/landing/landing';
import { tableItemsData } from '@/components/Customers/customers';

const DetailPage = () => {
    const router = useRouter();
    const numberid = router.query.numberid;

    // Find the customer data based on the numberid
    const selectedCustomer = tableItemsData.find(item => item.numberid === numberid);

    return (
        <div>
            
            {selectedCustomer ? (
                <div>
                    <h1>Customer {numberid}</h1>
                    <Landing customer={selectedCustomer} />
                </div>
            ) : (
                <p className='text-5xl font-bold'>Customer not found.</p>
            )}
        </div>
    );
};

export default DetailPage;
