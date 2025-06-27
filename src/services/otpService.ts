// Tools for random numbers and db access
import crypto from "crypto"
import { pool } from "../config/session";
import logger from "../utils/logger";

// handle of otp and checks
class OTPService {
    // Creation of 6 digits
    static generateOTP(){
        return crypto.randomInt(100000, 999999).toString();
    }

    // Save OTP in db
    static async storeOTP(email:any, otp:any){
        try{
            // Set otp to expire in 5 mins
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
            // Insert OTP into the OTP table
            await pool.query(
                'INSERT INTO "OTP" ("email", "otp", "expiresAt") VALUES ($1, $2, $3)',
                [email, otp, expiresAt]
            );
            logger.info(`Saved OTP for ${email}`);
        } catch (err){
            logger.error('Error Saving OTP:', err);
            throw new Error('Could not save OTP');
        }
    }

    // Check if otp is valid
    static async verifyOTP(email: any, otp: any) {
        try {
            // Checking in the db
            const { rows } = await pool.query(
                'SELECT * FROM "OTP" WHERE "email" = $1 AND "otp" = $2 AND "expiresAt" > NOW()',
                [email, otp]
            );

            // Valid or expired
            if (rows.length === 0) {
                logger.warn(`Invalid or expired OTP for ${email}`);
                return false;
            }

            // Deleting OTP so it can't be used again
            await pool.query('DELETE FROM "OTP" WHERE "email" = $1', [email]);
            logger.info(`Verified and deleted OTP for ${email}`);
            return true;
        } catch (err) {
            logger.error('Error checking OTP:', err);
            throw new Error('Could not check OTP');
        }
    }
}

export default OTPService;