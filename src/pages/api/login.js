import connect from "../../../lib/mongodb";
import User from '../../../model/loginschema'

connect()

export default async function handler(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (!user) {
        return res.json({ status: 'User does not exist' });
    } else {
        return res.json({ status: 'Success', redirectUrl: '/customers' });
    }
}
