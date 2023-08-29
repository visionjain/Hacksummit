import connectDb from "../../../lib/mongodb";
import Customer from "../../../model/customerschema";

const handler = async (req, res) => {
    if (req.method === 'POST') {
        try {
            const allCustomers = await Customer.find();

            allCustomers.forEach(async (customer, index) => {
                customer.customerid = (index + 1).toString();
                await customer.save();
            });

            res.status(200).json({ success: "Customer IDs updated successfully" });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(400).json({ error: "This method is not allowed" });
    }
};

export default connectDb(handler);
