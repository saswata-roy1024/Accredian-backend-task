import express from 'express';
import { Refer, GetReferralCode } from '../controllers/Referrer.controllers.js';
import isAuthenticated from '../middlewares/isAuthentiCated.js';

const router = express.Router();

router.get("/referralcode", isAuthenticated, GetReferralCode);
router.post("/refer", isAuthenticated, Refer);


export default router;