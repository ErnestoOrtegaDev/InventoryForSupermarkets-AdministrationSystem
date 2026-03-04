import express from 'express';
import { getMovementsBySupermarket } from '../controllers/movementController';
import { protect } from '../middleware/authMiddleware'; 

const router = express.Router();

router.use(protect); 

router.get('/supermarket/:supermarketId', getMovementsBySupermarket);

export default router;