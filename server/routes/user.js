const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();
const prisma = new PrismaClient();

// PUT /api/user/interests - Aktualizacja zainteresowań
// Używamy authenticateToken, więc mamy pewność, że user jest zalogowany
router.put('/interests', authenticateToken, async (req, res) => {
  const userId = req.user.userId; // To wyciągnęliśmy z tokena w middleware
  const { categoryIds } = req.body; // Lista ID, np. [1, 3, 5]

  try {
    // Aktualizacja użytkownika w bazie
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        interests: {
          set: [], // Najpierw czyścimy stare zainteresowania (żeby nie dublować)
          connect: categoryIds.map(id => ({ id: id })) // Łączymy nowe
        }
      },
      include: { interests: true } // Żeby backend odesłał nam zaktualizowaną listę
    });

    res.json({ message: 'Zapisano preferencje!', interests: updatedUser.interests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Błąd podczas zapisywania preferencji' });
  }
});

// GET /api/user/me - Pobranie danych aktualnego użytkownika (żeby zaznaczyć kafelki po odświeżeniu)
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            include: { interests: true }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

module.exports = router;