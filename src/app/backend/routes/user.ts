import { Router } from 'express';
import { getAllUsers, getUserById, addUser, updateUser, deleteUser } from '../controllers/user';

const router = Router();

// Get all users
router.get('/', getAllUsers);

// Get a single user by ID
router.get('/:id', async (req, res, next) => {
  try {
    await getUserById(req, res);
  } catch (err) {
    next(err);
  }
});

// Create a new user
router.post('/', addUser);

// Update a user by ID
router.put('/:id', async (req, res, next) => {
  try {
    await updateUser(req, res);
  } catch (err) {
    next(err);
  }
});

// Delete a user by ID
router.delete('/:id', async (req, res, next) => {
  try {
	await deleteUser(req, res);
  } catch (err) {
	next(err);
  }
});

export default router;