import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const BillPage = () => {
  const router = useRouter();
  const { customerid, numberid } = router.query;
  const [customer, setCustomer] = useState(null);

  // Fetch the customer data for the specified customerid
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/getcustomer`);
        const allCustomerData = response.data.customer;

        // Find the customer that matches the current customer ID (customerid)
        const matchingCustomer = allCustomerData.find((customer) => customer.customerid === customerid);

        if (matchingCustomer) {
          setCustomer(matchingCustomer); // Set the matching customer object
        } else {
          console.error('Customer not found');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [customerid]);

  // Render the component
  return (
    <div className="flex justify-center items-start h-screen mx-10 mt-10">
      {customer && (
        <div className="w-full">
          <table className="border-2 border-black w-full mb-6">
            <tbody>
              <tr>
                <td className="border-2 border-black p-6 px-40 text-center" colSpan="4">
                  <div className="text-5xl font-bold font-serif">JAI LIME & CHEMICALS</div>
                  <div>H-1, 503, Road No 15, Bhamashah Ind. Area, Kaladwas, Udaipur</div>
                  <div>Mo. : 99508 35585, 85296 22695</div>
                  <div>GST No. 08ADVPJ9429L1ZL &nbsp; &nbsp; Email: jailime79@gmail.com</div>
                </td>
              </tr>
              {customer.data &&
                customer.data.length > 0 &&
                customer.data.map((item) => {
                  if (item.numberid === numberid) {
                    return (
                      <React.Fragment key={item.numberid}>
                        <tr>
                          <td className="border-2 border-black p-2" style={{ width: '20%' }}>
                            Challan No.
                          </td>
                          <td className="border-2 border-black p-2" style={{ width: '30%' }}>
                            {item.numberid}
                          </td>
                          <td className="border-2 border-black p-2" style={{ width: '20%' }}>
                            Sales Date
                          </td>
                          <td className="border-2 border-black p-2" style={{ width: '30%' }}>
                            {item.salesdate}
                          </td>
                        </tr>
                        <tr>
                          <td className="border-2 border-black p-2" style={{ width: '20%' }}>
                            Client Name
                          </td>
                          <td className="border-2 border-black p-2" style={{ width: '30%' }}>
                            {customer.customername}
                          </td>
                          <td className="border-2 border-black p-2" style={{ width: '20%' }}>
                            Driver Name
                          </td>
                          <td className="border-2 border-black p-2" style={{ width: '30%' }}>
                            {item.drivername}
                          </td>
                        </tr>
                        <tr>
                          <td className="border-2 border-black p-2" style={{ width: '20%' }}>
                            Vehical No.
                          </td>
                          <td className="border-2 border-black p-2" style={{ width: '30%' }}>
                            {item.autono}
                          </td>
                          <td className="border-2 border-black p-2" style={{ width: '20%' }}>
                            K.M.
                          </td>
                          <td className="border-2 border-black p-2" style={{ width: '30%' }}>
                            {item.km}
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  }
                  return null;
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BillPage;
