import { Router } from 'express';
import getPassportSetup from '../config/passport';
import jwt from 'jsonwebtoken';

const router = Router();

const CLIENT_URL = process.env.CLIENT_URL!;

// Redirect to Google OAuth
router.get('/google', getPassportSetup().authenticate('google', {
  scope: ['profile', 'email']
}));

// Google callback
router.get(
  '/google/callback',
  getPassportSetup().authenticate('google', { session: false, failureRedirect: CLIENT_URL + '/login' }),
  (req, res) => {
    const user = req.user as any;

    const token = jwt.sign(
      { sub: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.cookie('auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.redirect(CLIENT_URL);
  }
);

// Logout
router.post('/logout', (_req, res) => {
  res.clearCookie('auth');
  res.json({ success: true });
});

export default router;
