    import express from 'express';
    import { getPlacementSchedule, getProfile } from '../controllers/studentController.js';

    const router = express.Router();

    router.get('/placement-schedule', getPlacementSchedule);
    router.get('/profile', getProfile);

    export default router;