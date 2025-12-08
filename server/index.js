require("dotenv").config(); // Ładowanie zmiennych z pliku .env

const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const eventRoutes = require("./routes/events");

// Konfiguracja
const app = express();
const prisma = new PrismaClient();
const PORT = 5000;

// Middleware (pomocniki)
app.use(cors()); // Pozwala na łączenie się z Reactem
app.use(express.json()); // Pozwala czytać dane JSON wysyłane w żądaniach
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

// --- TESTOWE ENDPOINTY ---

// 1. Sprawdzenie czy serwer działa
app.get("/", (req, res) => {
  res.send("Serwer aplikacji Kultura działa!");
});

// 2. Sprawdzenie połączenia z bazą
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Błąd połączenia z bazą" });
  }
});

// Uruchomienie serwera
app.listen(PORT, () => {
  console.log(`Serwer nasłuchuje na porcie http://localhost:${PORT}`);
});