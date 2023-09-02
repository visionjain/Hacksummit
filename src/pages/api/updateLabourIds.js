import connectDb from "../../../lib/mongodb";
import Labour from "../../../model/laboursSchema";

const handler = async (req, res) => {
    if (req.method === 'POST') {
        try {
            const allLabours = await Labour.find();

            allLabours.forEach(async (labour, index) => {
                labour.labourid = (index + 1).toString();
                await labour.save();
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
