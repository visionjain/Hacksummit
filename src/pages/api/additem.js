// api/additem.js
// This route should handle adding new data to the database

import connectDb from "../../../lib/mongodb";
import Customer from "../../../model/customerschema";

const handler = async (req, res) => {
    if (req.method === 'POST') {
        try {
            const { customerid } = req.query;
            const newData = req.body; // Assuming your request body contains the new data

            // Find the customer by customerid
            const customer = await Customer.findOne({ customerid });

            if (!customer) {
                return res.status(404).json({ error: "Customer not found" });
            }

            // Add the new data to the customer's data array
            customer.data.push(newData);

            // Save the updated customer document
            await customer.save();

            res.status(201).json({ success: "Item added successfully" });
        } catch (error) {
            console.error('Error adding item:', error);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(400).json({ error: "This method is not allowed" });
    }
};

export default connectDb(handler);
