import { Router } from 'express';
import { createSweet , listSweets , updateSweet , deleteSweet} from '../controllers/sweets.controller';
import { authenticateToken } from '../middlewear/auth';

const router = Router();


router.post('/', authenticateToken, createSweet);
router.get('/' , listSweets);
router.patch('/:id' , authenticateToken, updateSweet);
router.delete('/:id' , authenticateToken , deleteSweet);
export default router;