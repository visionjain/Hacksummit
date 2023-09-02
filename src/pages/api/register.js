// pages/api/register.js

import connectDb from "../../../lib/mongodb";
import User from "../../../model/loginschema";
import { useRouter } from 'next/router';

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { userid, password, referralCode } = req.body;

      // Check if the referral code is valid
      if (referralCode === "GIVEMEACCESS") {
        // Referral code is correct, proceed with registration
        const user = new User({
          userid,
          password,
        });

        await user.save();
        res.status(201).json({ success: "Registration successful" });
      } else {
        // Incorrect referral code
        res.status(400).json({ error: "Invalid referral code" });
        router.push('/register');
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(400).json({ error: "This method is not allowed" });
  }
};

export default connectDb(handler);
