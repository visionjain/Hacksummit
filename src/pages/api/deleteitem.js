import connectDb from "../../../lib/mongodb";
import Customer from "../../../model/customerschema";

const handler = async (req, res) => {
    if (req.method === 'DELETE') {
        try {
            const { customerid, _id } = req.query;
            // Find the customer by customerid
            const customer = await Customer.findOne({ customerid });

            if (!customer) {
                return res.status(404).json({ error: "Customer not found" });
            }

            // Use the _id field to find the item to delete
            const itemToDelete = customer.data.find(item => item._id.toString() === _id);

            if (!itemToDelete) {
                return res.status(404).json({ error: "Item not found in customer's data" });
            }

            // Remove the item from the data array
            customer.data.pull({ _id: itemToDelete._id });

            // Save the updated customer document
            await customer.save();

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
