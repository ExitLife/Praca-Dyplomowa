const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();
const prisma = new PrismaClient();

// 1. POBIERANIE WSZYSTKICH WYDARZEŃ (Dla każdego - publiczne)
// GET /api/events
router.get('/', async (req, res) => {
  try {
    // Pobieramy wydarzenia razem z nazwą kategorii i e-mailem organizatora
    const events = await prisma.event.findMany({
      include: {
        category: true,
        organizer: {
          select: { email: true }
        }
      },
      orderBy: { date: 'asc' } // Sortowanie od najbliższych
    });
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Błąd pobierania wydarzeń' });
  }
});

// 2. DODAWANIE WYDARZENIA (Tylko dla organizatorów)
// POST /api/events
router.post('/', authenticateToken, async (req, res) => {
  // --- NOWE ZABEZPIECZENIE ROLI ---
  // req.user jest dostępne dzięki authenticateToken i zawiera teraz rolę
  if (req.user.role !== 'organizer') {
      return res.status(403).json({ error: 'Tylko organizatorzy mogą dodawać wydarzenia!' });
  }
  // ---------------------------------
   const { title, description, date, location, latitude, longitude, categoryId, imageUrl } = req.body;

 // Prosta walidacja
 if (!title || !date || !location || !categoryId) {
 return res.status(400).json({ error: 'Wypełnij wymagane pola (tytuł, data, lokalizacja, kategoria)' });
 }

 try {
 const newEvent = await prisma.event.create({
 data: {
 title,
 description: description || "",
 date: new Date(date), // Konwersja tekstu na datę
 location,
 latitude: parseFloat(latitude || 0),  // Domyślnie 0 jeśli brak mapy
 longitude: parseFloat(longitude || 0),
 imageUrl: imageUrl || "",
 // Powiązania (Relacje):
 organizer: { connect: { id: req.user.userId } }, // Kto tworzy? Ten z tokena!
 category: { connect: { id: parseInt(categoryId) } }
 }
 });

 res.status(201).json({ message: 'Wydarzenie utworzone!', event: newEvent });
 } catch (error) {
 console.error("Błąd dodawania wydarzenia:", error);
 res.status(500).json({ error: 'Nie udało się dodać wydarzenia.' });
 }
});

// 3. PRZEŁĄCZANIE ZAPISU (TOGGLE SAVE) - Dodaj do ulubionych / Usuń
// POST /api/events/:id/toggle-save
router.post('/:id/toggle-save', authenticateToken, async (req, res) => {
  const eventId = parseInt(req.params.id);
  const userId = req.user.userId;

  try {
    // 1. Sprawdź, czy już zapisane - Używamy findFirst zamiast skomplikowanego findUnique
    const existingSave = await prisma.savedEvent.findFirst({
      where: {
        userId: userId, // Szukamy po ID użytkownika
        eventId: eventId  // Szukamy po ID wydarzenia
      }
    });

    if (existingSave) {
      // JEŚLI JEST -> USUŃ (Odubienie)
      await prisma.savedEvent.delete({
        where: { id: existingSave.id } // Używamy prostego ID do usunięcia
      });
      res.json({ message: 'Usunięto z zapisanych', isSaved: false });
    } else {
      // JEŚLI NIE MA -> STWÓRZ (Polubienie)
      await prisma.savedEvent.create({
        data: {
          userId: userId,
          eventId: eventId,
          reminderSent: false
        }
      });
      res.json({ message: 'Dodano do zapisanych', isSaved: true });
    }

  } catch (error) {
    console.error("Błąd bazy danych w toggle-save:", error);
    res.status(500).json({ error: 'Błąd wewnętrzny serwera podczas zapisu.' });
  }
});

// 4. POBIERANIE ID ZAPISANYCH WYDARZEŃ (Żeby frontend wiedział, które serduszka zapalić)
// GET /api/events/saved-ids
router.get('/saved-ids', authenticateToken, async (req, res) => {
 try {
 const saved = await prisma.savedEvent.findMany({
        where: { userId: req.user.userId },
 select: { eventId: true }
 });
 // Zwracamy samą tablicę ID, np. [1, 5, 12]
 res.json(saved.map(s => s.eventId));
 } catch (error) {
 res.status(500).json({ error: 'Błąd pobierania zapisanych' });
 }
});

// 5. POBIERANIE PEŁNYCH OBIEKTÓW ZAPISANYCH WYDARZEŃ
// GET /api/events/saved
router.get('/saved', authenticateToken, async (req, res) => {
    try {
        const savedEvents = await prisma.savedEvent.findMany({
            where: { userId: req.user.userId },
            select: { 
                eventId: true, // Wybieramy tylko ID wydarzenia
            }
        });

        const eventIds = savedEvents.map(s => s.eventId);

        // Pobieramy pełne dane wydarzeń (Event) na podstawie tych ID
        const events = await prisma.event.findMany({
            where: { id: { in: eventIds } },
            include: { 
                category: true,
                organizer: { select: { email: true } }
            },
            orderBy: { date: 'asc' }
        });

        res.json(events);
    } catch (error) {
        console.error("Błąd pobierania ulubionych:", error);
        res.status(500).json({ error: 'Nie udało się pobrać ulubionych wydarzeń.' });
    }
});

module.exports = router;