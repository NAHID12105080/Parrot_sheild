import express, { Request, Response } from "express";

const app = express();
const port = 3000;

app.use(express.json());

const otpStore: Record<string, string> = {};

// Helper function to generate a random 6-digit OTP
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post("/generate-otp", (req: Request, res: Response) => {
  const { email } = req.body.email;

  if (!email) {
    return res.status(400).json({ status: 400, message: "Email is required" });
  }

  const otp = generateOtp();
  otpStore[email] = otp;
  console.log(`Generated OTP for ${email}: ${otp}`);

  console.log(`otp for ${email} is ${otp}`);

  res
    .status(200)
    .json({ status: 200, message: "OTP has been sent to your email" });
});

app.post("/reset-password", (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res
      .status(400)
      .json({ status: 400, message: "All fields are mandatory" });
  }

  if (otpStore[email] === otp) {
    console.log(`Password reset for ${email}`);
    console.log(`New password: ${newPassword}`);
    delete otpStore[email];
    res.status(200).json({ status: 200, message: "Password reset successful" });
  } else {
    res.status(400).json({ status: 400, message: "Invalid OTP" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
