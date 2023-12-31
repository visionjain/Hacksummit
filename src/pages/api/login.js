import connectDb from "../../../lib/mongodb";
import User from '../../../model/loginschema'

const handler = async (req, res) => {
    if (req.method === 'POST') {
        console.log(req.body);
        try {
            const { userid, password } = req.body;
            const user = await User.findOne({ userid });

            if (user && user.password === password) {
                // Redirect to /customers upon successful login
                res.redirect(302, 'https://microsoft-future-ready-talent-project.vercel.app/');
            } else {
                res.status(401).json({ error: "Invalid credentials" });
            }
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(400).json({ error: "This method is not allowed" });
    }
}

export default connectDb(handler);
