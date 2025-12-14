import { Router } from 'express';
import { createSweet , listSweets } from '../controllers/sweets.controller';
import { authenticateToken } from '../middlewear/auth';

const router = Router();


router.post('/', authenticateToken, createSweet);
router.get('/' , listSweets);
export default router;