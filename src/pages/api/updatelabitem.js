import connectDb from "../../../lib/mongodb";
import Labour from "../../../model/laboursSchema";

const handler = async (req, res) => {
    if (req.method === 'PUT') {
        try {
            const { labourid } = req.query;
            const updatedData = req.body;

            // Find the customer by customerid
            const labour = await Labour.findOne({ labourid });

            if (!labour) {
                return res.status(404).json({ error: "Labour not found" });
            }

            // Find the index of the item to update
            const itemIndex = labour.data.findIndex(item => item._id.toString() === updatedData._id);

            if (itemIndex === -1) {
                return res.status(404).json({ error: "Item not found in customer's data" });
            }

            // Update the item data
           labour.data[itemIndex] = updatedData;

            // Save the updated customer document
            await labour.save();

            res.status(200).json({ success: "Item updated successfully" });
        } catch (error) {
            console.error('Error updating item:', error);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(400).json({ error: "This method is not allowed" });
    }
};

export default connectDb(handler);
