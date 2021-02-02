import { Router } from 'express';
import AuthController from '../controllers/auth';

const router = Router();

/** Register user route
 * payload { email, password, first_name, last_name, username }
 */
router.post('/', async function (req, res) {
  try {
    const { email, username, password, first_name, last_name } = req.body;
    const data = await AuthController.registerUser({
      email,
      username,
      password,
      first_name,
      last_name,
    });
    res.status(201).json({ data });
    return;
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
