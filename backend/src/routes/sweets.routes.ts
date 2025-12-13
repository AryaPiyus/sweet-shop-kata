import { Router } from 'express';
import { createSweet } from '../controllers/sweets.controller';
import { authenticateToken } from '../middlewear/auth';

const router = Router();


router.post('/', authenticateToken, createSweet);

export default router;