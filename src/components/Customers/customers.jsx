import React, { useState, useEffect } from 'react';
import axios from 'axios';



const Customers = ({ customer }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [customerData, setCustomerData] = useState([]);
    const [isAddingData, setIsAddingData] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCustomerData = customerData.customer
        ? customerData.customer.filter((customer) =>
            customer.customerid.includes(searchQuery) ||
            customer.customername.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/getcustomer');
                setCustomerData(response.data);
                setIsLoading(false); // Turn off loading state after data fetch
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsLoading(false); // Turn off loading state on error as well
            }
        };
        fetchData();
    }, []);



    const reassignCustomerIds = (newCustomerData) => {
        newCustomerData.forEach((customer, index) => {
            customer.customerid = (index + 1).toString();
        });
    };


    const handleEditClick = (index) => {
        setIsEditing(true);
        setEditingIndex(index);
        const customerToEdit = filteredCustomerData[index];
        setNewData({
            customerid: customerToEdit.customerid,
            customername: customerToEdit.customername,
            phoneno: customerToEdit.phoneno,
        });
    };



    const handleDeleteClick = async (customerid) => {
        const shouldDelete = window.confirm("Are you sure you want to delete this customer?");
        if (!shouldDelete) {
            return; // If user cancels deletion, do nothing
        }

        try {
            await axios.delete(`/api/deletecustomer?customerid=${customerid}`);

            // Update customerData state after successful deletion
            const updatedCustomerData = customerData.customer.filter(customer => customer.customerid !== customerid);
            reassignCustomerIds(updatedCustomerData); // Reassign customer IDs
            setCustomerData({ customer: updatedCustomerData });

            // Call the updateCustomerIds API to reassign customer IDs in the database
            await axios.post('/api/updateCustomerIds');
        } catch (error) {
            console.error("Error deleting customer:", error);
        }
    };







    const [newData, setNewData] = useState({
        customerid: '',
        customername: '',
        phoneno: '',
    });




    const handleAddDataClick = () => {
        setIsAddingData(true);
        setNewData({
            customerid: '',
            customername: '',
            phoneno: '',
        });
        setEditingIndex(null);
    };


    const handleViewData = (customerid) => {
        // Navigate to the DetailPage with the corresponding customerid
        window.location.href = `/customers/${customerid}`;
    };




    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setNewData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAddCustomer = async () => {
        try {
            // Construct the new customer data
            const newCustomerData = {
                customerid: (customerData.customer.length + 1).toString(), // Generate a new customer id
                customername: newData.customername,
                phoneno: newData.phoneno,
                data: [] // Initialize with an empty array for other data
            };

            const response = await axios.post('/api/addcustomer', [newCustomerData]);

            // Update customerData state after successful add
            fetchData();
            setIsAddingData(false);
            setNewData({
                customerid: '',
                customername: '',
                phoneno: '',
            });
        } catch (error) {
            console.error("Error adding customer:", error);
        }
    };

    const handleUpdateCustomer = async () => {
        try {

            const response = await axios.put(
                `/api/updatecustomer?customerid=${newData.customerid}`,
                newData
            );

            // Update customerData state after successful update
            fetchData();
            setIsEditing(false);
            setEditingIndex(null);
            setNewData({
                customerid: '',
                customername: '',
                phoneno: '',
            });
        } catch (error) {
            console.error("Error updating customer:", error);
        }
    };
    const handleSaveChanges = async () => {
        try {
            const shouldSubmit = window.confirm("Are you sure you want to save the changes?");
            if (!shouldSubmit) {
                return; // User canceled submission
            }

            await handleUpdateCustomer(); // Call the update handler

            // Close the edit block and reset new data
            setIsEditing(false);
            setEditingIndex(null);
            setNewData({
                customerid: '',
                customername: '',
                phoneno: '',
            });

            // Fetch the data again to reflect changes
            fetchData();
        } catch (error) {
            console.error("Error saving changes:", error);
        }
    };


    const handleFormSubmit = () => {

        if (isEditing) {
            handleUpdateCustomer();
        } else {
            handleAddCustomer();
        }
    };





    return (
        <div>
            {isLoading ? ( // Display loading indicator if isLoading is true
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-blue-500"></div>
                </div>
            ) : (
                <div className='pt-10 pb-10'>

                    <div className="w-full px-4 md:px-8">
                        <div className="items-start justify-between md:flex">
                            <div className="max-w-lg">
                                <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
                                    All Customers
                                </h3>
                            </div>
                            <div className="mt-3 md:mt-0">
                                <a
                                    className="cursor-pointer inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm"
                                    onClick={handleAddDataClick}
                                >
                                    Add Customer
                                </a>
                            </div>
                        </div>

                        <div className="mt-10">
                            <input
                                type="text"
                                placeholder="Search by S.NO. or Customers Name"
                                value={searchQuery}
                                onChange={event => setSearchQuery(event.target.value)}
                                className="border p-2 rounded-md w-full"
                            />
                        </div>
                        <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
                            <table className="w-full table-auto text-sm text-left">
                                <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                                    <tr>
                                        <th className="py-3 px-6">S. NO.</th>
                                        <th className="py-3 px-6">Customers Name</th>
                                        <th className="py-3 px-6">Contact No.</th>
                                        <th className="py-3 px-6">View Data</th>
                                        <th className="py-3 px-6"></th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-600 divide-y">
                                    {filteredCustomerData.map((item, _id) => (
                                        <tr key={_id} className="divide-x">
                                            <td className="px-6 py-4 whitespace-nowrap">{item.customerid}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{item.customername}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{item.phoneno}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleViewData(item.customerid)}
                                                    className="px-4 py-2 text-white bg-green-600 rounded-lg duration-150 hover:bg-green-700 active:shadow-lg"
                                                >
                                                    View Data
                                                </button>

                                            </td>
                                            <td className="text-right px-6 whitespace-nowrap">
                                                {isEditing && editingIndex === _id ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            name="customername"
                                                            value={newData.customername}
                                                            onChange={handleFormChange}
                                                            className="border p-2 rounded-md"
                                                        />
                                                        <input
                                                            type="tel"
                                                            name="phoneno"
                                                            value={newData.phoneno}
                                                            onChange={handleFormChange}
                                                            className="border p-2 rounded-md"
                                                        />
                                                        <button
                                                            onClick={handleSaveChanges} // Use the handler directly here
                                                            className="py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setIsEditing(false);
                                                                setEditingIndex(null);
                                                                setNewData({
                                                                    customerid: '',
                                                                    customername: '',
                                                                    phoneno: '',
                                                                });
                                                            }}
                                                            className="ml-2 text-gray-600 hover:text-gray-800"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleEditClick(_id)} // Pass the index to the handler
                                                            className="py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(item.customerid)}
                                                            className="py-2 leading-none px-3 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg"
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {isAddingData && (
                        <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white p-6 rounded-lg">
                                <h2 className="text-xl font-semibold mb-4">Add New Customer</h2>
                                <form onSubmit={handleFormSubmit}>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            name="customername"
                                            placeholder="Customers Name"
                                            value={newData.customername} // Corrected value attribute
                                            onChange={handleFormChange}
                                            className="border p-2 rounded-md"
                                        />
                                        <input
                                            type="tel"
                                            name="phoneno"
                                            placeholder="Contact No."
                                            value={newData.phoneno} // Corrected value attribute
                                            onChange={handleFormChange}
                                            className="ml-2 border p-2 rounded-md"
                                        />
                                    </div>
                                    <div className="flex mt-4">
                                        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
                                            Add
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsAddingData(false)}
                                            className="ml-2 text-gray-600 hover:text-gray-800"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>)}
        </div>
    );
};


export default Customers;
