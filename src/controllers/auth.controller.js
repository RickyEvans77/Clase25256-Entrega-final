import * as authService from '../services/auth.service.js';

export async function login(req, res) {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username y password requeridos' });

  const ok = authService.validateCredentials(username, password);
  if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

  const token = authService.signToken({ username });
  // devolver con el formato común: "Bearer <token>"
  res.json({ token: `Bearer ${token}` });
}