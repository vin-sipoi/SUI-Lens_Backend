// import pool from '../config/db';
import OTPService from '../services/otpService';
import EmailService from '../services/emailService';
import logger from '../utils/logger';
import { pool } from '../config/session';

// Class to handle login
class AuthController {
    // Handle otp req
static async requestOTP(req: any, res: any) {
    const { email } = req.body;
    try {
        // Check if user exists
        const { rows } = await pool.query('SELECT * FROM "User" WHERE "email" = $1', [email]);

        if (rows.length === 0) {
            logger.info(`No user found for ${email}, creating new user...`);
            await pool.query('INSERT INTO "User" ("email") VALUES ($1)', [email]);
            logger.info(`New user created with email: ${email}`);
        }

        // Create and save OTP
        const otp = OTPService.generateOTP();
        await OTPService.storeOTP(email, otp);
        await EmailService.sendOTP(email, otp);
        
        res.status(200).json({ message: 'OTP sent to your email' });
    } catch (err) {
        logger.error('Error in requestOTP:', err);
        res.status(500).json({ error: 'Could not send OTP' });
    }
}

    // Handle otp verification
    static async verifyOTP(req:any, res:any) {
        const { email, otp } = req.body;
        try{
            // Check otp is valid
            const isValid = await OTPService.verifyOTP(email, otp);
            if(!isValid) {
                return res.status(400).json({error: 'Invalid or expired OTP'});
            }
            const { rows } = await pool.query('SELECT id FROM "User" WHERE "email" = $1', [email]);
            if (rows.length === 0) {
                logger.warn(`No user found after OTP check: ${email}`);
                return res.status(404).json({ error: 'User not found' });
            }
            req.session.userId = rows[0].id;
            req.session.email = email;
            logger.info(`Logged in user: ${email}`);
            res.status(200).json({ message: 'Logged in successfully' });
        } catch (err) {
            logger.error('Error in VerifyOTP:', err);
            res.status(500).json({ error: 'Could not verify OTP'});
        }
    }
    // Handle user's profile
    static async getProfile(req:any, res:any) {
        try{
            // Send welcome message with user's email
            res.status(200).json({message: `Welcome, ${req.session.email}`});
        } catch (err) {
            logger.error('Error in getProfile:', err);
            res.status(500).json({ error: 'Could not get profile'});
        }
    }
}

export default AuthController;
