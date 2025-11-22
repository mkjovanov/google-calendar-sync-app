import { Router } from 'express';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, (req, res) => {
  const user = (req as any).currentUser;

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    picture: user.picture
  });
});

export default router;
