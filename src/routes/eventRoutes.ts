import express from "express"
import EventController from '../controllers/eventController';
import { validateCreateEvent, checkValidationResult} from '../middleware/validate';
import { requireAuth } from '../middleware/auth';

const router = express.Router();
// Routes
router.post('/create', validateCreateEvent, checkValidationResult, requireAuth, EventController.createEvent);
router.get('/', requireAuth,EventController.getUserEvents);

export default router;