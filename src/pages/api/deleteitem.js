import connectDb from "../../../lib/mongodb";
import Customer from "../../../model/customerschema";

const handler = async (req, res) => {
    if (req.method === 'DELETE') {
        try {
            const { customerid, itemid } = req.query;
            console.log("customerid:", customerid);
            console.log("itemid:", itemid);

            // Find the customer by customerid
            const customer = await Customer.findOne({ customerid });

            if (!customer) {
                return res.status(404).json({ error: "Customer not found" });
            }

            // Find the index of the item to delete
            const itemIndex = customer.data.findIndex(item => item.numberid.toString() === itemid);

            if (itemIndex === -1) {
                return res.status(404).json({ error: "Item not found in customer's data" });
            }

            // Remove the item from the data array
            customer.data.splice(itemIndex, 1);

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
