import { Router } from 'express';
import AuthController from '../controllers/auth';

const router = Router();

/** Register user route
 * payload { email, password, first_name, last_name, username }
 */
router.post('/register', async function (req, res) {
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
    console.error(error);
    res.status(500).json({ error: error.message });
    return;
  }
});

router.post('/', async function (req, res) {
  try {
    const { username, password } = req.body;
    const data = await AuthController.loginUser({ username, password });
    res.status(200).json({ data });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
    return;
  }
});

export default router;
