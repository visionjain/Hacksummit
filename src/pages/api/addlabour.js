import connectDb from "../../../lib/mongodb";
import Labour from "../../../model/laboursSchema";

const handler = async (req, res) => {
    if (req.method === 'POST') {
        try {
            for (let i = 0; i < req.body.length; i++) {
                let data = req.body[i].data.map(item => ({
                    date: item.date,
                    lot: item.lot,
                    wages: item.wages,
                    amount: item.amount,
                    gas: item.gas,
                    cashrec: item.cashrec,
                    totalamount: item.totalamount
                }));

                let labour = new Labour({
                    labourid: req.body[i].labourid,
                    labourname: req.body[i].labourname,
                    data: data
                });

                await labour.save();
            }

            res.status(200).json({ success: "success" });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(400).json({ error: "This method is not allowed" });
    }
};

export default connectDb(handler);
