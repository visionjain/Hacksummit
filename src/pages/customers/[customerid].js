import React, { useState, useEffect } from 'react';
import { calculateDRAndBalance } from '../../components/landing/calculateDRAndBalance';
import { useRouter } from 'next/router';
import ExcelGenerator from '../../components/landing/ExcelGenerator';
const axios = require('axios').default;
import db from '../../components/database/db.json';






const Landing = () => {

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    // const [translatedDriverNames, setTranslatedDriverNames] = useState([]);
    // const [translationsFetched, setTranslationsFetched] = useState(false);

    // Assuming this code is inside a function or component
    const router = useRouter();
    const customerid = router.query.customerid;

    useEffect(() => {
        // Fetch the selected customer data based on customerid
        const fetchedCustomer = db.find(item => item.customerid === customerid);
        setSelectedCustomer(fetchedCustomer);
    }, [customerid]);
    // Find the customer using the customerid
    // const selectedCustomer = db.find(item => item.customerid === customerid);
    // console.log(selectedCustomer);


    //   selectedCustomer.data.map((e)=>{

    //       console.log(e);
    //   }
    //   )
    if (!selectedCustomer) {
        console.log("loading")
    }
    else {
        console.log("hi")
    }
    const [translatedSiteAddresses, setTranslatedSiteAddresses] = useState([]);

    useEffect(() => {
        const translateSiteAddresses = async () => {
            if (!selectedCustomer) return;

            const siteAddresses = selectedCustomer.data.map(item => item.siteaddress);

            try {
                const apiKey = '7fe898c8a155dbcbb5bd';
                const email = 'visionjain118@gmail.com'; // Provide a valid email here
                const translations = await Promise.all(
                    siteAddresses.map(address => translate(address, apiKey, email))
                );

                const translatedAddresses = translations.map(res => res.data.responseData.translatedText);
                setTranslatedSiteAddresses(translatedAddresses);
            } catch (error) {
                console.error('Translation error:', error);
            }
        };

        translateSiteAddresses();
    }, [selectedCustomer]);

    const translate = async (text, apiKey, email) => {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|hi&key=${apiKey}&de=${email}`;
        return axios.get(url);
    };

    const [translatedDriverNames, setTranslatedDriverNames] = useState([]);
    const [translationsFetched, setTranslationsFetched] = useState(false);
    useEffect(() => {
        const translateDriverNames = async () => {
            if (!selectedCustomer) return;

            const driverNames = selectedCustomer.data.map(item => item.drivername);

            try {
                const translations = await Promise.all(driverNames.map(name => translate(name)));
                const translatedNames = translations.map(res => res.data.responseData.translatedText);
                setTranslatedDriverNames(translatedNames);
                setTranslationsFetched(true); // Set translationsFetched to true when translations are available
            } catch (error) {
                console.error('Translation error:', error);
            }
        };

        const translate = async (text) => {
            const apiKey = '7fe898c8a155dbcbb5bd';
            const email = 'visionjain118@gmail.com';
            const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|hi&key=${apiKey}&de=${email}`;

            return axios.get(url);
        };

        translateDriverNames();
    }, [selectedCustomer]);


    const handlePrint = () => {
        // Open the print dialog
        window.print();
    };


    const [initialCalculationDone, setInitialCalculationDone] = useState(false);
    // const [currentPage, setCurrentPage] = useState(1);
    // const itemsPerPage = 10;
    // const totalPages = Math.ceil(selectedCustomer.data.length / itemsPerPage);
    const [searchQuery, setSearchQuery] = useState("");
    const filteredTableItems = selectedCustomer && selectedCustomer.data
    ? selectedCustomer.data.filter(item =>
        item.numberid.includes(searchQuery) ||
        item.salesdate.includes(searchQuery) ||
        item.drivername.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

    const handleFormChangeForExistingData = (event, index) => {
        const { name, value } = event.target;
        const updatedTableItems = [...selectedCustomer.data];
        updatedTableItems[index][name] = value;
        setSelectedCustomer(updatedTableItems);
    };

    useEffect(() => {
        const calculateDRAndBalance = (data, previousBalance) => {
            const totalProductAmount =
                (valueToNumber(data.Limea) * valueToNumber(data.LimeaPrice)) +
                (valueToNumber(data.Limew) * valueToNumber(data.LimewPrice)) +
                (valueToNumber(data.Limeb) * valueToNumber(data.LimebPrice)) +
                (valueToNumber(data.jhiki) * valueToNumber(data.jhikiPrice)) +
                (valueToNumber(data.rs) * valueToNumber(data.rsPrice));

            const dr = (totalProductAmount + valueToNumber(data.autocharge)).toFixed(2);
            const balance = (previousBalance + parseFloat(dr)).toFixed(2);

            return { dr, balance };
        };

        setSelectedCustomer(prevCustomer => {
            if (!prevCustomer) return prevCustomer;

            let previousBalance = 0; // Initialize previousBalance here

            const updatedData = prevCustomer.data.map(item => {
                const { dr, balance } = calculateDRAndBalance(item, previousBalance);
                previousBalance = parseFloat(balance);
                return {
                    ...item,
                    dr,
                    balance,
                };
            });

            return { ...prevCustomer, data: updatedData };
        });

    }, []);



    const calculateDR = (data) => {
        const totalProductAmount =
            (valueToNumber(data.Limea) * valueToNumber(data.LimeaPrice)) +
            (valueToNumber(data.Limew) * valueToNumber(data.LimewPrice)) +
            (valueToNumber(data.Limeb) * valueToNumber(data.LimebPrice)) +
            (valueToNumber(data.jhiki) * valueToNumber(data.jhikiPrice)) +
            (valueToNumber(data.rs) * valueToNumber(data.rsPrice));

        return (totalProductAmount + valueToNumber(data.autocharge)).toFixed(2);
    };

    const calculateTotalAmount = () => {
        let totalAmount = 0;

        selectedCustomer.data.forEach(item => {
            if (item.Limea && item.LimeaPrice) {
                const limeaParts = item.Limea.split(' x ');
                const limeaValue = parseFloat(limeaParts[0]);
                const limeaPrice = parseFloat(item.LimeaPrice);
                const productAmount = limeaValue * limeaPrice;

                totalAmount += productAmount;
            }
        });

        return totalAmount.toFixed(2); // You can format this as needed
    };


    const [isAddingData, setIsAddingData] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);

    const handleEditClick = (index) => {
        setEditingIndex(index);
        setNewData(selectedCustomer.data[index]);
        setIsAddingData(true);
    };

    const handleDeleteClick = (index) => {
        const shouldDelete = window.confirm("Are you sure you want to delete this item?");
        if (shouldDelete) {
            const updatedTableItems = selectedCustomer.data.filter((item, idx) => idx !== index);
    
            // Recalculate balance for remaining rows
            let currentBalance = 0;
            const updatedItemsWithBalances = updatedTableItems.map((item) => {
                const drValue = parseFloat(item.dr);
                const crValue = parseFloat(item.cr);
                currentBalance += drValue - crValue;
    
                return {
                    ...item,
                    balance: currentBalance.toFixed(2),
                };
            });
    
            setSelectedCustomer((prevCustomer) => ({
                ...prevCustomer,
                data: updatedItemsWithBalances,
            }));
        }
    };
    


    const reassignNumberIds = (items) => {
        items.forEach((item, index) => {
            item.numberid = (index + 1).toString();
        });
    };


    const [newData, setNewData] = useState({
        numberid: '',
        salesdate: '',
        drivername: '',
        autono: '',
        Limea: '',
        Limew: '',
        Limeb: '',
        jhiki: '',
        rs: '',
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

        const products = ["Limea", "LimeaPrice", "Limew", "LimewPrice", "Limeb", "LimebPrice", "jhiki", "jhikiPrice", "rs", "rsPrice"];
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
                    (valueToNumber(updatedNewData.rs) * valueToNumber(updatedNewData.rsPrice));
                updatedNewData.dr = (totalProductAmount + valueToNumber(updatedNewData.autocharge)).toFixed(2);
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


    

    const handleFormSubmit = (event) => {
        event.preventDefault();

        let updatedTableItems;
        if (editingIndex !== null) {
            // Update existing data when in edit mode
            updatedTableItems = selectedCustomer.data.map((item, index) =>
                index === editingIndex ? newData : item
            );
        } else {
            // Add new data when in add mode
            updatedTableItems = [...selectedCustomer.data, newData];
        }

        // Calculate DR and balance for the new data
        const { dr, balance } = calculateDRAndBalance(newData, 0);
        newData.dr = dr;
        newData.balance = balance;


        let currentBalance = 0;
        let previousBalance = 0;
        const updatedItemsWithBalancesAndTotals = updatedTableItems.map((item) => {
            const { dr, balance } = calculateDRAndBalance(item, previousBalance);
            previousBalance = parseFloat(balance);

            currentBalance += dr - parseFloat(item.cr);

            return {
                ...item,
                dr,
                balance: currentBalance.toFixed(2),
            };
        });

        // setSelectedCustomer(updatedItemsWithBalancesAndTotals);

        // Recalculate balance values for all rows
        // let currentBalance = 0;
        // const updatedItems = updatedTableItems.map((item) => {
        //     const drValue = parseFloat(item.dr);
        //     const crValue = parseFloat(item.cr);
        //     currentBalance += drValue - crValue;

        //     return {
        //         ...item,
        //         balance: currentBalance.toFixed(2),
        //     };
        // });

        setSelectedCustomer((prevCustomer) => ({
            ...prevCustomer,
            data: updatedItemsWithBalancesAndTotals, // Use the correct variable name here
        }));

        // Reset form and state
        setNewData({
            numberid: "",
            salesdate: "",
            drivername: "",
            autono: "",
            Limea: "",
            Limew: "",
            Limeb: "",
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
    };



    useEffect(() => {
        if (selectedCustomer && selectedCustomer.data && !initialCalculationDone) {
            let previousBalance = 0;

            const updatedItemsWithBalance = selectedCustomer.data.map(item => {
                const { dr, balance } = calculateDRAndBalance(item, previousBalance);
                previousBalance = parseFloat(balance);

                return {
                    ...item,
                    dr,
                    balance,
                };
            });

            setSelectedCustomer(prevCustomer => ({
                ...prevCustomer,
                data: updatedItemsWithBalance,
            }));

            setInitialCalculationDone(true);
        }
    }, [selectedCustomer, initialCalculationDone]);







    if (!selectedCustomer) {
        return <p>loading.....</p>
    } else {




        return (
            <div className='pt-10'>
                <div className="w-full px-4 md:px-8">
                    <div className="items-start justify-between md:flex">
                        <div className="max-w-lg">
                            <h3 className="text-gray-800 text-xl font-bold sm:text-2xl mb-4">
                                {selectedCustomer.customername}&apos;s Data
                            </h3>
                            <ExcelGenerator tableItems={selectedCustomer.data} />
                        </div>
                        <div className="mt-3 md:mt-0">
                            <a
                                className="cursor-pointer inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm"
                                onClick={handleAddDataClick}
                            >
                                Add Data
                            </a>
                            <button
                                onClick={handlePrint}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg ml-10"
                            >
                                Print Table
                            </button>
                        </div>

                    </div>
                    <div className="mt-10">
                    <input
                        type="text"
                        placeholder="Search by S.NO. / Driver Name / Date"
                        value={searchQuery}
                        onChange={event => setSearchQuery(event.target.value)}
                        className="border p-2 rounded-md w-full"
                    />
                </div>

                    <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto mb-10">
                        <table className="w-full table-auto text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                                <tr>
                                    <th className="py-3 px-6">S. NO.</th>
                                    <th className="py-3 px-6">Sales Date</th>
                                    <th className="py-3 px-6">Driver Name</th>
                                    <th className="py-3 px-6">Auto No.</th>
                                    <th className="py-3 px-6">Lime (A)</th>
                                    <th className="py-3 px-6">Lime (W)</th>
                                    <th className="py-3 px-6">Lime (B)</th>
                                    <th className="py-3 px-6">Jhiki</th>
                                    <th className="py-3 px-6">RS</th>
                                    <th className="py-3 px-6">Site Address</th>
                                    <th className="py-3 px-6">Labour Charge</th>
                                    <th className="py-3 px-6">Auto Charge</th>
                                    <th className="py-3 px-6">Amount</th>
                                    <th className="py-3 px-6">DR (बकाया)</th>
                                    <th className="py-3 px-6">CR (जमा)</th>
                                    <th className="py-3 px-6">Balance (शेष)</th>
                                    <th className="py-3 px-6"></th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 divide-y">

                                {selectedCustomer && selectedCustomer.data && filteredTableItems
                                    ? filteredTableItems.map((item, idx) => (
                                        <tr key={idx} className="divide-x">
                                            <td className="px-6 py-4 whitespace-nowrap">{item.numberid}</td>
                                            <td className="px-6 py-4 whitespace-nowrap font-bold">{item.salesdate}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {translatedDriverNames[idx] || item.drivername}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">{item.autono}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {item.Limea ? `${item.Limea} X ${item.LimeaPrice}` : ''}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {item.Limew ? `${item.Limew} X ${item.LimewPrice}` : ''}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {item.Limeb ? `${item.Limeb} X ${item.LimebPrice}` : ''}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {item.jhiki ? `${item.jhiki} X ${item.jhikiPrice}` : ''}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {item.rs ? `${item.rs} X ${item.rsPrice}` : ''}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-bold">
                                                {translatedSiteAddresses[idx] || item.siteaddress}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">{item.labourcharge}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{item.autocharge}</td>
                                            <td className="px-6 py-4 whitespace-nowrap font-bold">
                                                {item.amount === '' ?
                                                    '' :
                                                    (
                                                        parseFloat(item.Limea) * parseFloat(item.LimeaPrice) +
                                                        parseFloat(item.Limew) * parseFloat(item.LimewPrice) +
                                                        parseFloat(item.Limeb) * parseFloat(item.LimebPrice) +
                                                        parseFloat(item.jhiki) * parseFloat(item.jhikiPrice) +
                                                        parseFloat(item.rs) * parseFloat(item.rsPrice)
                                                    ).toFixed(2)
                                                }
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-bold">{item.dr}</td>
                                            <td className="px-6 py-4 whitespace-nowrap font-bold">{item.cr}</td>
                                            <td className="px-6 py-4 whitespace-nowrap font-bold">{item.balance}</td>
                                            <td className="text-right px-6 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleEditClick(idx)} // Call handleEditClick with the index
                                                    className="py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(idx)} // Call the delete handler
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
                                        name="numberid"
                                        placeholder="S. NO."
                                        value={newData.numberid}
                                        onChange={handleFormChange}
                                        className="border p-2 rounded-md"
                                    />
                                    <input
                                        type="date"
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
                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            name="Limea"
                                            placeholder="Lime (A)"
                                            value={newData.Limea}
                                            onChange={handleFormChange}
                                            className="border p-2 rounded-md"
                                        />
                                        <span className="text-gray-600 mx-2">x</span>
                                        <input
                                            type="text"
                                            name="LimeaPrice"
                                            placeholder="Price"
                                            value={newData.LimeaPrice}
                                            onChange={handleFormChange}
                                            className="border p-2 rounded-md"
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            name="Limew"
                                            placeholder="Lime (W)"
                                            value={newData.Limew}
                                            onChange={handleFormChange}
                                            className="border p-2 rounded-md"
                                        />
                                        <span className="text-gray-600 mx-2">x</span>
                                        <input
                                            type="text"
                                            name="LimewPrice"
                                            placeholder="Price"
                                            value={newData.LimewPrice}
                                            onChange={handleFormChange}
                                            className="border p-2 rounded-md"
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            name="Limeb"
                                            placeholder="Lime (B)"
                                            value={newData.Limeb}
                                            onChange={handleFormChange}
                                            className="border p-2 rounded-md"
                                        />
                                        <span className="text-gray-600 mx-2">x</span>
                                        <input
                                            type="text"
                                            name="LimebPrice"
                                            placeholder="Price"
                                            value={newData.LimebPrice}
                                            onChange={handleFormChange}
                                            className="border p-2 rounded-md"
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            name="jhiki"
                                            placeholder="Jhiki"
                                            value={newData.jhiki}
                                            onChange={handleFormChange}
                                            className="border p-2 rounded-md"
                                        />
                                        <span className="text-gray-600 mx-2">x</span>
                                        <input
                                            type="text"
                                            name="jhikiPrice"
                                            placeholder="Price"
                                            value={newData.jhikiPrice}
                                            onChange={handleFormChange}
                                            className="border p-2 rounded-md"
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            name="rs"
                                            placeholder="RS"
                                            value={newData.rs}
                                            onChange={handleFormChange}
                                            className="border p-2 rounded-md"
                                        />
                                        <span className="text-gray-600 mx-2">x</span>
                                        <input
                                            type="text"
                                            name="rsPrice"
                                            placeholder="Price"
                                            value={newData.rsPrice}
                                            onChange={handleFormChange}
                                            className="border p-2 rounded-md"
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
            </div>
        );
    };
}


export default Landing
