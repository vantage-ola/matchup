import { Router, Request, Response } from 'express';

const router = Router();

interface RegisterBody {
  username: string;
  password: string;
  displayName: string;
}

interface LoginBody {
  username: string;
  password: string;
}

router.post('/register', async (req: Request<{}, {}, RegisterBody>, res: Response) => {
  const { username, password, displayName } = req.body;

  // TODO: Validate input
  // TODO: Check if username exists
  // TODO: Hash password
  // TODO: Create user in DB
  // TODO: Return JWT

  res.status(501).json({ error: 'Not implemented' });
});

router.post('/login', async (req: Request<{}, {}, LoginBody>, res: Response) => {
  const { username, password } = req.body;

  // TODO: Find user by username
  // TODO: Compare password hash
  // TODO: Return JWT

  res.status(501).json({ error: 'Not implemented' });
});

router.get('/me', async (req: Request, res: Response) => {
  // TODO: Extract JWT from header
  // TODO: Verify token
  // TODO: Fetch user from DB
  // TODO: Return user profile + wallet balance

  res.status(501).json({ error: 'Not implemented' });
});

export default router;