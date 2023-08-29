import connectDb from "../../../lib/mongodb";
import Customer from "../../../model/customerschema";

const handler = async (req, res) => {
    if (req.method === 'POST') {
        try {
            for (let i = 0; i < req.body.length; i++) {
                let data = req.body[i].data.map(item => ({
                    numberid: item.numberid,
                    salesdate: item.salesdate,
                    drivername: item.drivername,
                    autono: item.autono,
                    Limea: item.Limea,
                    LimeaPrice: item.LimeaPrice,
                    Limew: item.Limew,
                    LimewPrice: item.LimewPrice,
                    Limeb: item.Limeb,
                    LimebPrice: item.LimebPrice,
                    jhiki: item.jhiki,
                    jhikiPrice: item.jhikiPrice,
                    rs: item.rs,
                    rsPrice: item.rsPrice,
                    siteaddress: item.siteaddress,
                    labourcharge: item.labourcharge,
                    autocharge: item.autocharge,
                    amount: item.amount,
                    dr: item.dr,
                    cr: item.cr,
                    balance: item.balance
                }));

                let customer = new Customer({
                    customerid: req.body[i].customerid,
                    customername: req.body[i].customername,
                    phoneno: req.body[i].phoneno,
                    data: data
                });

                await customer.save();
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
