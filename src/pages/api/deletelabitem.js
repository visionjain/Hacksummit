import connectDb from "../../../lib/mongodb";
import Labour from "../../../model/laboursSchema";

const handler = async (req, res) => {
    if (req.method === 'DELETE') {
        try {
            const { labourid, itemid } = req.query;
            console.log("labourid:", labourid);
            console.log("itemid:", itemid);

            // Find the customer by customerid
            const labour = await Labour.findOne({ labourid });

            if (!labour) {
                return res.status(404).json({ error: "Customer not found" });
            }

            // Find the index of the item to delete
            const itemIndex = labour.data.findIndex(item => item._id.toString() === itemid);

            if (itemIndex === -1) {
                return res.status(404).json({ error: "Item not found in customer's data" });
            }

            // Remove the item from the data array
           labour.data.splice(itemIndex, 1);

            // Save the updated customer document
            await labour.save();

            res.status(200).json({ success: "Item deleted successfully" });
        } catch (error) {
            console.error('Error deleting item:', error);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(400).json({ error: "This method is not allowed" });
    }
};

export default connectDb(handler);
