import express from 'express';
import { addCompany, getAllCompanies, getCompany, updateCompany, deleteCompany } from '../controllers/companyController.js';

const router = express.Router();

router.post('/', addCompany);
router.get('/', getAllCompanies);
router.get('/company', getCompany);
router.put('/', updateCompany);
router.delete('/', deleteCompany);

export default router;