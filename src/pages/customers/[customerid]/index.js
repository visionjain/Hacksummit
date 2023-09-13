import React, { useState, useEffect, useRef } from 'react';
import { calculateDRAndBalance } from '../../../components/landing/calculateDRAndBalance';
import { useRouter } from 'next/router';
import ExcelGenerator from '../../../components/landing/ExcelGenerator';
import axios from 'axios';





const Landing = () => {
    const [customer, setCustomer] = useState(null);
    const [isLoading, setIsLoading] = useState(true);


    const router = useRouter();
    const customerid = router.query.customerid;


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/getcustomer');
                const allCustomerData = response.data.customer;

                // Find the customer that matches the current customer ID (slug)
                const matchingCustomer = allCustomerData.find(customer => customer.customerid === customerid);

                if (matchingCustomer) {
                    setCustomer(matchingCustomer); // Set the matching customer object
                    setIsLoading(false); // Turn off loading state after data fetch
                } else {
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            }
        };
        fetchData();
    }, [customerid]);


    // ...
    const [initialBalance, setInitialBalance] = useState(0);

    // ...

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/getcustomer');
                const allCustomerData = response.data.customer;

                // Find the customer that matches the current customer ID (slug)
                const matchingCustomer = allCustomerData.find(customer => customer.customerid === customerid);

                if (matchingCustomer) {
                    // Check if the customer object has an initialbalance property and parse it to a float
                    const customerInitialBalance = parseFloat(matchingCustomer.initialbalance || 0);
                    setInitialBalance(customerInitialBalance);

                    setCustomer(matchingCustomer); // Set the matching customer object
                    setIsLoading(false); // Turn off loading state after data fetch
                } else {
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            }
        };
        fetchData();
    }, [customerid]);








    const handlePrint = () => {
        window.print();
    };


    const [initialCalculationDone, setInitialCalculationDone] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const filteredTableItems = customer && customer.data
        ? customer.data.filter(item =>
            item.numberid.includes(searchQuery) ||
            item.salesdate.includes(searchQuery) ||
            item.drivername.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];



    const prevCustomerDataRef = useRef();
    useEffect(() => {
        const calculateDRAndBalance = (data, previousBalance) => {
            const totalProductAmount =
                (valueToNumber(data.Limea) * valueToNumber(data.LimeaPrice)) +
                (valueToNumber(data.Limew) * valueToNumber(data.LimewPrice)) +
                (valueToNumber(data.Limeb) * valueToNumber(data.LimebPrice)) +
                (valueToNumber(data.Limeoffw) * valueToNumber(data.LimeoffwPrice)) +
                (valueToNumber(data.jhiki) * valueToNumber(data.jhikiPrice)) +
                (valueToNumber(data.rs) * valueToNumber(data.rsPrice));

            const dr = (totalProductAmount + valueToNumber(data.autocharge) + valueToNumber(data.labourcharge)).toFixed(2);
            const cr = valueToNumber(data.cr) || 0;
            const balance = (previousBalance + valueToNumber(dr) - valueToNumber(cr)).toFixed(2);


            return { dr, balance };
        };



        if (customer && customer.data) {
            let previousBalance = initialBalance;

            const updatedItemsWithBalance = customer.data.map(item => {
                const { dr, balance } = calculateDRAndBalance(item, previousBalance);
                previousBalance = parseFloat(balance);

                return {
                    ...item,
                    dr,
                    balance,
                };
            });

            // Only update the state if the customer data has changed
            if (JSON.stringify(customer.data) !== JSON.stringify(prevCustomerDataRef.current)) {
                setCustomer(prevCustomer => ({
                    ...prevCustomer,
                    data: updatedItemsWithBalance,
                }));

                prevCustomerDataRef.current = customer.data; // Update the ref
            }

            setInitialCalculationDone(true);
        }
    }, [customer, initialBalance]);


    const [isAddingData, setIsAddingData] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);

    const handleEditClick = (index) => {
        setEditingIndex(index);
        setNewData(customer.data[index]);
        setIsAddingData(true);
    };

    const handleDeleteClick = async (index, _id) => {
        const shouldDelete = window.confirm("Are you sure you want to delete this item?");
        if (shouldDelete) {
            try {
                await axios.delete(`/api/deleteitem?customerid=${customer.customerid}&_id=${_id}`);

                // Update the local state after successful deletion
                const updatedTableItems = customer.data.filter((item, idx) => idx !== index);
                setCustomer(prevCustomer => ({
                    ...prevCustomer,
                    data: updatedTableItems,
                }));
                window.location.reload(true);
            } catch (error) {
                console.error('Error deleting data entry:', error);
            }
        }
    };






    const [newData, setNewData] = useState({
        numberid: '',
        salesdate: '',
        drivername: '',
        autono: '',
        km: '',
        Limea: '',
        LimeaPrice: '',
        Limew: '',
        LimewPrice: '',
        Limeb: '',
        LimebPrice: '',
        Limeoffw: '',
        LimeoffwPrice: '',
        jhiki: '',
        jhikiPrice: '',
        rs: '',
        rsPrice: '',
        siteaddress: '',
        labourcharge: '',
        autocharge: '',
        amount: '',
        dr: '',
        cr: '',
        balance: '',
    });



    const handleAddDataClick = () => {
        setIsAddingData(true);
        setEditingIndex(null); // Clear editing index when adding new data
    };



    const handleFormChange = (event) => {
        const { name, value } = event.target;

        let updatedNewData = { ...newData };
        updatedNewData[name] = value;
        // updatedNewData.cr = updatedNewData.cr || '0.00';

        const products = ["Limea", "LimeaPrice", "Limew", "LimewPrice", "Limeb", "LimebPrice", "Limeoffw", "LimeoffwPrice", "jhiki", "jhikiPrice", "rs", "rsPrice"];
        let totalAmount = 0;

        products.forEach((product, index) => {
            const valueName = product;
            const priceName = product + "Price";

            const productValue = valueToNumber(updatedNewData[valueName]);
            const productPrice = valueToNumber(updatedNewData[priceName]);
            if (!isNaN(productValue) && !isNaN(productPrice)) {
                const totalProductAmount =
                    (valueToNumber(updatedNewData.Limea) * valueToNumber(updatedNewData.LimeaPrice)) +
                    (valueToNumber(updatedNewData.Limew) * valueToNumber(updatedNewData.LimewPrice)) +
                    (valueToNumber(updatedNewData.Limeb) * valueToNumber(updatedNewData.LimebPrice)) +
                    (valueToNumber(updatedNewData.jhiki) * valueToNumber(updatedNewData.jhikiPrice)) +
                    (valueToNumber(updatedNewData.Limeoffw) * valueToNumber(updatedNewData.LimeoffwPrice)) +
                    (valueToNumber(updatedNewData.rs) * valueToNumber(updatedNewData.rsPrice));
                updatedNewData.dr = (totalProductAmount + valueToNumber(updatedNewData.autocharge) + valueToNumber(updatedNewData.labourcharge)).toFixed(2);
                totalAmount += productValue * productPrice;
            }
            if (index === products.length - 1) {
                updatedNewData.amount = totalAmount.toFixed(2);
            }
        });

        setNewData(updatedNewData);
    };


    const valueToNumber = (value) => {

        const numericValue = parseFloat(value);
        return isNaN(numericValue) ? 0 : numericValue;
    };




    const handleFormSubmit = async (event) => {
        event.preventDefault();

        // Calculate DR and balance for the new data
        const { dr, balance } = calculateDRAndBalance(newData, initialBalance);
        newData.dr = dr;
        newData.balance = balance;
        newData.cr = newData.cr === "" ? "0" : newData.cr;

        try {
            if (editingIndex !== null) {
                // Update existing data when in edit mode
                const updatedTableItems = customer.data.map((item, index) =>
                    index === editingIndex ? newData : item
                );

                // Send a PUT request to update the item
                await axios.put(`/api/updateitem?customerid=${customer.customerid}`, newData);

                setCustomer((prevCustomer) => ({
                    ...prevCustomer,
                    data: updatedTableItems,
                }));
            } else {
                // Send a POST request to add the new data
                await axios.post(`/api/additem?customerid=${customer.customerid}`, newData);

                // Update local state with the new data
                const updatedTableItems = [...customer.data, newData];
                setCustomer((prevCustomer) => ({
                    ...prevCustomer,
                    data: updatedTableItems,
                }));
            }

            // Reset form and state
            setNewData({
                numberid: "",
                salesdate: "",
                drivername: "",
                autono: "",
                km: '',
                Limea: "",
                Limew: "",
                Limeb: "",
                Limeoffw: '',
                LimeoffwPrice: '',
                jhiki: "",
                rs: "",
                siteaddress: "",
                labourcharge: "",
                autocharge: "",
                amount: "",
                dr: "",
                cr: "",
                balance: "",
            });
            setIsAddingData(false);
            setEditingIndex(null);
            window.location.reload(true);
        } catch (error) {
            console.error('Error adding data entry:', error);
        }
    };
    const handleViewData = (customerid, _id) => {
        // Navigate to the DetailPage with the corresponding customerid
        window.location.href = `/customers/${customerid}/bill/${_id}`;
    };




    useEffect(() => {
        if (customer && customer.data && !initialCalculationDone) {
            let previousBalance = 0;

            const updatedItemsWithBalance = customer.data.map(item => {
                const { dr, balance } = calculateDRAndBalance(item, previousBalance);
                previousBalance = parseFloat(balance);

                return {
                    ...item,
                    dr,
                    balance,
                };
            });

            setCustomer(prevCustomer => ({
                ...prevCustomer,
                data: updatedItemsWithBalance,
            }));

            setInitialCalculationDone(true);
        }
    }, [customer, initialCalculationDone]);


    //pagiantion
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const paginatedTableItems = customer && customer.data
        ? filteredTableItems.slice(startIndex, endIndex)
        : [];
    const nextPage = () => {
        if (currentPage < Math.ceil(filteredTableItems.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    const totalPages = Math.ceil(filteredTableItems.length / itemsPerPage);
    const goToFirstPage = () => {
        setCurrentPage(1);
    };

    const goToLastPage = () => {
        setCurrentPage(totalPages);
    };
   
    useEffect(() => {
        // Check if localStorage is available in the browser environment
        if (typeof window !== 'undefined' && window.localStorage) {
          const savedPage = parseInt(localStorage.getItem('currentPage')) || 1;
          setCurrentPage(savedPage);
        }
      }, []);
      useEffect(() => {
        // Check if localStorage is available in the browser environment
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('currentPage', currentPage);
        }
      }, [currentPage]);
    











    if (!customer) {
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-blue-500"></div>
        </div>
    } else {




        return (
            <div className='pt-10'>

                <div className="w-full px-4 md:px-8">
                    <div className="items-start justify-between md:flex">
                        <div className="max-w-lg">
                            <h3 className="text-gray-800 text-xl font-bold sm:text-2xl mb-4">
                                {customer.customername}&apos;s खाता
                            </h3>
                            <ExcelGenerator tableItems={customer.data} />
                        </div>
                        <div className="mt-3 mb-3 md:mt-0">
                            <a
                                className="cursor-pointer inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm print:hidden"
                                onClick={handleAddDataClick}
                            >
                                Add Data
                            </a>
                            <button
                                onClick={handlePrint}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg ml-10 print:hidden"
                            >
                                Print Table
                            </button>
                        </div>

                    </div>
                    <table className="border-2 border-black mx-auto">
                        <tbody>
                            <tr>
                                <td className="border-2 border-black p-6 md:px-40 px-8 text-center">
                                    <div className='text-5xl font-bold font-serif'>
                                        JAI LIME & CHEMICAL
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
                    <div className="mt-10 print:hidden">
                        <input
                            type="text"
                            placeholder="Search by S.NO. / Driver Name / Date"
                            value={searchQuery}
                            onChange={event => setSearchQuery(event.target.value)}
                            className="border p-2 rounded-md w-full"
                        />
                    </div>
                    <div className="mt-2 font-medium print:hidden">
                        Old Due Balance: {initialBalance}
                    </div>

                    <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto mb-10">
                        <table className="w-full table-auto text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                                <tr className='divide-x'>
                                    <th className="py-3 px-6">S. NO.</th>
                                    <th className="py-3 px-6">Sales Date</th>
                                    <th className="py-3 px-6">Driver Name</th>
                                    <th className="py-3 px-6">Auto No.</th>
                                    <th className="py-3 px-6">Lime (A)</th>
                                    <th className="py-3 px-6">Lime (W)</th>
                                    <th className="py-3 px-6">Lime (B)</th>
                                    <th className="py-3 px-6">Lime (OFF_W)</th>
                                    <th className="py-3 px-6">Jhiki (झिकीं)</th>
                                    <th className="py-3 px-6">Aaras (आरस)</th>
                                    <th className="py-3 px-6">Site Address</th>
                                    <th className="py-3 px-6">Amount</th>
                                    <th className="py-3 px-2">Labour Charge</th>
                                    <th className="py-3 px-2">Auto Charge</th>

                                    <th className="py-3 px-6">DR (बकाया)</th>
                                    <th className="py-3 px-6">CR (जमा)</th>
                                    <th className="py-3 px-6">Balance (शेष)</th>
                                    <th className="py-3 px-6 print:hidden">Generate Bill</th>
                                    <th className="py-3 px-6 print:hidden"></th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 divide-y">

                                {customer && customer.data && paginatedTableItems
                                    ? paginatedTableItems.map((item, idx) => (
                                        <tr key={idx} className="divide-x">
                                            <td className="px-6 py-4 whitespace-nowrap font-bold"> {item.numberid === '' ? '-' : item.numberid}</td>
                                            <td className="px-6 py-4 whitespace-nowrap font-bold"> {item.salesdate === '' ? '-' : item.salesdate}</td>
                                            <td className="px-6 py-4 whitespace-nowrap font-bold">
                                                {item.drivername === '' ? '-' : item.drivername}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-bold">{item.autono === '' ? '-' : item.autono}</td>
                                            <td className="px-6 py-4 whitespace-nowrap font-bold">
                                                {item.Limea ? (
                                                    `${item.Limea} X ${item.LimeaPrice}`
                                                ) : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-bold">
                                                {item.Limew ? (
                                                    `${item.Limew} X ${item.LimewPrice}`
                                                ) : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-bold">
                                                {item.Limeb ? (
                                                    `${item.Limeb} X ${item.LimebPrice}`
                                                ) : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-bold">
                                                {item.Limeoffw ? (
                                                    `${item.Limeoffw} X ${item.LimeoffwPrice}`
                                                ) : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-bold">
                                                {item.jhiki ? (
                                                    `${item.jhiki} X ${item.jhikiPrice}`
                                                ) : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-bold">
                                                {item.rs ? (
                                                    `${item.rs} KG X ${item.rsPrice}`
                                                ) : '-'}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap font-bold">
                                                {item.siteaddress === '' ? '-' : item.siteaddress}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-bold">
                                                {isNaN(item.amount) || item.amount === '' ? '0' : parseFloat(item.amount).toFixed(2)}
                                            </td>


                                            <td className="px-2 py-4 whitespace-nowrap font-bold text-center">{item.labourcharge === '' ? '-' : item.labourcharge}</td>
                                            <td className="px-2 py-4 whitespace-nowrap font-bold text-center text-xl">{item.autocharge === '' ? '-' : item.autocharge}</td>

                                            <td className="px-6 py-4 whitespace-nowrap font-bold">{item.dr}</td>
                                            <td className="px-6 py-4 whitespace-nowrap font-bold">
                                                {item.cr === '' ? 0 : item.cr}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap font-bold">
                                                {item.balance < 0 ? `${Math.abs(item.balance)} ADV` : item.balance}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap print:hidden font-bold">
                                                <button
                                                    onClick={() => handleViewData(customer.customerid, item._id)}
                                                    className="px-4 py-2 text-white bg-green-600 rounded-lg duration-150 hover:bg-green-700 active:shadow-lg font-bold"
                                                >
                                                    Generate Bill
                                                </button>
                                            </td>
                                            <td className="text-right px-6 whitespace-nowrap print:hidden font-bold">
                                                <button
                                                    onClick={() => handleEditClick(idx, item.numberid)} // Call handleEditClick with the index
                                                    className="py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(idx, item._id)} // Call the delete handler with item._id
                                                    className="py-2 leading-none px-3 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    )) : null}
                            </tbody>
                        </table>

                    </div>


                </div>
                {isAddingData && (
                    <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-4 rounded-xl">
                            <h2 className="text-xl font-semibold mb-4">Add New Data</h2>
                            <form onSubmit={handleFormSubmit}>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="numberid"
                                        placeholder="S. NO."
                                        value={newData.numberid}
                                        onChange={handleFormChange}
                                        className="border p-2 rounded-md"
                                    />
                                    <input
                                        type="text"
                                        name="salesdate"
                                        placeholder="Sales Date"
                                        value={newData.salesdate}
                                        onChange={handleFormChange}
                                        className="border p-2 rounded-md"
                                    />
                                    <input
                                        type="text"
                                        name="drivername"
                                        placeholder="Driver Name"
                                        value={newData.drivername}
                                        onChange={handleFormChange}
                                        className="border p-2 rounded-md"
                                    />
                                    <input
                                        type="text"
                                        name="autono"
                                        placeholder="Auto No."
                                        value={newData.autono}
                                        onChange={handleFormChange}
                                        className="border p-2 rounded-md"
                                    />
                                    <input
                                        type="text"
                                        name="km"
                                        placeholder="K.M."
                                        value={newData.km}
                                        onChange={handleFormChange}
                                        className="border p-2 rounded-md"
                                    />
                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            name="Limea"
                                            placeholder="Lime (A)"
                                            value={newData.Limea}
                                            onChange={handleFormChange}
                                            className="border p-2 rounded-md md:w-52 w-20"
                                        />
                                        <span className="text-gray-600 mx-2">x</span>
                                        <input
                                            type="text"
                                            name="LimeaPrice"
                                            placeholder="Price"
                                            value={newData.LimeaPrice}
                                            onChange={handleFormChange}
                                            className="border p-2 rounded-md md:w-52 w-16"
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            name="Limew"
                                            placeholder="Lime (W)"
                                            value={newData.Limew}
                                            onChange={handleFormChange}
                                            className="border p-2 rounded-md md:w-52 w-20"
                                        />
                                        <span className="text-gray-600 mx-2">x</span>
                                        <input
                                            type="text"
                                            name="LimewPrice"
                                            placeholder="Price"
                                            value={newData.LimewPrice}
                                            onChange={handleFormChange}
                                            className="border p-2 rounded-md md:w-52 w-16"
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            name="Limeb"
                                            placeholder="Lime (B)"
                                            value={newData.Limeb}
                                            onChange={handleFormChange}
                                            className="border p-2 rounded-md md:w-52 w-20"
                                        />
                                        <span className="text-gray-600 mx-2">x</span>
                                        <input
                                            type="text"
                                            name="LimebPrice"
                                            placeholder="Price"
                                            value={newData.LimebPrice}
                                            onChange={handleFormChange}
                                            className="border p-2 rounded-md md:w-52 w-16"
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            name="Limeoffw"
                                            placeholder="Lime (OFF_W)"
                                            value={newData.Limeoffw}
                                            onChange={handleFormChange}
                                            className="border p-2 rounded-md md:w-52 w-20"
                                        />
                                        <span className="text-gray-600 mx-2">x</span>
                                        <input
                                            type="text"
                                            name="LimeoffwPrice"
                                            placeholder="Price"
                                            value={newData.LimeoffwPrice}
                                            onChange={handleFormChange}
                                            className="border p-2 rounded-md md:w-52 w-16"
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            name="jhiki"
                                            placeholder="Jhiki"
                                            value={newData.jhiki}
                                            onChange={handleFormChange}
                                            className="border p-2 rounded-md md:w-52 w-20"
                                        />
                                        <span className="text-gray-600 mx-2">x</span>
                                        <input
                                            type="text"
                                            name="jhikiPrice"
                                            placeholder="Price"
                                            value={newData.jhikiPrice}
                                            onChange={handleFormChange}
                                            className="border p-2 rounded-md md:w-52 w-16"
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            name="rs"
                                            placeholder="Aaras"
                                            value={newData.rs}
                                            onChange={handleFormChange}
                                            className="border p-2 rounded-md md:w-52 w-20"
                                        />
                                        <span className="text-gray-600 mx-2">x</span>
                                        <input
                                            type="text"
                                            name="rsPrice"
                                            placeholder="Price"
                                            value={newData.rsPrice}
                                            onChange={handleFormChange}
                                            className="border p-2 rounded-md md:w-52 w-16"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        name="siteaddress"
                                        placeholder="Site Address"
                                        value={newData.siteaddress}
                                        onChange={handleFormChange}
                                        className="border p-2 rounded-md"
                                    />
                                    <input
                                        type="text"
                                        name="labourcharge"
                                        placeholder="Labour Charge"
                                        value={newData.labourcharge}
                                        onChange={handleFormChange}
                                        className="border p-2 rounded-md"
                                    />
                                    <input
                                        type="text"
                                        name="autocharge"
                                        placeholder="Auto Charge"
                                        value={newData.autocharge}
                                        onChange={handleFormChange}
                                        className="border p-2 rounded-md"
                                    />
                                    <input
                                        type="text"
                                        name="cr"
                                        placeholder="CR"
                                        value={newData.cr}
                                        onChange={handleFormChange}
                                        className="border p-2 rounded-md"
                                    />
                                </div>
                                <div className="flex mt-4">
                                    <button type="submit" className='bg-indigo-600 p-3 px-6 rounded mr-4'>{editingIndex !== null ? 'Update' : 'Add'}</button>
                                    <button
                                        type="button"
                                        onClick={() => setIsAddingData(false)}
                                        className=" text-black bg-red-600 p-3 px-6 rounded mr-4"
                                    >
                                        Cancel
                                    </button>
                                </div>

                            </form>



                        </div>
                    </div>
                )}
                <div className="flex justify-center space-x-2 print:hidden">
                    <button
                        onClick={goToFirstPage}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:bg-indigo-700 font-bold"
                    >
                        First Page
                    </button>
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:bg-indigo-700 font-bold"
                    >
                        Previous Page
                    </button>
                    <span className="text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:bg-indigo-700 font-bold"
                    >
                        Next Page
                    </button>
                    <button
                        onClick={goToLastPage}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:bg-indigo-700 font-bold"
                    >
                        Last Page
                    </button>
                </div>


                <div className="mt-10 py-4 border-t md:text-center">
                    <p>© 2023  Jai Lime & Chemical. All rights reserved.</p>
                </div>
            </div>
        );
    };
}


export default Landing
