import { Router } from 'express';
import { createSweet , listSweets , updateSweet , deleteSweet, restockSweet} from '../controllers/sweets.controller';
import { authenticateToken , isAdmin} from '../middlewear/auth';

const router = Router();


router.post('/', authenticateToken, createSweet);
router.get('/' , listSweets);
router.patch('/:id' , authenticateToken, updateSweet);
router.delete('/:id' , authenticateToken , deleteSweet);
router.post('/:id/restock', authenticateToken, isAdmin, restockSweet);
export default router;