import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
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
    <div className="flex justify-center items-start h-screen mt-10">
      <div>
        {customer && (
          <div>
            {/* Find the sale (item) with the specified numberid */}
            {customer.data && customer.data.length > 0 && (
              <div>
                {customer.data.map((item) => {
                  if (item.numberid === numberid) {
                    return (
                      <div key={item.numberid}>
                        <table className="border-2 border-black w-full">
                          <tbody>
                            <tr>
                              <td className="border-2 border-black p-6 px-40 text-center">
                                <div className='text-5xl font-bold font-serif'>
                                  JAI LIME & CHEMICALS
                                </div>
                                <div>
                                  H-1, 503, Road No 15, Bhamashah Ind. Area, Kaladwas, Udaipur
                                </div>
                                <div>
                                  Mo. : 99508 35585, 85296 22695
                                </div>
                                <div>
                                  GST No. 08ADVPJ9429L1ZL &nbsp; &nbsp; Email: jailime79@gmail.com
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BillPage;
