import Labour from "../../../model/laboursSchema";
import connectDb from "../../../lib/mongodb";

const handler = async(req,res)=> {
    let labour = await Labour.find()
    res.status(200).json({ labour })
}

export default connectDb(handler);