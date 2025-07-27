import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js';

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Please fill all the fields' });
    }

    try {

        const existingUser = await userModel.findOne({ email })

        if (existingUser) {
            return res.json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Set cookie with conditional secure flag
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('token', token, {
            httpOnly: true,
            secure: isProduction, // Only secure in production
            sameSite: isProduction ? 'None' : 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'
        });

        // sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Auth System',
            text: `Hello ${name},\n\nThank you for registering with us. We are excited to have you on board. Your account has been created with email id : ${email}\n\nBest Regards,\nAuth System Team`
        }

        await transporter.sendMail(mailOptions);

        res.json({ 
            success: true, 
            message: 'Registration successful',
            token: token  // Include token in the response
        });

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: 'Please fill all the fields' });
    }

    try {
        console.log(`Login attempt for email: ${email}`);
        const user = await userModel.findOne({ email });

        if (!user) {
            console.log(`Login failed: User with email ${email} not found`);
            return res.json({ success: false, message: 'Invalid Email' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log(`Login failed: Invalid password for ${email}`);
            return res.json({ success: false, message: 'Invalid Password' });
        }

        console.log(`Login successful for user: ${user._id}`);
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        // Set cookie with conditional secure flag
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('token', token, {
            httpOnly: true,
            secure: isProduction, // Only secure in production
            sameSite: isProduction ? 'None' : 'Lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({ 
            success: true, 
            message: 'Login successful',
            token: token  // Add this line
        });

    } catch (error) {
        console.error('Login error:', error);
        res.json({ success: false, message: error.message });
    }
}

export const logout = async (req, res) => {
    try {
        // Clear the cookie regardless of user authentication status
        // This ensures the cookie is always cleared even if there are issues
        const isProduction = process.env.NODE_ENV === 'production';
        res.clearCookie('token', {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'None' : 'Lax',
            path: '/',
            expires: new Date(0)
        });

        console.log('Cookie cleared successfully');
        return res.json({ success: true, message: 'Logged Out Successfully' });

    } catch (error) {
        console.error('Logout error:', error);
        // Even if there's an error, try to clear the cookie
        const isProduction = process.env.NODE_ENV === 'production';
        res.clearCookie('token', {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'None' : 'Lax',
            path: '/',
            expires: new Date(0)
        });
        return res.json({ success: false, message: error.message });
    }
}

// Send verification otp to user email

export const sendVerificationOtp = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.json({ success: false, message: 'User not found' });
        }

        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (user.isAccountVerified) {
            return res.json({ success: false, message: 'Account already verified' });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            // text: `Your OTP for account verification is ${otp}. It is valid for 24 hours.`, 
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        };

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: 'OTP sent to your email' });
    } catch (error) {
        console.error('Send verification OTP error:', error);
        return res.json({ success: false, message: error.message });
    }
}

export const verifyEmail = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.json({ success: false, message: 'User not found' });
        }

        const { otp } = req.body;

        if (!otp) {
            return res.json({ success: false, message: 'OTP is required' });
        }

        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP expired' });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: 'Account verified successfully' });
    } catch (error) {
        console.error('Verify email error:', error);
        return res.json({ success: false, message: error.message });
    }
}

// Check if user is authenticated
export const isAuthenticated = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.json({ success: false, message: 'User not found' });
        }

        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (!user.isAccountVerified) {
            return res.json({ success: false, message: 'Account not verified' });
        }

        return res.json({ success: true, message: 'User is authenticated' });
    } catch (error) {
        console.error('Authentication error:', error);
        return res.json({ success: false, message: error.message });
    }
}

// send password reset otp
export const sendResetOtp = async (req, res) => {

    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: 'Please provide an email' });
    }

    try {

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            // text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`,
            html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        }
        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: 'OTP sent to your email' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// reset password
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: 'Please fill all the fields' });
    }

    try {

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (user.resetOtp === "" || user.resetOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP expired' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: 'Password reset successful' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}