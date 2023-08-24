import React, { useState } from 'react';

const Customers = () => {

    const [isAddingData, setIsAddingData] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);

    const handleEditClick = (index) => {
        setEditingIndex(index);
        setNewData(tableItems[index]);
        setIsAddingData(true);
    };

    const handleDeleteClick = (index) => {
        const updatedTableItems = tableItems.filter((item, idx) => idx !== index);
        reassignNumberIds(updatedTableItems);
        setTableItems(updatedTableItems);
    };

    const reassignNumberIds = (items) => {
        items.forEach((item, index) => {
            item.numberid = (index + 1).toString();
        });
    };

    const [tableItems, setTableItems] = useState([
        {
            numberid: "1",
            customername: "Rajesh",
        },
        {
            numberid: "2",
            customername: "Mahesh",
        },
        {
            numberid: "3",
            customername: "Rohit",
        },
        {
            numberid: "4",
            customername: "Vision",
        },
        {
            numberid: "5",
            customername: "Someone",
        },
    ]);

    const [newData, setNewData] = useState({
        numberid: '',
        customername: '',
    });



    const handleAddDataClick = () => {
        setIsAddingData(true);
        const nextId = tableItems.length + 1;
        setNewData(prevData => ({ ...prevData, numberid: nextId.toString() }));
        setEditingIndex(null); // Clear editing index when adding new data
    };




    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setNewData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();

        if (editingIndex !== null) {
            // Update existing data when in edit mode
            const updatedTableItems = [...tableItems];
            updatedTableItems[editingIndex] = newData;
            setTableItems(updatedTableItems);
        } else {
            // Add new data when in add mode
            setTableItems(prevItems => [...prevItems, newData]);
        }
        // Reset form and state
        setNewData({
            numberid: '',
            customername: '',
        });
        setIsAddingData(false);
        setEditingIndex(null);
    };


    return (
        <div className='pt-10'>
            <div className="w-full px-4 md:px-8">
                <div className="items-start justify-between md:flex">
                    <div className="max-w-lg">
                        <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
                            All Customers
                        </h3>
                    </div>
                    <div className="mt-3 md:mt-0">
                        <a
                            href="javascript:void(0)"
                            className="inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm"
                            onClick={handleAddDataClick}
                        >
                            Add Customer
                        </a>
                    </div>
                </div>
                <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
                    <table className="w-full table-auto text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                            <tr>
                                <th className="py-3 px-6">S. NO.</th>
                                <th className="py-3 px-6">Customers Name</th>
                                <th className="py-3 px-6"></th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 divide-y">
                            {tableItems.map((item, idx) => (
                                <tr key={idx} className="divide-x">
                                    <td className="px-6 py-4 whitespace-nowrap">{item.numberid}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.customername}</td>
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


export default Customers
