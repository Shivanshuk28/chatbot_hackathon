import express from 'express';
import cors from 'cors';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

// Create an express app
const app = express();
const PORT = 5000;
app.use(express.json());
// Enable CORS
app.use(cors());

// Correctly initialize Razorpay instance
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Payment route
app.post('/user/pay-razorpay', async (req, res) => {
    try {
        const amount = req.body.amount;
        if (!amount) {
            return res.status(400).json({ status: false, message: "Amount is required" });
        }

        const order = await razorpayInstance.orders.create({
            amount: amount * 100, // Convert to paise
            currency: "INR",
        });

        return res.status(200).json({ status: true, orderId: order.id });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
