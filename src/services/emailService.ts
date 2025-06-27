import resend from '../config/email';
require('dotenv').config();
import logger from "../utils/logger";

// Class to send emails with resend
class EmailService {
    // Send an otp
    static async sendOTP(email:any, otp:any) {
        try{
            // Send email 
            const { data, error} = await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
                to: ['bevonmokuas@gmail.com'],
                subject: 'Your OTP Code',
                html: `<p> YOur OTP is <strong>${otp}</strong>. It expires in 5 minutes.</p>`
            });

            if(error){
                logger.error('Resend email error:', error);
                throw new Error('Could not send OTP email');
            }

            logger.info(`Sent OTP email to ${email}`);
            return data;
        } catch (err){
            console.log(err, "*(*(*(&")
            logger.error('Error sending OTP email:', err);
            throw new Error('Could not send OTP email');
        }
    }
}

export default EmailService;