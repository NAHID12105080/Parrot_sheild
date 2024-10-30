"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
const otpStore = {};
// Helper function to generate a random 6-digit OTP
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
app.post("/generate-otp", (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ status: 400, message: "Email is required" });
    }
    const otp = generateOtp();
    otpStore[email] = otp;
    console.log(`Generated OTP for ${email}: ${otp}`);
    res
        .status(200)
        .json({ status: 200, message: "OTP has been sent to your email" });
});
app.post("/reset-password", (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        return res
            .status(400)
            .json({ status: 400, message: "All fields are mandatory" });
    }
    if (otpStore[email] !== otp) {
        return res.status(400).json({ status: 400, message: "Invalid OTP" });
    }
    // Reset password logic here
    delete otpStore[email]; // Remove OTP after successful password reset
    res
        .status(200)
        .json({ status: 200, message: "Password has been reset successfully" });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
