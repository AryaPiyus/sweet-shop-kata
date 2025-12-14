import { Router } from 'express';
import { createSweet , listSweets , updateSweet} from '../controllers/sweets.controller';
import { authenticateToken } from '../middlewear/auth';

const router = Router();


router.post('/', authenticateToken, createSweet);
router.get('/' , listSweets);
router.patch('/:id' , authenticateToken, updateSweet);
export default router;