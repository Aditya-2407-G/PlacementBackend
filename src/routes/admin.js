import express from 'express';
import { getActivities, addActivity, getStudentStats, getStudents, updateStudentStatus, removeCompanyFromStudent } from '../controllers/adminController.js';

const router = express.Router();

router.get('/activities', getActivities);
router.post('/activities', addActivity);
router.get('/student-stats', getStudentStats);
router.get('/students', getStudents);
router.put('/updateStatus', updateStudentStatus);
router.delete('/remove-company', removeCompanyFromStudent);

export default router;