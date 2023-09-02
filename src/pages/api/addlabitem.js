
import connectDb from "../../../lib/mongodb";
import Labour from "../../../model/laboursSchema";

const handler = async (req, res) => {
    if (req.method === 'POST') {
        try {
            const { labourid } = req.query;
            const newData = req.body; // Assuming your request body contains the new data

            // Find the customer by customerid
            const labour = await Labour.findOne({ labourid });

            if (!labour) {
                return res.status(404).json({ error: "Labour not found" });
            }

            // Add the new data to the customer's data array
            labour.data.push(newData);

            // Save the updated customer document
            await labour.save();

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
