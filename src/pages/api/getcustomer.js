import Customer from "../../../model/customerschema";
import connectDb from "../../../lib/mongodb";

const handler = async(req,res)=> {
    let customer = await Customer.find()
    res.status(200).json({ customer })
}

export default connectDb(handler);