import connectDb from "../../../lib/mongodb";
import Customer from "../../../model/customerschema";

const handler = async (req, res) => {
    if (req.method === 'PUT') {
        try {
            const { customerid, customername, phoneno, phoneno2, data } = req.body;

            // Find the customer by customerid
            const existingCustomer = await Customer.findOne({ customerid });

            if (!existingCustomer) {
                return res.status(404).json({ error: "Customer not found" });
            }

            // Update the customer's main data if provided
            if (customername) {
                existingCustomer.customername = customername;
            }
            if (phoneno) {
                existingCustomer.phoneno = phoneno;
            }
            if (phoneno2) {
                existingCustomer.phoneno2 = phoneno2;
            }

            // Update nested data if provided
            if (data) {
                const updatedData = data.map(item => ({
                    numberid: item.numberid,
                    salesdate: item.salesdate,
                    drivername: item.drivername,
                    autono: item.autono,
                    km: item.km,
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
                existingCustomer.data = updatedData;
            }

            await existingCustomer.save();
            await reassignCustomerIds();

            res.status(200).json({ success: "Customer updated successfully" });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(400).json({ error: "This method is not allowed" });
    }
};

export default connectDb(handler);
