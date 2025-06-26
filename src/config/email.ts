import {Resend} from "resend"
import logger from "../utils/logger"
require('dotenv').config();

// Resend client
const resend = new Resend(process.env.RESEND_API);

// Checks
resend.domains.list()
    .then(() => logger.info('Resend email setup is ready'))
    .catch(err => logger.error('Resend email setup failed:', err));

module.exports = resend;