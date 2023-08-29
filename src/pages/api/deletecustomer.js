import connectDb from "../../../lib/mongodb";
import Customer from "../../../model/customerschema";

const handler = async (req, res) => {
    if (req.method === 'DELETE') {
        try {
            const customerid = req.query.customerid; // Get customerid from query parameter

            // Find the customer by customerid and delete
            const deletedCustomer = await Customer.findOneAndDelete({ customerid });

            if (deletedCustomer) {
                res.status(200).json({ success: "Customer and associated data deleted successfully" });
            } else {
                res.status(404).json({ error: "Customer not found" });
            }
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(400).json({ error: "This method is not allowed" });
    }
};

export default connectDb(handler);
