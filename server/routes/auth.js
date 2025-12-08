const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Dodano brakujący import
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// --- REJESTRACJA ---
router.post('/register', async (req, res) => {
  const { email, password, role } = req.body; // <--- Odbieramy też 'role'

  if (!email || !password) {
    return res.status(400).json({ error: 'Podaj email i hasło!' });
  }

  // Walidacja roli (domyślnie 'user' jeśli ktoś kombinuje)
  const userRole = role === 'organizer' ? 'organizer' : 'user';

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Użytkownik istnieje.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: userRole, // <--- Zapisujemy rolę w bazie
      },
    });

    res.status(201).json({ message: 'Rejestracja udana! Możesz się zalogować.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Błąd serwera.' });
  }
});

// --- LOGOWANIE ---
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Błąd logowania' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ error: 'Błąd logowania' });

    // Generujemy token ZAWIERAJĄCY ROLĘ
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role }, // <--- Tutaj dodajemy rolę
      process.env.JWT_SECRET || 'sekret',
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Zalogowano!',
      token,
      user: { id: user.id, email: user.email, role: user.role } // Odsyłamy rolę do frontend
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Błąd serwera.' });
  }
});

module.exports = router;