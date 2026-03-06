import express from 'express';
import { getUsers, updateUser, createUser, deleteUser } from '../controllers/userController';
import { protect, authorizeRoles } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect); 

// GET: Only admin and manager can access the list of users
router.get('/', authorizeRoles('admin', 'manager'), getUsers);

router.post('/', authorizeRoles('admin', 'manager'), createUser);
router.put('/:id', authorizeRoles('admin', 'manager'), updateUser);
router.delete('/:id', authorizeRoles('admin', 'manager'), deleteUser);

export default router;