import React, { useState, useEffect } from 'react';
import { calculateDRAndBalance } from '../../../components/landing/calculateDRAndBalance';
import { useRouter } from 'next/router';
import ExcelGenerator from '../../../components/landing/ExcelGenerator';
import axios from 'axios';






const Landing = () => {
    const [labour, setLabour] = useState(null);
    const [isLoading, setIsLoading] = useState(true);


    const router = useRouter();
    const labourid = router.query.labourid;


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/getlabour');
                const allLabourData = response.data.labour;

                // Find the customer that matches the current customer ID (slug)
                const matchingLabour = allLabourData.find(labour => labour.labourid === labourid);

                if (matchingLabour) {
                    setLabour(matchingLabour); // Set the matching customer object
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
    }, [labourid]);


    // const [translatedSiteAddresses, setTranslatedSiteAddresses] = useState([]);

    // useEffect(() => {
    //     const translateSiteAddresses = async () => {
    //         if (!customer) return;

    //         const siteAddresses = customer.data.map(item => item.siteaddress);

    //         try {
    //             const apiKey = '7fe898c8a155dbcbb5bd';
    //             const email = 'visionjain118@gmail.com'; // Provide a valid email here
    //             const translations = await Promise.all(
    //                 siteAddresses.map(address => translate(address, apiKey, email))
    //             );

    //             const translatedAddresses = translations.map(res => res.data.responseData.translatedText);
    //             setTranslatedSiteAddresses(translatedAddresses);
    //         } catch (error) {
    //             console.error('Translation error:', error);
    //         }
    //     };

    //     translateSiteAddresses();
    // }, [customer]);

    // const translate = async (text, apiKey, email) => {
    //     const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|hi&key=${apiKey}&de=${email}`;
    //     return axios.get(url);
    // };

    // const [translatedDriverNames, setTranslatedDriverNames] = useState([]);
    // const [translationsFetched, setTranslationsFetched] = useState(false);
    // useEffect(() => {
    //     const translateDriverNames = async () => {
    //         if (!customer) return;

    //         const driverNames = customer.data.map(item => item.drivername);

    //         try {
    //             const translations = await Promise.all(driverNames.map(name => translate(name)));
    //             const translatedNames = translations.map(res => res.data.responseData.translatedText);
    //             setTranslatedDriverNames(translatedNames);
    //             setTranslationsFetched(true); // Set translationsFetched to true when translations are available
    //         } catch (error) {
    //             console.error('Translation error:', error);
    //         }
    //     };

    //     const translate = async (text) => {
    //         const apiKey = '7fe898c8a155dbcbb5bd';
    //         const email = 'visionjain118@gmail.com';
    //         const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|hi&key=${apiKey}&de=${email}`;

    //         return axios.get(url);
    //     };

    //     translateDriverNames();
    // }, [customer]);


    const handlePrint = () => {
        window.print();
    };


    const [initialCalculationDone, setInitialCalculationDone] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const filteredTableItems = labour && labour.data
        ? labour.data.filter(item =>
            item.number.includes(searchQuery) ||
            item.date.includes(searchQuery)
        )
        : [];



    // useEffect(() => {
    //     const calculateDRAndBalance = (data, previousBalance) => {
    //         const totalProductAmount =
    //             (valueToNumber(data.Limea) * valueToNumber(data.LimeaPrice)) +
    //             (valueToNumber(data.Limew) * valueToNumber(data.LimewPrice)) +
    //             (valueToNumber(data.Limeb) * valueToNumber(data.LimebPrice)) +
    //             (valueToNumber(data.Limeoffw) * valueToNumber(data.LimeoffwPrice)) +
    //             (valueToNumber(data.jhiki) * valueToNumber(data.jhikiPrice)) +
    //             (valueToNumber(data.rs) * valueToNumber(data.rsPrice));

    //         const dr = (totalProductAmount + valueToNumber(data.autocharge)).toFixed(2);
    //         const balance = (previousBalance + parseFloat(dr)).toFixed(2);

    //         return { dr, balance };
    //     };

    //     setCustomer(prevCustomer => {
    //         if (!prevCustomer) return prevCustomer;

    //         let previousBalance = 0; // Initialize previousBalance here

    //         const updatedData = prevCustomer.data.map(item => {
    //             const { dr, balance } = calculateDRAndBalance(item, previousBalance);
    //             previousBalance = parseFloat(balance);
    //             return {
    //                 ...item,
    //                 dr,
    //                 balance,
    //             };
    //         });

    //         return { ...prevCustomer, data: updatedData };
    //     });

    // }, []);

    const [isAddingData, setIsAddingData] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);

    const handleEditClick = (index) => {
        setEditingIndex(index);
        setNewData(labour.data[index]);
        setIsAddingData(true);
    };

    const handleDeleteClick = async (index, itemId) => {
        const shouldDelete = window.confirm("Are you sure you want to delete this item?");
        if (shouldDelete) {
            try {
                await axios.delete(`/api/deletelabitem?labourid=${labour.labourid}&itemid=${itemId}`);

                // Update the local state after successful deletion
                const updatedTableItems = labour.data.filter((item, idx) => idx !== index);
                setLabour(prevLabour => ({
                    ...prevLabour,
                    data: updatedTableItems,
                }));
                window.location.reload(true);
            } catch (error) {
                console.error('Error deleting data entry:', error);
            }
        }
    };






    const [newData, setNewData] = useState({
        number: '',
        date: '',
        lot: '',
        wages: '',
        amount: '',
        cashrec: '',
        totalamount: '',

    });



    const handleAddDataClick = () => {
        setIsAddingData(true);
        setEditingIndex(null); // Clear editing index when adding new data
    };



    const handleFormChange = (event) => {
        const { name, value } = event.target;
        let updatedNewData = { ...newData };
        updatedNewData[name] = value;
        setNewData(updatedNewData);
    };


    const valueToNumber = (value) => {
        const numericValue = parseFloat(value);
        return isNaN(numericValue) ? 0 : numericValue;
    };




    const handleFormSubmit = async (event) => {
        event.preventDefault();

        // Calculate DR and balance for the new data
        // const { dr, balance } = calculateDRAndBalance(newData, 0);
        // newData.dr = dr;
        // newData.balance = balance;

        try {
            if (editingIndex !== null) {
                // Update existing data when in edit mode
                const updatedTableItems = labour.data.map((item, index) =>
                    index === editingIndex ? newData : item
                );

                // Send a PUT request to update the item
                await axios.put(`/api/updatelabitem?labourid=${labour.labourid}`, newData);

                setLabour((prevLabour) => ({
                    ...prevLabour,
                    data: updatedTableItems,
                }));
            } else {
                // Send a POST request to add the new data
                await axios.post(`/api/addlabitem?labourid=${labour.labourid}`, newData);

                // Update local state with the new data
                const updatedTableItems = [...labour.data, newData];
                setLabour((prevLabour) => ({
                    ...prevLabour,
                    data: updatedTableItems,
                }));
            }

            // Reset form and state
            setNewData({
                number: '',
                date: '',
                lot: '',
                wages: '',
                amount: '',
                cashrec: '',
                totalamount: '',
            });
            setIsAddingData(false);
            setEditingIndex(null);
            window.location.reload(true);
        } catch (error) {
            console.error('Error adding data entry:', error);
        }
    };
    // const handleViewData = (labourid, number) => {
    //     // Navigate to the DetailPage with the corresponding customerid
    //     window.location.href = `/customers/${customerid}/bill/${numberid}`;
    // };




    // useEffect(() => {
    //     if (labour && labour.data && !initialCalculationDone) {
    //         let previousBalance = 0;

    //         const updatedItemsWithBalance = labour.data.map(item => {
    //             const { dr, balance } = calculateDRAndBalance(item, previousBalance);
    //             previousBalance = parseFloat(balance);

    //             return {
    //                 ...item,
    //                 dr,
    //                 balance,
    //             };
    //         });

    //         setLabour(prevLabour => ({
    //             ...prevLabour,
    //             data: updatedItemsWithBalance,
    //         }));

    //         setInitialCalculationDone(true);
    //     }
    // }, [labour, initialCalculationDone]);







    if (!labour) {
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
                                {labour.labourname}&apos;s Data
                            </h3>
                            <ExcelGenerator tableItems={labour.data} />
                        </div>
                        <div className="mt-3 md:mt-0">
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
                                <td className="border-2 border-black p-6 px-40 text-center">
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
                    <div className="mt-10">
                        <input
                            type="text"
                            placeholder="Search by S.NO. / Labour Name / Date"
                            value={searchQuery}
                            onChange={event => setSearchQuery(event.target.value)}
                            className="border p-2 rounded-md w-full"
                        />
                    </div>

                    <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto mb-10">
                        <table className="w-full table-auto text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                                <tr className='divide-x'>
                                    <th className="py-3 px-6">S. NO.</th>
                                    <th className="py-3 px-6">Date</th>
                                    <th className="py-3 px-6">LOT</th>
                                    <th className="py-3 px-6">WAGES</th>
                                    <th className="py-3 px-6">Amount</th>
                                    <th className="py-3 px-6">Daily Cash Recieved</th>
                                    <th className="py-3 px-6">Total Amount</th>
                                    <th className="py-3 px-6 print:hidden"></th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 divide-y">

                                {labour && labour.data && filteredTableItems
                                    ? filteredTableItems.map((item, idx) => (
                                        <tr key={idx} className="divide-x">
                                            <td className="px-6 py-4 whitespace-nowrap">{item.number}</td>
                                            <td className="px-6 py-4 whitespace-nowrap font-bold">{item.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {item.lot}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">{item.wages}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {item.amount}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {item.cashrec}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {item.totalamount}
                                            </td>
                                            <td className="text-right px-6 whitespace-nowrap print:hidden">
                                                <button
                                                    onClick={() => handleEditClick(idx, item.number)} // Call handleEditClick with the index
                                                    className="py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(idx, item.number)} // Call the delete handler with item._id
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
                        <div className="bg-white p-6 rounded-lg">
                            <h2 className="text-xl font-semibold mb-4">Add New Data</h2>
                            <form onSubmit={handleFormSubmit}>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="number"
                                        placeholder="S. NO."
                                        value={newData.number}
                                        onChange={handleFormChange}
                                        className="border p-2 rounded-md"
                                    />
                                    <input
                                        type="text"
                                        name="date"
                                        placeholder="Date"
                                        value={newData.date}
                                        onChange={handleFormChange}
                                        className="border p-2 rounded-md"
                                    />
                                    <input
                                        type="text"
                                        name="lot"
                                        placeholder="LOT"
                                        value={newData.lot}
                                        onChange={handleFormChange}
                                        className="border p-2 rounded-md"
                                    />
                                    <input
                                        type="text"
                                        name="wages"
                                        placeholder="Wages"
                                        value={newData.wages}
                                        onChange={handleFormChange}
                                        className="border p-2 rounded-md"
                                    />
                                    <input
                                        type="text"
                                        name="amount"
                                        placeholder="Amount"
                                        value={newData.amount}
                                        onChange={handleFormChange}
                                        className="border p-2 rounded-md"
                                    />
                                    <input
                                        type="text"
                                        name="cashrec"
                                        placeholder="Daily Cash Recieved"
                                        value={newData.cashrec}
                                        onChange={handleFormChange}
                                        className="border p-2 rounded-md"
                                    />
                                     <input
                                        type="text"
                                        name="totalamount"
                                        placeholder="Total Amount"
                                        value={newData.totalamount}
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
                <div className="mt-10 py-4 border-t md:text-center">
                    <p>© 2023  Jai Lime & Chemical. All rights reserved.</p>
                </div>
            </div>
        );
    };
}


export default Landing
