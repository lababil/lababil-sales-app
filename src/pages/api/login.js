import { DEFAULT_USERS } from '../../../lib/constants';

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ message: 'Login API is working' });
    return;
  }

  if (req.method === 'POST') {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        res.status(400).json({ error: 'Username and password are required' });
        return;
      }

      // Use DEFAULT_USERS for now (in production, use database or file storage)
      const users = DEFAULT_USERS;

      const user = users.find(u => u.username === username && u.isActive);

      if (!user) {
        res.status(401).json({ error: 'Invalid username or password, or account is inactive' });
        return;
      }

      // Verify password (plain text for demo)
      const isValidPassword = password === user.password;

      if (!isValidPassword) {
        res.status(401).json({ error: 'Invalid username or password, or account is inactive' });
        return;
      }

      // Return user data without password
      const { password: _, ...userData } = user;

      res.status(200).json({
        success: true,
        user: userData
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'An error occurred during login. Please try again.' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
