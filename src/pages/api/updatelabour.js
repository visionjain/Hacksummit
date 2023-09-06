import connectDb from "../../../lib/mongodb";
import Labour from "../../../model/laboursSchema";

const handler = async (req, res) => {
    if (req.method === 'PUT') {
        try {
            const { labourid, labourname, data } = req.body;

            // Find the customer by customerid
            const existingLabour = await Labour.findOne({ labourid });

            if (!existingLabour) {
                return res.status(404).json({ error: "Customer not found" });
            }

            // Update the customer's main data if provided
            if (labourname) {
                existingLabour.labourname = labourname;
            }

            // Update nested data if provided
            if (data) {
                const updatedData = data.map(item => ({
                    date: item.date,
                    lot: item.lot,
                    wages: item.wages,
                    amount: item.amount,
                    gas: item.gas,
                    cashrec: item.cashrec,
                    totalamount: item.totalamount
                }));
                existingLabour.data = updatedData;
            }

            await existingLabour.save();
            await reassignLabourIds();

            res.status(200).json({ success: "Customer updated successfully" });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(400).json({ error: "This method is not allowed" });
    }
};

export default connectDb(handler);
